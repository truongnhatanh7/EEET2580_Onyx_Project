
let scrollContent = $('#content');
let cards = $('.card');

let yPosiScroll = $(cards[0]).offset().top;
console.log(yPosiScroll);
$(window).on('scroll', function() {
    let yOffset = window.pageYOffset;
    // yPosiScroll = 700;
    if (yOffset > yPosiScroll && yOffset <(yPosiScroll + 100))
        console.log(yOffset);

});


