const message = document.querySelector('.message-box');
const messageInput = document.querySelector('.message-input');
const socket = io();
const courseCode = window.location.href.split('/')[4].replace('_', ' ');

const addSentMessage = (msg) => {
    const text  = document.createElement('p');
    const newMessage  = document.createElement('div');
    const newMessageContainer  = document.createElement('div');
    newMessage.classList.add("sender-message");
    newMessageContainer.classList.add("sender-message-container");
    text.innerText = `${msg}`;
    newMessage.appendChild(text);
    newMessageContainer.appendChild(newMessage);
    message.appendChild(newMessageContainer);
}

const addRecivevedMessage = (msg) => {
    const text  = document.createElement('p');
    const textContainer  = document.createElement('div');
    textContainer.classList.add("reciver-message");
    text.innerText = `${msg}`;
    textContainer.appendChild(text);
    message.appendChild(textContainer);
}

messageInput.addEventListener('keyup', (event)=> {
    if(event.keyCode === 13) {
        if(messageInput.value) {
            socket.send({message: messageInput.value, room: courseCode});
        }
        addSentMessage(`${messageInput.value}`);
        messageInput.value = "";
    }
});

// console.log(courseCode);
socket.emit('join', courseCode);

socket.on('chat', msg => {
   addRecivevedMessage(msg);
})

