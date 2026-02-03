const BASE_URL = "http://localhost:8080/api/v1";

document.addEventListener("DOMContentLoaded", loadHistory);

async function loadHistory() {
    try {
        const res = await fetch(`${BASE_URL}/history/find-all-for-this-month`);
        const json = await res.json();

        const data = json.data || [];
        const table = document.getElementById("historyTable");

        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">No history this month</td>
                </tr>
            `;
            return;
        }

        data.forEach((item, index) => {
            table.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.date ?? "-"}</td>
                    <td>${item.invoiceNumber ?? "-"}</td>
                    <td>${item.type ?? "-"}</td>
                    <td>
                        <span class="badge ${statusClass(item.status)}">
                            ${item.status}
                        </span>
                    </td>
                    <td>Rp ${formatRupiah(item.amount)}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        document.getElementById("historyTable").innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
                    Failed to load history
                </td>
            </tr>
        `;
    }
}

function formatRupiah(value) {
    if (!value) return "0";
    return value.toLocaleString("id-ID");
}

function statusClass(status) {
    if (!status) return "";
    switch (status.toUpperCase()) {
        case "SUCCESS": return "success";
        case "FAILED": return "danger";
        case "PENDING": return "warning";
        default: return "";
    }
}
