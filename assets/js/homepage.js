const featureImage = $('.feature__img')
const featureParagraph = $('.feature__paragraph')
const featureImageHelper = $('.feature__img-helper')

const navbarLogo = $('.navbar__logo')

const pickerDragAndDrop = $('.picker__dragndrop')
const pickerDarkmode = $('.picker__darkmode')
const pickerCollaboration = $('.picker__collaboration')

const discoverBtns = $$('.discover-btn')


discoverBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        location.href = "./login.html"
    })
})

navbarLogo.addEventListener('click', () => {
    location.href = "./"
})


pickerDragAndDrop.addEventListener('click', () => {
    featureImage.src = "./assets/img/homepage/dnd.svg";
    featureImageHelper.style.display = "block";
    featureParagraph.innerText = "Reallocate Task With Ease saving you the hazzel of repeated deleting and creating!"
    pickerDragAndDrop.classList.add("pick");
    pickerDarkmode.classList.remove("pick");
    pickerCollaboration.classList.remove("pick");
    
})

pickerDarkmode.addEventListener('click', () => {
    featureImage.src = "./assets/img/homepage/darkmode.svg";
    featureImageHelper.style.display = "none";
    featureParagraph.innerText = "Brings comfort to your eyes in the dark"
    pickerDragAndDrop.classList.remove("pick");
    pickerDarkmode.classList.add("pick");
    pickerCollaboration.classList.remove("pick");
})

pickerCollaboration.addEventListener('click', () => {
    featureImage.src = "./assets/img/homepage/collaboration.svg";
    featureImageHelper.style.display = "none";
    featureParagraph.innerText = "Real-time sync enable better collaboration and boost productivity"
    pickerDragAndDrop.classList.remove("pick");
    pickerDarkmode.classList.remove("pick");
    pickerCollaboration.classList.add("pick");
})
