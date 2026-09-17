(() => {
  const apiBase = () => (localStorage.getItem("diagnostic_api_url") || "http://127.0.0.1:8000").replace(/\/$/, "");
  const token = () => localStorage.getItem("diagnostic_token") || "";
  const esc = value => String(value ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

  async function generatePdf(jobId, button) {
    const accessToken = token();
    if (!accessToken) {
      alert("Please sign in first.");
      return;
    }
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Generating…";
    try {
      const response = await fetch(`${apiBase()}/reports/ingest/${encodeURIComponent(jobId)}/finalize`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      let data = null;
      try { data = await response.json(); } catch (_) {}
      if (!response.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : JSON.stringify(data?.detail || data || `HTTP ${response.status}`);
        throw new Error(detail);
      }
      button.textContent = "PDF generated";
      button.classList.add("secondary");
      button.title = `Report #${data.report_id} — ${data.release_status || "HELD_PAYMENT"}`;
      const row = button.closest(".report-row");
      const status = row?.querySelector(".status");
      if (status) {
        status.textContent = "HELD PAYMENT";
        status.className = "status verify";
      }
      const main = row?.querySelector(".report-main");
      if (main) {
        const old = main.querySelector("small");
        if (old && !old.textContent.includes("PDF #")) {
          old.textContent += ` · PDF #${data.report_id}`;
        }
      }
      if (typeof window.toast === "function") window.toast(`Job #${jobId} PDF generated and held for payment.`);
    } catch (error) {
      button.disabled = false;
      button.textContent = original;
      if (typeof window.toast === "function") window.toast(`PDF generation failed: ${error.message}`);
      else alert(`PDF generation failed: ${error.message}`);
    }
  }

  function enhanceRows() {
    document.querySelectorAll(".report-row").forEach(row => {
      const status = row.querySelector(".status");
      const button = row.querySelector(".row-action");
      if (!status || !button || button.dataset.m4Ready === "1") return;
      const normalized = status.textContent.trim().replace(/\s+/g, "_").toUpperCase();
      if (normalized !== "VERIFIED") return;
      const match = row.querySelector(".report-main strong")?.textContent.match(/#(\d+)/);
      if (!match) return;
      const jobId = match[1];
      button.dataset.m4Ready = "1";
      button.textContent = "Generate PDF";
      button.type = "button";
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        generatePdf(jobId, button);
      }, { capture: true });
    });
  }

  const observer = new MutationObserver(enhanceRows);
  document.addEventListener("DOMContentLoaded", () => {
    enhanceRows();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
