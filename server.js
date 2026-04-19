window.SkymasterOS = (() => {

  const API = "/api";

  /* =========================
     SCORE SYSTEM
  ========================= */

  const SCORE_MAP = {
    page_view: 1,
    click: 3,
    product_view: 5,
    checkout_click: 12,
    stripe_click: 20
  };

  function getScore() {
    return Number(localStorage.getItem("ns_score") || 0);
  }

  function setScore(v) {
    localStorage.setItem("ns_score", v);
  }

  function addScore(event) {
    const next = getScore() + (SCORE_MAP[event] || 0);
    setScore(next);
    return next;
  }

  function getStage(score) {
    if (score >= 20) return "HOT";
    if (score >= 8) return "WARM";
    return "COLD";
  }

  /* =========================
     TRACK CORE
  ========================= */

  async function track(event, data = {}) {

    const score = addScore(event);
    const stage = getStage(score);

    const payload = {
      event,
      data,
      score,
      stage,
      user_id: localStorage.getItem("ns_user_id") || "anon",
      session_id: localStorage.getItem("ns_session_id") || "no-session",
      url: location.href
    };

    console.log("[SKYMASTER]", payload);

    // send to backend
    fetch(`${API}/hot-lead`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    }).catch(() => {});

    /* =========================
       AUTOPILOT ROUTING
    ========================= */

    if (stage === "HOT") {
      console.log("🔥 HOT LEAD → STRIPE PUSH");

      setTimeout(() => {
        window.location.href =
          "https://buy.stripe.com/9B6eV64qDcT20xpeDC2ZO0i";
      }, 800);
    }

    return payload;
  }

  /* =========================
     PRODUCT CLICK FUNNEL
  ========================= */

  function viewProduct() {
    track("product_view");
  }

  function clickCheckout() {
    track("checkout_click");

    fetch(`${API}/checkout-click`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        user_id: localStorage.getItem("ns_user_id"),
        session_id: localStorage.getItem("ns_session_id"),
        score: getScore()
      })
    });
  }

  /* =========================
     INIT
  ========================= */

  function init() {
    track("page_view");

    document.addEventListener("click", (e) => {
      const el = e.target.closest("a, button");
      if (!el) return;

      track("click", {
        text: el.innerText || "",
        href: el.href || ""
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    track,
    viewProduct,
    clickCheckout,
    getScore,
    getStage
  };

})();