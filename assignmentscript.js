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

let activeItem = { code: "", link: "" };

// Admin Check
auth.onAuthStateChanged((user) => {
    const btn = document.getElementById('uploadBtn');
    if (user && user.email === "ehankit777@gmail.com") {
        btn.style.display = "flex";
    }
});

// Modal Logic social media links
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



// Modal Logic
function openUploadModal() { document.getElementById('assignmentModal').style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

function openChoiceModal(code, link) {
    activeItem = { code, link };
    document.getElementById('choiceModal').style.display = "flex";
}

function showAccessInput() {
    closeModal('choiceModal');
    let pass = prompt("Enter Code:");
    if (pass && pass.trim() === activeItem.code.trim()) {
        window.open(activeItem.link, "_blank");
    } else if (pass !== null) {
        alert("Wrong Code! Insta check karo.");
    }
}

// Load Assignments
function loadAssignments() {
    const container = document.getElementById('dynamicAssignments');
    db.collection("all_assignments").orderBy("timestamp", "desc").onSnapshot(snap => {
        container.innerHTML = "";
        snap.forEach(doc => {
            const data = doc.data();
            container.innerHTML += `
                <div class="card">
                    <span style="background:#e8f5e9; color:#27ae60; padding:4px 10px; border-radius:5px; font-size:12px; font-weight:bold; width:fit-content;">${data.subject}</span>
                    <h3 style="margin:10px 0;">${data.topic}</h3>
                    <p style="color:#e74c3c; font-size:13px;"><b>Deadline: ${data.deadline}</b></p>
                    <button onclick="openChoiceModal('${data.accessCode}', '${data.link}')" class="btn-view">
                        <i class="fas fa-file-download"></i> Get Assignment
                    </button>
                </div>
            `;
        });
    });
}

// Upload Assignment
function uploadAssignment() {
    const subject = document.getElementById('aSubject').value;
    const topic = document.getElementById('aTopic').value;
    const deadline = document.getElementById('aDeadline').value;
    const link = document.getElementById('aLink').value;
    const code = document.getElementById('aAccessCode').value;

    if(!subject || !topic || !link || !code) return alert("Fill all fields!");

    db.collection("all_assignments").add({
        subject, topic, deadline, link, accessCode: code,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        closeModal('assignmentModal');
        alert("Assignment Added!");
    });
}





window.onload = loadAssignments;