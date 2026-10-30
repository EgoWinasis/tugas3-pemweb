// Service untuk memuat data JSON dan template komponen SITTA.
window.SittaAPI = {
  async loadData() {
    const response = await fetch('./data/dataBahanAjar.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Gagal membaca dataBahanAjar.json (HTTP ${response.status}).`);
    }
    return response.json();
  },

  async loadTemplates() {
    const names = ['status-badge', 'app-modal', 'stock-table', 'do-tracking', 'order-form'];
    const host = document.getElementById('template-host');
    if (!host) throw new Error('Elemen #template-host tidak ditemukan di index.html.');

    // Hapus template lama agar tidak terjadi ID ganda ketika dimuat ulang.
    host.innerHTML = '';

    await Promise.all(names.map(async (name) => {
      const response = await fetch(`./templates/${name}.html`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Gagal memuat templates/${name}.html (HTTP ${response.status}).`);
      }

      const html = await response.text();
      if (!html.trim()) throw new Error(`Template ${name}.html kosong.`);

      const template = document.createElement('script');
      template.type = 'text/x-template';
      template.id = `tpl-${name}`;
      template.textContent = html;
      host.appendChild(template);
    }));

    // Pastikan semua template yang dibutuhkan komponen tersedia.
    names.forEach((name) => {
      if (!document.getElementById(`tpl-${name}`)) {
        throw new Error(`Elemen template #tpl-${name} tidak berhasil dibuat.`);
      }
    });
  }
};
