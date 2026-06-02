// 1. Firebase Configuration

console.log("Ankit's Script is working!");
const firebaseConfig = {
    apiKey: "AIzaSyBJaFHyI0g271m_5327E0J1ajCxroM8ey8",
    authDomain: "vit-bhopal-paper-hubs.firebaseapp.com",
    projectId: "vit-bhopal-paper-hubs",
    storageBucket: "vit-bhopal-paper-hubs.firebasestorage.app",
    messagingSenderId: "907343684705",
    appId: "1:907343684705:web:17e2c5b836a6ccff39b620"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Admin Configuration
const ADMIN_EMAIL = "ehankit777@gmail.com";

// 2. Auth State Observer 
auth.onAuthStateChanged((user) => {
    const uploadBtn = document.getElementById('uploadBtn');
    if (user && user.email === ADMIN_EMAIL) {
        if(uploadBtn) uploadBtn.style.display = 'flex';
        console.log("Welcome Admin:", user.email);
    } else {
        if(uploadBtn) uploadBtn.style.display = 'none';
    }
});

// 3. Login Function 
function loginAsAdmin() {
    auth.signInWithPopup(provider)
        .then((result) => {
            if (result.user.email !== ADMIN_EMAIL) {
                alert("Access Denied: You are not the admin!");
                auth.signOut();
            }
        })
        .catch(error => {
            console.error("Login Error:", error);
            alert("Login failed!");
        });
}

// 4. Modal Controls
function openModal() { document.getElementById("uploadModal").style.display = "block"; }
function closeModal() { document.getElementById("uploadModal").style.display = "none"; }

// 5. Save Paper to Firestore (Security check ke saath)
function savePaperLink() {
    const user = auth.currentUser;
    
   
    if (!user || user.email !== ADMIN_EMAIL) {
        alert("Unauthorized! Sirf admin hi upload kar sakta hai.");
        return;
    }

    const code = document.getElementById("paperCode").value;
    const title = document.getElementById("paperTitle").value;
    const slot = document.getElementById("paperSlot").value;
    const link = document.getElementById("driveLink").value;
    const msg = document.getElementById("statusMsg");

    if(!code || !title || !link || !slot) { alert("Sare fields bharna zaroori hai!"); return; }

    msg.style.color = "#f39c12";
    msg.innerText = "Processing...";

    db.collection("all_papers").add({
        code: code.toUpperCase(),
        title: title,
        slot: slot.toUpperCase(),
        url: link,
        adminEmail: user.email, // Tracking ke liye
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        msg.style.color = "#27ae60";
        msg.innerText = "Paper Added Successfully!";
        setTimeout(() => { 
            closeModal(); 
            msg.innerText = "";
            document.querySelectorAll('.modal-content input').forEach(i => i.value = "");
        }, 1500);
    }).catch(e => { 
        msg.style.color = "red";
        msg.innerText = "Error: " + e.message; 
    });
}

// 6. Load Papers Dynamically
function loadPapers() {
    const displayArea = document.getElementById("dynamicPapers");
    db.collection("all_papers").orderBy("timestamp", "desc").onSnapshot(snap => {
        displayArea.innerHTML = "";
        snap.forEach(doc => {
            const data = doc.data();
            displayArea.innerHTML += `
                <div class="PaperBox"> 
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <a class="Classid">${data.code}</a>
                        <span class="slot-badge">${data.slot || 'N/A'}</span>
                    </div>
                    <p>${data.title}<br><span style="font-size: 0.8rem; color: #7f8c8d;"></span></p>
                    <a href="${data.url}" target="_blank"><button class="Paper">View Paper</button></a>
                </div>
            `;
        });
    });
}

// 7. Search Filter
const searchInput = document.getElementById('mainSearch');
if(searchInput) {
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        document.querySelectorAll('.PaperBox').forEach(box => {
            const content = box.textContent.toLowerCase();
            box.style.display = content.includes(q) ? 'block' : 'none';
        });
    });
}

// Run on Load
window.onload = loadPapers;