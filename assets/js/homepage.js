document.querySelector(".features__card").addEventListener('scroll', event => {
        var scrollTop = document.querySelector("features__card").scrollTop;
        var scrollHeight = document.querySelector("features__card").scrollHeight; // added
        var offsetHeight = document.querySelector("features__card").offsetHeight;
        // var clientHeight = document.querySelector("features__card").clientHeight;
        var contentHeight = scrollHeight - offsetHeight; // added
        if (contentHeight <= scrollTop) { // modified 
            // Now this is called when scroll end!
            console.log("scroll end");
        }
    },
    false
);
// localStorage.setItem("login_timestamp",  new Date(2022,3,12,16,33,0))
// console.log(localStorage.getItem("login_timestamp"));
// console.log(new Date(localStorage.getItem("login_timestamp")))
// console.log(Date.now() - new Date(localStorage.getItem("login_timestamp")))
let elapsedTime = (Math.round((Date.now() - new Date(localStorage.getItem('login_timestamp'))) / 1000 ) / 3600);
if (elapsedTime > 1) {
    localStorage.removeItem('userId');
}
