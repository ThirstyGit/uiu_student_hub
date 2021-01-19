const course_code = window.location.href.split('/')[4];
const fileSubmitButton = document.querySelector('#file-submit-button');
const form = document.querySelector('#form');


fileSubmitButton.addEventListener('click', () => {
  form.action = `/course/${course_code}/files` ;
  form.submit();
})

