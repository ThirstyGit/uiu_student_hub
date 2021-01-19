// Selecting elements.
const addCourse = document.querySelector('#add-course');
const courseCode = document.querySelector('#course-code');
const courseName = document.querySelector('#course-name');
const semester = document.querySelector('#semester');
const setSemester = document.querySelector('#set-semester');
const searchBar = document.querySelector('#search-bar');
const userContainer = document.querySelector('#user-container');
const suggestionContainer = document.querySelector('#suggestion-container');
const user = document.querySelector('#user');
const searchedPosts = document.querySelector('#searched-posts');
const postSearchBar = document.querySelector('.post-search-bar');
const searchedBlogs = document.querySelector('#searched-blogs');
const blogSearchBar = document.querySelector('.blog-search-bar');
const userPosts = document.querySelector('.user-posts');
const userBlogs = document.querySelector('.user-blogs');

// Declaration
let timeoutId;
let suggestions = [];
let suggestionIndex = -1;

// functions
const clearSearchSuggestion = () => {
   while(suggestionContainer.firstChild) {
      suggestionContainer.removeChild(suggestionContainer.firstChild);
   }
}

const selectSuggestion = data => {
   searchBar.value = data.name;
   fetch(`/api/getuser/${data.id}`)
   .then(res => {
      res.json().then(datas => {
         clearSearchSuggestion();
         addUser(datas);
      })
   })
}

const removeUser = () => {
   while(user.firstChild) {
      user.removeChild(user.firstChild);
   }
}

const addUser = (userInfo) => {
   removeUser();
   // Adding initial data about the user.
   const h1 = document.createElement('h1');
   const button = document.createElement('button');
   h1.innerText = userInfo[0].name;
   console.log(userInfo);
   button.innerText = 'Delete';
   button.addEventListener('click', event => {
      fetch(`/admin/deleteuser`, {
         method: "POST",
         body: JSON.stringify({
            id: userInfo[0].id
         }),
         headers: {
            'Content-type': 'application/json; charset=UTF-8'
         }
      })
      removeUser();
   })
   user.appendChild(h1);
   user.appendChild(button);
}

const getUserSuggestion = () => {
   fetch(`/api/getusersuggestion/${searchBar.value}`)
   .then(res => {
      res.json().then(datas => {
         suggestions = [];
         datas.forEach(data => {
            const div = document.createElement('div');
            const h3 = document.createElement('h3');
            h3.innerText = data.name
            div.classList.add('search-suggestion');
            div.tabIndex = '0'
            div.appendChild(h3)
            suggestionContainer.appendChild(div);
            div.addEventListener('click', event => {
               selectSuggestion(data)
            })
            div.addEventListener("keydown", event => {
               selectSuggestion(data)
            });
            div.addEventListener('mouseover', event => {
               div.focus()
            })
            suggestions.push(div);
         })
      })
   })
}


// Adding Course using AJAX
addCourse.addEventListener('click', event => {
   fetch(`/admin/addcourses`, {
      method: "POST",
      body: JSON.stringify({
         courseCode: courseCode.value,
         courseName: courseName.value
      }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8'
      }
   })
   courseCode.value = ''
   courseName.value = ''
})

// Adding semester using AJAX
setSemester.addEventListener('click', event => {
   fetch(`/admin/setsemester`, {
      method: "POST",
      body: JSON.stringify({
         semester: semester.value
      }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8'
      }
   })
   semester.value = '';
})

// Suggest users to search for using AJAX
searchBar.addEventListener('keyup', event => {
   clearSearchSuggestion();
   if(searchBar.value) {
      if(timeoutId) {
         clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
         getUserSuggestion();
      })
   }
})

// Searching posts with AJAX
function filterPostResults(str) {
   while(searchedPosts.firstElementChild) {
      searchedPosts.removeChild(searchedPosts.firstElementChild);
   }
   fetch(`/api/getpost/${str}`)
   .then(res => {
      res.json().then(datas => {
         datas.forEach(data => {
            const a = document.createElement('a');
            const h3 = document.createElement('h3');
            const button = document.createElement('button');
            h3.innerText = data.title;
            a.href = `/posts/${data.id}`;
            button.innerText = 'delete';
            button.addEventListener('click', event => {
               fetch(`/post/delete`, {
                  method: "POST",
                  body: JSON.stringify({
                     id: data.id
                  }),
                  headers: {
                     'Content-type': 'application/json; charset=UTF-8'
                  }
               })
               button.remove();
               a.remove();
            })
            a.appendChild(h3);
            searchedPosts.appendChild(a);
            searchedPosts.append(button);
         })
      })
   })
}

// Searching for a post with keyboard.
postSearchBar.addEventListener("keydown", event => {
   if(event.keyCode === 13 && postSearchBar.value.length) {
      filterPostResults(postSearchBar.value);
   }
})

function filterBlogResults(str) {
   while(searchedBlogs.firstElementChild) {
      searchedBlogs.removeChild(searchedBlogs.firstElementChild);
   }
   fetch(`/api/getblog/${str}`)
   .then(res => {
      res.json().then(datas => {
         datas.forEach(data => {
            const a = document.createElement('a');
            const h3 = document.createElement('h3');
            const button = document.createElement('button');
            h3.innerText = data.title;
            a.href = `/blogs/${data.id}`;
            button.innerText = 'delete';
            button.addEventListener('click', event => {
               fetch(`/blog/delete`, {
                  method: "POST",
                  body: JSON.stringify({
                     id: data.id
                  }),
                  headers: {
                     'Content-type': 'application/json; charset=UTF-8'
                  }
               })
               button.remove();
               a.remove();
            })
            a.appendChild(h3);
            searchedBlogs.appendChild(a);
            searchedBlogs.appendChild(button);
         })
      })
   })
}


blogSearchBar.addEventListener("keydown", event => {
   if(event.keyCode === 13 && blogSearchBar.value.length) {
      filterBlogResults(blogSearchBar.value);
   }
})


