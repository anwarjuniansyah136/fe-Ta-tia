const API_URL = "http://localhost:8080/api/v1/rentals";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", loadTransactions);

function loadTransactions() {
    fetch(`${API_URL}/find-for-warehouse`, {
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
            <td>${item.rentals.invoiceNumber}</td>
            <td>${item.rentals.renterName}</td>
            <td>${item.rentals.renterPhone}</td>
            <td>${item.rentals.rentalDate}</td>
            <td>${item.rentals.endDate}</td>
            <td>Rp ${item.rentals.totalAmount}</td>
            <td>${item.status}</td>
        `;

        tbody.appendChild(tr);
    });
}
