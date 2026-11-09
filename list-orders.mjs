import { timingSafeEqual } from "node:crypto";
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
function safeEqual(a, b) { const x=Buffer.from(String(a)); const y=Buffer.from(String(b)); return x.length===y.length && timingSafeEqual(x,y); }
export default async (req) => {
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);
  const expected = process.env.ADMIN_PASSWORD;
  const supplied = req.headers.get("x-admin-password") || "";
  if (!expected || !supplied || !safeEqual(supplied, expected)) return json({ error: "Unauthorized" }, 401);
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseKey) return json({ error: "Server belum dikonfigurasi" }, 503);
  const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/orders?select=id,created_at,customer_name,phone,address,items,total,delivery_fee,payment_method,status&order=created_at.desc&limit=2000`;
  let response;
  try { response = await fetch(url, { headers: { apikey: supabaseKey, authorization: `Bearer ${supabaseKey}` } }); }
  catch { return json({ error: "Database tidak bisa dihubungi" }, 502); }
  if (!response.ok) return json({ error: "Gagal membaca pesanan database" }, 502);
  const orders = await response.json();
  return json({ orders });
};
