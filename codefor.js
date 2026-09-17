const CORRECT_PASSCODE = "0721";

// Connect to Socket.io Server
const socket = io();

const statusIndicator = document.getElementById("connection-status");

socket.on('connect', () => {
    statusIndicator.textContent = "Connected to chat server";
    statusIndicator.classList.add("connected");
});

socket.on('disconnect', () => {
    statusIndicator.textContent = "Disconnected from chat server";
    statusIndicator.classList.remove("connected");
});

// Listen for real-time messages coming from the server
socket.on('receive_message', (text) => {
    appendMessageToUI(text);
});

function verifyPasscode() {
    const input = document.getElementById("passcode-input").value;
    const errorDiv = document.getElementById("error-message");

    if (input === CORRECT_PASSCODE) {
        document.getElementById("auth-screen").classList.add("hidden");
        document.getElementById("dashboard-screen").classList.remove("hidden");
        
        // Clear initial placeholder if it was loading
        const chatBox = document.getElementById("chat-messages");
        if(chatBox.children.length === 1 && chatBox.children[0].textContent.includes("Loading")) {
            chatBox.innerHTML = "";
        }
    } else {
        errorDiv.textContent = "Incorrect passcode. Try again.";
        document.getElementById("passcode-input").value = "";
    }
}

document.getElementById("passcode-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        verifyPasscode();
    }
});

function signOut() {
    document.getElementById("dashboard-screen").classList.add("hidden");
    document.getElementById("auth-screen").classList.remove("hidden");
    document.getElementById("passcode-input").value = "";
    document.getElementById("error-message").textContent = "";
}

function sendQuickMessage(text) {
    socket.emit('send_message', text);
}

function sendCustomMessage() {
    const input = document.getElementById("message-input");
    const text = input.value.trim();
    if (text !== "") {
        socket.emit('send_message', text);
        input.value = "";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendCustomMessage();
    }
}

function appendMessageToUI(text) {
    const chatBox = document.getElementById("chat-messages");
    
    // Clear placeholder text if present
    if (chatBox.children.length === 1 && (chatBox.children[0].textContent.includes("Loading") || chatBox.children[0].textContent.includes("No messages"))) {
        chatBox.innerHTML = "";
    }

    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message";
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}