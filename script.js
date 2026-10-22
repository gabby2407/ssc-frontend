// Live API Endpoint from Render
const API_URL = "https://ssc-api-remk.onrender.com/api/members";

let activeFilter = 'ALL';

// Fetch Members from Database
async function fetchMembers(search = '') {
  try {
    const res = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    renderMembers(data);
  } catch (err) {
    console.error("Error fetching members:", err);
  }
}

// Fetch Officers from Database
async function fetchOfficers(search = '') {
  try {
    const res = await fetch(`${API_URL}?type=officer&search=${encodeURIComponent(search)}`);
    const data = await res.json();
    renderOfficers(data);
  } catch (err) {
    console.error("Error fetching officers:", err);
  }
}

// Modal Open / Close Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (modalId === 'memberModal') fetchMembers();
    if (modalId === 'officerModal') fetchOfficers();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Search Functions
function searchMembers() {
  const searchInput = document.getElementById('memberSearch');
  fetchMembers(searchInput ? searchInput.value : '');
}

function searchOfficers() {
  const searchInput = document.getElementById('officerSearch');
  fetchOfficers(searchInput ? searchInput.value : '');
}

// Handle Member Registration
async function handleRegistration(event) {
  event.preventDefault();

  const formData = {
    ssc_number: document.getElementById('regSscNumber').value.trim(),
    full_name: document.getElementById('regFullName').value.trim(),
    member_type: document.getElementById('regType').value,
    designation: document.getElementById('regDesignation').value.trim(),
    year_section: document.getElementById('regYearSection').value.trim(),
    cellphone: document.getElementById('regCellphone').value.trim(),
    status: 'ACTIVE'
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration Successful! You can now log in.");
      document.getElementById('registrationForm').reset();
      closeModal('registerModal');
    } else {
      alert(data.error || "Failed to register.");
    }
  } catch (err) {
    console.error("Error submitting registration:", err);
    alert("Connection error. Could not reach server.");
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  const sscNumber = document.getElementById('loginSscNumber').value.trim();

  try {
    const res = await fetch(`${API_URL}?search=${encodeURIComponent(sscNumber)}`);
    const members = await res.json();

    const user = members.find(m => m.ssc_number.toLowerCase() === sscNumber.toLowerCase());

    if (user) {
      loginUser(user);
    } else {
      alert("SSC ID not found in the database. Please register first!");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Connection error. Could not reach server.");
  }
}

// Store Session and Redirect to Dashboard Feed
function loginUser(userData) {
  localStorage.setItem('ssc_user', JSON.stringify(userData));
  window.location.href = "dashboard.html";
}

// Render Membership Table
function renderMembers(data) {
  const tbody = document.getElementById('memberTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500 italic">No membership records found.</td></tr>`;
    return;
  }

  data.forEach(m => {
    tbody.innerHTML += `
      <tr class="hover:bg-slate-700/50 border-b border-slate-700 transition-colors">
        <td class="p-3 font-semibold text-emerald-400">${m.ssc_number}</td>
        <td class="p-3 font-medium text-slate-200">${m.full_name}</td>
        <td class="p-3 text-slate-300">${m.year_section}</td>
        <td class="p-3 text-slate-300">${m.designation}</td>
        <td class="p-3 text-slate-300">${m.cellphone}</td>
        <td class="p-3">
          <span class="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
            ${m.status}
          </span>
        </td>
      </tr>`;
  });
}

// Render Officers Table
function renderOfficers(data) {
  const tbody = document.getElementById('officerTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500 italic">No officer records found.</td></tr>`;
    return;
  }

  data.forEach(o => {
    tbody.innerHTML += `
      <tr class="hover:bg-slate-700/50 border-b border-slate-700 transition-colors">
        <td class="p-3 font-semibold text-amber-400">${o.ssc_number}</td>
        <td class="p-3 font-medium text-slate-200">${o.full_name}</td>
        <td class="p-3 font-semibold text-amber-300">${o.designation}</td>
        <td class="p-3 text-slate-300">${o.year_section}</td>
        <td class="p-3 text-slate-300">${o.cellphone}</td>
      </tr>`;
  });
}
