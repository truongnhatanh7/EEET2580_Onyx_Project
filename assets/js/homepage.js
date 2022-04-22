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
  
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        let elementVisible = 300;
        let elementInvisible = 600;
        console.log(elementTop);
        if ((elementTop < windowHeight - elementVisible)) {
        reveals[i].classList.add("active");

        } else {
        reveals[i].classList.remove("active");
        }
    }
}
  
