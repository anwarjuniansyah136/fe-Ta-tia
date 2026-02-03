const BASE_URL = "http://localhost:8080/api/v1";
const ROLE_URL = "http://localhost:8080/api/v1/role";
const token = localStorage.getItem("token");

if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", loadUsers);

async function loadUsers() {
    const table = document.getElementById("userTable");
    table.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

    try {
        const res = await fetch(`${BASE_URL}/find-all`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const response = await res.json();
        table.innerHTML = "";

        if (!Array.isArray(response.data)) {
            table.innerHTML = `<tr><td colspan="5">Invalid data format</td></tr>`;
            return;
        }

        response.data.forEach((u, i) => {
            table.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${u.fullName}</td>
                    <td>${u.username}</td>
                    <td>${u.roles?.roleName ?? "-"}</td>
                    <td>
                        <button class="btn small danger" onclick="deleteUser('${u.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        table.innerHTML = `<tr><td colspan="5">Failed to load users</td></tr>`;
    }
}

async function loadRoles(selectedRoleId = "") {
    const roleSelect = document.getElementById("role");
    roleSelect.innerHTML = `<option value="">Loading...</option>`;

    try {
        const res = await fetch(ROLE_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const roles = await res.json();

        roleSelect.innerHTML = `<option value="">-- Select Role --</option>`;

        roles.forEach(r => {
            const selected = r.id === selectedRoleId ? "selected" : "";
            roleSelect.innerHTML += `
                <option value="${r.id}" ${selected}>
                    ${r.roleName}
                </option>
            `;
        });

    } catch (err) {
        console.error(err);
        roleSelect.innerHTML = `<option value="">Failed to load role</option>`;
    }
}

function openModal(title = "Add User") {
    clearForm();
    loadRoles(); // ⬅️ ambil role ke backend
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("userModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("userModal").classList.add("hidden");
}

async function saveUser() {
    const id = document.getElementById("userId").value;

    const payload = {
        fullName: document.getElementById("fullName").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value,
        roleId: document.getElementById("role").value
    };

    if (!payload.fullName || !payload.username || !payload.roleId) {
        alert("Please complete all required fields");
        return;
    }

    await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    closeModal();
    loadUsers();
}

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadUsers();
}

function clearForm() {
    document.getElementById("userId").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
}
