document.addEventListener("DOMContentLoaded", () => {
    const processBtn = document.querySelector(".btn.primary");

    if (!processBtn) {
        console.error("Process Return button not found");
        return;
    }

    processBtn.addEventListener("click", processReturn);
});

async function processReturn() {
    const rentalIdInput = document.getElementById("rentalId");

    if (!rentalIdInput || !rentalIdInput.value.trim()) {
        alert("Rental ID wajib diisi");
        return;
    }

    const rentalId = rentalIdInput.value.trim();

    try {
        const res = await fetch(
            `http://localhost:8080/api/v1/rentals/return/${rentalId}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json"
                }
            }
        );

        if (!res.ok) {
            throw new Error("Gagal memproses return");
        }

        alert("Return berhasil diproses");
        window.location.href = "rentals.html";

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat return");
    }
}

function logout() {
    window.location.href = "../login/login.html";
}
