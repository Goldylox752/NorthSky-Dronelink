import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Required for Stripe signature verification
export const config = {
  api: { bodyParser: false },
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (c) => chunks.push(c));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const rawBody = await buffer(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send(err.message);
  }

  // 🔐 THIS IS YOUR SOURCE OF TRUTH
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("✅ Payment confirmed:", session.id);

    // TODO: store this in DB (Supabase recommended)
    // Example:
    // session.id
    // session.customer_email
    // session.metadata.plan

    // For now, log only
  }

  res.status(200).json({ received: true });
}