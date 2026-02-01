const API_URL = "http://localhost:8080/api/v1/rentals";

const params = new URLSearchParams(window.location.search);
const renterName = document.getElementById("renterName");
const renterPhone = document.getElementById("renterPhone");
const rentalDate = document.getElementById("rentalDate");
const endDate = document.getElementById("endDate");
const quantity = document.getElementById("qty")
const productId = params.get("productId");

async function saveRental() {

    if (!renterName.value || !rentalDate.value || !endDate.value) {
        alert("Please complete the form");
        return;
    }

    const payload = {
        renterName: renterName.value,
        renterPhone: renterPhone.value,
        rentalDate: rentalDate.value+"T00:00:00",
        endDate: endDate.value+"T00:00:00",
        totalAmount: 0,
        quantity: quantity.value,
        productId: productId
    };

    console.log(payload)

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error("Failed to create rental");
        }

        alert("Rental created successfully!");
        window.location.href = `sum.html?id=${data.data.id}`;

    } catch (err) {
        console.error(err);
        alert("Error creating rental");
    }
}
