Vue.component('status-badge', {
  props: { qty: { type: Number, required: true }, safety: { type: Number, required: true }, note: { type: String, default: '' } },
  computed: {
    status() {
      if (Number(this.qty) === 0) return { label: 'Kosong', icon: '●', className: 'danger' };
      if (Number(this.qty) < Number(this.safety)) return { label: 'Menipis', icon: '▲', className: 'warning' };
      return { label: 'Aman', icon: '●', className: 'success' };
    }
  },
  template: '#tpl-status-badge'
});
