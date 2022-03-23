
let scrollContent = $('#content');
let cards = $('.card');
let cardBackgrounds = $('.card-content-illus');

let cardIllustrationUrls = [
    "/assets/img/homepage-content-cards/dragdrop.png",
    "/assets/img/homepage-content-cards/collab.png"
];
for (let i = 0; i < cardIllustrationUrls.length; i ++) {
    $(cardBackgrounds[i]).css("background-image", 'url("' + cardIllustrationUrls[i] + '")');
}


let yPosiScroll = $(cards[0]).offset().top;
console.log(yPosiScroll);
$(window).on('scroll', function() {
    let yOffset = window.pageYOffset;
    // yPosiScroll = 700;
    if (yOffset > yPosiScroll && yOffset <(yPosiScroll + 100))
        console.log(yOffset);

});


