import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { session_id } = req.body || {};

    if (!session_id) {
      return res.json({ valid: false });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const isValid = session.payment_status === "paid";

    return res.json({
      valid: isValid,
      plan: session.metadata?.plan || null,
    });

  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ valid: false });
  }
}