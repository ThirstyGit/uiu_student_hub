const semesterCode = document.querySelector('#semesterCode');
const semesterForm = document.querySelector('#semesterForm');
const addSemester = document.querySelector('#addSemester');

addSemester.addEventListener('click', (event) => {
   if(!isNaN(semesterCode.value) &&
      semesterCode.value.length == 3 &&
      semesterCode.value.charAt(2) < '4' &&
      semesterCode.value.charAt(2) > '0'
   ) {
      semesterForm.submit();
   }
   else {
      alert('Please give a proper semester');
   }
})

semesterForm.addEventListener('keypress', (event => {
   if(event.keyCode === 13) {
      event.preventDefault();
   }
}))


