Vue.component('do-tracking', {
  props: { tracking: { type: Array, required: true }, packages: { type: Array, required: true }, upbjjList: { type: Array, required: true } },
  data() {
    return { query: '', submittedQuery: '', showOrderForm: false, progressTarget: null, progressText: '', progressError: '' };
  },
  computed: {
    trackingRows() {
      return this.tracking.map(record => ({ ...record, perjalanan: record.perjalanan || [] })).filter(record => {
        if (!this.submittedQuery) return true;
        const q = this.submittedQuery.toLowerCase();
        return record.nomorDO.toLowerCase().includes(q) || record.nim.toLowerCase().includes(q);
      });
    },
    packageMap() { return this.packages.reduce((map, p) => { map[p.kode] = p; return map; }, {}); }
  },
  watch: {
    query(value) { if (!value) this.submittedQuery = ''; },
    tracking() { /* watcher saat daftar DO diperbarui */ }
  },
  methods: {
    submitSearch() { this.submittedQuery = this.query.trim(); },
    clearSearch() { this.query = ''; this.submittedQuery = ''; },
    formatDate(value) {
      if (!value) return '-';
      return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value + 'T00:00:00'));
    },
    formatDateTime(value) {
      if (!value) return '-';
      return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value.replace(' ', 'T')));
    },
    formatRupiah(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
    },
    packageName(code) { return this.packageMap[code] ? this.packageMap[code].nama : code; },
    addOrder(payload) { this.$emit('add-do', payload); this.showOrderForm = false; },
    openProgress(record) { this.progressTarget = record; this.progressText = ''; this.progressError = ''; },
    saveProgress() {
      if (!this.progressText.trim()) { this.progressError = 'Keterangan perjalanan wajib diisi.'; return; }
      this.$emit('add-progress', { nomorDO: this.progressTarget.nomorDO, keterangan: this.progressText.trim() });
      this.progressTarget = null; this.progressText = ''; this.progressError = '';
    }
  },
  template: '#tpl-do-tracking'
});
