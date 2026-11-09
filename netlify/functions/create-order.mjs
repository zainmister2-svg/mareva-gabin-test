const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseKey) return json({ error: "Server belum dikonfigurasi" }, 503);
  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON tidak valid" }, 400); }
  const name = typeof body.customer_name === "string" ? body.customer_name.trim().slice(0,120) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0,40) : "";
  const address = typeof body.address === "string" ? body.address.trim().slice(0,1500) : "";
  const items = Array.isArray(body.items) ? body.items.slice(0,30).map(x => ({ name: String(x.name || "Produk").slice(0,120), quantity: Math.max(0, Math.min(999, Number(x.quantity || 0))), unit_price: Math.max(0, Number(x.unit_price || 0)), line_total: Math.max(0, Number(x.line_total || 0)) })) : [];
  const total = Number(body.total);
  const deliveryFee = Number(body.delivery_fee || 0);
  const payment = ["Cash", "QRIS"].includes(body.payment_method) ? body.payment_method : "Cash";
  if (!name || !phone || !items.length || items.some(x => !Number.isFinite(x.quantity) || x.quantity <= 0) || !Number.isFinite(total) || total < 0 || !Number.isFinite(deliveryFee) || deliveryFee < 0) return json({ error: "Data pesanan tidak lengkap atau tidak valid" }, 400);
  const row = { customer_name: name, phone, address, items, total, delivery_fee: deliveryFee, payment_method: payment, status: "Baru" };
  let response;
  try {
    response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/orders`, { method: "POST", headers: { apikey: supabaseKey, authorization: `Bearer ${supabaseKey}`, "content-type": "application/json", prefer: "return=minimal" }, body: JSON.stringify(row) });
  } catch { return json({ error: "Database tidak bisa dihubungi" }, 502); }
  if (!response.ok) return json({ error: "Database menolak pesanan", detail: (await response.text()).slice(0,500) }, 502);
  return json({ ok: true }, 201);
};
