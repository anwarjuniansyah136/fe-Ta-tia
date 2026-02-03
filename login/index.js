const BASE_URL = "http://localhost:8080/api/v1";

document.getElementById("loginBtn").addEventListener("click", login);

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageEl = document.getElementById("message");

    if (!username || !password) {
        messageEl.innerText = "Username dan password wajib diisi";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();


        if (!response.ok) {
            messageEl.innerText = result.message || "Login gagal";
            return;
        }

        messageEl.innerText = "Login berhasil";
        
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.roleName);

        if(localStorage.getItem("role") == "cashier"){
            window.location.href = "../cashier/index.html";
        }
        else if(localStorage.getItem("role") == "owner"){
            window.location.href = "../admin/index.html"
        }
        else if(localStorage.getItem("role") == "warehouse"){
            window.location.href = "../warehouse/index.html"
        }

    } catch (error) {
        messageEl.innerText = "Tidak bisa terhubung ke server";
    }
}
