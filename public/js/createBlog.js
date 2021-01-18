const postButton = document.querySelector('#post-button');
const tag = document.querySelector('#tag');
const tagSelect = document.querySelector('#tag-select');
const form = document.querySelector('.form');
const tagButton = document.querySelector('#tag-button');

postButton.addEventListener('click', event => {
   if(tag.classList.contains('hidden')) {
      tag.value = tagSelect.value;
   }
   form.submit();
})

tagButton.addEventListener('click', event => {
   if(tag.classList.contains('hidden')) {
      tag.classList.remove('hidden');
      tagSelect.classList.add('hidden');
      tagButton.innerText = "Select Tag";
   }
   else {
      tag.classList.add('hidden');
      tagSelect.classList.remove('hidden');
      tagButton.innerText = "Other Tag";
   }
})

