// VARIABLES 
const POSTS_URL = "http://localhost:3000/posts"
const postsDiv = document.getElementById("post-collection")
const addBtn = document.querySelector("#new-post-btn");
const formContainer = document.querySelector(".container");
let addPost = false;

const showCreatePostForm = () => {
    // hide & seek with the form
    addPost = !addPost;
    if (addPost) {
      formContainer.style.display = "block";
    } else {
      formContainer.style.display = "none";
    }
}
  

function fetchPosts() {
    fetch(POSTS_URL)
    .then(resp => resp.json())
    .then(postsData => renderPostsData(postsData))
}


function renderPostsData(postsData) {
    postsData.forEach(post => {
      let postData =  `<div class="card">
      <img src=${post.image} class="post-avatar" />
      <h2>${post.location}</h2>
      <p>${post.description}</p>
      <p>${post.date}</p>
      <p>${post.likes} Likes </p>
      <button id=${post.id} data-likes=${post.likes} class="like-btn">Like</button>
    </div>`
      postsDiv.innerHTML += postData 
    })
  }


// EVENT LISTENERS

addBtn.addEventListener("click", showCreatePostForm);






fetchPosts()