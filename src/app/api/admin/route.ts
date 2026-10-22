import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function isAdmin(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  return profile?.tipo === "admin";
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const admin = adminClient();
  const tab = req.nextUrl.searchParams.get("tab") || "visao_geral";

  if (tab === "visao_geral") {
    const [usersRes, ordersRes, txRes] = await Promise.all([
      admin.from("profiles").select("id, tipo, status, created_at"),
      admin.from("orders").select("id, status, valor_total, created_at"),
      admin.from("transactions").select("id, tipo, valor, created_at"),
    ]);

    const users = usersRes.data || [];
    const orders = ordersRes.data || [];
    const txs = txRes.data || [];

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const ordersThisMonth = orders.filter((o) => new Date(o.created_at) >= thisMonth);
    const volumeThisMonth = ordersThisMonth.reduce((s, o) => s + Number(o.valor_total || 0), 0);
    const taxaTotal = txs.filter((t) => t.tipo === "taxa").reduce((s, t) => s + Number(t.valor), 0);

    const statusCount: Record<string, number> = {};
    for (const o of orders) statusCount[o.status] = (statusCount[o.status] || 0) + 1;

    return NextResponse.json({
      stats: {
        totalUsers: users.filter((u) => u.status === "ativo").length,
        ordersThisMonth: ordersThisMonth.length,
        volumeThisMonth,
        taxaTotal: Math.abs(taxaTotal),
      },
      statusCount,
      totalOrders: orders.length,
    });
  }

  if (tab === "usuarios") {
    const { data } = await admin.from("profiles").select("id, nome, tipo, nivel_vendedor, nivel_comprador, nota_media, total_vendas, total_compras, status, created_at").order("created_at", { ascending: false });
    return NextResponse.json({ usuarios: data || [] });
  }

  if (tab === "pedidos") {
    const { data } = await admin.from("orders").select("*, comprador:comprador_id(nome), vendedor:vendedor_id(nome)").order("created_at", { ascending: false });
    return NextResponse.json({ pedidos: data || [] });
  }

  if (tab === "financeiro") {
    const [txRes, walletsRes] = await Promise.all([
      admin.from("transactions").select("*").order("created_at", { ascending: false }).limit(50),
      admin.from("wallets").select("saldo, saldo_pendente, user_id, profiles(nome)"),
    ]);

    const txs = txRes.data || [];
    const wallets = walletsRes.data || [];

    const taxaTotal = txs.filter((t) => t.tipo === "taxa").reduce((s, t) => s + Math.abs(Number(t.valor)), 0);
    const escrow = wallets.reduce((s, w) => s + Number(w.saldo_pendente || 0), 0);
    const saquesPendentes = txs.filter((t) => t.tipo === "saque" && t.status === "pendente");

    return NextResponse.json({ taxaTotal, escrow, saquesPendentes, transacoes: txs, wallets });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const admin = adminClient();
  const body = await req.json();

  if (body.action === "update_user_status") {
    const { userId, status } = body;
    await admin.from("profiles").update({ status }).eq("id", userId);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "update_order_status") {
    const { orderId, status } = body;
    await admin.from("orders").update({ status }).eq("id", orderId);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "set_admin") {
    const { userId } = body;
    await admin.from("profiles").update({ tipo: "admin" }).eq("id", userId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
}
