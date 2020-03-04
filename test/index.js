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
const formSubmitButton = document.getElementsByClassName("modal-footer")[0];
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
    .catch( err => console.log(err) )

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
formSubmitButton.addEventListener("click", createNewPost)
loginForm.addEventListener("submit", userLogin)
navBar.addEventListener("click", navBarClickHandler)

// createNewPost




// formSubmitButton.addEventListener("click", (e) => {
//     console.log(e.target)
// })