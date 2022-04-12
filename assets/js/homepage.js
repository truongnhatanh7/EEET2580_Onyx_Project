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
