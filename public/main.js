const socket = io();
const ClientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container'); // fixed typo
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone =new Audio('whatssap_sound.mp3')


// Listen for form submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

// Update the number of clients in the room
socket.on('clients-total', (data) => {
    ClientsTotal.innerText = `There ${data === 1 ? 'is' : 'are'} ${data} ${data === 1 ? 'person' : 'people'} in this room`;
});

// Send the message
function sendMessage() {
    const messageText = messageInput.value.trim(); // Trim whitespace
    if (messageText === '') return; // Prevent empty messages

    const data = {
        name: nameInput.value || 'anonymous', // Default to 'anonymous' if no name provided
        message: messageText,
        dateTime: new Date() // Timestamp when the message was sent
    };

    socket.emit('message', data); // Send message to the server
    addMessageToUI(true, data); // Add the message to the UI
    messageInput.value = ''; // Clear the input field
}

// Receive broadcasted message from server
socket.on('chat-message', (data) => {
    // console.log(data);
    messageTone.play()
    addMessageToUI(false, data); // Add the message to the UI
});

// Add the message to the UI
function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const messageElement = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
                ${data.message}
                <span>
                    ${data.name} 📍 ${moment(data.dateTime).fromNow()}
                </span>
            </p>
        </li>`;
    
    messageContainer.innerHTML += messageElement; // Append new message
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to bottom
}


messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`✍🏻 ${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`✍🏻 ${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:""
    })
})

socket.on('feedback',(data)=>{
    clearFeedback()
    const element=`
    <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
    </li>
    `
    messageContainer.innerHTML+=element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}