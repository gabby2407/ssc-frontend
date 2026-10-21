// Sample Data
const API_URL = "https://ssc-api-remk.onrender.com/api/members";s

let activeFilter = 'ALL';

// Modal Open / Close Functions
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Render Membership Table
function renderMembers(data) {
  const tbody = document.getElementById('memberTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500 italic">No members found matching your search.</td></tr>`;
    return;
  }

  data.forEach(m => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
    tr.innerHTML = `
      <td class="px-4 py-3 font-semibold text-emerald-800">${m.id}</td>
      <td class="px-4 py-3 font-medium text-slate-800">${m.name}</td>
      <td class="px-4 py-3 text-slate-600">${m.year}</td>
      <td class="px-4 py-3 text-slate-600">${m.role}</td>
      <td class="px-4 py-3 text-slate-600">${m.phone}</td>
      <td class="px-4 py-3"><span class="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold text-xs">${m.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Officers Table
function renderOfficers(data) {
  const tbody = document.getElementById('officerTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let filtered = data;
  if (activeFilter === 'OFFICERS') filtered = data.filter(d => d.type === 'officer');
  if (activeFilter === 'COMMITTEES') filtered = data.filter(d => d.type === 'member');

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500 italic">No records found.</td></tr>`;
    return;
  }

  filtered.forEach(o => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
    tr.innerHTML = `
      <td class="px-4 py-3 font-semibold text-emerald-800">${o.id}</td>
      <td class="px-4 py-3 font-medium text-slate-800">${o.name}</td>
      <td class="px-4 py-3 font-semibold text-emerald-700">${o.role}</td>
      <td class="px-4 py-3 text-slate-600">${o.year}</td>
      <td class="px-4 py-3 text-slate-600">${o.phone}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Filtering & Search Listeners
function filterOfficers(type) {
  activeFilter = type;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-700', 'text-white');
    btn.classList.add('bg-slate-100', 'text-slate-600');
  });
  
  const activeTab = document.getElementById(`tab-${type}`);
  if (activeTab) {
    activeTab.classList.remove('bg-slate-100', 'text-slate-600');
    activeTab.classList.add('bg-emerald-700', 'text-white');
  }

  searchOfficers();
}

function searchMembers() {
  const query = document.getElementById('memberSearch').value.toLowerCase();
  const filtered = memberData.filter(m => 
    m.name.toLowerCase().includes(query) || 
    m.id.toLowerCase().includes(query) || 
    m.year.toLowerCase().includes(query)
  );
  renderMembers(filtered);
}

function searchOfficers() {
  const query = document.getElementById('officerSearch').value.toLowerCase();
  const filtered = memberData.filter(m => 
    m.name.toLowerCase().includes(query) || 
    m.id.toLowerCase().includes(query) || 
    m.role.toLowerCase().includes(query) ||
    m.year.toLowerCase().includes(query)
  );
  renderOfficers(filtered);
}

// Initialize tables on page load
document.addEventListener('DOMContentLoaded', () => {
  renderMembers(memberData);
  renderOfficers(memberData);
});