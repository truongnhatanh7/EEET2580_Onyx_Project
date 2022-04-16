// animation for hamburger
let hamburgerDiv = document.querySelector(".nav__hamburger-wrapper");
let navMenu = document.querySelector(".nav__menu-wrapper");
let loginIcon = document.querySelector(".nav__btn");
// Mobile phone query
const mobileMedia = window.matchMedia('(max-width: 768px)');
var navBar = document.querySelector('nav');


// Event listener
hamburgerDiv.addEventListener("click", event => handleHamburgerClick(event));
// click outside menu nav to close the menu nav
navMenu.addEventListener('click', function(event) {
    // if not child click
    if (event.target == event.currentTarget) {
        navMenuClose();
    }
})
// scroll then change nav bar style
window.onscroll = function () { 
    "use strict";
    if (document.body.scrollTop >= 150 || document.documentElement.scrollTop >= 150 ) {
        navBar.classList.add("nav-colored");
        navBar.classList.remove("nav-transparent");
    } 
    else {
        navBar.classList.add("nav-transparent");
        navBar.classList.remove("nav-colored");
    }
};

// functions
//  open nav menu when click hamburger
function navMenuOpen() {
    hamburgerDiv.classList.add("cross");
    navMenu.classList.add("open");
    navMenu.firstElementChild.style.animation = "slide-in 0.5s forwards";
}

function navMenuClosePart(event) {
    if (event.animationName == 'slide-out') {
        navMenu.classList.remove("open");
        navMenu.firstElementChild.style.animation = undefined;
        navMenu.firstElementChild.removeEventListener("animationend",  event => navMenuClosePart(event));
    }
}
//  close nav menu when click hamburger
function navMenuClose() {
    hamburgerDiv.classList.remove("cross");
    navMenu.firstElementChild.style.animation = "slide-out 0.5s forwards";
    navMenu.firstElementChild.addEventListener("animationend", event => navMenuClosePart(event));
}

// handle hamburger click
function handleHamburgerClick(event) {
    const checkCross = hamburgerDiv.classList.contains("cross");
    if (!checkCross) {
        navMenuOpen();  
    }
    else {
        navMenuClose();
    }
    
}