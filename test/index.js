const homePage = document.getElementById("home")
const profPage = document.getElementById("profile")
const navBar = document.querySelector(".navbar")








//Functions
const navBarClickHandler = () => {
    
    if (event.target.innerText === "Home"){
        homePage.style.display = "block"
        profPage.style.display = "none"
    }
    if (event.target.innerText === "Profile"){
        homePage.style.display = "none"
        profPage.style.display = "block"
    }
}







//Event Listener
navBar.addEventListener("click", navBarClickHandler)