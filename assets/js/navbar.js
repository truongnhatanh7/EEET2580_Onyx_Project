const hamburger = $('.navbar__hamburger-wrapper')
const navbar = $('.home__navbar')
hamburger.addEventListener('click', () => {
    if (navbar.style.display === 'none') {
        navbar.style.display = 'flex';
    } else {
        navbar.style.display = 'none'
    }
})

