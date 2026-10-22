// Live API Endpoint from Render
const API_URL = "https://ssc-api-remk.onrender.com/api/members";
const BASE_API = "https://ssc-api-remk.onrender.com/api";

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

// --- POSTS & ANNOUNCEMENTS LOGIC ---

// Fetch and Render Feed Posts
async function loadPosts() {
  const feedContainer = document.getElementById('postsFeed');
  if (!feedContainer) return;

  try {
    const res = await fetch(`${BASE_API}/posts`);
    const posts = await res.json();

    const currentUser = JSON.parse(localStorage.getItem('ssc_user')) || {};
    const isOfficer = currentUser.member_type && (currentUser.member_type.toLowerCase() === 'officer' || currentUser.member_type.toLowerCase() === 'officers');

    feedContainer.innerHTML = '';

    if (!posts || posts.length === 0) {
      feedContainer.innerHTML = `<div class="bg-slate-800 p-6 rounded-xl text-center text-slate-400 italic">No posts yet. Check back later!</div>`;
      return;
    }

    posts.forEach(p => {
      const deleteBtn = isOfficer
        ? `<button onclick="deletePost(${p.id})" class="text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 text-xs px-2 py-1 rounded border border-rose-800/60 transition-colors ml-2">
             <i class="fa-solid fa-trash mr-1"></i> Delete
           </button>`
        : '';

      feedContainer.innerHTML += `
        <div class="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-3 shadow">
          <div class="flex justify-between items-center border-b border-slate-700/60 pb-2">
            <div>
              <h4 class="font-bold text-amber-300 text-sm">${p.author_name}</h4>
              <span class="text-xs text-slate-400">${p.author_role}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-[10px] text-slate-500">${new Date(p.created_at).toLocaleString()}</span>
              ${deleteBtn}
            </div>
          </div>
          <p class="text-slate-200 text-sm whitespace-pre-line">${p.content}</p>
          ${p.image_url ? `<img src="${p.image_url}" class="rounded-lg max-h-80 w-full object-cover border border-slate-700" alt="Post Image">` : ''}
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

// Delete a Post (Council Officers only)
async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this announcement?")) return;

  try {
    const res = await fetch(`${BASE_API}/posts/${postId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      loadPosts(); // Refresh feed after deletion
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete the post.");
    }
  } catch (err) {
    console.error("Error connecting to server:", err);
    alert("Connection error while deleting post.");
  }
}

// Publish Post Function with Direct File Upload Support (Matches HTML button `onclick="publishPost()"`)
async function publishPost() {
  const currentUser = JSON.parse(localStorage.getItem('ssc_user'));
  if (!currentUser || (currentUser.member_type.toLowerCase() !== 'officer' && currentUser.member_type.toLowerCase() !== 'officers')) {
    alert("Unauthorized. Only council officers can post announcements.");
    return;
  }

  const content = document.getElementById('postContent').value.trim();
  const imageFileInput = document.getElementById('postImageFile');
  let imageUrl = null;

  if (!content && imageFileInput.files.length === 0) {
    return alert("Please write an announcement or attach an image to post.");
  }

  try {
    // 1. Upload image file first if one was selected
    if (imageFileInput.files.length > 0) {
      const file = imageFileInput.files[0];
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch(`${BASE_API}/upload`, {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (uploadRes.ok) {
        imageUrl = uploadData.image_url;
      } else {
        alert(uploadData.error || "Failed to upload image.");
        return;
      }
    }

    // 2. Submit post content and image URL to database
    const res = await fetch(`${BASE_API}/posts`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author_name: currentUser.full_name,
        author_role: currentUser.designation || 'Council Officer',
        content,
        image_url: imageUrl
      })
    });

    if (res.ok) {
      document.getElementById('postContent').value = '';
      imageFileInput.value = '';
      loadPosts(); // Refresh feed to show the new post
    } else {
      alert("Failed to publish post.");
    }
  } catch (err) {
    console.error("Error publishing post:", err);
    alert("Connection error. Could not reach server.");
  }
}
