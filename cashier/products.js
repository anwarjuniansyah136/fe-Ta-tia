const API_URL = "http://localhost:8080/api/v1/products";

/* =========================
   ELEMENTS
========================= */
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");

const code = document.getElementById("code");
const name = document.getElementById("name");
const description = document.getElementById("description");
const categoryId = document.getElementById("categoryId");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const unit = document.getElementById("unit");
// const imageInput = document.getElementById("image");

const productList = document.getElementById("productList");

/* =========================
   STATE
========================= */
let products = [];
let editId = null;

/* =========================
   LOAD DATA
========================= */
async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        products = await res.json();
        renderProducts();
    } catch (err) {
        console.error("Failed to load products", err);
    }
}

/* =========================
   MODAL
========================= */
function openModal(product = null) {
    modal.classList.remove("hidden");

    if (product) {
        editId = product.id;
        modalTitle.innerText = "Edit Product";

        code.value = product.code ?? "";
        name.value = product.name ?? "";
        description.value = product.description ?? "";
        categoryId.value = product.category_id ?? "";
        price.value = product.price ?? "";
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
        stock.value = "";
        unit.value = "";
        // imageInput.value = "";
    }
}

function closeModal() {
    modal.classList.add("hidden");
}

/* =========================
   SAVE PRODUCT
========================= */
async function saveProduct() {
    const payload = {
        code: code.value,
        name: name.value,
        description: description.value,
        category_id: categoryId.value,
        price: Number(price.value),
        purchase_price: Number(price.value),
        stock: Number(stock.value),
        unit: unit.value
    };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    await fetch(url, {
        method,
        headers: {  
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    closeModal();
    loadProducts();
}


/* =========================
   DELETE
========================= */
async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadProducts();
    } catch (err) {
        console.error("Failed to delete product", err);
    }
}

/* =========================
   RENDER
========================= */
function renderProducts() {
    productList.innerHTML = "";

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${p.image_url || 'no-image.png'}" alt="">
            <div class="product-body">
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
            window.location.href = `rental-users.html`
        }

        productList.appendChild(card);
    });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", loadProducts);
