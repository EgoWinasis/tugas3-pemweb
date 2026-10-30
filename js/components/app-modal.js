Vue.component('app-modal', {
  props: { show: { type: Boolean, default: false }, title: { type: String, default: 'Konfirmasi' } },
  template: '#tpl-app-modal'
});
