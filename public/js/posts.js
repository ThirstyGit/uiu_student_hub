const posts = document.querySelector('#all-posts');
const searchBar = document.querySelector('.search-bar');
const semester = document.querySelector('#semester');
const courses = document.querySelector('#courses');

function filterResults(str) {
   while(posts.firstElementChild) {
      posts.removeChild(posts.firstElementChild);
   }
   fetch(`/api/getpost/${str}`)
   .then(res => {
      res.json().then(datas => {
         // <a href="/posts/<%=post.id%>"><h3><%=post.title%></h3></a>
         datas.forEach(data => {
            console.log(data);
            if(data.semester === Number(semester.value) && data.course_code === courses.value) {
               const a = document.createElement('a');
               const h3 = document.createElement('h3');
               h3.innerText = data.title;
               a.href = `/posts/${data.id}`;
               a.appendChild(h3);
               posts.appendChild(a);
            }
         })
      })
   })
}


searchBar.addEventListener("keydown", event => {
   if(event.keyCode === 13 && searchBar.value.length) {
      filterResults(searchBar.value);
   }
})

semester.addEventListener('change', event => {
   if(searchBar.value.length) {
      filterResults(searchBar.value);
   }
   else {
      filterResults('');
   }
})

courses.addEventListener('change', event => {
   if(searchBar.value.length) {
      filterResults(searchBar.value);
   }
   else {
      filterResults('');
   }
})


