const BASE_URL = "http://localhost:8080/api/v1/categories";

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
});

/* =========================
   GET ALL
========================= */
async function loadCategories() {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    const table = document.getElementById("categoryTable");
    table.innerHTML = "";

    data.forEach((cat, index) => {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${cat.name}</td>
                <td>
                    <button onclick="editCategory('${cat.id}', '${cat.name}')">Edit</button>
                    <button onclick="deleteCategory('${cat.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

/* =========================
   CREATE & UPDATE
========================= */
async function saveCategory() {
    const id = document.getElementById("categoryId").value;
    const name = document.getElementById("categoryName").value;

    if (!name) {
        alert("Category name wajib diisi");
        return;
    }

    const payload = { name };

    let url = BASE_URL;
    let method = "POST";

    if (id) {
        url = `${BASE_URL}/${id}`;
        method = "PUT";
    }

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    resetForm();
    loadCategories();
}

/* =========================
   EDIT
========================= */
function editCategory(id, name) {
    document.getElementById("categoryId").value = id;
    document.getElementById("categoryName").value = name;
    document.getElementById("formTitle").innerText = "Update Category";
}

/* =========================
   DELETE
========================= */
async function deleteCategory(id) {
    if (!confirm("Yakin ingin menghapus category ini?")) return;

    await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });

    loadCategories();
}

/* =========================
   RESET FORM
========================= */
function resetForm() {
    document.getElementById("categoryId").value = "";
    document.getElementById("categoryName").value = "";
    document.getElementById("formTitle").innerText = "Add Category";
}
