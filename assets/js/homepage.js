// localStorage.setItem("login_timestamp",  new Date(2022,3,12,16,33,0))
// console.log(localStorage.getItem("login_timestamp"));
// console.log(new Date(localStorage.getItem("login_timestamp")))
// console.log(Date.now() - new Date(localStorage.getItem("login_timestamp")))
let elapsedTime = (Math.round((Date.now() - new Date(localStorage.getItem('login_timestamp'))) / 1000 ) / 3600);
if (elapsedTime > 1) {
    localStorage.removeItem('userId');
}
window.addEventListener("scroll", reveal);

function reveal() {
    let reveals = document.querySelectorAll(".features__scroll-appear");
    let parallaxText = document.querySelectorAll(".features__card-article");
    let parallaxImg = document.querySelectorAll(".features__card-fig");
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        let elementVisible = 300;
        if (elementTop < windowHeight - elementVisible) {
            // appear on scroll
            reveals[i].classList.add("active");
            // parallax when appear
            parallaxText[i].style.transform = `translateY(${(-1) *elementTop * 0.13}px)`;
            parallaxImg[i].style.transform = `translateY(${elementTop * 0.13}px)`;

        } else {
            reveals[i].classList.remove("active");
        }
    }
}
  
