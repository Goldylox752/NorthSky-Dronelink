window.SkymasterOS = (() => {
  const API = "/api";

  // =========================
  // CONFIG
  // =========================
  const SCORE_MAP = {
    page_view: 1,
    click: 3,
    product_view: 5,
    checkout_click: 12,
    stripe_click: 20,
  };

  const STORAGE_KEYS = {
    score: "ns_score",
    user: "ns_user_id",
    session: "ns_session_id",
  };

  // =========================
  // STATE HELPERS
  // =========================
  const get = (key, fallback = 0) =>
    Number(localStorage.getItem(key) || fallback);

  const set = (key, value) =>
    localStorage.setItem(key, value);

  const getScore = () => get(STORAGE_KEYS.score, 0);
  const setScore = (v) => set(STORAGE_KEYS.score, v);

  const getUserId = () =>
    localStorage.getItem(STORAGE_KEYS.user) || "anon";

  const getSessionId = () =>
    localStorage.getItem(STORAGE_KEYS.session) || "no-session";

  // =========================
  // SCORING ENGINE
  // =========================
  const addScore = (event) => {
    const nextScore = getScore() + (SCORE_MAP[event] || 0);
    setScore(nextScore);
    return nextScore;
  };

  const getStage = (score) => {
    if (score >= 20) return "HOT";
    if (score >= 8) return "WARM";
    return "COLD";
  };

  // =========================
  // CORE TRACKER
  // =========================
  async function track(event, data = {}) {
    const score = addScore(event);
    const stage = getStage(score);

    const payload = {
      event,
      data,
      score,
      stage,
      user_id: getUserId(),
      session_id: getSessionId(),
      url: window.location.href,
      timestamp: Date.now(),
    };

    console.log("[SKYMASTER OS]", payload);

    // send to backend (non-blocking)
    fetch(`${API}/hot-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    // =========================
    // AUTOPILOT LOGIC
    // =========================
    if (stage === "HOT") {
      console.log("🔥 HOT LEAD DETECTED");

      setTimeout(() => {
        window.location.href =
          "https://buy.stripe.com/9B6eV64qDcT20xpeDC2ZO0i";
      }, 800);
    }

    return payload;
  }

  // =========================
  // FUNNEL ACTIONS
  // =========================
  const viewProduct = () => track("product_view");

  const clickCheckout = () => {
    track("checkout_click");

    fetch(`${API}/checkout-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: getUserId(),
        session_id: getSessionId(),
        score: getScore(),
      }),
    }).catch(() => {});
  };

  // =========================
  // AUTO INIT
  // =========================
  function init() {
    track("page_view");

    document.addEventListener("click", (e) => {
      const el = e.target.closest("a, button");
      if (!el) return;

      track("click", {
        text: el.innerText?.trim() || "",
        href: el.href || "",
      });
    });
  }

  // safe DOM init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // =========================
  // PUBLIC API
  // =========================
  return {
    track,
    viewProduct,
    clickCheckout,
    getScore,
    getStage,
  };
})();