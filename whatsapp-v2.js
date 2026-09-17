(() => {
  const apiBase=()=> (localStorage.getItem('diagnostic_api_url')||'http://127.0.0.1:8000').replace(/\/$/,'');
  const token=()=>localStorage.getItem('diagnostic_token')||'';
  const toastW=m=>window.toast?window.toast(m):alert(m);
  async function apiW(path,opt={}){const r=await fetch(apiBase()+path,{...opt,headers:{Authorization:`Bearer ${token()}`,...(opt.headers||{})}});let d=null;try{d=await r.json()}catch(_){}if(!r.ok)throw Error(typeof d?.detail==='string'?d.detail:JSON.stringify(d?.detail||d||`HTTP ${r.status}`));return d;}
  function install(){
    const billing=document.getElementById('view-billing');if(!billing||billing.dataset.waV2==='1')return;billing.dataset.waV2='1';
    const panel=billing.querySelector('.panel');const btn=document.createElement('button');btn.className='primary';btn.textContent='Send WhatsApp messages for ready reports';btn.style.marginBottom='12px';panel?.prepend(btn);
    btn.onclick=async()=>{const ids=(window.state?.reports||[]).map(r=>r.final_report_id).filter(Boolean);if(!ids.length)return toastW('No generated reports are ready for WhatsApp yet.');btn.disabled=true;try{const d=await apiW('/workflow/whatsapp/bulk',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({report_ids:ids})});toastW(`${d.queued||0} WhatsApp message(s) queued.`);}catch(e){toastW(e.message)}finally{btn.disabled=false}};
  }
  document.addEventListener('DOMContentLoaded',install);new MutationObserver(install).observe(document.body,{childList:true,subtree:true});
})();
