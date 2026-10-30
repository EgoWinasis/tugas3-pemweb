Vue.component('ba-stock-table', {
  props: {
    stocks: { type: Array, required: true },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true }
  },

  data() {
    return {
      search: '', selectedUpbjj: '', selectedKategori: '', stockMode: 'all',
      sortBy: 'judul', sortDirection: 'asc',
      showForm: false, editingCode: null, showDelete: false, deleteTarget: null,
      form: this.emptyForm(), formError: ''
    };
  },

  computed: {
    filteredStocks() {
      const q = this.search.toLowerCase().trim();
      const result = this.stocks.filter(item => {
        const kode = String(item.kode || '').toLowerCase();
        const judul = String(item.judul || '').toLowerCase();
        const qty = Number(item.qty || 0);
        const safety = Number(item.safety || 0);
        const matchSearch = !q || kode.includes(q) || judul.includes(q);
        const matchUpbjj = !this.selectedUpbjj || item.upbjj === this.selectedUpbjj;
        const matchKategori = !this.selectedKategori || item.kategori === this.selectedKategori;
        let matchMode = true;
        if (this.stockMode === 'safe') matchMode = qty >= safety;
        if (this.stockMode === 'low') matchMode = qty > 0 && qty < safety;
        if (this.stockMode === 'empty') matchMode = qty === 0;
        if (this.stockMode === 'reorder') matchMode = qty < safety;
        return matchSearch && matchUpbjj && matchKategori && matchMode;
      });

      return result.slice().sort((a, b) => {
        let av = a[this.sortBy];
        let bv = b[this.sortBy];
        if (this.sortBy === 'judul') {
          av = String(av || '').toLocaleLowerCase('id');
          bv = String(bv || '').toLocaleLowerCase('id');
        } else {
          av = Number(av || 0);
          bv = Number(bv || 0);
        }
        const compare = av > bv ? 1 : av < bv ? -1 : 0;
        return this.sortDirection === 'asc' ? compare : -compare;
      });
    },
    totalStock() {
      return this.stocks.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    },
    lowCount() {
      return this.stocks.filter(item => Number(item.qty) > 0 && Number(item.qty) < Number(item.safety)).length;
    },
    emptyCount() {
      return this.stocks.filter(item => Number(item.qty) === 0).length;
    },
    safeCount() {
      return this.stocks.filter(item => Number(item.qty) > 0 && Number(item.qty) >= Number(item.safety)).length;
    },
    kategoriOptions() {
      if (!this.selectedUpbjj) return this.kategoriList;
      const categories = this.stocks.filter(item => item.upbjj === this.selectedUpbjj).map(item => item.kategori);
      return this.kategoriList.filter(kategori => categories.includes(kategori));
    }
  },

  watch: {
    selectedUpbjj() { this.selectedKategori = ''; },
    search(value) { console.log('Pencarian stok berubah:', value); },
    stockMode(value) { console.log('Filter stok berubah:', value); }
  },

  methods: {
    emptyForm() {
      return { kode: '', judul: '', kategori: this.kategoriList[0] || 'MK Wajib', upbjj: this.upbjjList[0] || 'Jakarta', lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: '' };
    },
    formatRupiah(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
    },
    formatBuah(value) { return `${Number(value || 0).toLocaleString('id-ID')} buah`; },
    resetFilters() {
      this.search = ''; this.selectedUpbjj = ''; this.selectedKategori = ''; this.stockMode = 'all';
      this.sortBy = 'judul'; this.sortDirection = 'asc';
    },
    openAdd() {
      this.editingCode = null; this.form = this.emptyForm(); this.formError = ''; this.showForm = true;
    },
    openEdit(item) {
      this.editingCode = item.kode; this.form = { ...item }; this.formError = ''; this.showForm = true;
    },
    saveForm() {
      const f = this.form;
      if (!String(f.kode || '').trim() || !String(f.judul || '').trim() || !String(f.lokasiRak || '').trim()) {
        this.formError = 'Kode, judul, dan lokasi rak wajib diisi.'; return;
      }
      if ([f.harga, f.qty, f.safety].some(v => v === '' || v === null || !Number.isFinite(Number(v)) || Number(v) < 0)) {
        this.formError = 'Harga, stok, dan safety stock harus berupa angka nol atau lebih.'; return;
      }
      const payload = { ...f, kode: f.kode.trim().toUpperCase(), judul: f.judul.trim(), harga: Number(f.harga), qty: Number(f.qty), safety: Number(f.safety) };
      const duplicate = this.stocks.some(item => String(item.kode).toLowerCase() === payload.kode.toLowerCase() && item.kode !== this.editingCode);
      if (duplicate) { this.formError = 'Kode mata kuliah sudah digunakan.'; return; }
      if (this.editingCode) this.$emit('update', { oldCode: this.editingCode, item: payload });
      else this.$emit('add', payload);
      this.showForm = false; this.formError = '';
    },
    askDelete(item) { this.deleteTarget = item; this.showDelete = true; },
    confirmDelete() {
      if (this.deleteTarget) this.$emit('remove', this.deleteTarget.kode);
      this.showDelete = false; this.deleteTarget = null;
    },
    noteText(item) {
      const div = document.createElement('div');
      div.innerHTML = item.catatanHTML || '';
      return div.textContent || div.innerText || 'Tidak ada catatan';
    }
  },

  template: '#tpl-stock-table'
});
