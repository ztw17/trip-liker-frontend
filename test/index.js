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
const modalDiv = document.getElementsByClassName("modal-content")[0];
const editButton = document.getElementById("edit-button");
const editFormContainer = document.getElementById("edit-post-form");
const editFormSubmitButton = document.getElementsByClassName("modal-footer")[1];
const editPostForm = document.getElementsByClassName("edit-post-form")[0];
const searchBar = document.getElementsByClassName("form-control")[0];
// const editPostForm = document.getElemenyById(" ")
let editPost = false;
let user = null;
let addPost = false;
let allPosts = [];

// functions
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
      .then( postsData => {
        allPosts = postsData
        postsData.forEach(post => renderPostsData(post))
      }
)}

function renderPostsData(post) {
      let postData =  `<div id="card" class="col-md-8">
        <h4>📍 ${post.location}</h4>
        <img src=${post.image} class="img-fluid" id="post-avatar" /><br>
        <p>Posted By: <b>${post.user.username}</b></p>
        <p>Description: <b>${post.description}</b></p>
        <p>Tops Tips: <b>${post.tips}</b></p>
        <p>Photo Date: <b>${post.date}</b></p>
        <p><b>${post.likes} ${post.likes === 1 ? "Like" : "Likes"}</b></p>
        <button data-id=${post.id} data-likes=${post.likes} data-user_id=${post.user.id} type="button" class="btn btn-outline-danger btn-md custom">Like ❤️</button>
        <button disabled style="display: none" type="button" class="btn btn-secondary btn-md custom">Liked ❤️</button>
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
    postsDiv.parentElement.style.display = "block"
    navBar.style.display = "block"
    postsDiv.innerHTML = ""
    fetchPosts()
}

const fetchUserPosts = () => {
    fetch(POSTS_URL)
    .then(resp => resp.json())
    .then(allPosts => {
      return renderUserPosts(allPosts)})
}

const navBarClickHandler = () => {  
    if (event.target.innerText === "Home"){
        homePage.style.display = "block"
        profPage.parentElement.style.display = "none"
        postsDiv.parentElement.style.display = "block"
        postsDiv.innerHTML = ""
        fetchPosts()
    }
    if (event.target.innerText === "Profile"){
        homePage.style.display = "none"
        postsDiv.parentElement.style.display = "none"
        loginDiv.style.display = "none"
        profPage.parentElement.style.display = "block"
        profPage.innerHTML = ""
        fetchUserPosts();
    }
    if (event.target.innerText === "New Post") {  
        showCreatePostForm();
        newPostForm.reset();
        addPost = false;
    }
    if (event.target.innerText === "Logout") {
      loginDiv.style.display = "block"
      postsDiv.parentElement.style.display = "none"
      profPage.parentElement.style.display = "none"
      navBar.style.display = "none"

    }

}

const likePost = (event) => {
  if (event.target.className === "btn btn-outline-danger btn-md custom") {
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

const showEditForm = () => {
  editPost = !editPost;
  if (editPost) {
    const editFormField = editFormContainer.firstElementChild;
    const isolatedFormField = event.target.parentElement;
    const locationString = isolatedFormField.children[0].children[0].innerText;
    editFormField.location.value = locationString.substr(locationString.indexOf(" ") + 1)
    editFormField.description.value = isolatedFormField.children[2].children[0].innerText
    editFormField.tips.value = isolatedFormField.children[3].children[0].innerText
    editFormContainer.style.display = "block";
    editPost = false;
  } else {
    editFormContainer.style.display = "none";
    loginDiv.style.display = "none";
  }
}
const createEditObj = (editDescription, editTips, editLocation) => {
    return {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
           description: editDescription,
           tips: editTips,
           location: editLocation
        })
    }
}
const editExistingPost = () => {
    event.preventDefault()
    const editDescription = editPostForm.description.value
    const editTips = editPostForm.tips.value
    const editLocation = editPostForm.location.value
    const editObj = createEditObj(editDescription, editTips, editLocation)
    fetch(`http://localhost:3000/posts/${editFormSubmitButton.children[0].dataset.id}`, editObj)
    .then(resp => resp.json())
    .then(() => {
        profPage.innerHTML = ""
        return fetchUserPosts()
    })
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
    allPosts.filter(post => { 
        if (user.id === post.user.id) {
        let userPostData =  `<div id="card" data-user=${post.user.id} class="col-md-8">
          <div id="header">
            <h4 class='header-title'>📍 ${post.location}</h4>
          </div>
          <img src=${post.image} class="img-fluid" id="post-avatar" />
          <p>Description: <b>${post.description}</b></p>
          <p>Top Tips: <b>${post.tips}</b></p>
          <p>Photo Date: <b>${post.date}</b></p>
          <p>${post.likes} ${post.likes === 1 ? "Like" : "Likes"}</p>
          <button data-toggle="modal" data-target="#editModal" id="expand-edit-post-form" data-id=${post.id} type="button" class="btn btn-outline-success btn-md">Edit</button>
          <button id="delete-btn" data-id=${post.id} data-likes=${post.likes} type="button" class="btn btn-outline-danger btn-md">Delete</button>
        </div>`
      profPage.innerHTML += userPostData 
    }
  })
}

const deletePost = (event) => {
  if (event.target.innerText === "Delete"){
  const postId = event.target.dataset.id
  const reqObj = {
    method: "DELETE"
  }
  fetch(`http://localhost:3000/posts/${postId}`, reqObj)
    .then( resp => resp.json() )
    .then( post => {event.target.parentNode.remove() 
      postsDiv.innerHTML = ""
      return fetchPosts() 
  })
  alert("Your post is about to be deleted")
  }
}

const handleSearch = () => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredSearch = allPosts.filter(postObject => postObject.location.toLowerCase().includes(searchTerm) || postObject.description.toLowerCase().includes(searchTerm) || postObject.tips.toLowerCase().includes(searchTerm))
  postsDiv.innerHTML = ""
  filteredSearch.forEach(post => renderPostsData(post))
}

// Event Listeners
formSubmitButton.addEventListener("click", createNewPost)
loginForm.addEventListener("submit", userLogin)
navBar.addEventListener("click", navBarClickHandler)
postsDiv.addEventListener("click", likePost)
profPage.addEventListener("click", (e) => {
    if (e.target.innerText === "Edit") {
    editFormSubmitButton.children[0].dataset.id = e.target.dataset.id
        showEditForm()
    }
})
editFormSubmitButton.addEventListener("click", editExistingPost)
profPage.addEventListener("click", deletePost)
searchBar.addEventListener("input", handleSearch)