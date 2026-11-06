const medicineBody=document.getElementById('medicineBody');
const orderBody=document.getElementById('orderBody');
const search=document.getElementById('search');
let medicines=[];

function esc(value){return String(value ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function renderMedicines(items){
 medicineBody.innerHTML=items.length?items.map(m=>`<tr><td>${esc(m.medicine_name)}</td><td>${esc(m.manufacturer)}</td><td>₹${Number(m.price).toFixed(2)}</td><td>${esc(m.stock)}</td><td>${m.expiry_date?new Date(m.expiry_date).toLocaleDateString():''}</td></tr>`).join(''):'<tr><td colspan="5">No medicines found</td></tr>';
}
async function loadMedicines(){const r=await fetch('/api/medicines');if(!r.ok)throw new Error('Unable to load medicines');medicines=await r.json();renderMedicines(medicines);}
async function loadOrders(){const r=await fetch('/api/orders');if(!r.ok)throw new Error('Unable to load orders');const orders=await r.json();orderBody.innerHTML=orders.map(o=>`<tr><td>${o.order_id}</td><td>${esc(o.customer_name||'Unknown')}</td><td>${o.order_date?new Date(o.order_date).toLocaleDateString():''}</td><td>₹${Number(o.total_amount).toFixed(2)}</td><td><span class="status">${esc(o.status)}</span></td></tr>`).join('');}
async function loadDashboard(){const r=await fetch('/api/dashboard');if(!r.ok)throw new Error('Unable to load dashboard');const d=await r.json();['totalMedicines','availableMedicines','lowStock','totalOrders'].forEach(id=>document.getElementById(id).textContent=d[id]??0);}
search.addEventListener('input',()=>{const q=search.value.toLowerCase();renderMedicines(medicines.filter(m=>m.medicine_name.toLowerCase().includes(q)));});
Promise.all([loadMedicines(),loadOrders(),loadDashboard()]).catch(e=>{console.error(e);medicineBody.innerHTML='<tr><td colspan="5">Please check that the server and MySQL database are running.</td></tr>';});
