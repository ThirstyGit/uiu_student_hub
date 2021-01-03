// Selecting necessary elements.
const form = document.querySelector('.form');
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const passwordConfirm = document.querySelector('#password-confirm')
const register = document.querySelector('#register');

// Validate and submit.
register.addEventListener("click", ()=> {
    if(name.value.length < 6) {
        alert("Name is too short!");
    }
    else if(!email.value.match(/(^.+@.+\.com$)/)) {
        alert("Please give a valid email.");
    }
    else if(!password.value.match(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(.{8})/)) {
        alert("Password must be minimum length 8 and contain smaller case, lower case, numnbers.");
    }
    else if(password.value != passwordConfirm.value) {
        alert("Passwords don't match");
    }
    else {
        form.submit();
    }
})
