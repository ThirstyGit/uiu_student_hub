const hamburger = document.querySelector('#hamburger');
const sidebar = document.querySelector('.sidebar');

hamburger.addEventListener('click', event => {
   if(sidebar.classList.contains('sidebar-close')) {
      sidebar.classList.remove('sidebar-close');
      sidebar.classList.add('sidebar-open');
   }
   else {
      sidebar.classList.remove('sidebar-open');
      sidebar.classList.add('sidebar-close');
   }
})
