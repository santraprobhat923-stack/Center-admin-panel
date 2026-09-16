/**
 * Diagnostic Centre Patient Portal - Centre Admin Panel
 * Client-Side Application State & Dynamic Views
 * 
 * DESIGN PRINCIPLE:
 * Strictly isolated for multi-tenancy. All data below belongs strictly to
 * centre_id: "C001" (Sunrise Diagnostic Centre).
 * 
 * In production, this file connects to Python / FastAPI endpoints
 * which enforce centre isolation at the database layer.
 */

/* ==========================================
   1. CENTRALIZED MOCK DATA STORE (CENTRE C001)
   ========================================== */

const centreData = {
  centre_id: "C001",
  centre_name: "Sunrise Diagnostic Centre",
  active_user: "Dr. A. Sen (Admin)",
  credits_available: 416,
  credits_purchased: 2500,
  credits_used: 2184,
  credits_promo: 100,
  website_url: "sunrise-diagnostics.medportal.in"
};

const demoPatients = [
  { id: "P10025", name: "Rahul Das", phone: "+91 98765 43210", totalReports: 3, outstanding: 70, lastActivity: "Today, 06:42 PM" },
  { id: "P10031", name: "Ananya Gupta", phone: "+91 98301 98301", totalReports: 1, outstanding: 0, lastActivity: "Today, 04:15 PM" },
  { id: "P10042", name: "Subhas Bose", phone: "+91 91234 56789", totalReports: 2, outstanding: 500, lastActivity: "Today, 02:10 PM" },
  { id: "P10055", name: "Pooja Roy", phone: "+91 98900 11223", totalReports: 1, outstanding: 0, lastActivity: "Yesterday, 08:30 PM" },
  { id: "P10068", name: "Manoj Sen", phone: "+91 94330 00112", totalReports: 4, outstanding: 120, lastActivity: "Yesterday, 11:20 AM" }
];

const demoReports = [
  { report_id: "R10025", patient_id: "P10025", patient_name: "Rahul Das", test: "Complete Blood Count (CBC)", upload_time: "Today 10:15 AM", status: "Bill Missing", bill_linked: false, payment_received: false, download_status: "Blocked" },
  { report_id: "R10031", patient_id: "P10031", patient_name: "Ananya Gupta", test: "Liver Function Test (LFT)", upload_time: "Today 11:40 AM", status: "Ready", bill_linked: true, payment_received: true, download_status: "Available" },
  { report_id: "R10042", patient_id: "P10042", patient_name: "Subhas Bose", test: "Lipid Profile & Glucose", upload_time: "Today 01:25 PM", status: "Payment Pending", bill_linked: true, payment_received: false, download_status: "Blocked" },
  { report_id: "R10055", patient_id: "P10055", patient_name: "Pooja Roy", test: "Thyroid Panel (T3, T4, TSH)", upload_time: "Today 03:00 PM", status: "Downloaded", bill_linked: true, payment_received: true, download_status: "Downloaded" },
  { report_id: "R10068", patient_id: "P10068", patient_name: "Manoj Sen", test: "Chest X-Ray Digital", upload_time: "Today 04:10 PM", status: "Ready", bill_linked: true, payment_received: true, download_status: "Available" }
];

const demoBills = [
  { bill_id: "B10025", patient_id: "P10025", patient_name: "Rahul Das", test: "Complete Blood Count (CBC)", total: 100, paid: 30, due: 70, status: "Partially Paid" },
  { bill_id: "B10031", patient_id: "P10031", patient_name: "Ananya Gupta", test: "Liver Function Test (LFT)", total: 750, paid: 750, due: 0, status: "Paid" },
  { bill_id: "B10042", patient_id: "P10042", patient_name: "Subhas Bose", test: "Lipid Profile & Glucose", total: 500, paid: 0, due: 500, status: "Outstanding" },
  { bill_id: "B10055", patient_id: "P10055", patient_name: "Pooja Roy", test: "Thyroid Panel (T3, T4, TSH)", total: 400, paid: 400, due: 0, status: "Paid" },
  { bill_id: "B10068", patient_id: "P10068", patient_name: "Manoj Sen", test: "Chest X-Ray Digital", total: 600, paid: 480, due: 120, status: "Partially Paid" }
];

const demoPayments = [
  { txn_id: "TXN-99824", patient_id: "P10031", patient_name: "Ananya Gupta", test: "Liver Function Test (LFT)", bill_id: "B10031", amount: 750, status: "Verified", time: "Today, 12:05 PM" },
  { txn_id: "TXN-99825", patient_id: "P10055", patient_name: "Pooja Roy", test: "Thyroid Panel", bill_id: "B10055", amount: 400, status: "Verified", time: "Today, 03:15 PM" },
  { txn_id: "TXN-99826", patient_id: "P10042", patient_name: "Subhas Bose", test: "Lipid Profile", bill_id: "B10042", amount: 500, status: "Pending", time: "Today, 04:30 PM" },
  { txn_id: "TXN-99827", patient_id: "P10068", patient_name: "Manoj Sen", test: "Chest X-Ray", bill_id: "B10068", amount: 120, status: "Failed", time: "Today, 05:00 PM" }
];

const demoDownloads = [
  { timestamp: "Today, 06:42 PM", patient_id: "P10025", patient_name: "Rahul Das", test: "CBC", report_id: "R10025", ip: "103.212.14.9 (Mobile Safari)" },
  { timestamp: "Today, 03:22 PM", patient_id: "P10055", patient_name: "Pooja Roy", test: "Thyroid Panel", report_id: "R10055", ip: "49.36.128.45 (Chrome Android)" }
];

const demoNotifications = [
  { date: "Today, 04:12 PM", patient_name: "Subhas Bose (P10042)", channel: "WhatsApp", event: "Payment Reminder (₹500 Due)", status: "Delivered" },
  { date: "Today, 03:18 PM", patient_name: "Pooja Roy (P10055)", channel: "WhatsApp", event: "Report Ready & Link Sent", status: "Delivered" },
  { date: "Today, 12:06 PM", patient_name: "Ananya Gupta (P10031)", channel: "SMS", event: "Payment Confirmation (₹750)", status: "Delivered" },
  { date: "Today, 10:20 AM", patient_name: "Rahul Das (P10025)", channel: "WhatsApp", event: "Report Uploaded Notification", status: "Failed" }
];

const demoCreditHistory = [
  { date: "01 Sep 2026", credits: 1000, amount: "₹3,000", method: "UPI", status: "Success" },
  { date: "15 Aug 2026", credits: 1000, amount: "₹3,000", method: "Razorpay Gateway", status: "Success" },
  { date: "01 Aug 2026", credits: 500, amount: "₹1,500", method: "UPI", status: "Success" },
  { date: "15 Jul 2026", credits: 100, amount: "FREE", method: "Promotional Onboarding", status: "Added" }
];

const demoStaff = [
  { name: "Dr. A. Sen", role: "Centre Admin", phone: "+91 98300 12345", status: "Active", lastLogin: "Today, 09:00 AM" },
  { name: "Rina Mukherjee", role: "Reception", phone: "+91 98300 67890", status: "Active", lastLogin: "Today, 08:45 AM" },
  { name: "Amitav Ghosh", role: "Report Operator", phone: "+91 98300 55443", status: "Active", lastLogin: "Today, 10:12 AM" },
  { name: "Sunil Paul", role: "Billing Clerk", phone: "+91 98300 99887", status: "Inactive", lastLogin: "04 Sep 2026" }
];

const demoTickets = [
  { id: "TCK-8812", category: "Report Problem", subject: "Barcode unreadable on sample P10042", priority: "High", status: "Open", updated: "10 mins ago" },
  { id: "TCK-8790", category: "Payment Problem", subject: "UPI payment received at counter not auto-matching", priority: "Normal", status: "In Progress", updated: "2 hours ago" },
  { id: "TCK-8722", category: "Report Upload Problem", subject: "Bulk PDF failed on 2 files", priority: "Normal", status: "Resolved", updated: "Yesterday" }
];

const demoActivities = [
  { time: "06:42 PM", text: "Patient Rahul Das (P10025) downloaded report for Complete Blood Count (CBC) via Patient Portal" },
  { time: "05:00 PM", text: "Patient Manoj Sen attempted online payment of ₹120 (Gateway: Declined)" },
  { time: "04:10 PM", text: "Report Operator Amitav Ghosh uploaded report R10068 (Chest X-Ray) for Manoj Sen" },
  { time: "03:15 PM", text: "Verified online payment of ₹400 received for Bill B10055 (Pooja Roy)" },
  { time: "11:40 AM", text: "Report R10031 for Ananya Gupta matched with Bill B10031. Status marked: READY" }
];

/* ==========================================
   2. INITIALIZATION & ROUTING
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  initCentreHeader();
  renderDashboard();
  renderReportsTable(demoReports);
  renderBillingTable(demoBills);
  renderDataReadiness();
  renderPatientsTable(demoPatients);
  renderPaymentsTable(demoPayments);
  renderDownloadsTable(demoDownloads);
  renderNotificationsTable(demoNotifications);
  renderCreditsPage();
  renderActivityTimeline();
  renderStaffTable();
  renderTicketsTable();
  setupNavigation();
  setupEventHandlers();
});

// Configure centre branding dynamically
function initCentreHeader() {
  document.getElementById("headerCentreName").textContent = centreData.centre_name;
  document.getElementById("headerCentreId").textContent = centreData.centre_id;
  document.getElementById("uploadPageBalance").textContent = centreData.credits_available;
}

// Single-Page View Navigation Controller
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link, .nav-sublink, .dropdown-item");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("data-target");
      if (!targetId) return;

      e.preventDefault();

      // Switch active class on sections
      document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add("active");

      // Update sidebar nav state
      document.querySelectorAll(".nav-link, .nav-sublink").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // Subfilter support (e.g. Reports -> Ready, Billing -> Outstanding)
      const reportFilter = link.getAttribute("data-filter");
      if (reportFilter && targetId === "section-reports-list") {
        applyReportFilter(reportFilter);
      }

      const billingFilter = link.getAttribute("data-billing-filter");
      if (billingFilter && targetId === "section-billing-records") {
        applyBillingFilter(billingFilter);
      }

      const paymentFilter = link.getAttribute("data-payment-filter");
      if (paymentFilter && targetId === "section-payments") {
        applyPaymentFilter(paymentFilter);
      }

      // Close mobile sidebar if open
      document.getElementById("sidebar").classList.remove("mobile-open");
      document.getElementById("profileDropdown").classList.remove("open");
    });
  });

  // Nav Groups Collapse / Expand
  document.querySelectorAll(".nav-group-header").forEach(header => {
    header.addEventListener("click", () => {
      const targetGroupId = header.getAttribute("data-toggle");
      const groupItems = document.getElementById(targetGroupId);
      if (groupItems) {
        const isHidden = groupItems.style.display === "none";
        groupItems.style.display = isHidden ? "flex" : "none";
        header.querySelector(".group-arrow").textContent = isHidden ? "▾" : "▸";
      }
    });
  });

  // Mobile Hamburger Toggle
  document.getElementById("hamburgerBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("mobile-open");
  });

  document.getElementById("sidebarCloseBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("mobile-open");
  });

  // Profile Menu Dropdown
  document.getElementById("centreProfileMenu").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("profileDropdown").classList.toggle("open");
  });

  document.addEventListener("click", () => {
    document.getElementById("profileDropdown").classList.remove("open");
  });
}

/* ==========================================
   3. DASHBOARD LOGIC (Operational Daily Events)
   ========================================== */

function renderDashboard() {
  // Operational mock indicators (known system events only)
  document.getElementById("cardReportsUploaded").textContent = "84";
  document.getElementById("cardPatientsCount").textContent = demoPatients.length.toString();
  document.getElementById("cardOnlinePayments").textContent = "23";
  document.getElementById("cardOnlineAmount").textContent = "₹8,450";
  document.getElementById("cardReportsDownloaded").textContent = "52";
  document.getElementById("cardNotificationsSent").textContent = "76";
  document.getElementById("cardPendingIssues").textContent = "4";
  document.getElementById("cardCreditsRemaining").textContent = centreData.credits_available.toString();
  document.getElementById("sidebarReadinessCount").textContent = "2";

  // Dashboard Report Status Pills
  const statusPillsContainer = document.getElementById("dashboardStatusPills");
  statusPillsContainer.innerHTML = `
    <div class="status-pill">
      <span class="pill-title">Ready (Notified)</span>
      <span class="pill-val text-success">24</span>
    </div>
    <div class="status-pill">
      <span class="pill-title">Payment Pending</span>
      <span class="pill-val text-amber">12</span>
    </div>
    <div class="status-pill">
      <span class="pill-title">Bill Missing</span>
      <span class="pill-val text-danger">4</span>
    </div>
    <div class="status-pill">
      <span class="pill-title">Notified Alerts</span>
      <span class="pill-val">31</span>
    </div>
    <div class="status-pill">
      <span class="pill-title">Downloaded</span>
      <span class="pill-val">52</span>
    </div>
    <div class="status-pill">
      <span class="pill-title">Upload Failed</span>
      <span class="pill-val text-danger">1</span>
    </div>
  `;

  // Data Readiness Alert Items
  const readinessAlertsContainer = document.getElementById("dashboardReadinessList");
  readinessAlertsContainer.innerHTML = `
    <div class="activity-item">
      <span class="badge badge-danger">Bill Missing</span>
      <div>
        <strong>Patient P10025 (Rahul Das)</strong> — CBC report uploaded, but no billing voucher matched. Link blocked from release.
        <button class="btn btn-secondary btn-sm mt-1" onclick="navigateTo('section-upload-billing')">Resolve: Upload Bill</button>
      </div>
    </div>
    <div class="activity-item mt-2">
      <span class="badge badge-warning">Payment Pending</span>
      <div>
        <strong>Patient P10042 (Subhas Bose)</strong> — Lipid Profile complete &amp; verified. Due: ₹500. Automatic release held until cleared.
        <button class="btn btn-secondary btn-sm mt-1" onclick="openPatientModal('P10042')">View Patient</button>
      </div>
    </div>
  `;
}

/* ==========================================
   4. DATA READINESS PAGE (Core SaaS Rule)
   ========================================== */

function renderDataReadiness() {
  const tbody = document.getElementById("dataReadinessTableBody");
  tbody.innerHTML = "";

  const readinessCases = [
    { patient: "Rahul Das (P10025)", test: "CBC", report: true, bill: false, pay: "—", status: "Bill Missing", action: "Upload Bill" },
    { patient: "Ananya Gupta (P10031)", test: "LFT", report: true, bill: true, pay: "Verified", status: "Ready", action: "Release Sent" },
    { patient: "Subhas Bose (P10042)", test: "Lipid Profile", report: true, bill: true, pay: "Due ₹500", status: "Payment Pending", action: "Send Reminder" },
    { patient: "Pooja Roy (P10055)", test: "Thyroid Panel", report: true, bill: true, pay: "Verified", status: "Downloaded", action: "Archived" },
    { patient: "Kiran Shah (P10099)", test: "Urinalysis", report: false, bill: true, pay: "Paid", status: "Report Missing", action: "Upload PDF" }
  ];

  readinessCases.forEach(item => {
    const tr = document.createElement("tr");

    let statusBadge = `<span class="badge badge-info">${item.status}</span>`;
    if (item.status === "Ready" || item.status === "Downloaded") statusBadge = `<span class="badge badge-success">${item.status}</span>`;
    if (item.status === "Payment Pending") statusBadge = `<span class="badge badge-warning">${item.status}</span>`;
    if (item.status === "Bill Missing" || item.status === "Report Missing") statusBadge = `<span class="badge badge-danger">${item.status}</span>`;

    tr.innerHTML = `
      <td><strong>${item.patient}</strong></td>
      <td>${item.test}</td>
      <td>${item.report ? "✓ Yes" : "<span class='text-danger'>✗ Missing</span>"}</td>
      <td>${item.bill ? "✓ Yes" : "<span class='text-danger'>✗ Missing</span>"}</td>
      <td>${item.pay}</td>
      <td>${statusBadge}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="alert('Action: ${item.action} for ${item.patient}')">${item.action}</button></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================
   5. REPORTS VIEW & BULK UPLOAD MOCK
   ========================================== */

function renderReportsTable(records) {
  const tbody = document.getElementById("reportsTableBody");
  tbody.innerHTML = "";

  records.forEach(r => {
    let badgeClass = "badge-gray";
    if (r.status === "Ready") badgeClass = "badge-success";
    if (r.status === "Payment Pending") badgeClass = "badge-warning";
    if (r.status === "Bill Missing" || r.status === "Failed") badgeClass = "badge-danger";
    if (r.status === "Downloaded") badgeClass = "badge-info";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${r.report_id}</strong></td>
      <td><a href="javascript:void(0)" onclick="openPatientModal('${r.patient_id}')">${r.patient_name} (${r.patient_id})</a></td>
      <td>${r.test}</td>
      <td>${r.upload_time}</td>
      <td><span class="badge ${badgeClass}">${r.status}</span></td>
      <td>${r.payment_received ? "<span class='text-success'>✓ Cleared</span>" : "<span class='text-amber'>Due / Pending</span>"}</td>
      <td>${r.download_status}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="alert('Previewing PDF for ${r.report_id}')">View PDF</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function applyReportFilter(filterValue) {
  document.getElementById("reportsListTitle").textContent = `Reports: ${filterValue.toUpperCase()}`;
  if (filterValue === "all") {
    renderReportsTable(demoReports);
  } else {
    const filtered = demoReports.filter(r => r.status.toLowerCase() === filterValue.toLowerCase());
    renderReportsTable(filtered);
  }
}

/* ==========================================
   6. BILLING SYSTEM & EXCEL IMPORT MOCK
   ========================================== */

function renderBillingTable(bills) {
  const tbody = document.getElementById("billingTableBody");
  tbody.innerHTML = "";

  let totalVal = 0;
  let paidVal = 0;
  let dueVal = 0;

  bills.forEach(b => {
    totalVal += b.total;
    paidVal += b.paid;
    dueVal += b.due;

    let badge = "badge-success";
    if (b.status === "Outstanding") badge = "badge-danger";
    if (b.status === "Partially Paid") badge = "badge-warning";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${b.bill_id}</strong></td>
      <td>${b.patient_name} (${b.patient_id})</td>
      <td>${b.test}</td>
      <td>₹${b.total}</td>
      <td>₹${b.paid}</td>
      <td class="${b.due > 0 ? 'text-danger font-bold' : ''}">₹${b.due}</td>
      <td><span class="badge ${badge}">${b.status}</span></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("billingSummaryTotal").textContent = `₹${totalVal.toLocaleString('en-IN')}`;
  document.getElementById("billingSummaryPaid").textContent = `₹${paidVal.toLocaleString('en-IN')}`;
  document.getElementById("billingSummaryDue").textContent = `₹${dueVal.toLocaleString('en-IN')}`;
}

function applyBillingFilter(filter) {
  if (filter === "all") {
    renderBillingTable(demoBills);
  } else if (filter === "outstanding") {
    renderBillingTable(demoBills.filter(b => b.due > 0));
  } else if (filter === "paid") {
    renderBillingTable(demoBills.filter(b => b.status === "Paid"));
  }
}

/* ==========================================
   7. PATIENT DIRECTORY & PATIENT MODAL
   ========================================== */

function renderPatientsTable(patients) {
  const tbody = document.getElementById("patientsTableBody");
  tbody.innerHTML = "";

  patients.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.id}</strong></td>
      <td>${p.name}</td>
      <td>${p.phone}</td>
      <td>${p.totalReports}</td>
      <td class="${p.outstanding > 0 ? 'text-danger' : 'text-success'}">₹${p.outstanding}</td>
      <td>${p.lastActivity}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="openPatientModal('${p.id}')">Details</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function openPatientModal(patientId) {
  const patient = demoPatients.find(p => p.id === patientId) || demoPatients[0];
  document.getElementById("modalPatientName").textContent = patient.name;
  document.getElementById("modalPatientMeta").textContent = `Patient ID: ${patient.id} | Phone: ${patient.phone}`;

  // Find linked reports
  const userReports = demoReports.filter(r => r.patient_id === patient.id);
  const reportsBody = document.getElementById("modalPatientReportsBody");
  reportsBody.innerHTML = userReports.length ? "" : "<tr><td colspan='4' class='text-muted'>No reports found.</td></tr>";

  userReports.forEach(r => {
    reportsBody.innerHTML += `
      <tr>
        <td>${r.test}</td>
        <td><span class="badge badge-info">${r.status}</span></td>
        <td>${r.payment_received ? "Cleared" : "Pending"}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="alert('Viewing Report ${r.report_id}')">Open PDF</button></td>
      </tr>
    `;
  });

  // Billing summary
  const userBills = demoBills.filter(b => b.patient_id === patient.id);
  let totalBilled = 0, totalPaid = 0, totalDue = 0;
  userBills.forEach(b => { totalBilled += b.total; totalPaid += b.paid; totalDue += b.due; });

  document.getElementById("modalPatientBillingInfo").innerHTML = `
    <div class="billing-summary-grid">
      <div class="mini-summary-card"><span class="label">Total Billed</span><strong>₹${totalBilled}</strong></div>
      <div class="mini-summary-card text-success"><span class="label">Total Paid</span><strong>₹${totalPaid}</strong></div>
      <div class="mini-summary-card text-danger"><span class="label">Balance Due</span><strong>₹${totalDue}</strong></div>
    </div>
  `;

  // Audit activities
  const activityList = document.getElementById("modalPatientActivityList");
  activityList.innerHTML = `
    <li class="activity-item"><span class="activity-dot"></span><span>Report uploaded by staff</span></li>
    <li class="activity-item"><span class="activity-dot"></span><span>Notification SMS dispatched</span></li>
    <li class="activity-item"><span class="activity-dot"></span><span>Portal session logged</span></li>
  `;

  document.getElementById("patientDetailModal").classList.add("open");
}

/* ==========================================
   8. PAYMENTS & REPORT CREDITS
   ========================================== */

function renderPaymentsTable(payments) {
  const tbody = document.getElementById("paymentsTableBody");
  tbody.innerHTML = "";

  let totalReceived = 0, verifiedCount = 0, pendingCount = 0, failedCount = 0;

  payments.forEach(p => {
    if (p.status === "Verified") {
      totalReceived += p.amount;
      verifiedCount++;
    } else if (p.status === "Pending") {
      pendingCount++;
    } else if (p.status === "Failed") {
      failedCount++;
    }

    let badge = "badge-info";
    if (p.status === "Verified") badge = "badge-success";
    if (p.status === "Pending") badge = "badge-warning";
    if (p.status === "Failed") badge = "badge-danger";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><code>${p.txn_id}</code></td>
      <td>${p.patient_name} (${p.patient_id})</td>
      <td>${p.test}</td>
      <td>${p.bill_id}</td>
      <td><strong>₹${p.amount}</strong></td>
      <td><span class="badge ${badge}">${p.status}</span></td>
      <td>${p.time}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("paySummaryReceived").textContent = `₹${totalReceived.toLocaleString('en-IN')}`;
  document.getElementById("paySummaryVerified").textContent = verifiedCount.toString();
  document.getElementById("paySummaryPending").textContent = pendingCount.toString();
  document.getElementById("paySummaryFailed").textContent = failedCount.toString();
}

function applyPaymentFilter(status) {
  if (status === "all") {
    renderPaymentsTable(demoPayments);
  } else {
    renderPaymentsTable(demoPayments.filter(p => p.status.toLowerCase() === status.toLowerCase()));
  }
}

function renderCreditsPage() {
  document.getElementById("heroCreditBalance").textContent = centreData.credits_available;
  document.getElementById("statCreditsPurchased").textContent = centreData.credits_purchased;
  document.getElementById("statCreditsUsed").textContent = centreData.credits_used;
  document.getElementById("statCreditsPromo").textContent = centreData.credits_promo;

  const tbody = document.getElementById("creditHistoryTableBody");
  tbody.innerHTML = "";

  demoCreditHistory.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${h.date}</td>
      <td><strong>+${h.credits}</strong></td>
      <td>${h.amount}</td>
      <td>${h.method}</td>
      <td><span class="badge badge-success">${h.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================
   9. AUDIT STREAMS: DOWNLOADS, NOTIFICATIONS, LOGS
   ========================================== */

function renderDownloadsTable(downloads) {
  const tbody = document.getElementById("downloadsTableBody");
  tbody.innerHTML = "";
  downloads.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.timestamp}</td>
      <td><strong>${d.patient_id}</strong></td>
      <td>${d.patient_name}</td>
      <td>${d.test}</td>
      <td>${d.report_id}</td>
      <td><span class="text-xs text-muted">${d.ip}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderNotificationsTable(notifs) {
  const tbody = document.getElementById("notificationsTableBody");
  tbody.innerHTML = "";
  notifs.forEach(n => {
    const tr = document.createElement("tr");
    let badge = n.status === "Delivered" ? "badge-success" : "badge-danger";
    tr.innerHTML = `
      <td>${n.date}</td>
      <td>${n.patient_name}</td>
      <td><span class="badge badge-gray">${n.channel}</span></td>
      <td>${n.event}</td>
      <td><span class="badge ${badge}">${n.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderActivityTimeline() {
  const timeline = document.getElementById("activityTimelineList");
  timeline.innerHTML = "";
  demoActivities.forEach(a => {
    timeline.innerHTML += `
      <li class="activity-item">
        <span class="activity-dot"></span>
        <span class="activity-time">${a.time}</span>
        <span class="activity-desc">${a.text}</span>
      </li>
    `;
  });
}

function renderStaffTable() {
  const tbody = document.getElementById("staffTableBody");
  tbody.innerHTML = "";
  demoStaff.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${s.name}</strong></td>
      <td><span class="badge badge-info">${s.role}</span></td>
      <td>${s.phone}</td>
      <td><span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-gray'}">${s.status}</span></td>
      <td>${s.lastLogin}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="alert('Editing permissions for ${s.name}')">Edit</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderTicketsTable() {
  const tbody = document.getElementById("supportTicketsTableBody");
  tbody.innerHTML = "";
  demoTickets.forEach(t => {
    let badge = "badge-info";
    if (t.status === "Open") badge = "badge-warning";
    if (t.status === "Resolved") badge = "badge-success";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${t.id}</strong></td>
      <td>${t.category}</td>
      <td>${t.subject}</td>
      <td><span class="badge badge-gray">${t.priority}</span></td>
      <td><span class="badge ${badge}">${t.status}</span></td>
      <td>${t.updated}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================
   10. INTERACTION HANDLERS & MODAL CONTROLS
   ========================================== */

function setupEventHandlers() {
  // Navigation shortcuts
  document.getElementById("btnGoToDataReadiness")?.addEventListener("click", () => navigateTo("section-data-readiness"));
  document.getElementById("btnUploadRedirect")?.addEventListener("click", () => navigateTo("section-upload-reports"));
  document.getElementById("btnGotoUploadBilling")?.addEventListener("click", () => navigateTo("section-upload-billing"));

  // Modals Open
  document.getElementById("btnOpenBuyCredits")?.addEventListener("click", () => {
    document.getElementById("buyCreditsModal").classList.add("open");
  });

  document.getElementById("btnOpenAddStaff")?.addEventListener("click", () => {
    document.getElementById("addStaffModal").classList.add("open");
  });

  document.getElementById("btnOpenCreateTicket")?.addEventListener("click", () => {
    document.getElementById("createTicketModal").classList.add("open");
  });

  // Credit Buy Tier Pill Toggle
  document.querySelectorAll(".tier-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".tier-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const credits = parseInt(pill.getAttribute("data-credits"), 10);
      const totalAmount = credits * 3;
      document.getElementById("modalSelectedCredits").textContent = credits.toLocaleString('en-IN');
      document.getElementById("modalTotalAmount").textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
    });
  });

  // Credit Purchase Simulation
  document.getElementById("btnSimulatePurchase")?.addEventListener("click", () => {
    const qty = parseInt(document.getElementById("modalSelectedCredits").textContent.replace(/,/g, ''), 10);
    centreData.credits_available += qty;
    centreData.credits_purchased += qty;
    demoCreditHistory.unshift({
      date: "Just Now",
      credits: qty,
      amount: document.getElementById("modalTotalAmount").textContent,
      method: "Simulated UPI Payment",
      status: "Success"
    });
    renderCreditsPage();
    initCentreHeader();
    closeModal("buyCreditsModal");
    alert(`Success! ${qty} report credits added to Centre C001 wallet.`);
  });

  // Mock Upload Reports Dropzone Handler
  const reportDropzone = document.getElementById("reportDropzone");
  const reportFileInput = document.getElementById("reportFileInput");

  reportDropzone?.addEventListener("click", () => reportFileInput.click());
  reportFileInput?.addEventListener("change", (e) => {
    handleMockReportUpload(e.target.files);
  });

  // Mock Billing Upload Dropzone Handler
  const billingDropzone = document.getElementById("billingDropzone");
  const billingFileInput = document.getElementById("billingFileInput");

  billingDropzone?.addEventListener("click", () => billingFileInput.click());
  billingFileInput?.addEventListener("change", (e) => {
    handleMockBillingFile(e.target.files);
  });

  document.getElementById("btnConfirmBillingImport")?.addEventListener("click", () => {
    alert("10 records imported successfully into billing database. All records verified.");
    document.getElementById("billingPreviewBox").style.display = "none";
    navigateTo("section-billing-records");
  });

  document.getElementById("btnCancelBillingImport")?.addEventListener("click", () => {
    document.getElementById("billingPreviewBox").style.display = "none";
  });

  // Global Multi-field Centre Search
  document.getElementById("btnExecuteSearch")?.addEventListener("click", executeCentreSearch);
  document.getElementById("quickSearchBtn")?.addEventListener("click", () => {
    const term = document.getElementById("quickSearchInput").value;
    if (!term) return;
    navigateTo("section-search");
    document.getElementById("deepSearchInput").value = term;
    executeCentreSearch();
  });

  // Settings Save Confirmation
  document.getElementById("btnSaveSettings")?.addEventListener("click", () => {
    alert("Centre configuration & automated release rules updated successfully.");
  });
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("open");
}

function navigateTo(sectionId) {
  document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
  document.getElementById(sectionId)?.classList.add("active");
}

/* ==========================================
   11. MOCK FILE PROCESSORS
   ========================================== */

function handleMockReportUpload(files) {
  if (!files || files.length === 0) return;
  const resultsBox = document.getElementById("uploadResultsBox");
  const tbody = document.getElementById("uploadResultRows");
  const batchTags = document.getElementById("batchTags");
  resultsBox.style.display = "block";
  tbody.innerHTML = "";

  let acceptedCount = 0;
  let duplicateCount = 0;

  Array.from(files).forEach((file, index) => {
    const isDuplicate = index === 1; // Simulate second file being duplicate
    if (!isDuplicate) acceptedCount++; else duplicateCount++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>📄 ${file.name}</td>
      <td>P100${25 + index}</td>
      <td>Blood Diagnostic Panel</td>
      <td>${isDuplicate ? "<span class='badge badge-warning'>Duplicate Found</span>" : "<span class='badge badge-success'>Ready / Uploaded</span>"}</td>
      <td>${isDuplicate ? "<span class='text-muted'>0 Credits (Duplicate)</span>" : "<strong class='text-danger'>-1 Credit</strong>"}</td>
    `;
    tbody.appendChild(tr);
  });

  // Deduct credits based on business rule
  centreData.credits_available -= acceptedCount;
  centreData.credits_used += acceptedCount;
  initCentreHeader();
  renderCreditsPage();

  batchTags.innerHTML = `
    <span class="badge badge-success">Accepted: ${acceptedCount}</span>
    <span class="badge badge-warning">Duplicates: ${duplicateCount} (Free)</span>
    <span class="badge badge-info">Credits Deducted: ${acceptedCount}</span>
  `;
}

function handleMockBillingFile(files) {
  if (!files || files.length === 0) return;
  const previewBox = document.getElementById("billingPreviewBox");
  const tbody = document.getElementById("billingPreviewBody");
  previewBox.style.display = "block";
  tbody.innerHTML = "";

  const mockRows = [
    { pid: "P10025", bid: "B10025", test: "Complete Blood Count (CBC)", total: 100, paid: 30, due: 70 },
    { pid: "P10042", bid: "B10042", test: "Liver Function Test (LFT)", total: 500, paid: 0, due: 500 },
    { pid: "P10061", bid: "B10061", test: "Thyroid Stimulating Hormone", total: 350, paid: 350, due: 0 }
  ];

  mockRows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.pid}</td>
      <td>${r.bid}</td>
      <td>${r.test}</td>
      <td>₹${r.total}</td>
      <td>₹${r.paid}</td>
      <td class="${r.due > 0 ? 'text-danger' : ''}">₹${r.due}</td>
      <td><span class="badge badge-success">Valid Row</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================
   12. SEARCH ENGINE (Scoped to Centre C001)
   ========================================== */

function executeCentreSearch() {
  const query = document.getElementById("deepSearchInput").value.trim().toLowerCase();
  const tbody = document.getElementById("searchResultsTableBody");
  const countLabel = document.getElementById("searchResultCount");
  tbody.innerHTML = "";

  if (!query) {
    countLabel.textContent = "Please enter a search keyword.";
    return;
  }

  // Scoped search across centre patients and reports
  const matchedPatients = demoPatients.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.id.toLowerCase().includes(query) || 
    p.phone.includes(query)
  );

  const matchedReports = demoReports.filter(r =>
    r.report_id.toLowerCase().includes(query) ||
    r.patient_name.toLowerCase().includes(query) ||
    r.test.toLowerCase().includes(query)
  );

  const totalMatches = matchedPatients.length + matchedReports.length;
  countLabel.textContent = `Found ${totalMatches} record(s) matching "${query}" in Centre C001.`;

  matchedPatients.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge badge-info">Patient</span></td>
      <td>${p.id}</td>
      <td><strong>${p.name}</strong></td>
      <td>Phone: ${p.phone} | Outstanding: ₹${p.outstanding}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="openPatientModal('${p.id}')">View</button></td>
    `;
    tbody.appendChild(tr);
  });

  matchedReports.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge badge-success">Report</span></td>
      <td>${r.report_id}</td>
      <td>${r.patient_name} (${r.patient_id})</td>
      <td>Test: ${r.test}</td>
      <td><span class="badge badge-gray">${r.status}</span></td>
    `;
    tbody.appendChild(tr);
  });

  if (totalMatches === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No records found matching "${query}".</td></tr>`;
  }
}

/* ==========================================
   13. FUTURE FASTAPI INTEGRATION BLUEPRINT
   ========================================== */

/**
 * ARCHITECTURE FOR PYTHON / FASTAPI BACKEND:
 * 
 * When connecting to your FastAPI backend, replace the mock arrays
 * above with standard fetch() requests.
 * 
 * Every endpoint is automatically scoped by the user's JWT / session token:
 * 
 * Example FastAPI Router:
 * 
 * @router.get("/api/centre/reports")
 * def get_centre_reports(current_user: User = Depends(get_current_centre_user)):
 *     # current_user.centre_id is extracted from verified auth token
 *     return db.query(Report).filter(Report.centre_id == current_user.centre_id).all()
 */

async function fetchCentreReportsApi() {
  try {
    const response = await fetch('/api/centre/reports', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Network error');
    const reports = await response.json();
    renderReportsTable(reports);
  } catch (err) {
    console.warn('Backend endpoint not wired yet. Using prototype mock data.', err);
  }
}

async function fetchCentreBillingApi() {
  try {
    const response = await fetch('/api/centre/bills', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const bills = await response.json();
    renderBillingTable(bills);
  } catch (err) {
    console.warn('Backend endpoint not wired yet. Using prototype mock data.', err);
  }
}
