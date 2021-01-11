const userForm = document.querySelector('#user-form');
const passwordForm = document.querySelector('#password-form');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const dob = document.querySelector('#dob');
const password = document.querySelector('#password');
const passwordConfirm = document.querySelector('#confirm-password');
const changeInfo = document.querySelector('#change-info');
const changePassword = document.querySelector('#change-password');
const myPosts = document.querySelector('#my-posts');
const myInfo = document.querySelector('#my-info');
const userInfoContainer = document.querySelector('.user-info-container');
const infoChangeContainer = document.querySelector('.info-change-container');
const passwordChangeContainer = document.querySelector('.password-change-container');
const myPostsContainer = document.querySelector('.my-posts-container');

// Form validation and submit with AJAX
userForm.addEventListener('submit', event => {
   event.preventDefault();
   if(name.value && email.value && phone.value && dob.value) {
      if(name.value.length < 6) {
         alert("Name is too short!");
      }
      else if(!email.value.match(/(^.+@.+\.com$)/)) {
         alert("Please give a valid email.");
      }
      else {
         fetch('/user', {
            method: "PUT",
            body: JSON.stringify({
               name: name.value,
               email: email.value,
               phone: phone.value,
               dob: dob.value
            }),
            headers: {
               'Content-type': 'application/json; charset=UTF-8'
            }
         })
      }
   }
})

// Form validation and submit with AJAX
passwordForm.addEventListener('submit', event => {
   event.preventDefault();
   if(!password.value.match(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(.{8})/)) {
      alert('Password must contain Uppercase Lowercase and at least 8 characters');
   }
   else if(password.value != passwordConfirm.value) {
      alert("Password fields don't match")
   }
   else {
      fetch('/changepassword', {
         method: "PUT",
         body: JSON.stringify({
            password: password.value
         }),
         headers: {
            'Content-type': 'application/json; charset=UTF-8'
         }
      })
   }
})

// Changing user views based on button press
myInfo.addEventListener('click', event => {
   userInfoContainer.classList.remove('hidden');
   infoChangeContainer.classList.add('hidden');
   passwordChangeContainer.classList.add('hidden');
   myPostsContainer.classList.add('hidden');
});


changeInfo.addEventListener('click', event => {
   userInfoContainer.classList.add('hidden');
   infoChangeContainer.classList.remove('hidden');
   passwordChangeContainer.classList.add('hidden');
   myPostsContainer.classList.add('hidden');
});

changePassword.addEventListener('click', event => {
   userInfoContainer.classList.add('hidden');
   infoChangeContainer.classList.add('hidden');
   passwordChangeContainer.classList.remove('hidden');
   myPostsContainer.classList.add('hidden');
});

myPosts.addEventListener('click', event => {
   userInfoContainer.classList.add('hidden');
   infoChangeContainer.classList.add('hidden');
   passwordChangeContainer.classList.add('hidden');
   myPostsContainer.classList.remove('hidden');
});

