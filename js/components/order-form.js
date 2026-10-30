// Komponen formulir pembuatan Delivery Order.
Vue.component('order-form', {
  props: { packages: { type: Array, required: true }, upbjjList: { type: Array, required: true } },
  data() {
    return { form: this.blank(), error: '' };
  },
  computed: {
    selectedPackage() { return this.packages.find(p => p.kode === this.form.paket) || null; }
  },
  watch: {
    'form.paket'() { this.error = ''; }
  },
  methods: {
    blank() {
      return { nim: '', nama: '', ekspedisi: 'JNE Regular', paket: this.packages.length ? this.packages[0].kode : '', tanggalKirim: new Date().toISOString().slice(0,10) };
    },
    submit() {
      const f = this.form;
      if (!f.nim.trim() || !f.nama.trim() || !f.paket || !f.tanggalKirim) { this.error = 'Semua kolom wajib diisi.'; return; }
      if (!/^\d{8,15}$/.test(f.nim.trim())) { this.error = 'NIM harus terdiri dari 8–15 angka.'; return; }
      this.$emit('submit', { ...f, nim: f.nim.trim(), nama: f.nama.trim() });
      this.form = this.blank(); this.error = '';
    }
  },
  template: '#tpl-order-form'
});
