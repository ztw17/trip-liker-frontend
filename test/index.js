// variables
const homePage = document.getElementById("home")
const profPage = document.getElementById("profile")
const navBar = document.getElementById("nav")
const POSTS_URL = "http://localhost:3000/posts"
const USERS_URL = "http://localhost:3000/users"
const postsDiv = document.getElementById("post-container")
const addBtn = document.querySelector("#new-post-btn");
const formContainer = document.getElementById("new-post-form");
const newPostForm = document.getElementsByClassName("add-post-form")[0];
const loginForm = document.getElementsByClassName("login-form")[0]
const loginDiv = document.getElementsByClassName("login-div")[0]
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
      .catch( err => console.log(err) )
)}

// .then(toys => toys.forEach(toy => renderToyInfo(toy)))

function renderPostsData(post) {
      let postData =  `<div id="card" class="col-md-8">
      <img src=${post.image} class="img-fluid" id="post-avatar" />
      <h2>${post.location}</h2>
      <p>Description: ${post.description}</p>
      <p>Tips: ${post.tips}</p>
      <p>Photo Date: ${post.date}</p>
      <p>${post.likes} Likes </p>
      <button id=${post.id} data-likes=${post.likes} type="button" class="btn btn-outline-danger btn-sm">Like</button>
    </div>`
      postsDiv.innerHTML += postData 
}

const createNewPost = () => {
  event.preventDefault();
  const image = newPostForm.image.value;
  const location = newPostForm.location.value
  const description = newPostForm.description.value
  const tips = newPostForm.tips.value
  const date = newPostForm.date.value
  fetch(POSTS_URL, createPostObj(image, location, description, tips, date, user) )
    .then( resp => resp.json() )
    .then( newPostData => renderPostsData(newPostData) )
    .catch( err => console.log(err) )

}

const createPostObj = (image, location, description, date, user) => {
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
      user_id: user.id
    }})
  }
}

const createUserObj = (user) => {
  return {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify({
          username: user.id
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

function renderNewPost(newPostData) {
  let postData = `<div id="card" class="col-md-8">
        <img src=${newPostData.image} class="img-fluid" id="post-avatar"/>
        <h2>Location: ${newPostData.location}</h2>
        <p>Description:${newPostData.description}</p>
        <p>Tips: ${newPostData.tips}</p>
        <p>Photo Date: ${newPostData.date}</p>
        <p>${newPostData.likes} Likes </p>
        <button id=${newPostData.id} data-likes=${newPostData.likes} type="button" class="btn btn-outline-danger btn-sm">Like</button>
    </div>`
    postsDiv.innerHTML += postData 
}

// EVENT LISTENERS

// addBtn.addEventListener("click", showCreatePostForm);
// formContainer.addEventListener("submit", createNewPost)
loginForm.addEventListener("submit", userLogin)

// INVOKED VARIABLES
// fetchPosts()

// functions
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

// event listeners
 
// invoked variables


//Event Listener
navBar.addEventListener("click", navBarClickHandler)
