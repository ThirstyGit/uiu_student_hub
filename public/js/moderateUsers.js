const moderateSearchbar = document.querySelector('#moderate-searchbar');
const usersContainer = document.querySelector('.users-container');
const course_code = window.location.href.split('/')[4];

moderateSearchbar.addEventListener('keyup', event => {
   if(event.keyCode === 13) {
      fetch(`/api/moderate/${course_code}/${moderateSearchbar.value}`)
      .then( res => {
         res.json().then(users => {
            while(usersContainer.firstElementChild) {
               usersContainer.removeChild(usersContainer.firstChild);
            }
            users.forEach(user => {
               const h3 = document.createElement('h3');
               h3.innerText = user.name;
               if(user.moderator === 'false') {
                  const form = document.createElement('form');
                  form.action = `/course/${course_code}/moderate/addmoderate`;
                  form.method = 'POST';
                  const input = document.createElement('input');
                  input.value = user.user_id;
                  input.name = 'id';
                  input.setAttribute('hidden', true);
                  const button = document.createElement('button');
                  button.innerText = 'ADD MODERATOR'
                  form.appendChild(input);
                  form.appendChild(button);
                  usersContainer.appendChild(h3);
                  usersContainer.appendChild(form);
               }
               else {
                  const form = document.createElement('form');
                  form.action = `/course/${course_code}/moderate/removemoderate`;
                  form.method = 'POST';
                  const input = document.createElement('input');
                  input.value = user.user_id;
                  input.name = 'id';
                  input.setAttribute('hidden', true);
                  const button = document.createElement('button');
                  button.classList.add('remove-users');
                  button.innerText = 'REMOVE MODERATOR';
                  form.appendChild(input);
                  form.appendChild(button);
                  usersContainer.appendChild(h3);
                  usersContainer.appendChild(form);
               }
            })
         })
      })
   }
})

