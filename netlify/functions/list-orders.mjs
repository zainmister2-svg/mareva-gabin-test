
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

export default async (req) => {
  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl || !supabaseKey || !adminPassword) {
    return json({ error: "Server belum dikonfigurasi" }, 503);
  }

  const suppliedPassword = req.headers.get("x-admin-password") || "";

  const a = Buffer.from(suppliedPassword);
  const b = Buffer.from(adminPassword);

  const { timingSafeEqual } = await import("node:crypto");

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return json({ error: "Kata sandi admin salah" }, 401);
  }

  try {
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/orders?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: supabaseKey,
          authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      return json({ error: "Gagal mengambil pesanan dari database" }, 502);
    }

    const orders = await response.json();
    return json({ ok: true, orders });
  } catch {
    return json({ error: "Database tidak bisa dihubungi" }, 502);
  }
};
