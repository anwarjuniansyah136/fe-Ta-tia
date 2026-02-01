const API_URL = "http://localhost:8080/api/v1/rentals";

document.addEventListener("DOMContentLoaded", () => {
    loadRentals();
});

async function loadRentals() {
    const res = await fetch(API_URL, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    const data = await res.json();
    renderTable(data);
}

function renderTable(rentals) {
    const tbody = document.getElementById("rentals-body");

    tbody.innerHTML = "";

    rentals.forEach(r => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${r.invoice}</td>
            <td>${r.renterName}</td>
            <td>-</td>
            <td>${r.startDate}</td>
            <td>${r.endDate}</td>
            <td class="${r.status === 'ONGOING' ? 'onrent' : 'returned'}">
                ${r.status}
            </td>
        `;

        tbody.appendChild(tr);
    });
}
