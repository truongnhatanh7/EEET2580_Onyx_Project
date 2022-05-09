const userTaskWrapper = $(".user-task__wrapper");
const userAvatar = $(".user-avatar");

// No avatar or unable to load avatar
userAvatar.onerror = () => {
    userAvatar.classList.add('disable');
    avatar.classList.remove('disable');
}


// Routing
const avatar = $(".user-text-avatar")
userTaskWrapper.addEventListener('click', () => {
    location.href = './profile.html'
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