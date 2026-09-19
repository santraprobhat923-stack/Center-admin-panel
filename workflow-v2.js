(() => {
  const apiBase = () => (localStorage.getItem('diagnostic_api_url') || 'http://127.0.0.1:8000').replace(/\/$/, '');
  const token = () => localStorage.getItem('diagnostic_token') || '';
  const esc2 = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const auth = () => ({Authorization: `Bearer ${token()}`});
  const toast2 = m => window.toast ? window.toast(m) : alert(m);
  const api2 = async (path, opt={}) => {
    const headers = {...auth(), ...(opt.headers||{})};
    const r = await fetch(apiBase()+path, {...opt, headers});
    let d=null; try { d=await r.json(); } catch (_) {}
    if (!r.ok) throw new Error(typeof d?.detail === 'string' ? d.detail : JSON.stringify(d?.detail || d || `HTTP ${r.status}`));
    return d;
  };

  function rowHtml(panelIndex, rowIndex, z={}) {
    return `<div class="parameter-grid" data-param-row data-p="${panelIndex}" data-x="${rowIndex}"><input data-f="name" data-p="${panelIndex}" data-x="${rowIndex}" value="${esc2(z.name)}" placeholder="Test / parameter name"><input data-f="result" data-p="${panelIndex}" data-x="${rowIndex}" value="${esc2(z.result)}" placeholder="Result value"><input data-f="unit" data-p="${panelIndex}" data-x="${rowIndex}" value="${esc2(z.unit||'')}" placeholder="Unit"><input data-f="reference_range" data-p="${panelIndex}" data-x="${rowIndex}" value="${esc2(z.reference_range||'')}" placeholder="Reference range"><button type="button" class="secondary" data-remove-row>Remove</button></div>`;
  }
  function panelHtml(panel, pi) {
    const params = panel?.parameters || [];
    const rows = params.length ? params.map((z,xi)=>rowHtml(pi,xi,z)).join('') : rowHtml(pi,0,{});
    return `<div class="verify-panel" data-panel-index="${pi}"><div class="panel-title"><input data-panel-name value="${esc2(panel?.panel_name || `Test Panel ${pi+1}`)}" placeholder="Panel name"><button type="button" class="secondary" data-remove-panel>Remove panel</button></div>${rows}<button type="button" class="secondary" data-add-row>Add test value</button></div>`;
  }

  window.verifyCard = function(r) {
    const d = r.extracted_data || {}, p = d.patient || {};
    let panels = Array.isArray(d.panels) ? d.panels : [];
    if (!panels.length) panels = [{panel_name:'Test Results', parameters:[]}];
    return `<article class="verify-card" data-card="${r.job_id}" data-patient-id="${esc2(r.patient_id||p.id||'')}"><div class="verify-head"><div><strong>Job #${r.job_id}</strong><small class="muted"> · ${esc2(r.original_filename||'Report image')}</small></div><span class="status verify">OCR DRAFT — EDIT BEFORE LOCK</span></div><div class="verify-body"><div class="patient-strip"><strong>Patient details</strong><p class="muted small">OCR is only a draft. Correct every field or enter missing information manually.</p><div class="patient-edit-grid"><label>Name<input data-patient="name" value="${esc2(p.patient_name?.value ?? p.full_name ?? '')}" placeholder="Patient name"></label><label>Age<input data-patient="age" type="number" min="0" max="150" value="${esc2(p.age?.value ?? p.age ?? '')}" placeholder="Age"></label><label>Gender<input data-patient="gender" value="${esc2(p.gender?.value ?? p.gender ?? '')}" placeholder="Gender"></label><label>Phone<input data-patient="phone" inputmode="tel" value="${esc2(p.phone?.value ?? p.phone ?? '')}" placeholder="Phone"></label><label>Email<input data-patient="email" type="email" value="${esc2(p.email?.value ?? p.email ?? '')}" placeholder="Email"></label><label>Patient ID / barcode<input data-patient="code" value="${esc2(p.patient_code?.value ?? p.patient_code ?? '')}" placeholder="Patient ID / barcode"></label></div></div><div class="ocr-test-editor">${panels.map(panelHtml).join('')}</div><button type="button" class="secondary" data-add-panel>Add test panel</button><div class="panel-title">Technician notes</div><input class="verify-notes" placeholder="Optional note"><div class="verify-actions"><button class="secondary" data-delete="${r.job_id}">Discard</button><button class="primary" data-verify="${r.job_id}">Verify & lock report</button></div></div></article>`;
  };

  window.verifyJob = async function(id) {
    const card=document.querySelector(`[data-card="${id}"]`), r=state.reports.find(x=>x.job_id===id); if(!card||!r)return;
    const panels=[];
    card.querySelectorAll('[data-panel-index]').forEach((panelEl,pi)=>{
      const panelName=panelEl.querySelector('[data-panel-name]')?.value.trim()||`Test Panel ${pi+1}`, params=[];
      panelEl.querySelectorAll('[data-param-row]').forEach(row=>{const get=f=>row.querySelector(`[data-f="${f}"]`)?.value.trim()||'', name=get('name');if(name)params.push({name,result:get('result'),unit:get('unit')||null,reference_range:get('reference_range')||null});});
      panels.push({panel_name:panelName,parameters:params});
    });
    if(!panels.some(x=>x.parameters.length))return toast2('Add at least one test value before verification.');
    const patientId=Number(card.dataset.patientId||r.patient_id||0);if(!patientId)return toast2('Patient ID is required.');
    const getPatient=f=>card.querySelector(`[data-patient="${f}"]`)?.value.trim()||null, age=getPatient('age');
    try{await api2(`/reports/ingest/${id}/verify`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({patient_id:patientId,patient_name:getPatient('name'),patient_age:age?Number(age):null,patient_gender:getPatient('gender'),patient_phone:getPatient('phone'),patient_email:getPatient('email'),patient_code:getPatient('code'),barcode:getPatient('code'),panels,technician_notes:card.querySelector('.verify-notes')?.value.trim()||null})});toast2(`Job #${id} verified. Generate the PDF next.`);await loadReports();}catch(e){toast2(e.message);}
  };

  function bindVerificationEditor(){const q=document.getElementById('verificationQueue');if(!q||q.dataset.workflowV2==='1')return;q.dataset.workflowV2='1';q.addEventListener('click',e=>{const verify=e.target.closest('[data-verify]');if(verify){e.preventDefault();e.stopPropagation();verifyJob(Number(verify.dataset.verify));return;}const del=e.target.closest('[data-delete]');if(del){e.preventDefault();e.stopPropagation();deleteJob(Number(del.dataset.delete));return;}const addRow=e.target.closest('[data-add-row]');if(addRow){const panel=addRow.closest('[data-panel-index]'),pi=Number(panel.dataset.panelIndex),n=panel.querySelectorAll('[data-param-row]').length;addRow.insertAdjacentHTML('beforebegin',rowHtml(pi,n,{}));return;}const removeRow=e.target.closest('[data-remove-row]');if(removeRow){removeRow.closest('[data-param-row]')?.remove();return;}const addPanel=e.target.closest('[data-add-panel]');if(addPanel){const card=addPanel.closest('[data-card]'),count=card?.querySelectorAll('[data-panel-index]').length||0;addPanel.insertAdjacentHTML('beforebegin',panelHtml({panel_name:`Test Panel ${count+1}`,parameters:[]},count));return;}const removePanel=e.target.closest('[data-remove-panel]');if(removePanel){const card=removePanel.closest('[data-card]'),panels=card?.querySelectorAll('[data-panel-index]')||[];if(panels.length<=1)return toast2('Keep at least one test panel.');removePanel.closest('[data-panel-index]')?.remove();}},true);}

  async function uploadFiles(files){if(!files.length)return;const results=[];let done=0;for(const file of files){try{const fd=new FormData();fd.append('file',file,file.name);const uploaded=await api2('/reports/ingest/photo',{method:'POST',body:fd});if(uploaded.duplicate){results.push({name:file.name,status:'duplicate'});done++;continue;}try{const extracted=await api2(`/reports/ingest/${uploaded.job_id}/extract`,{method:'POST'});results.push({name:file.name,status:extracted.status,job_id:uploaded.job_id});}catch(e){results.push({name:file.name,status:'ocr-warning',job_id:uploaded.job_id,detail:e.message});}}catch(e){results.push({name:file.name,status:'failed',detail:e.message});}done++;document.getElementById('uploadStatus').textContent=`Processed ${done}/${files.length} image(s)…`;}state.jobs=[...new Set([...state.jobs,...results.filter(x=>x.job_id).map(x=>x.job_id)])];saveJobs();await loadReports();const ready=results.filter(x=>x.status==='NEEDS_VERIFICATION'||x.status==='ocr-warning').length;document.getElementById('uploadStatus').textContent=`Finished ${done} image(s). ${ready} ready for technician verification.`;clearSelectedFile();if(ready)setView('verification');else toast2('Bulk upload finished.');}

  function installBulkUpload(){
    const capture=document.getElementById('view-capture');
    if(!capture||capture.dataset.bulkV2==='1')return;
    capture.dataset.bulkV2='1';
    const camera=document.getElementById('cameraInput'), gallery=document.getElementById('galleryInput'), upload=document.getElementById('uploadBtn');
    const handler=e=>{
      window.workflowFiles=Array.from(e.target.files||[]);
      if(!window.workflowFiles.length)return;
      const count=window.workflowFiles.length;
      document.getElementById('fileName').textContent=count===1?window.workflowFiles[0].name:`${count} images selected`;
      document.getElementById('fileSize').textContent=count===1?Math.round(window.workflowFiles[0].size/1024)+' KB':'Single or bulk upload ready';
      document.getElementById('uploadBtn').disabled=false;
      document.getElementById('uploadStatus').textContent=count===1?'Ready for OCR':'Ready to process '+count+' images';
    };
    camera?.addEventListener('change',handler);
    gallery?.addEventListener('change',handler);
    upload?.addEventListener('click',e=>{
      if(window.workflowFiles?.length){e.preventDefault();e.stopImmediatePropagation();uploadFiles(window.workflowFiles);}
    },true);
  }

  function installSettings(){const view=document.getElementById('view-settings');if(!view||view.dataset.workflowV2==='1')return;view.dataset.workflowV2='1';const card=view.querySelector('.settings-card');card.insertAdjacentHTML('beforeend','<hr><h2>PDF template</h2><p class="muted">Upload the centre PDF template. Future generated reports use it automatically.</p><input id="pdfTemplateInput" type="file" accept="application/pdf"><button class="secondary" id="uploadTemplateBtn">Upload PDF template</button><p id="templateStatus" class="muted small"></p><hr><h2>Optional WhatsApp delivery</h2><label><input id="waEnabled" type="checkbox"> Enable WhatsApp sending for this centre</label><label>Centre UPI ID<input id="waUpi" placeholder="centre@upi"></label><label>Public report URL<input id="waBaseUrl" placeholder="https://your-domain.example"></label><button class="primary" id="saveWorkflowSettings">Save WhatsApp settings</button><p class="muted small">WhatsApp is optional. PDF credits are charged only when a PDF is generated.</p>');document.getElementById('uploadTemplateBtn').onclick=async()=>{const f=document.getElementById('pdfTemplateInput').files[0];if(!f)return toast2('Choose a PDF template first.');const fd=new FormData();fd.append('file',f,f.name);try{const d=await api2('/workflow/template',{method:'POST',body:fd});document.getElementById('templateStatus').textContent=`Template saved (${d.size} bytes).`;toast2('Centre PDF template saved.')}catch(e){toast2(e.message)}};document.getElementById('saveWorkflowSettings').onclick=async()=>{try{const d=await api2('/workflow/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({whatsapp_enabled:document.getElementById('waEnabled').checked,upi_id:document.getElementById('waUpi').value,public_base_url:document.getElementById('waBaseUrl').value})});toast2(d.whatsapp_enabled?'WhatsApp delivery enabled.':'WhatsApp delivery disabled.')}catch(e){toast2(e.message)}};api2('/workflow/settings').then(d=>{document.getElementById('waEnabled').checked=!!d.whatsapp_enabled;document.getElementById('waUpi').value=d.upi_id||'';document.getElementById('waBaseUrl').value=d.public_base_url||'';document.getElementById('templateStatus').textContent=d.template_uploaded?'Template uploaded.':'No template uploaded.'}).catch(()=>{});}

  document.addEventListener('DOMContentLoaded',()=>{installBulkUpload();installSettings();bindVerificationEditor();const ob=new MutationObserver(()=>{bindVerificationEditor();});ob.observe(document.body,{childList:true,subtree:true});});
})();
