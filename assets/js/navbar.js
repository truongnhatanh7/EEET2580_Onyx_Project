const hamburger = $('.navbar__hamburger-wrapper')
const navbar = $('.home__navbar')
const navbarLogin = $('.navbar__login');

hamburger.addEventListener('click', () => {
    if (navbar.classList.contains('flex')) {
        navbar.classList.remove('flex')
    } else {
        navbar.classList.add('flex')
    }
})


navbarLogin.addEventListener('click', () => {
    if (sessionStorage.getItem("userId")) {
        location.href = "./app/dashboard.html"
    } else {
        location.href = "./login.html";
    }
})

if (sessionStorage.getItem('userId')) {
    navbarLogin.innerText = "Dashboard"
} 