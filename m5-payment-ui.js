(() => {
  const apiBase = () => (localStorage.getItem("diagnostic_api_url") || "http://127.0.0.1:8000").replace(/\/$/, "");
  const authFetch = async (path, options = {}) => {
    const headers = { ...(options.headers || {}), Authorization: `Bearer ${localStorage.getItem("diagnostic_token") || ""}` };
    const r = await fetch(apiBase() + path, { ...options, headers });
    let d = null; try { d = await r.json(); } catch {}
    if (!r.ok) throw Error(typeof d?.detail === "string" ? d.detail : JSON.stringify(d?.detail || d) || `HTTP ${r.status}`);
    return d;
  };
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const pretty = s => String(s || "UNKNOWN").replaceAll("_", " ");
  const modal = () => document.getElementById("modal");
  const modalContent = () => document.getElementById("modalContent");
  const showModal = html => { modalContent().innerHTML = html; modal().classList.remove("hidden"); };
  const closeModal = () => modal()?.classList.add("hidden");
  const toast = m => { const t=document.getElementById("toast"); if(t){t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600);} };

  async function paymentContext(reportId) {
    return authFetch(`/reports/final/${reportId}/payment-context`);
  }

  function orderHtml(ctx) {
    if (!ctx.orders?.length) return `<div class="empty">No order exists for this patient yet. Create the patient order first, then return here.</div>`;
    return ctx.orders.map(o => {
      const b = o.billing;
      const billingText = b ? `${pretty(b.payment_status)} · Paid ₹${b.paid_amount ?? 0} · Pending ₹${b.pending_amount ?? 0}` : "No billing record yet";
      let action = `<button class="secondary m5-link-order" data-report="${ctx.report_id}" data-order="${o.id}">Link this order</button>`;
      if (ctx.order_id === o.id && b) {
        if (String(b.payment_status).toUpperCase() === "PAID" && Number(b.pending_amount) <= 0) {
          action = `<button class="primary m5-release" data-report="${ctx.report_id}">Release report</button>`;
        } else {
          action = `<button class="primary m5-mark-paid" data-order="${o.id}" data-report="${ctx.report_id}">Mark paid & release</button>`;
        }
      } else if (ctx.order_id === o.id && !b) {
        action = `<button class="primary m5-create-billing" data-order="${o.id}" data-report="${ctx.report_id}" data-total="${o.total_amount ?? 0}">Create pending payment</button>`;
      }
      return `<div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0"><strong>Order #${esc(o.id)}</strong><div class="muted">Total ₹${esc(o.total_amount ?? 0)} · ${esc(o.status || "pending")}</div><div class="muted" style="margin:6px 0">${esc(billingText)}</div>${action}</div>`;
    }).join("");
  }

  async function openPayment(jobId) {
    try {
      const job = await authFetch(`/reports/ingest/${jobId}`);
      if (!job.final_report_id) throw Error("This report has no generated PDF yet.");
      const ctx = await paymentContext(job.final_report_id);
      showModal(`<h2>Payment & release</h2><p class="muted">Report #${esc(ctx.report_id)} · ${esc(ctx.patient_name || `Patient #${ctx.patient_id}`)}</p><div>${orderHtml(ctx)}</div><button class="secondary full" id="m5Close">Close</button>`);
      document.getElementById("m5Close").onclick = closeModal;
      bindModalActions();
    } catch (e) { toast(e.message); }
  }

  async function refreshPayment(reportId) {
    const ctx = await paymentContext(reportId);
    showModal(`<h2>Payment & release</h2><p class="muted">Report #${esc(ctx.report_id)} · ${esc(ctx.patient_name || `Patient #${ctx.patient_id}`)}</p><div>${orderHtml(ctx)}</div><button class="secondary full" id="m5Close">Close</button>`);
    document.getElementById("m5Close").onclick = closeModal;
    bindModalActions();
  }

  function form(fields) { const f = new FormData(); Object.entries(fields).forEach(([k,v]) => f.append(k,String(v))); return f; }

  function bindModalActions() {
    document.querySelectorAll(".m5-link-order").forEach(b => b.onclick = async () => {
      try { await authFetch(`/reports/final/${b.dataset.report}/link-order/${b.dataset.order}`, {method:"POST"}); toast("Order linked to report"); await refreshPayment(+b.dataset.report); }
      catch(e){toast(e.message)}
    });
    document.querySelectorAll(".m5-create-billing").forEach(b => b.onclick = async () => {
      try {
        await authFetch("/billing/", {method:"POST", body:form({order_id:b.dataset.order,payment_status:"PENDING",pending_amount:b.dataset.total})});
        toast("Pending payment record created"); await refreshPayment(+b.dataset.report);
      } catch(e){toast(e.message)}
    });
    document.querySelectorAll(".m5-mark-paid").forEach(b => b.onclick = async () => {
      try {
        await authFetch(`/billing/${b.dataset.order}/payment`, {method:"PUT", body:form({payment_status:"PAID",pending_amount:0})});
        await authFetch(`/reports/final/${b.dataset.report}/release`, {method:"POST"});
        toast("Payment verified and report released"); closeModal(); window.dispatchEvent(new CustomEvent("m5-refresh"));
      } catch(e){toast(e.message)}
    });
    document.querySelectorAll(".m5-release").forEach(b => b.onclick = async () => {
      try { await authFetch(`/reports/final/${b.dataset.report}/release`, {method:"POST"}); toast("Report released"); closeModal(); window.dispatchEvent(new CustomEvent("m5-refresh")); }
      catch(e){toast(e.message)}
    });
  }

  async function decorate() {
    for (const row of document.querySelectorAll(".report-row")) {
      if (row.dataset.m5Done) continue;
      const status = row.querySelector(".status")?.textContent?.trim();
      if (!status) continue;
      const jobButton = row.querySelector("[data-job]");
      if (!jobButton) continue;
      if (status === "HELD PAYMENT") {
        const b = document.createElement("button");
        b.className = "row-action"; b.textContent = "Payment / Release";
        b.onclick = e => { e.preventDefault(); e.stopPropagation(); openPayment(Number(jobButton.dataset.job)); };
        row.appendChild(b);
      } else if (status === "RELEASED") {
        const b = document.createElement("button");
        b.className = "row-action"; b.textContent = "Released"; b.disabled = true;
        row.appendChild(b);
      }
      row.dataset.m5Done = "1";
    }
  }

  window.addEventListener("m5-refresh", () => setTimeout(decorate, 300));
  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => decorate());
    observer.observe(document.body, {childList:true,subtree:true});
    setInterval(decorate, 1200);
    decorate();
  });
})();
