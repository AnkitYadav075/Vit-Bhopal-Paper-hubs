// Poora code ek hi DOMContentLoaded ke andar hona chahiye
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. REGISTER LOGIC (Firebase + Firestore) ---
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const username = document.getElementById("username").value;

            // Firebase Authentication
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Firestore mein username save karein
                    return db.collection("users").doc(userCredential.user.uid).set({
                        username: username,
                        email: email,
                        createdAt: new Date()
                    });
                })
                .then(() => {
                    alert("Registration Successful! Now Login.");
                    window.location.href = "main.html"; 
                })
                .catch((error) => {
                    alert("Error: " + error.message);
                });
        });
    }

    // --- 2. LOGIN LOGIC (Firebase Auth) ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Note: Login ke liye hum HTML mein id="email" use karenge
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Login ke baad user ka naam LocalStorage mein temporary save kar sakte hain display ke liye
                    // Par Firebase auth state check karna best hota hai
                    localStorage.setItem("tempUser", email); 
                    alert("Login Successful!");
                    window.location.href = "main.html";
                })
                .catch((error) => {
                    alert("Login Failed: " + error.message);
                });
        });
    }

    // --- 3. MAIN PAGE LOGIC (Display Name) ---
    // Ye sirf tab chalega jab hum main.html par honge aur wahan 'welcomeUser' id hogi
    const welcomeText = document.getElementById("welcomeUser");
    if (welcomeText) {
        // Firebase se current user check karein
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Firestore se username nikaalna
                db.collection("users").doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        welcomeText.innerText = doc.data().username;
                    }
                });
            } else {
                // Agar logged in nahi hai toh wapas bhej do
                if (window.location.pathname.includes("main.html")) {
                    window.location.href = "index.html";
                }
            }
        });
    }
});

// --- 4. LOGOUT FUNCTION (Isse bahar rakhein taaki HTML button ise call kar sake) ---

function logout() {
    // 1. Firebase session close karein
    auth.signOut().then(() => {
        // 2. Local memory saaf karein
        localStorage.clear();
        
        // 3. Login page (index.html) par bhej dein
        alert("Logged out successfully!");
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// --- 5. FORGOT PASSWORD FUNCTION ---
const forgotPassLink = document.getElementById('forgotPassLink');

if (forgotPassLink) {
    forgotPassLink.addEventListener('click', (e) => {
        e.preventDefault(); // Page refresh hone se rokne ke liye

        // Aapke login form mein email input ki jo bhi ID hai (e.g., 'loginEmail' ya 'email')
        const emailInput = document.getElementById('email'); 
        const emailValue = emailInput ? emailInput.value.trim() : "";

        if (!emailValue) {
            alert("Please enter your email address first in the input field!");
            if(emailInput) emailInput.focus();
            return;
        }

        // Firebase Forgot Password Function
        auth.sendPasswordResetEmail(emailValue)
            .then(() => {
                alert("Password reset link has been sent to your email: " + emailValue);
            })
            .catch((error) => {
                console.error("Reset Error:", error.message);
                // Agar email galat hai ya register nahi hai toh error dikhayega
                alert(error.message);
            });
    });
}

