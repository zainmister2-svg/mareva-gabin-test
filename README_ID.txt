MAREVA GABIN — SALINAN UJI COBA SUPABASE + NETLIFY

PENTING
- Ini salinan terpisah. Website Netlify lama tidak diubah.
- Jangan unggah Secret key ke chat, HTML, atau GitHub. Masukkan hanya ke environment variables Netlify.
- File index.html mempertahankan desain dan ringkasan pesanan di bagian bawah.

ISI PAKET
- index.html: website yang mengirim pesanan ke fungsi backend.
- netlify/functions/create-order.mjs: simpan pesanan ke Supabase.
- netlify/functions/list-orders.mjs: baca pesanan dengan kata sandi admin.
- netlify.toml: konfigurasi folder fungsi.

SEBELUM DITES
1. Buat situs Netlify BARU / salinan uji coba. Jangan deploy ke situs lama. Unggah folder ini melalui metode deploy yang mendukung folder project beserta netlify/functions dan netlify.toml (misalnya deploy dari repository atau Netlify CLI). Upload hanya index.html tidak cukup karena fungsi backend juga harus ikut dideploy.
2. Di Netlify situs uji coba, tambahkan environment variables (scope Functions):
   SUPABASE_URL = Project URL Supabase (bukan secret key)
   SUPABASE_SECRET_KEY = Secret key Supabase (hanya di Netlify server environment)
   ADMIN_PASSWORD = kata sandi admin yang panjang dan unik
3. Redeploy situs uji coba setelah environment variables diisi.
4. Pastikan tabel public.orders memiliki kolom yang dipakai: id, created_at, customer_name (text), phone (text), address (text), items (jsonb), total (numeric), delivery_fee (numeric), payment_method (text), status (text).
5. Tabel tetap pakai RLS. Fungsi backend memakai secret key yang hanya tersimpan di Netlify; jangan membuat SELECT publik pada orders.
6. Tes pesanan contoh dengan data palsu. Setelah pelanggan menekan tombol, WhatsApp tetap dibuka. Jika fungsi database belum berhasil, situs memberi peringatan.
7. Untuk melihat dashboard online, klik “Muat data pesanan online” lalu masukkan ADMIN_PASSWORD. Jangan berikan kata sandi ke pelanggan.

CATATAN
- Dashboard menampilkan hingga 2.000 pesanan terakhir untuk agregasi bulanan. Untuk volume lebih besar perlu pagination.
- Endpoint create-order publik bisa menerima percobaan spam; sebelum penggunaan luas, tambahkan proteksi anti-spam/rate limit.
- Alamat, metode penerimaan, desa/zona, dan catatan pelanggan disimpan bersama dalam kolom address supaya tidak perlu mengubah skema tabel.
- Ini paket awal untuk uji coba, belum terhubung ke situs live. Tes dulu sebelum memindahkan apa pun.
