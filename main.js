// main.js - 공통 레이아웃 + 모달/탭 + KV + (Demo) submit + Amplitude/Experiment
import * as amplitude from "https://esm.sh/@amplitude/analytics-browser";
import { Experiment } from "https://esm.sh/@amplitude/experiment-js-client";


document.addEventListener('DOMContentLoaded', function () {
    const deeplinkBtn = document.querySelector('.open-deeplink');

    if (!deeplinkBtn) return;

    deeplinkBtn.addEventListener('click', function () {
      airbridge.openDeeplink({
        deeplinks: {
          android: 'juryeol://',
          ios: 'juryeol://',
          desktop: 'https://abjuju.cafe24.com/',
        },
        fallbacks: {
          android: 'google-play',
          ios: 'itunes-appstore',
        },
        defaultParams: {
          campaign: '<EXAMPLE_CAMPAIGN>',
          medium: '<EXAMPLE_MEDIUM>',
          term: '<EXAMPLE_TERM>',
          content: '<EXAMPLE_CONTENT>',
        },
        ctaParams: {
          cta_param_1: '<EXAMPLE_CTA_PARAM_1>',
          cta_param_2: '<EXAMPLE_CTA_PARAM_2>',
          cta_param_3: '<EXAMPLE_CTA_PARAM_3>',
        },
      });
    });
  });

braze.initialize('2bebced7-f02d-4b28-b6bf-29faa38b1c3e', {
    baseUrl: "sdk.iad-03.braze.com",
    enableLogging: false, // set to `true` for debugging
    allowUserSuppliedJavascript: false, // set to `true` to support custom HTML messages
});

/* =========================
 * 0) SDK init (Amplitude / Experiment)
 * ========================= */
amplitude.init("abd0527cc3b38429edfedee3fd14874f", {
  fetchRemoteConfig: true,
  autocapture: {
    attribution: true,
    pageViews: true,
    sessions: true,
    formInteractions: false,
    elementInteractions: false,
  },
  //logLevel: amplitude.Types.LogLevel.Debug, // <- loglevel 오타 주의(공식은 logLevel)
});

const experiment = Experiment.initializeWithAmplitudeAnalytics(
  "client-n647zNuxko1LDKdFyCrInlDpMvNOwPSt"
);
console.log(experiment);


// const user = {
//   user_id: 'juryeol_control',
//   user_properties: {
//     premium: true,
//   },
// };


await experiment.fetch();

const variant = experiment.variant('demo-feature-expeirment');
variant;
console.log(variant);

if (variant.value === 'control') {
    console.log('Control Group 배정됨 : 아무 작업하지 않습니다.');
  }

if (variant.value === 'treatment') {
  console.log("Treatment Group 배정됨: Amplitude 블럭 색상을 강조합니다.");
  const card = document.getElementById('amplitude_card');
  card.style.background = '#2F80ED';
  card.style.border = '1px solid #2F80ED';

  //Payload 받아와서 source로 사용하기
  var treantment_payload = variant.payload.text;
  document.querySelector('#amplitude_card > h4').innerText = treantment_payload;
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.open-app');
    if (!btn) return;

    console.log('[open-app] clicked');

    if (!window.airbridge || typeof window.airbridge.openDeeplink !== 'function') {
      console.error('[airbridge] not loaded or openDeeplink is not a function', window.airbridge);
      return;
    }

    window.airbridge.openDeeplink({
      type: 'click',
      deeplinks: {
        android: 'juryeol://',
        ios: 'ablog://',
        desktop: 'https://blog.ab180.co/',
      },
      fallbacks: {
        android: 'google-play',
        ios: 'itunes-appstore',
      },
      defaultParams: {
        campaign: '<EXAMPLE_CAMPAIGN>',
        medium: '<EXAMPLE_MEDIUM>',
        term: '<EXAMPLE_TERM>',
        content: '<EXAMPLE_CONTENT>',
      },
      ctaParams: {
        cta_param_1: '<EXAMPLE_CTA_PARAM_1>',
        cta_param_2: '<EXAMPLE_CTA_PARAM_2>',
        cta_param_3: '<EXAMPLE_CTA_PARAM_3>',
      },
    });
  });

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.open-hd');
    if (!btn) return;

    console.log('[open-app] clicked');

    if (!window.airbridge || typeof window.airbridge.openDeeplink !== 'function') {
      console.error('[airbridge] not loaded or openDeeplink is not a function', window.airbridge);
      return;
    }
    window.location.href = "https://abr.ge/j9cziu"
  });

/* =========================
 * 1) Layout + basic UX
 * ========================= */
(function () {
  const isHtmlFolder = window.location.pathname.includes("/html/");
  const base = isHtmlFolder ? ".." : ".";

  const routes = {
    header: `${base}/layout/header.html`,
    footer: `${base}/layout/footer.html`,
  };

  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    return await res.text();
  }

  async function injectLayout() {
    const headerMount = document.querySelector("[data-include='header']");
    const footerMount = document.querySelector("[data-include='footer']");
    if (headerMount) headerMount.innerHTML = await fetchText(routes.header);
    if (footerMount) footerMount.innerHTML = await fetchText(routes.footer);

    setupMobileNav();
    highlightNav();
    setupSmoothScroll();
  }

  function setupMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  function highlightNav() {
    const hash = window.location.hash;
    let key = "home";
    if (hash === "#services") key = "services";
    if (hash === "#faq") key = "faq";
    if (hash === "#contact") key = "contact";

    document.querySelectorAll(".nav-link").forEach((el) => {
      const navKey = el.getAttribute("data-navkey");
      el.classList.toggle("is-active", navKey === key);
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll("[data-scroll]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function setupFAQ() {
    document.querySelectorAll("[data-faq-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        if (!item) return;
        item.classList.toggle("is-open");
      });
    });
  }

  function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      console.log("[CONTACT_SUBMIT]", payload);

      alert("문의가 접수되었습니다! (데모)");
      form.reset();
    });
  }

  function applyHeroBg() {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    const img = hero.getAttribute("data-hero-img");
    if (!img) return;
    hero.style.setProperty("--hero-image", `url('${img}')`);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    applyHeroBg();
    await injectLayout();
    setupFAQ();
    setupContactForm();
  });
})();

/* =========================
 * 2) Modal + Tabs (single implementation)
 * ========================= */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("show");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("show");
  modalEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function closeAllModals() {
  document.querySelectorAll(".modal.show").forEach((m) => {
    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

function activateTab(modalEl, tabName) {
  if (!modalEl || !tabName) return;

  modalEl.querySelectorAll(".tab").forEach((btn) => {
    const isTarget = btn.dataset.tab === tabName;
    btn.classList.toggle("is-active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  modalEl.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tabName);
  });
}

// 이벤트 위임으로 한 번만 처리
document.addEventListener("click", (e) => {
  // (A) open modal
  const openBtn = e.target.closest(".open-modal");
  if (openBtn) {
    const id = openBtn.dataset.target;
    const modal = document.getElementById(id);
    if (!modal) return;

    // 탭 기본 활성화
    const defaultTab =
      modal.querySelector(".tab.is-active")?.dataset.tab ||
      modal.querySelector(".tab:not([disabled])")?.dataset.tab;

    if (defaultTab) activateTab(modal, defaultTab);

    openModal(modal);
    return;
  }

  // (B) close modal (backdrop or close button)
  const closeBtn = e.target.closest("[data-close]");
  if (closeBtn) {
    const modalId = closeBtn.dataset.close;
    const modal = document.getElementById(modalId);
    closeModal(modal);
    return;
  }

  // (C) tab click
  const tabBtn = e.target.closest(".tab");
  if (tabBtn && !tabBtn.disabled) {
    const modalEl = tabBtn.closest(".modal");
    if (!modalEl) return;
    activateTab(modalEl, tabBtn.dataset.tab);
    return;
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

/* =========================
 * 3) Utils
 * ========================= */
function safeJsonParse(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// KV list -> object (타입 추정: JSON/boolean/number/string)
function kvListToObject(listEl, keyName, valueName) {
  const obj = {};
  if (!listEl) return obj;

  const keys = listEl.querySelectorAll(`input[name="${keyName}"]`);
  const values = listEl.querySelectorAll(`input[name="${valueName}"]`);

  keys.forEach((kEl, idx) => {
    const key = (kEl.value || "").trim();
    if (!key) return;

    const raw = (values[idx]?.value || "").trim();
    if (raw === "") return;

    let parsed = raw;

    // JSON object/array
    if (
      (raw.startsWith("{") && raw.endsWith("}")) ||
      (raw.startsWith("[") && raw.endsWith("]"))
    ) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = raw;
      }
    } else if (raw === "true") parsed = true;
    else if (raw === "false") parsed = false;
    else if (!Number.isNaN(Number(raw))) parsed = Number(raw);

    obj[key] = parsed;
  });

  return obj;
}

function createKvRow(group /* "event" | "user" | "be" | "ba" */) {
  const row = document.createElement("div");
  row.className = "kv-row";

  if (group === "event" || group === "user") {
    row.innerHTML = `
      <input class="kv-input" name="${group}_key[]" type="text" placeholder="key" />
      <input class="kv-input" name="${group}_value[]" type="text" placeholder="value" />
      <button class="kv-remove" type="button" aria-label="삭제">－</button>
    `;
    return row;
  }

  // Braze 용 (be_key[]/be_value[], ba_key[]/ba_value[])
  if (group === "be") {
    row.innerHTML = `
      <input class="kv-input" name="be_key[]" type="text" placeholder="key" />
      <input class="kv-input" name="be_value[]" type="text" placeholder="value" />
      <button class="kv-remove" type="button" aria-label="삭제">－</button>
    `;
    return row;
  }

  if (group === "ba") {
    row.innerHTML = `
      <input class="kv-input" name="ba_key[]" type="text" placeholder="key" />
      <input class="kv-input" name="ba_value[]" type="text" placeholder="value" />
      <button class="kv-remove" type="button" aria-label="삭제">－</button>
    `;
    return row;
  }

  return row;
}

function updateRemoveButtons(listEl) {
  if (!listEl) return;
  const rows = listEl.querySelectorAll(".kv-row");
  const shouldDisable = rows.length <= 1;

  rows.forEach((r) => {
    const btn = r.querySelector(".kv-remove");
    if (btn) btn.disabled = shouldDisable;
  });
}

/* =========================
 * 4) KV add/remove (event delegation, single)
 * ========================= */
document.addEventListener("click", (e) => {
  // + 버튼
  const addBtn = e.target.closest("[data-add-kv]");
  if (addBtn) {
    const type = addBtn.dataset.addKv; // "event" | "user" | "braze-event" | "braze-attr"

    if (type === "event" || type === "user") {
      const listEl = document.getElementById(
        type === "event" ? "ampEventProps" : "ampUserProps"
      );
      if (!listEl) return;
      listEl.appendChild(createKvRow(type));
      updateRemoveButtons(listEl);
      return;
    }

    if (type === "braze-event") {
      const listEl = document.getElementById("brazeEventProps");
      if (!listEl) return;
      listEl.appendChild(createKvRow("be"));
      updateRemoveButtons(listEl);
      return;
    }

    if (type === "braze-attr") {
      const listEl = document.getElementById("brazeAttrList");
      if (!listEl) return;
      listEl.appendChild(createKvRow("ba"));
      updateRemoveButtons(listEl);
      return;
    }
  }

  // - 버튼
  const removeBtn = e.target.closest(".kv-remove");
  if (removeBtn) {
    const listEl = removeBtn.closest(".kv-list");
    if (!listEl) return;

    const rows = listEl.querySelectorAll(".kv-row");
    if (rows.length <= 1) return;

    removeBtn.closest(".kv-row")?.remove();
    updateRemoveButtons(listEl);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  updateRemoveButtons(document.getElementById("ampEventProps"));
  updateRemoveButtons(document.getElementById("ampUserProps"));
  updateRemoveButtons(document.getElementById("brazeEventProps"));
  updateRemoveButtons(document.getElementById("brazeAttrList"));
});

/* =========================
 * 5) Demo submits (Airbridge / Braze)
 * ========================= */
document.getElementById("airbridgeLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const userId = new FormData(e.target).get("user_id");
  console.log("[Airbridge][LOGIN]", { user_id: userId });
});

document.getElementById("airbridgeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Airbridge][EVENT]", {
    event_name: fd.get("event_name"),
    props: safeJsonParse(fd.get("props")),
  });
});

document.getElementById("airbridgeAttrForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Airbridge][ATTRIBUTE]", { key: fd.get("key"), value: fd.get("value") });
});

document.getElementById("brazeLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const externalId = new FormData(e.target).get("external_id");
  console.log("[Braze][LOGIN]", { external_id: externalId });
});

document.getElementById("brazeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const eventName = new FormData(e.target).get("event_name");

  const properties = kvListToObject(
    document.getElementById("brazeEventProps"),
    "be_key[]",
    "be_value[]"
  );

  console.log("[Braze][EVENT]", { event_name: eventName, properties });
});

document.getElementById("brazeAttrForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const attributes = kvListToObject(
    document.getElementById("brazeAttrList"),
    "ba_key[]",
    "ba_value[]"
  );

  console.log("[Braze][ATTRIBUTE]", { attributes });
});

/* =========================
 * 6) Amplitude: Login + Identify -> Track
 * (모듈 import 버전 기준으로 amplitude 객체 그대로 사용)
 * ========================= */
document.getElementById("amplitudeLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const userId = new FormData(e.target).get("user_id")?.toString().trim();
  if (!userId) return;

  console.log("[Amplitude][LOGIN] user_id =", userId);
  amplitude.setUserId(userId);
  experiment.fetch(userId);
});

document.getElementById("amplitudeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  const eventName = fd.get("event_name")?.toString().trim();
  if (!eventName) return;

  const eventProps = kvListToObject(
    document.getElementById("ampEventProps"),
    "event_key[]",
    "event_value[]"
  );

  const userProps = kvListToObject(
    document.getElementById("ampUserProps"),
    "user_key[]",
    "user_value[]"
  );

  console.log("[Amplitude][FORM]", { eventName, eventProps, userProps });

  // 1) identify (user props)
  if (Object.keys(userProps).length > 0) {
    const identify = new amplitude.Identify();
    Object.entries(userProps).forEach(([k, v]) => identify.set(k, v));
    amplitude.identify(identify);
  }

  // 2) track
  amplitude.track(eventName, eventProps);
  console.log("[Amplitude][SENT] identify -> track 완료");
});