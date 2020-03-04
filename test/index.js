// variables
const homePage = document.getElementById("home")
const profPage = document.getElementById("profile")
const navBar = document.getElementById("nav")
const POSTS_URL = "http://localhost:3000/posts"
const USERS_URL = "http://localhost:3000/users"
const postsDiv = document.getElementById("post-container")
const addBtn = document.querySelector("#new-post-btn");
const formContainer = document.getElementById("new-post-form");
const newPostForm = document.getElementsByClassName("add-post-form")[0]
const formSubmitButton = document.getElementsByClassName("modal-footer")[0];
const loginForm = document.getElementsByClassName("login-form")[0]
const loginDiv = document.getElementsByClassName("login-div")[0]
const modalDiv = document.getElementsByClassName("modal-content")[0]
const editButton = document.getElementById("edit-post")
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
      loginDiv.style.display = "none";
    }
}
  
function fetchPosts() {
    fetch(POSTS_URL)
      .then( resp => resp.json() )
      .then( postsData => postsData.forEach(post => renderPostsData(post) )
)}

// .then(toys => toys.forEach(toy => renderToyInfo(toy)))

function renderPostsData(post) {
      let postData =  `<div id="card" data-user=${post.user.id} class="col-md-8">
        <div id="header">
        <h4 class='header-title'>📍 ${post.location}</h4>
        </div>
        <img src=${post.image} class="img-fluid" id="post-avatar" />
        <p>Description: ${post.description}</p>
        <p>Tips: ${post.tips}</p>
        <p>Photo Date: ${post.date}</p>
        <p>${post.likes} Likes </p>
        <button data-id=${post.id} data-likes=${post.likes} type="button" class="btn btn-outline-danger btn-sm">Like</button>
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
    .then( newPostData => renderNewPost(newPostData) )

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

function renderNewPost(newPostData) {
  let postData = `<div id="card" class="col-md-8" data-user=${newPostData.user.id}>
        <h4>📍 ${newPostData.location}</h4>
        <img src=${newPostData.image} class="img-fluid" id="post-avatar"/>
        <p>Description:${newPostData.description}</p>
        <p>Tips: ${newPostData.tips}</p>
        <p>Photo Date: ${newPostData.date}</p>
        <p>${newPostData.likes} Likes </p>
        <button data-id=${post.id} data-likes=${post.likes} type="button" class="btn btn-outline-danger btn-sm">Like</button>
        <button disabled style="display: none" type="button" class="btn btn-secondary btn-sm">Liked ❤️</button>
    </div>`
    postsDiv.innerHTML += postData 
}

// const editPost = () => {
//     e.preventDefault()
// }

// EVENT LISTENERS

// addBtn.addEventListener("click", showCreatePostForm);
// formContainer.addEventListener("submit", createNewPost)

// INVOKED VARIABLES
// fetchPosts()
const fetchUserPosts = () => {
    fetch(POSTS_URL)
    .then(resp => resp.json())
    .then(allPosts => renderUserPosts(allPosts))
}

// functions
const navBarClickHandler = () => {
    
    if (event.target.innerText === "Home"){
        homePage.style.display = "block"
        profPage.style.display = "none"
        postsDiv.parentElement.style.display = "block"
    }
    if (event.target.innerText === "Profile"){
        homePage.style.display = "none"
        postsDiv.parentElement.style.display = "none"
        loginDiv.style.display = "none"
        profPage.style.display = "block"
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
        <p>Description: ${post.description}</p>
        <p>Tips: ${post.tips}</p>
        <p>Photo Date: ${post.date}</p>
        <p>${post.likes} Likes </p>
        <button type="button" id="edit-post" class="btn btn-outline-success btn-sm">Edit Post</button>
        <button data-id=${post.id} data-likes=${post.likes} type="button" class="btn btn-outline-danger btn-sm">Delete Post</button>
      </div>`
      profPage.innerHTML += userPostData 
}

    })
}

// event listeners

// invoked variables


//Event Listener
formSubmitButton.addEventListener("click", createNewPost)
loginForm.addEventListener("submit", userLogin)
navBar.addEventListener("click", navBarClickHandler)
postsDiv.addEventListener("click", likePost)
editButton.addEventListener("click")

// createNewPost
