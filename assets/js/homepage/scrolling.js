let scrollFeature = document.querySelector(".js__scrolling");
let mainContent = document.querySelector("#content__main");
if (mainContent.getBoundingClientRect().top < ((-1) * (mainContent.clientHeight / 2.75))) {
    // scroll down
    // scrollFeature.style.display = "block";
    // scrollFeature.classList.remove("feature-bar-ani-disappear");
    scrollFeature.classList.add("feature-bar-ani-appear");
    // scrollFeature.className = 'feature-bar-ani-appear';
    scrollFeature.style.display = "block";
}
else {

    // const secondFunction = async () => {
    //     firstFunction();
    //     scrollFeature.style.display = "none";
    //   }

    //   firstFunction(function() {
    //     scrollFeature.style.display = "none";
    // });    
    // scrollFeature.className = 'feature-bar-ani-disappear';
    scrollFeature.classList.remove("feature-bar-ani-appear");
    setTimeout(function() {
        scrollFeature.style.display = "none";
    }, 1000);
}
// scroll();


function firstFunction(_callback) {
    scrollFeature.classList.remove("feature-bar-ani-appear");
    scrollFeature.classList.add(".feature-bar-ani-disappear");
    _callback();
}
function scroll() {
    window.addEventListener("scroll", (e) => {
        // if scroll to the special height of main content -> appear feature bar
        
    });
}