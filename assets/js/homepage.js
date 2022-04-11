
// const rallax = new Rellax('.parallax');

// let windowHeight = window.innerHeight;

// document.addEventListener('resize', function() {
// 	windowHeight = window.innerHeight;
// })

// function outerHeight(el) {
// 	let height = el.offsetHeight;
// 	let style = getComputedStyle(el);

// 	height += parseInt(style.marginTop) + parseInt(style.marginBottom);
// 	return height;
// }

// function parallax (el, speedFactor, outerHeight) {
// 	var foo = document.querySelectorAll(el);

// 	var getHeight;
// 	var firstTop;
// 	var paddingTop = 0;

// 	//get the starting position of each element to have parallax applied to it		
// 	foo.forEach(function(subEl){
// 	    firstTop = subEl.getBoundingClientRect().top;
// 	});

// 	if (outerHeight) {
// 		getHeight = function(el) {
// 			return outerHeight(el);
// 		};
// 	} else {
// 		getHeight = function(el) {
// 			return el.clientHeight;
// 		};
// 	}

// 	// function to be called whenever the window is scrolled or resized
// 	function update(){
// 		var pos = window.scrollY;				

// 		foo.forEach(function(subEl){
// 			// var element = subEl;
// 			// var top = element.getBoundingClientRect().top;
// 			// var height = getHeight(element);
      
// 			// element.style.top = -(Math.round((firstTop - pos) * speedFactor)) + "px";
//             subEl.style.transform = "translate(-10%, 15%)";

// 		});
// 	}		
// 	document.addEventListener('scroll', update, true)
// 	document.addEventListener('resize', update)
// 	update()
// };

// parallax(".parallax", -0.6);


// Based on  https://github.com/alvarotrigo/fullPage.js/tree/master/pure%20javascript%20(Alpha)
// Use with caution, still in alpha. I'm trying to avoid jquery ^_^
// fullpage.initialize('#fullpage', {
//     css3:false,
//     scrollBar:true
// });

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
