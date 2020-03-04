// variables
const POSTS_URL = "http://localhost:3000/posts";
const USERS_URL = "http://localhost:3000/users";
const homePage = document.getElementById("home");
const profPage = document.getElementById("profile");
const navBar = document.getElementById("nav");
const postsDiv = document.getElementById("post-container");
// const addBtn = document.querySelector("#new-post-btn");
const formContainer = document.getElementById("new-post-form");
const newPostForm = document.getElementsByClassName("add-post-form")[0];
const formSubmitButton = document.getElementsByClassName("modal-footer")[0];
const loginForm = document.getElementsByClassName("login-form")[0];
const loginDiv = document.getElementsByClassName("login-div")[0];
// const modalDiv = document.getElementsByClassName("modal-content")[0];
const editButton = document.getElementById("edit-post");
let user = null;
let addPost = false;

// FUNCTIONS 

const showCreatePostForm = () => {
    addPost = !addPost;
    if (addPost) {
      formContainer.style.display = "block";

    } else {
      formContainer.style.display = "none";
      loginDiv.style.display = "none";
    }
}
  
function fetchPosts() {
    fetch(POSTS_URL)
      .then( resp => resp.json() )
      .then( postsData => postsData.forEach(post => renderPostsData(post) )
)}

function renderPostsData(post) {
      let postData =  `<div id="card" class="col-md-8">
        <h4>📍 ${post.location}</h4>
        <img src=${post.image} class="img-fluid" id="post-avatar" /><br>
        <p>Description: <b>${post.description}</b></p>
        <p>Tips: <b>${post.tips}</b></p>
        <p>Photo Date: <b>${post.date}</b></p>
        <p>${post.likes} ${post.likes === 1 ? "Like" : "Likes"}</p>
        <button data-id=${post.id} data-likes=${post.likes} data-user_id=${post.user.id} type="button" class="btn btn-outline-danger btn-sm">Like ❤️</button>
        <button disabled style="display: none" type="button" class="btn btn-secondary btn-sm">Liked ❤️</button>
      </div>`
      postsDiv.innerHTML += postData 
}

const createNewPost = () => {
    console.log(user)
    const foo = user

    event.preventDefault();
    const image = newPostForm.image.value;
    const location = newPostForm.location.value
    const description = newPostForm.description.value
    const tips = newPostForm.tips.value
    const date = newPostForm.date.value
    const reqObj = createPostObj(image, location, description, tips, date, user)
    fetch(POSTS_URL, reqObj)
      .then( resp => resp.json() )
      .then( newPostData => renderPostsData(newPostData) )
}

const createPostObj = (image, location, description, tips, date, user) => {
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
      tips: tips,
      date: date,
      likes: 0,
      user_id: user.id
    }})
  }
}

const createUserObj = (username) => {
  return {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify({
          username: username
      })
  }
}

const setUser = (userData) => {
    user = userData
}

const userLogin = (e) => {
    e.preventDefault()
    username = loginForm.username.value
    fetch(USERS_URL, createUserObj(username))
      .then(resp => resp.json())
      .then(userData => setUser(userData))
    loginDiv.style.display = "none"
    postsDiv.style.display = "block"
    navBar.style.display = "block"
    fetchPosts()
}

// const editPost = () => {
//     e.preventDefault()
// }

const fetchUserPosts = () => {
    fetch(POSTS_URL)
    .then(resp => resp.json())
    .then(allPosts => renderUserPosts(allPosts))
}

const navBarClickHandler = () => {
  if (event.target.innerText === "Home"){
      homePage.style.display = "block"
      profPage.parentElement.style.display = "none"
      postsDiv.parentElement.style.display = "block"
  }
  if (event.target.innerText === "Profile"){
      homePage.style.display = "none"
      postsDiv.parentElement.style.display = "none"
      loginDiv.style.display = "none"
      profPage.parentElement.style.display = "block"
      fetchUserPosts()
  }
  if (event.target.innerText === "New Post") {  
      showCreatePostForm()
  }
}

const likePost = (event) => {
  if (event.target.className === "btn btn-outline-danger btn-sm") {
    const likes = parseInt(event.target.dataset.likes)
    const clicked = event.target
    fetch(`http://localhost:3000/posts/${event.target.dataset.id}`, updatedLikeObj(likes) )
      .then( resp => resp.json() )
      .then( updatedPost => renderPostLike(clicked, updatedPost))
      .catch( err => console.log(err) )
  }
}

const updatedLikeObj = (likes) => {
  return {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: likes + 1})
  }
}

const renderPostLike = (clicked, updatedPost) => {
  const likesElement = clicked.previousElementSibling
  const likesPluralize = updatedPost.likes === 1 ? "Like" : "Likes"
  clicked.dataset.likes = updatedPost.likes
  clicked.style.display = "none"
  clicked.nextElementSibling.style.display ="block"
  likesElement.innerText = `${updatedPost.likes} ${likesPluralize}`
}

const renderUserPosts = (allPosts) => {
    allPosts.forEach(post => { 
        if (user.id === post.user.id) {
        let userPostData =  `<div id="card" data-user=${post.user.id} class="col-md-8">
        <div id="header">
          <h4 class='header-title'>📍 ${post.location}</h4>
        </div>
        <img src=${post.image} class="img-fluid" id="post-avatar" />
        <p>Description: <b>${post.description}</b></p>
        <p>Tips: <b>${post.tips}</b></p>
        <p>Photo Date: <b>${post.date}</b></p>
        <p>${post.likes} ${post.likes === 1 ? "Like" : "Likes"}</p>
        <button type="button" id="edit-post" class="btn btn-outline-success btn-sm">Edit Post</button>
        <button id="delete-btn" data-id=${post.id} data-likes=${post.likes} type="button" class="btn btn-outline-danger btn-sm">Delete Post</button>
      </div>`
      profPage.innerHTML += userPostData 
    }
  })
}

const deletePost = (event) => {
  const postId = event.target.dataset.id
  const reqObj = {
    method: "DELETE"
  }
  fetch(`http://localhost:3000/posts/${postId}`, reqObj)
    .then( resp => resp.json() )
    .then( post => {event.target.parentNode.remove() 
      postsDiv.innerHTML = ""
      fetchPosts() 
  })
  alert("Your post is about to be deleted")
}

// Event Listeners
formSubmitButton.addEventListener("click", createNewPost)
loginForm.addEventListener("submit", userLogin)
navBar.addEventListener("click", navBarClickHandler)
postsDiv.addEventListener("click", likePost)
// editButton.addEventListener("click")
profPage.addEventListener("click", deletePost)

// Extra

// function fetchUsers() {
//   fetch(USERS_URL)
//   .then(resp => resp.json() )
//   .then(userData => {
//     user = userData
//     postsDiv.innerHTML = ''
//     fetchPosts()
//   })
// }

// function renderNewPost(newPostData) {
//   let postData = `<div id="card" class="col-md-8">
//         <h4>📍 ${newPostData.location}</h4>
//         <img src=${newPostData.image} class="img-fluid" id="post-avatar"/>
//         <p>Description:${newPostData.description}</p>
//         <p>Tips: ${newPostData.tips}</p>
//         <p>Photo Date: ${newPostData.date}</p>
//         <p>${newPostData.likes} Likes </p>
//         <button data-id=${post.id} data-likes=${post.likes} type="button" class="btn btn-outline-danger btn-sm">Like</button>
//         <button disabled style="display: none" type="button" class="btn btn-secondary btn-sm">Liked ❤️</button>
//     </div>`
//     postsDiv.innerHTML += postData 
// }
