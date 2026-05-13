import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ received: true });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const session = event.data.object as Stripe.Checkout.Session;
    const ip = session.metadata?.ip;
    const plan = session.metadata?.plan;
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (ip && plan === "unlimited") {
      const paidUntil = new Date();
      paidUntil.setDate(paidUntil.getDate() + 31);
      await supabase.from("paid_usage").upsert({ ip_address: ip, paid_until: paidUntil.toISOString(), updated_at: new Date().toISOString() });
    } else if (ip && plan === "single") {
      await supabase.from("paid_usage").upsert({ ip_address: ip, remaining_reports: 1, updated_at: new Date().toISOString() });
    }
  }

  return NextResponse.json({ received: true });
}
