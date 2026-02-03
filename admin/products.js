const API_URL = "http://localhost:8080/api/v1/products";
const BASE_URL = "http://localhost:8080/api/v1";

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadProducts();
});

const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");

const code = document.getElementById("code");
const name = document.getElementById("name");
const description = document.getElementById("description");
const categoryId = document.getElementById("categoryId");
const purchasePrice = document.getElementById("purchasePrice");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const unit = document.getElementById("unit");
const imageInput = document.getElementById("image");

const productList = document.getElementById("productList");

let products = [];
let editId = null;

async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        products = await res.json();
        renderProducts();
    } catch (err) {
        console.error("Failed to load products", err);
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`);
        const categories = await response.json();

        categoryId.innerHTML = `<option value="">-- Select Category --</option>`;
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            categoryId.appendChild(option);
        });

    } catch (error) {
        console.error("Failed load categories", error);
    }
}

function openModal(product = null) {
    modal.classList.remove("hidden");

    if (product) {
        editId = product.id;
        modalTitle.innerText = "Edit Product";

        code.value = product.code ?? "";
        name.value = product.name ?? "";
        description.value = product.description ?? "";
        categoryId.value = product.categoryId ?? "";
        price.value = product.price ?? "";
        purchasePrice.value = product.purchasePrice ?? "";
        stock.value = product.stock ?? "";
        unit.value = product.unit ?? "";
    } else {
        editId = null;
        modalTitle.innerText = "Add Product";

        code.value = "";
        name.value = "";
        description.value = "";
        categoryId.value = "";
        price.value = "";
        purchasePrice.value = "";
        stock.value = "";
        unit.value = "";
    }

    imageInput.value = "";
}

function closeModal() {
    modal.classList.add("hidden");
}

async function saveProduct() {
    const payload = {
        code: code.value,
        name: name.value,
        description: description.value,
        categoryId: categoryId.value,
        price: Number(price.value),
        purchasePrice: Number(purchasePrice.value),
        stock: Number(stock.value),
        unit: unit.value
    };

    console.log(payload)

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const product = await res.json();

        if (imageInput.files.length > 0) {
            const formData = new FormData();
            formData.append("file", imageInput.files[0]);

            const uploadRes = await fetch(
                `${API_URL}/upload-photo-product/${product.id}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!uploadRes.ok) throw new Error("Failed upload photo");
        }

        closeModal();
        loadProducts();

    } catch (err) {
        console.error(err);
        alert("Gagal menyimpan product");
    }
}

async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadProducts();
    } catch (err) {
        console.error("Failed to delete product", err);
    }
}

function renderProducts() {
    productList.innerHTML = "";

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";

        console.log(p.imageUrl)

        card.innerHTML = `
            <div class="product-body">
                <img src="http://localhost:8080/images/products/${p.imageUrl}" alt="product">
                <h4>${p.name}</h4>
                <p>Rp ${Number(p.price).toLocaleString()}</p>
                <p>Stock: ${p.stock}</p>

                <div class="product-actions">
                    <button class="btn btn-rent">Rent</button>
                    <button class="btn btn-edit">Edit</button>
                    <button class="btn btn-delete">Delete</button>
                </div>
            </div>
        `;

        card.querySelector(".btn-edit").onclick = () => openModal(p);
        card.querySelector(".btn-delete").onclick = () => deleteProduct(p.id);
        card.querySelector(".btn-rent").onclick = () => {
            window.location.href = `rental-users.html?productId=${p.id}`;
        };

        productList.appendChild(card);
    });
}
