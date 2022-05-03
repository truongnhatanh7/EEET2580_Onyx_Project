const hamburger = $('.navbar__hamburger-wrapper')
const navbar = $('.home__navbar')

hamburger.addEventListener('click', () => {
    if (navbar.classList.contains('flex')) {
        navbar.classList.remove('flex')
    } else {
        navbar.classList.add('flex')
    }
})