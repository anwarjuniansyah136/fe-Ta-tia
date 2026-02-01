const BASE_URL = "http://localhost:8080/api/v1";

document.addEventListener("DOMContentLoaded", loadUsers);

async function loadUsers() {
    const table = document.getElementById("userTable");
    table.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

    try {
        const res = await fetch(`${BASE_URL}/find-all`);
        const response = await res.json();

        console.log("API RESPONSE:", response);

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
                        <button class="btn small" onclick="editUser('${u.id}')">Edit</button>
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

/* ================= MODAL ================= */

function openModal(title = "Add User") {
    document.getElementById("userModal").classList.remove("hidden");
    document.getElementById("modalTitle").innerText = title;
}

function closeModal() {
    document.getElementById("userModal").classList.add("hidden");
}

/* ================= CRUD ================= */

async function saveUser() {
    const id = document.getElementById("userId").value;

    const payload = {
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        role: document.getElementById("role").value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${BASE_URL}/${id}` : BASE_URL;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    closeModal();
    loadUsers();
}

async function editUser(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    const response = await res.json();

    const u = response.data;

    document.getElementById("userId").value = u.id;
    document.getElementById("username").value = u.username;
    document.getElementById("email").value = u.email ?? "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = u.roles?.roleName ?? "";

    openModal("Edit User");
}

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    loadUsers();
}

function clearForm() {
    document.getElementById("userId").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
}
