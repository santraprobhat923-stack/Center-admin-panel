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
      addDownloadButton(button, data.report_id);
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



  function addDownloadButton(anchorButton, reportId) {
    if (!reportId || !anchorButton?.parentElement) return;
    const parent = anchorButton.parentElement;
    if (parent.querySelector(`[data-download-report="${reportId}"]`)) return;
    const download = document.createElement("button");
    download.className = "row-action";
    download.type = "button";
    download.dataset.downloadReport = String(reportId);
    download.textContent = "Download PDF";
    download.title = `Download generated report #${reportId}`;
    download.addEventListener("click", async event => {
      event.preventDefault();
      event.stopPropagation();
      const accessToken = token();
      try {
        const response = await fetch(
          `${apiBase()}/workflow/reports/${encodeURIComponent(reportId)}/download`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) {
          let detail = `HTTP ${response.status}`;
          try {
            const data = await response.json();
            detail = typeof data?.detail === "string" ? data.detail : detail;
          } catch (_) {}
          throw new Error(detail);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        if (typeof window.toast === "function") window.toast(`Download failed: ${error.message}`);
        else alert(`Download failed: ${error.message}`);
      }
    });
    parent.appendChild(download);
  }

  async function addDownloadButtonsForHeldReports() {
    for (const row of document.querySelectorAll(".report-row")) {
      const status = row.querySelector(".status")?.textContent?.trim().replace(/\s+/g, "_").toUpperCase();
      if (status !== "HELD_PAYMENT" && status !== "HELD" && status !== "HELD_PAYMENT") continue;
      const match = row.querySelector(".report-main strong")?.textContent.match(/#(\d+)/);
      if (!match) continue;
      const jobId = match[1];
      if (row.querySelector("[data-download-report]")) continue;
      try {
        const response = await fetch(`${apiBase()}/reports/ingest/${encodeURIComponent(jobId)}`, {
          headers: { Authorization: `Bearer ${token()}` }
        });
        if (!response.ok) continue;
        const job = await response.json();
        if (job.final_report_id) addDownloadButton(row.querySelector(".row-action") || row, job.final_report_id);
      } catch (_) {}
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
    addDownloadButtonsForHeldReports();
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(addDownloadButtonsForHeldReports, 1500);
  });
})();
