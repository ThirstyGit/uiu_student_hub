const showUsers = document.querySelector('#show-users');
const showModerators = document.querySelector('#show-moderators');


if(showUsers) {
   showUsers.addEventListener("click", event => {
      window.location.href += "/users";
   })
}

if(showModerators) {
   showModerators.addEventListener("click", event => {
      window.location.href += "/moderators";
   })
}

