(() => {
  const $ = id => document.getElementById(id);
  const LOW = 3; // أقل من أو يساوي هذا = كمية محدودة

  // لتوصيل API حقيقي: أعد Promise بنفس شكل window.CATALOG / window.STORES
  const loadCatalog = async () => ({ products: window.CATALOG, stores: window.STORES });

  // تطبيع النص العربي/الإنجليزي: إزالة التشكيل وتوحيد الهمزات والتاء المربوطة
  const norm = s => (s || "").toString().toLowerCase()
    .replace(/[ً-ٟـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = n => n.toLocaleString("ar-EG");

  let products = [], stores = {}, cat = "الكل";
  const state = { q: "", inOnly: false, sort: "rel" };

  const offers = p => Object.entries(p.stock).map(([id, [price, qty]]) => ({ ...stores[id], price, qty }));
  const total = p => offers(p).reduce((a, o) => a + o.qty, 0);
  const status = q => q === 0 ? ["نفد", "b-out"] : q <= LOW ? ["كمية محدودة", "b-low"] : ["متوفر", "b-ok"];

  function score(p, terms) {
    if (!terms.length) return 1;
    const hay = norm([p.name, p.en, p.brand, p.cat, p.desc].join(" "));
    let s = 0;
    for (const t of terms) {
      if (!hay.includes(t)) return 0;
      s += norm(p.name + " " + p.en).includes(t) ? 3 : 1;
    }
    return s;
  }
  const hl = (text, terms) => {
    let out = esc(text);
    for (const t of terms) if (t.length > 1) out = out.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>");
    return out;
  };

  function render() {
    const terms = norm(state.q).split(" ").filter(Boolean);
    let list = products.map(p => ({ p, s: score(p, terms) })).filter(x => x.s > 0)
      .filter(x => cat === "الكل" || x.p.cat === cat)
      .filter(x => !state.inOnly || total(x.p) > 0);
    const minPrice = p => Math.min(...offers(p).filter(o => o.qty).map(o => o.price), Infinity);
    const sorters = {
      rel: (a, b) => b.s - a.s, low: (a, b) => minPrice(a.p) - minPrice(b.p),
      high: (a, b) => minPrice(b.p) - minPrice(a.p), avail: (a, b) => total(b.p) - total(a.p),
    };
    list.sort(sorters[state.sort]);
    $("count").textContent = state.q ? `${list.length} نتيجة لـ «${state.q}»` : `${list.length} منتج`;
    $("empty").hidden = list.length > 0;
    $("results").innerHTML = list.map(({ p }, i) => card(p, terms, i)).join("");
  }

  function card(p, terms, i) {
    const os = offers(p).sort((a, b) => (b.qty > 0) - (a.qty > 0) || a.price - b.price);
    const inStock = os.filter(o => o.qty > 0), t = total(p), [label, cls] = status(t);
    const best = inStock[0];
    return `<article class="card" style="animation-delay:${Math.min(i, 8) * 40}ms">
      <div class="top"><div class="pic">${p.emoji}</div>
        <div style="flex:1"><h3>${hl(p.name, terms)}</h3><div class="en">${hl(p.en, terms)}</div><div class="d">${esc(p.desc)}</div></div>
        <span class="badge ${cls}">${label}</span></div>
      <div class="sum"><div><small>أفضل سعر متوفر</small><b>${best ? fmt(best.price) + " " + best.cur : "—"}</b></div>
        <div style="text-align:end"><small>متوفر في</small><b>${inStock.length} / ${os.length} متاجر</b></div></div>
      <ul class="stores">${os.map(o => { const [l, c] = status(o.qty);
        return `<li class="${o === best ? "best" : ""}"><div class="n">${esc(o.name)}<small>📍 ${esc(o.city)}</small></div>
          <span class="p">${fmt(o.price)} ${o.cur}</span>
          <span class="badge ${c}">${o.qty ? l + " · " + fmt(o.qty) : l}</span></li>`; }).join("")}</ul>
    </article>`;
  }

  // الإكمال التلقائي
  let act = -1;
  function suggest() {
    const terms = norm($("q").value).split(" ").filter(Boolean), box = $("suggest");
    if (!terms.length) return box.hidden = true;
    const m = products.filter(p => score(p, terms)).slice(0, 6);
    box.innerHTML = m.map(p => `<li data-q="${esc(p.name)}">${p.emoji} ${esc(p.name)}<small>${esc(p.en)}</small></li>`).join("");
    box.hidden = !m.length; act = -1;
  }
  const run = v => { state.q = v; $("q").value = v; $("suggest").hidden = true; render(); };

  async function init() {
    ({ products, stores } = await loadCatalog());
    const cats = ["الكل", ...new Set(products.map(p => p.cat))];
    $("cats").innerHTML = cats.map(c => `<button class="${c === cat ? "on" : ""}">${c}</button>`).join("");
    $("quick").innerHTML = ["آيفون", "لابتوب", "سماعة", "بلايستيشن", "تلفزيون"].map(w => `<button>${w}</button>`).join("");
    $("cats").onclick = e => { if (e.target.tagName !== "BUTTON") return; cat = e.target.textContent;
      [...$("cats").children].forEach(b => b.classList.toggle("on", b === e.target)); render(); };
    $("quick").onclick = e => e.target.tagName === "BUTTON" && run(e.target.textContent);
    $("searchForm").onsubmit = e => { e.preventDefault(); run($("q").value); };
    $("q").oninput = () => { suggest(); state.q = $("q").value; render(); };
    $("q").onkeydown = e => {
      const items = [...$("suggest").children];
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault();
        act = (act + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((li, i) => li.classList.toggle("on", i === act)); }
      else if (e.key === "Enter" && act >= 0) { e.preventDefault(); run(items[act].dataset.q); }
      else if (e.key === "Escape") $("suggest").hidden = true;
    };
    $("suggest").onclick = e => { const li = e.target.closest("li"); li && run(li.dataset.q); };
    document.addEventListener("click", e => { if (!e.target.closest(".search")) $("suggest").hidden = true; });
    $("inOnly").onchange = e => { state.inOnly = e.target.checked; render(); };
    $("sort").onchange = e => { state.sort = e.target.value; render(); };
    render();
  }
  init();
})();
