document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("ID rental tidak ditemukan");
        return;
    }

    fetch(`http://localhost:8080/api/v1/rentals/get-by-id/${id}`, {
        headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
    })
        .then(res => res.json())
        .then(res => {

            console.log(res)

            document.getElementById("renterName").innerText = res.renterName ?? "-";
            document.getElementById("renterPhone").innerText = res.renterPhone ?? "-";
            document.getElementById("rentalDate").innerText = res.startDate ?? "-";
            document.getElementById("endDate").innerText = res.endDate ?? "-";
            document.getElementById("totalAmount").innerText =
                "Rp " + Number(res.totalAmount).toLocaleString();
            document.getElementById("paymentStatus").innerText = res.status ?? "-";
        })
        .catch(err => {
            console.error(err);
            alert("Gagal load data rental");
        });
});
function finishPayment() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    fetch(`http://localhost:8080/api/v1/rentals/payment/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(res => {
        alert("Payment success");
        window.location.href = "rentals.html";
    })
    .catch(err => {
        console.error(err);
        alert("Payment failed");
    });
}