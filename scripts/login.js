import { Data } from "/scripts/index.js"

function handleLogin() {
    let jwt = localStorage.getItem("jwt")
    if (jwt) showelements() 

    document.getElementById("loginBtn").addEventListener("click", () => {
        async function login() {
            const usernameOrEmail = document.getElementById('username').value
            const password = document.getElementById('password').value
            
            try {
                const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${btoa(`${usernameOrEmail}:${password}`)}`,
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json();
                if (response.ok) {
                    showAlert("Logged in successfully", "succes")
                    handledata(data)
                } else {
                    showAlert("Invalid credentials", "error")
                }
            } catch (error) {
                showAlert("Error logging in", "error")
            }
        }

        login()
    })
}

function handledata(data) {
    localStorage.setItem('jwt', data)
    // show stats and hide login container
    showelements()

    Data()
    document.getElementById("logout").addEventListener("click", handleLogout)
}

function handleLogout() {
    document.getElementById("stats").style.display = "none"
    document.querySelector(".login-container").style.display = "block"
    document.querySelector(".states-container").style.display = "none"
    localStorage.removeItem('jwt')
    showAlert("Logged out successfully", "succes")
}

function showAlert(message, type) {
    const loginalert = document.getElementById('errorsucces')
    loginalert.textContent = message
    loginalert.classList.remove("error", "succes")
    loginalert.classList.add(type)
    setTimeout(() => {
        loginalert.style.display = "none"
    }, 2000)
}
function showelements() {
    document.querySelector(".xp").style.display = "flex";
    document.querySelector(".lvl").style.display = "flex";
    document.getElementById("pxp").style.display = "flex";
    document.getElementById("plvl").style.display = "flex";
    document.getElementById("txt").style.display = "flex";
    document.getElementById("audit").style.display = "flex";
    document.getElementById("svg").style.display = "flex";
    document.getElementById("secondsvg").style.display = "flex";
    document.querySelector(".login-container").style.display = "none";
    document.querySelector(".states-container").style.display = "flex";
    document.getElementById("stats").style.display = "flex";
}
handleLogin()
