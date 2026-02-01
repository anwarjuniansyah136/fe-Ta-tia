const API_BASE = "http://localhost:8080/api/v1/transactions";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
    loadTransactions();
});

async function loadTransactions() {
    try {
        const res = await fetch(`${API_BASE}?status=UNPAID`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            throw new Error("Gagal mengambil data transaksi");
        }

        const data = await res.json();
        renderTransactions(data);

    } catch (err) {
        console.error(err);
        alert("Tidak bisa memuat transaksi");
    }
}

function renderTransactions(transactions) {
    const table = document.getElementById("transactionTable");

    if (!table) {
        console.error("transactionTable tidak ditemukan");
        return;
    }

    table.innerHTML = "";

    if (transactions.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    Tidak ada transaksi UNPAID
                </td>
            </tr>
        `;
        return;
    }

    transactions.forEach(t => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${t.customerName ?? "-"}</td>
            <td>${t.productName ?? "-"}</td>
            <td>Rp ${Number(t.totalAmount).toLocaleString("id-ID")}</td>
            <td class="status-unpaid">${t.status}</td>
            <td>
                <button class="btn small primary" onclick="markPaid('${t.id}')">
                    Paid
                </button>
                <button class="btn small" onclick="cancelTransaction('${t.id}')">
                    Cancel
                </button>
            </td>
        `;

        table.appendChild(tr);
    });
}

async function markPaid(id) {
    if (!confirm("Tandai transaksi ini sebagai PAID?")) return;

    try {
        const res = await fetch(`${API_BASE}/${id}/pay`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            throw new Error("Gagal update transaksi");
        }

        alert("Transaksi berhasil dibayar");
        loadTransactions();

    } catch (err) {
        console.error(err);
        alert("Gagal memproses pembayaran");
    }
}

async function cancelTransaction(id) {
    if (!confirm("Batalkan transaksi ini?")) return;

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            throw new Error("Gagal membatalkan transaksi");
        }

        alert("Transaksi dibatalkan");
        loadTransactions();

    } catch (err) {
        console.error(err);
        alert("Gagal membatalkan transaksi");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "../login/login.html";
}
