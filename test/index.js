// variables
const homePage = document.getElementById("home");
const profPage = document.getElementById("profile");
const navBar = document.getElementById("nav");
const POSTS_URL = "http://localhost:3000/posts";
const USERS_URL = "http://localhost:3000/users";
const postsDiv = document.getElementById("post-container");
const addBtn = document.querySelector("#new-post-btn");
const formContainer = document.getElementById("new-post-form");
const newPostForm = document.getElementsByClassName("add-post-form")[0]
const formSubmitButton = document.getElementsByClassName("modal-footer")[0];
const loginForm = document.getElementsByClassName("login-form")[0];
const loginDiv = document.getElementsByClassName("login-div")[0];
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
  //   console.log(reqObj)
    fetch(POSTS_URL, reqObj )
      .then( resp => resp.json() )
      .then( newPostData => renderPostsData(newPostData) )
}

console.log(user)
const createPostObj = (image, location, description, tips, date, user) => {
// console.log(foo)
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
    // console.log('f', user)
  
}

const userLogin = (e) => {
    console.log('here')
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

const navBarClickHandler = () => {
    
    if (event.target.innerText === "Home"){
        homePage.style.display = "block"
        profPage.style.display = "none"
    }
    if (event.target.innerText === "Profile"){
        homePage.style.display = "none"
        profPage.style.display = "block"
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
      .then( updatedPost => renderUpdatedPost(clicked, updatedPost))
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

const renderUpdatedPost = (clicked, updatedPost) => {
  debugger
  const likesElement = clicked.previousElementSibling
  const likesPluralize = updatedPost.likes === 1 ? "Like" : "Likes"
  clicked.dataset.likes = updatedPost.likes
  clicked.style.display = "none"
  clicked.nextElementSibling.style.display ="block"
  likesElement.innerText = `${updatedPost.likes} ${likesPluralize}`
}

// Event Listeners
formSubmitButton.addEventListener("click", createNewPost)
loginForm.addEventListener("submit", userLogin)
navBar.addEventListener("click", navBarClickHandler)
postsDiv.addEventListener("click", likePost)

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
