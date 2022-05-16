const userTaskWrapper = $(".user-task__wrapper");
const userAvatar = $(".user-avatar");
var lastLocation = '';
// No avatar or unable to load avatar
userAvatar.onerror = () => {
    userAvatar.classList.add('disable');
    avatar.classList.remove('disable');
}

userAvatar.onload = () => {
    if (userAvatar.width > userAvatar.height) {
        userAvatar.style.height = "36px";
        userAvatar.style.width = "auto";
    }
}


// Routing
const avatar = $(".user-text-avatar")
userTaskWrapper.addEventListener('click', () => {
    lastLocation = location.href.toString();
    sessionStorage.setItem("lastLocation", location.href.toString());
    location.replace('./profile.html')
})


// Render google like name avatar
function renderAvatarFromName() {
        userAvatar.classList.add("disable")
        let nameList = sessionStorage.getItem("userName").split(" ");
        let processedName = nameList[0][0] + nameList[nameList.length - 1][0];
        avatar.innerText = processedName.toUpperCase();
        userAvatar.classList.remove("disable")
        userAvatar.src = sessionStorage.getItem("userAvatar")
    
}

renderAvatarFromName()