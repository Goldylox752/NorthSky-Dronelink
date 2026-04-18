import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Stripe signature failed:", err.message);
    return res.status(400).send("Webhook signature error");
  }

  try {

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      const email = session.customer_details?.email || "unknown";
      const amount = (session.amount_total || 0) / 100;

      const meta = session.metadata || {};

      const session_id = meta.session_id || null;
      const source = meta.utm_source || "unknown";
      const campaign = meta.utm_campaign || null;
      const cost = parseFloat(meta.cpc || 0);

      const profit = amount - cost;

      const payload = {
        email,
        amount,
        session_id,
        source,
        campaign,
        cost,
        profit,
        created_at: new Date().toISOString()
      };

      const response = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/purchases`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.SUPABASE_SERVICE_KEY,
            "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        console.log("❌ Supabase insert failed:", await response.text());
      } else {
        console.log("💰 Purchase tracked:", email, amount);
      }
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.log("❌ Webhook processing error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}



require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// IMPORTANT: raw body required for Stripe signature verification
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle events
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("💰 Payment successful:", session.id);

        // TODO: grant access / activate drone features
        break;

      case "invoice.paid":
        console.log("📦 Subscription payment received");
        break;

      case "customer.subscription.deleted":
        console.log("❌ Subscription cancelled");
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// normal JSON routes AFTER webhook
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NorthSky Stripe Webhook Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
