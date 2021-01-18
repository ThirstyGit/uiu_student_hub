const blogs = document.querySelector('#all-blogs');
const searchBar = document.querySelector('.search-bar');
const tag = document.querySelector('#tag');

function filterResults(str) {
   while(blogs.firstElementChild) {
      blogs.removeChild(blogs.firstElementChild);
   }
   fetch(`/api/getblog/${str}`)
   .then(res => {
      res.json().then(datas => {
         // <a href="/blogs/<%=blog.id%>"><h3><%=blog.title%></h3></a>
         datas.forEach(data => {
            // console.log(data);
            if(data.tag === tag.value) {
               const a = document.createElement('a');
               const h3 = document.createElement('h3');
               h3.innerText = data.title;
               a.href = `/blogs/${data.id}`;
               a.appendChild(h3);
               blogs.appendChild(a);
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

tag.addEventListener('change', event => {
   if(searchBar.value.length) {
      filterResults(searchBar.value);
   }
   else {
      filterResults('');
   }
})
