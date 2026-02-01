const BASE_URL = "http://localhost:8080/api/v1";

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

async function loadDashboard() {
    try {
        const response = await fetch(`${BASE_URL}/history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // kalau pakai JWT
                // "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data dashboard");
        }

        const result = await response.json();
        const data = result.data;

        document.getElementById("totalProduct").innerText = data.totalProduct;
        document.getElementById("activeProduct").innerText = data.activeProduct;
        document.getElementById("revenue").innerText = formatRupiah(data.revenue);

    } catch (error) {
        console.error(error);
        alert("Gagal memuat data dashboard");
    }
}
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}
