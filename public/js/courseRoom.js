// Element selecting.
const message = document.querySelector('.message-box');
const messageInput = document.querySelector('.message-input');
const enrollCourse = document.querySelector('#enroll-course')
const moderate = document.querySelector('#moderate');


// Declarations.
const socket = io();
const courseCode = window.location.href.split('/')[4].replace('_', ' ');




// Enrolling to a new course.
if(enrollCourse) {
    enrollCourse.addEventListener('click', () => {
        console.log('enrolled');
        window.location.href = window.location.href + '/enroll';
    })

}

// routing
if(moderate) {
    moderate.addEventListener('click', event => {
        window.location.href = window.location.href + '/moderate';
        console.log(window.location.href);
    })
}


// Message part.
if(messageInput) {
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
                socket.send({message: messageInput.value, room: courseCode, id: socket.id});
                let xhr = new XMLHttpRequest();
                xhr.open('POST', `/course/${courseCode.replace(/ /g, '_')}`, true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.send(`chat=${messageInput.value}`);
            }
            addSentMessage(`${messageInput.value}`);
            messageInput.value = "";
        }
    });
    
    socket.emit('join', courseCode);

    socket.on('chat', data => {
        addRecivevedMessage(data.message);
    });
}


