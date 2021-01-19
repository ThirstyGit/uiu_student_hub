// Element selecting.
const message = document.querySelector('.message-box');
const messageInput = document.querySelector('.message-input');
const enrollCourse = document.querySelector('#enroll-course')
const moderate = document.querySelector('#moderate');
const files = document.querySelector('#files');


// Declarations.
const socket = io();
const courseCode = window.location.href.split('/')[4].replace('_', ' ');

// Scroll to the end of message at start
if(message) {
    message.scrollTo(0,message.scrollHeight);
}

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
    })
}
if(message) {
    files.addEventListener('click', event => {
        window.location.href = window.location.href + '/files';
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
        message.scrollTo(0,message.scrollHeight);
    }

    const addRecivevedMessage = (msg) => {
        const user = document.createElement('p');
        const text  = document.createElement('p');
        const textContainer  = document.createElement('div');
        user.innerText = msg.user;
        textContainer.classList.add("recieved-message-container");
        user.classList.add('recieved-user')
        text.classList.add('recieved-message')
        text.innerText = `${msg.message}`;
        textContainer.appendChild(user);
        textContainer.appendChild(text);
        message.appendChild(textContainer);
        message.scrollTo(0,message.scrollHeight);
    }

    messageInput.addEventListener('keyup', (event)=> {
        if(event.keyCode === 13) {
            if(messageInput.value) {
                fetch(`/course/${courseCode.replace(/ /g, '_')}`, {
                    method: "POST",
                    body: JSON.stringify({
                        chat: messageInput.value
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                })
                addSentMessage(`${messageInput.value}`);
                fetch('/api/getuser').then(res => {
                    res.json().then(data => {
                        socket.send({message: messageInput.value, room: courseCode, id: socket.id, user: data.name});
                        messageInput.value = "";
                    })
                })
            }
        }
    });
    
    socket.emit('join', courseCode);

    socket.on('chat', data => {
        addRecivevedMessage({message: data.message, user: data.user});
    });
}


