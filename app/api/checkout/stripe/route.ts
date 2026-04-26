import { NextResponse } from "next/server";

type CheckoutItem = {
  name: string;
  price: number;
  quantity: number;
};

function getBaseUrl(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        error: "Stripe is nog niet geconfigureerd. Voeg STRIPE_SECRET_KEY toe in je environment variables."
      },
      { status: 500 }
    );
  }

  const body = (await request.json()) as { items?: CheckoutItem[] };
  const items = Array.isArray(body.items) ? body.items.filter((item) => item.quantity > 0 && item.price > 0) : [];

  if (items.length === 0) {
    return NextResponse.json({ error: "Je winkelmand is leeg." }, { status: 400 });
  }

  const baseUrl = getBaseUrl(request);
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${baseUrl}/checkout/success`);
  params.set("cancel_url", `${baseUrl}/checkout/cancel`);

  items.forEach((item, index) => {
    params.set(`line_items[${index}][price_data][currency]`, "eur");
    params.set(`line_items[${index}][price_data][product_data][name]`, item.name);
    params.set(`line_items[${index}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
    params.set(`line_items[${index}][quantity]`, String(item.quantity));
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = (await response.json()) as { url?: string; error?: { message?: string } };

  if (!response.ok || !data.url) {
    return NextResponse.json(
      {
        error: data.error?.message || "Stripe Checkout Session kon niet worden aangemaakt."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.url });
}
