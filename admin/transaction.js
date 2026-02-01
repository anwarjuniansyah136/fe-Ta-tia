const API_URL = "http://localhost:8080/api/v1/rentals";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", loadTransactions);

function loadTransactions() {
    fetch(`${API_URL}/find-by-status`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(res => renderTable(res))
    .catch(err => console.error(err));
}

function renderTable(data) {
    const tbody = document.getElementById("transactionTable");
    tbody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.invoice}</td>
            <td>${item.renterName}</td>
            <td>${item.renterPhone}</td>
            <td>${item.startDate}</td>
            <td>${item.endDate}</td>
            <td>Rp ${item.totalAmount}</td>
            <td>UNPAID</td>
            <td>
                ${renderActions(item)}
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function renderActions(item) {
    let buttons = "";
        buttons += `
            <button class="cancel" onclick="cancelRental('${item.id}')">
                Cancel
            </button>
        `;

        buttons += `
            <button class="pay" onclick="payRental('${item.id}')">
                Pay
            </button>
        `;

    return buttons;
}

function cancelRental(id) {
    if (!confirm("Cancel this rental?")) return;

    fetch(`${API_URL}/${id}/close`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(() => loadTransactions())
    .catch(err => alert(err));
}

function payRental(id) {
    if (!confirm("Proceed payment?")) return;

    fetch(`${API_URL}/payment/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(() => loadTransactions())
    .catch(err => alert(err));
}
