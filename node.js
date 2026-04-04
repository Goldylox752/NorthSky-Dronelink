const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const stripe = Stripe("YOUR_SECRET_KEY");

app.post("/create-checkout", async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Drone Order"
            },
            unit_amount: amount * 100
          },
          quantity: 1
        }
      ],
      success_url: "https://your-site.com/success.html",
      cancel_url: "https://your-site.com/cancel.html"
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running"));


metadata: {
  addons: "battery,case"
}



