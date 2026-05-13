import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function POST(req: Request) {
  try {
    const { listing } = await req.json();
    if (!listing) return NextResponse.json({ error: "Listing text is required" }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const supabase = getSupabase();

    if (supabase) {
      const { data: paidData } = await supabase.from("paid_usage").select("*").eq("ip_address", ip).single();
      let isPaid = false;
      if (paidData) {
        if (paidData.paid_until && new Date(paidData.paid_until) > new Date()) isPaid = true;
        else if (paidData.remaining_reports > 0) isPaid = true;
      }
      if (!isPaid) {
        const { data: logs } = await supabase.from("usage_logs").select("id").eq("ip_address", ip);
        if (logs && logs.length >= 1) {
          return NextResponse.json({ error: "Free limit reached. Please upgrade to FlipScan Pro.", code: "LIMIT_REACHED" }, { status: 402 });
        }
      }
    }

    let analysisText = "";
    if (!process.env.ANTHROPIC_API_KEY) {
      analysisText = "## Mock Analysis\n\nAdd your ANTHROPIC_API_KEY environment variable to get real analysis.\n\n**VERDICT: NEGOTIATE**";
    } else {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: "You are a professional M&A analyst. Analyze business listings and provide comprehensive acquisition reports.",
        messages: [{
          role: "user",
          content: `Analyze this business listing in Markdown with sections: Financial Breakdown, Payback Period, Red Flags & Risks, Growth Opportunities, Fair Valuation, Final Recommendation (VERDICT: BUY/PASS/NEGOTIATE).\n\nListing:\n${listing}`
        }],
      });
      const content = response.content[0];
      if (content.type === "text") analysisText = content.text;
    }

    if (supabase) {
      await supabase.from("usage_logs").insert([{ ip_address: ip }]);
    }

    return NextResponse.json({ analysis: analysisText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to analyze" }, { status: 500 });
  }
}
