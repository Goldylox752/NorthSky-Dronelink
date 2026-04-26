export default function Pricing() {
  return (
    <main style={styles.page}>

      {/* HEADER */}
      <section style={styles.header}>
        <h1 style={styles.title}>Skymaster X1 v2 Pricing</h1>
        <p style={styles.sub}>
          Choose your access level. Built for roofing contractors who want inspection speed + higher close rates.
        </p>
      </section>

      {/* PRICING GRID */}
      <section style={styles.grid}>

        {/* STARTER */}
        <div style={styles.card}>
          <h2 style={styles.plan}>Starter</h2>
          <p style={styles.price}>$899</p>
          <p style={styles.desc}>Single drone unit</p>

          <ul style={styles.list}>
            <li>✔ Skymaster X1 v2 drone</li>
            <li>✔ 4K inspection camera</li>
            <li>✔ Basic flight system</li>
            <li>✔ 1-year warranty</li>
          </ul>

          <a
            href="https://buy.stripe.com/your-starter-link"
            style={styles.btn}
          >
            Buy Starter
          </a>
        </div>

        {/* GROWTH (featured) */}
        <div style={styles.cardFeatured}>
          <h2 style={styles.plan}>Growth</h2>
          <p style={styles.price}>$1,499</p>
          <p style={styles.desc}>Most popular for contractors</p>

          <ul style={styles.list}>
            <li>✔ Everything in Starter</li>
            <li>✔ Extra battery pack</li>
            <li>✔ Extended range control system</li>
            <li>✔ Priority support</li>
          </ul>

          <a
            href="https://buy.stripe.com/your-growth-link"
            style={styles.btnFeatured}
          >
            Buy Growth
          </a>
        </div>

        {/* DOMINATION */}
        <div style={styles.card}>
          <h2 style={styles.plan}>Domination</h2>
          <p style={styles.price}>$2,499</p>
          <p style={styles.desc}>Full contractor system</p>

          <ul style={styles.list}>
            <li>✔ Everything in Growth</li>
            <li>✔ 2nd backup drone unit</li>
            <li>✔ Inspection workflow bundle</li>
            <li>✔ Priority onboarding support</li>
          </ul>

          <a
            href="https://buy.stripe.com/your-domination-link"
            style={styles.btn}
          >
            Buy Domination
          </a>
        </div>

      </section>

      {/* FOOTER CTA */}
      <section style={styles.footer}>
        <h2>Need help choosing?</h2>
        <p style={{ opacity: 0.7 }}>
          Most contractors start with Growth for maximum ROI.
        </p>

        <a href="/apply" style={styles.secondaryBtn}>
          Apply Instead
        </a>
      </section>

    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    padding: 20,
  },

  header: {
    textAlign: "center",
    padding: "60px 20px 30px",
  },

  title: {
    fontSize: 38,
    fontWeight: 900,
  },

  sub: {
    maxWidth: 700,
    margin: "10px auto",
    opacity: 0.7,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
    maxWidth: 1000,
    margin: "0 auto",
    padding: "20px 0",
  },

  card: {
    background: "#121a2b",
    border: "1px solid #24314d",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
  },

  cardFeatured: {
    background: "#16213a",
    border: "2px solid #4f46e5",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
    transform: "scale(1.03)",
  },

  plan: {
    fontSize: 20,
    fontWeight: 800,
  },

  price: {
    fontSize: 32,
    fontWeight: 900,
    margin: "10px 0",
    color: "#22c55e",
  },

  desc: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 15,
  },

  list: {
    listStyle: "none",
    padding: 0,
    fontSize: 13,
    opacity: 0.85,
    lineHeight: 1.8,
    textAlign: "left",
  },

  btn: {
    display: "inline-block",
    marginTop: 15,
    padding: "12px 18px",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 700,
  },

  btnFeatured: {
    display: "inline-block",
    marginTop: 15,
    padding: "12px 18px",
    background: "linear-gradient(105deg,#22c55e,#16a34a)",
    color: "#0b1220",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 800,
  },

  footer: {
    textAlign: "center",
    marginTop: 60,
    padding: 30,
  },

  secondaryBtn: {
    display: "inline-block",
    marginTop: 15,
    padding: "10px 16px",
    border: "1px solid #4f46e5",
    borderRadius: 10,
    color: "#fff",
    textDecoration: "none",
  },
};