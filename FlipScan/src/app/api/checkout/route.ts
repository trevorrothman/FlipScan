import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { plan, ip } = await req.json();
    if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ url: "/success" });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: plan === "unlimited" ? "subscription" : "payment",
      metadata: { plan, ip },
      success_url: `${base}/success`,
      cancel_url: `${base}/cancel`,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: plan === "unlimited" ? "FlipScan Pro - Unlimited" : "FlipScan - Single Report" },
          unit_amount: plan === "unlimited" ? 2900 : 900,
          ...(plan === "unlimited" ? { recurring: { interval: "month" } } : {}),
        },
        quantity: 1,
      }],
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
