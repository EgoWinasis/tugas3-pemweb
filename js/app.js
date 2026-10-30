new Vue({
  el: '#app',

  data: {
    isAuthenticated: false,
    loginForm: { username: '', password: '' },
    loginError: '',
    loginLoading: false,

    // Kredensial demo untuk tugas praktik.
    // Catatan: autentikasi ini hanya simulasi sisi client, bukan keamanan produksi.
    defaultUsername: 'egowinasis@ut.ac.id',
    defaultPassword: '053062337',

    tab: 'stok',
    stocks: [],
    upbjjList: [],
    kategoriList: [],
    packages: [],
    tracking: [],
    loading: false,
    loadError: ''
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    todayLabel() {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date());
    }
  },

  created() {
    // Sesi login dipertahankan selama tab/browser session masih aktif.
    if (sessionStorage.getItem('sitta_logged_in') === 'true') {
      const savedUsername = sessionStorage.getItem('sitta_username') || '';
      if (savedUsername.toLowerCase() === this.defaultUsername) {
        this.loginForm.username = savedUsername;
        this.isAuthenticated = true;
        this.loadApp();
      } else {
        sessionStorage.removeItem('sitta_logged_in');
        sessionStorage.removeItem('sitta_username');
      }
    }
  },

  methods: {
    async login() {
      this.loginError = '';
      const username = this.loginForm.username.trim().toLowerCase();
      const password = this.loginForm.password;

      if (username !== this.defaultUsername || password !== this.defaultPassword) {
        this.loginError = 'Username atau password yang Anda masukkan salah.';
        return;
      }

      this.loginLoading = true;
      // Sedikit jeda agar status tombol login terlihat.
      await new Promise(resolve => setTimeout(resolve, 250));

      this.loginForm.username = username;
      this.isAuthenticated = true;
      sessionStorage.setItem('sitta_logged_in', 'true');
      sessionStorage.setItem('sitta_username', username);
      this.loginLoading = false;

      await this.loadApp();
    },

    logout() {
      sessionStorage.removeItem('sitta_logged_in');
      sessionStorage.removeItem('sitta_username');
      this.isAuthenticated = false;
      this.loginForm.password = '';
      this.loginError = '';
      this.loadError = '';
      this.loading = false;
      this.tab = 'stok';
    },

    async loadApp() {
      this.loading = true;
      this.loadError = '';

      try {
        // Semua template harus selesai dimuat sebelum komponen anak dirender.
        await SittaAPI.loadTemplates();
        const data = await SittaAPI.loadData();

        this.stocks = Array.isArray(data.stok) ? data.stok : [];
        this.upbjjList = data.upbjjList || [];
        this.kategoriList = data.kategoriList || [];
        this.packages = data.paket || [];
        this.tracking = this.normalizeTracking(data.tracking || []);
      } catch (error) {
        console.error('Kesalahan memuat SITTA:', error);
        this.loadError = error.message || 'Terjadi kesalahan saat memuat aplikasi.';
      } finally {
        this.loading = false;
      }
    },

    normalizeTracking(raw) {
      const rows = [];
      raw.forEach(group => {
        Object.keys(group || {}).forEach(key => {
          const item = group[key] || {};
          if (!rows.some(row => row.nomorDO === key)) {
            rows.push({
              nomorDO: key, nim: item.nim || '', nama: item.nama || '',
              status: item.status || 'Diproses', ekspedisi: item.ekspedisi || '',
              tanggalKirim: item.tanggalKirim || '', paket: item.paket || '',
              total: Number(item.total || 0), perjalanan: item.perjalanan || []
            });
          }
        });
      });
      return rows;
    },

    addStock(item) {
      this.stocks.push(item);
    },

    updateStock(payload) {
      const index = this.stocks.findIndex(item => item.kode === payload.oldCode);
      if (index !== -1) this.$set(this.stocks, index, payload.item);
    },

    removeStock(code) {
      this.stocks = this.stocks.filter(item => item.kode !== code);
    },

    addDO(payload) {
      const year = new Date().getFullYear();
      const numbers = this.tracking.map(item => {
        const match = String(item.nomorDO || '').match(/^DO(\d{4})-(\d+)$/);
        return match && Number(match[1]) === year ? Number(match[2]) : 0;
      });
      const sequence = Math.max(0, ...numbers) + 1;
      const nomorDO = `DO${year}-${String(sequence).padStart(3, '0')}`;
      const selected = this.packages.find(p => p.kode === payload.paket);

      this.tracking.unshift({
        nomorDO, nim: payload.nim, nama: payload.nama, status: 'Diproses',
        ekspedisi: payload.ekspedisi, tanggalKirim: payload.tanggalKirim,
        paket: payload.paket, total: selected ? Number(selected.harga) : 0,
        perjalanan: [{ waktu: this.localDateTime(), keterangan: 'Delivery Order dibuat' }]
      });
    },

    addProgress(payload) {
      const item = this.tracking.find(row => row.nomorDO === payload.nomorDO);
      if (!item) return;
      if (!Array.isArray(item.perjalanan)) this.$set(item, 'perjalanan', []);
      item.perjalanan.push({
        waktu: this.localDateTime(),
        keterangan: payload.keterangan
      });
      item.status = 'Dalam Perjalanan';
    },

    localDateTime() {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }
});
