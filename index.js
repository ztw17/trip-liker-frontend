// VARIABLES 
const POSTS_URL = "http://localhost:3000/posts"
const USERS_URL = "http://localhost:3000/users"
const postsDiv = document.getElementById("post-collection")
const addBtn = document.querySelector("#new-post-btn");
const formContainer = document.querySelector(".container");
const newPostForm = document.getElementsByClassName("add-post-form")[0];
let user = null;
let addPost = false;

// FUNCTIONS 

// function fetchUsers() {
//   fetch(USERS_URL)
//   .then(resp => resp.json() )
//   .then(userData => {
//     user = userData
//     postsDiv.innerHTML = ''
//     fetchPosts()
//   })
// }

const showCreatePostForm = () => {
    addPost = !addPost;
    if (addPost) {
      formContainer.style.display = "block";
    } else {
      formContainer.style.display = "none";
    }
}
  
function fetchPosts() {
    fetch(POSTS_URL)
      .then( resp => resp.json() )
      .then( postsData => postsData.forEach(post => renderPostsData(post) )
      .catch( err => console.log(err) )
)}

// .then(toys => toys.forEach(toy => renderToyInfo(toy)))

function renderPostsData(post) {
      let postData =  `<div class="card">
      <img src=${post.image} class="post-avatar" />
      <h2>${post.location}</h2>
      <p>${post.description}</p>
      <p>${post.date}</p>
      <p>${post.likes} Likes </p>
      <button id=${post.id} data-likes=${post.likes} class="like-btn">Like</button>
    </div>`
      postsDiv.innerHTML += postData 
}

const createNewPost = () => {
  event.preventDefault();
  const image = newPostForm.image.value;
  const location = newPostForm.location.value
  const description = newPostForm.description.value
  const date = newPostForm.date.value
  fetch(POSTS_URL, createPostObj(image, location, description, date) )
    .then( resp => resp.json() )
    .then( newPostData => renderPostsData(newPostData) )
    .catch( err => console.log(err) )

}

const createPostObj = (image, location, description, date) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({post: {
      image: image,
      location: location,
      description: description,
      date: date,
      likes: 0,
      user_id: 25 // user.id
    }})
  }
}

// function renderNewPost(newPostData) {
//   let postData =  `<div class="card">
//     <img src=${newPostData.image} class="post-avatar" />
//     <h2>${newPostData.location}</h2>
//     <p>${newPostData.description}</p>
//     <p>${newPostData.date}</p>
//     <p>${newPostData.likes} Likes </p>
//     <button id=${newPostData.id} data-likes=${newPostData.likes} class="like-btn">Like</button>
//   </div>`
//     postsDiv.innerHTML += postData 
// }

// EVENT LISTENERS

addBtn.addEventListener("click", showCreatePostForm);
formContainer.addEventListener("submit", createNewPost)

// INVOKED VARIABLES
fetchPosts()