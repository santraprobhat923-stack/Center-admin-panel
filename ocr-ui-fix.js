/*
 * OCR demographic compatibility layer.
 * The backend stores patient demographics as structured fields:
 * { value, confidence }. The verification UI accepts plain input values.
 * This bridge also accepts future flat OCR fields so the UI remains tolerant.
 */
(function () {
  function valueOf(field) {
    if (field && typeof field === "object" && "value" in field) return field.value ?? "";
    return field ?? "";
  }

  function patientValues(patient) {
    patient = patient || {};
    return {
      name: valueOf(patient.patient_name ?? patient.full_name ?? patient.name),
      age: valueOf(patient.age),
      gender: valueOf(patient.gender),
      phone: valueOf(patient.phone),
      email: valueOf(patient.email),
      code: valueOf(patient.patient_code ?? patient.code ?? patient.patient_id ?? patient.id)
    };
  }

  function hydrateVerificationCards() {
    if (typeof state === "undefined") return;
    document.querySelectorAll("[data-card]").forEach(card => {
      const id = Number(card.dataset.card);
      const report = state.reports.find(r => Number(r.job_id) === id);
      if (!report) return;
      const p = patientValues((report.extracted_data || {}).patient);
      Object.entries(p).forEach(([key, value]) => {
        const input = card.querySelector(`[data-patient="${key}"]`);
        if (input && value !== "" && !input.value.trim()) input.value = value;
      });
    });
  }

  function start() {
    const queue = document.getElementById("verificationQueue");
    if (!queue) return;
    const observer = new MutationObserver(hydrateVerificationCards);
    observer.observe(queue, { childList: true, subtree: true });
    hydrateVerificationCards();
    window.addEventListener("load", hydrateVerificationCards);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
