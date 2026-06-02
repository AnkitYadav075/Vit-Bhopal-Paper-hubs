// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJaFHyI0g271m_5327E0J1ajCxroM8ey8",
    authDomain: "vit-bhopal-paper-hubs.firebaseapp.com",
    projectId: "vit-bhopal-paper-hubs",
    storageBucket: "vit-bhopal-paper-hubs.firebasestorage.app",
    messagingSenderId: "907343684705",
    appId: "1:907343684705:web:17e2c5b836a6ccff39b620"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let activeProjectData = { title: "", code: "", link: "" };

// Check Admin Status (Plus Button Hide/Show)
auth.onAuthStateChanged((user) => {
    const btn = document.getElementById('uploadBtn');
    if (user && user.email === "ehankit777@gmail.com") {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
});

function openUploadModal() {
    document.getElementById('projectModal').style.display = "flex";
}

function closeModal(id) { 
    document.getElementById(id).style.display = "none"; 
}

function openChoiceModal(code, link, title) {
    activeProjectData = { title, code, link };
    document.getElementById('choiceModal').style.display = "flex";
}

function showAccessInput() {
    closeModal('choiceModal');
    let enteredCode = prompt("Enter Access Code:");
    if (enteredCode && enteredCode.trim() === activeProjectData.code.trim()) {
        window.open(activeProjectData.link, "_blank");
    } else if (enteredCode !== null) {
        alert("Incorrect Code!");
    }
}

function showFollowForm() {
    closeModal('choiceModal');
    document.getElementById('followModal').style.display = "flex";
}

function loadProjects() {
    const container = document.getElementById('dynamicProjects');
    db.collection("all_projects").orderBy("timestamp", "desc").onSnapshot(snap => {
        container.innerHTML = "";
        snap.forEach(doc => {
            const data = doc.data();
            container.innerHTML += `
                <div class="card">
                    <h3>${data.title}</h3>
                    <div style="background:#eee; height:8px; border-radius:5px; margin:10px 0; overflow:hidden;">
                        <div style="background:#27ae60; height:100%; width:${data.percentage}%;"></div>
                    </div>
                    <p>Status: ${data.percentage}%</p>
                    <button onclick="openChoiceModal('${data.accessCode}', '${data.link}', '${data.title}')" class="btn-view">
                        <i class="fas fa-lock"></i> Unlock Project
                    </button>
                </div>
            `;
        });
    });
}

function uploadProject() {
    const title = document.getElementById('pTitle').value;
    const percent = document.getElementById('pPercent').value;
    const link = document.getElementById('pLink').value;
    const code = document.getElementById('pAccessCode').value;

    if(!title || !percent || !link || !code) return alert("All fields required!");

    db.collection("all_projects").add({
        title, percentage: percent, link, accessCode: code,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        closeModal('projectModal');
        alert("Uploaded!");
    });
}

window.onload = loadProjects;