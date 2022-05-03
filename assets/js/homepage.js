

// // Detect request animation frame
// let scroll = window.requestAnimationFrame || 
//     function(callback){ window.setTimeout(callback, 1000 / 60)};
// let elementsToShow = document.querySelectorAll('.features__scroll-appear'); 
// // let darkmodeFigureContainer = document.querySelector(".features__card-fig-darkmode");
// // let darklightFigure = document.querySelector(".features__card-fig-img-darklight");
// // let darkmodeAnimationPath = "darkmode-scale-in 1.5s 1 cubic-bezier(.25,.46,.45,.94) both";

// function loop() {

//     Array.prototype.forEach.call(elementsToShow, function(element) {
//         let elementTop = element.getBoundingClientRect().top;
//         if (isElementInViewport(element)) {
//             element.classList.add('active');
//             // parallax when appear
//             element.querySelector(".features__card-article").style.transform = `translateY(${(-1) *elementTop * 0.13}px)`;
//             // parallaxImg[i].style.transform = `translateY(${elementTop * 0.13}px)`;

//             if (element.classList.contains("features__collab")) {
//                 document.querySelectorAll(".svg__collab-circle").forEach(animationTarget => {
//                     animationTarget.style.animation = "collab-appear 2.5s 1 ease forwards";
//                 })
//             }
//             else if (element.classList.contains("features__dragdrop")) {
//                 document.querySelectorAll(".svg__dragdrop-moving-rect").forEach(animationTarget => {
//                     animationTarget.style.animation = "dragdrop-move 2.5s 5 ease forwards";
//                 })
//             }
//             // else if (element.classList.contains("features__darkmode")) {
//             //     // document.querySelector(".features__card-fig-img-dark").style.display = "none";
//             //     darkmodeFigureContainer.classList.add("active");
//             //     darklightFigure.style.webkitAnimation = darkmodeAnimationPath;
//             //     darklightFigure.style.animation = darkmodeAnimationPath;
//             // }
//         } else {
//             element.classList.remove('active');
//             if (element.classList.contains("features__collab")) {
//                 document.querySelectorAll(".svg__collab-circle").forEach(animationTarget => {
//                     animationTarget.style.animation = "";
//                 })
//             }
//             else if (element.classList.contains("features__dragdrop")) {
//                 document.querySelectorAll(".svg__dragdrop-moving-rect").forEach(animationTarget => {
//                     animationTarget.style.animation = "";
//                 })
//             }
//             // else if (element.classList.contains("features__darkmode")) {
//             //     darkmodeFigureContainer.classList.remove("active");
//             //     darklightFigure.style.animation = "";
//             //     darklightFigure.style.webkitAnimation = "";
//             //     // navMenuClose();
//             // }
//         }
//     });

//     scroll(loop);
// }

// loop();
// function isElementInViewport(element) {
//   // special bonus for those using jQuery
//   if (typeof jQuery === "function" && element instanceof jQuery) {
//     element = element[0];
//   }
//   let rect = element.getBoundingClientRect();
//   return (
//     (rect.top <= 0
//       && rect.bottom >= 0)
//     ||
//     (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.top <= (window.innerHeight || document.documentElement.clientHeight))
//     ||
//     (rect.top >= 0 &&
//       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
//   );
// }
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const navbarLogin = $('.navbar__login');

const featureImage = $('.feature__img')
const featureParagraph = $('.feature__paragraph')
const featureImageHelper = $('.feature__img-helper')

const pickerDragAndDrop = $('.picker__dragndrop')
const pickerDarkmode = $('.picker__darkmode')
const pickerCollaboration = $('.picker__collaboration')


navbarLogin.addEventListener('click', () => {
    if (sessionStorage.getItem("userId")) {
        location.href = "./app/dashboard.html"
    } else {
        location.href = "./login2.html";
    }
})

if (sessionStorage.getItem('userId')) {
    navbarLogin.innerText = "Dashboard"
} 

pickerDragAndDrop.addEventListener('click', () => {
    featureImage.src = "./assets/img/homepage/dnd.svg";
    featureImageHelper.style.display = "block";
    pickerDragAndDrop.classList.add("pick");
    pickerDarkmode.classList.remove("pick");
    pickerCollaboration.classList.remove("pick");
})

pickerDarkmode.addEventListener('click', () => {
    featureImage.src = "./assets/img/homepage/darkmode.svg";
    featureImageHelper.style.display = "none";
    pickerDragAndDrop.classList.remove("pick");
    pickerDarkmode.classList.add("pick");
    pickerCollaboration.classList.remove("pick");
})

pickerCollaboration.addEventListener('click', () => {
    featureImage.src = "./assets/img/homepage/collaboration.svg";
    featureImageHelper.style.display = "none";
    pickerDragAndDrop.classList.remove("pick");
    pickerDarkmode.classList.remove("pick");
    pickerCollaboration.classList.add("pick");
})

// const line = $('.line');
// const navbarItems = $$('.navbar__item');
// const leftIndex = line.style.left;
// const lineWidth = line.style.width;

// line.style.left = leftIndex + "px";
// line.style.width = lineWidth + "px";  

// navbarItems.forEach(function(item, index) {
//     item.addEventListener('mouseover', function() {
//         if(this.querySelector(":hover")){
//             console.log("hovering");
//             line.style.left = this.offsetLeft + "px";
//             line.style.width = this.offsetWidth + "px";
//         }
//     });
// })

// Help me with this!!!!




      