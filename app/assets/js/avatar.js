const userTaskWrapper = $(".user-task__wrapper");
const userAvatar = $(".user-avatar");
function renderUserNavbar() {
    console.log("yes")
}

userAvatar.onerror = () => {
    userAvatar.classList.add('disable');
}

const avatar = $(".user-text-avatar")
userTaskWrapper.addEventListener('click', () => {
    location.href = './profile.html'
})

function renderAvatarFromName() {

        userAvatar.classList.add("disable")
        console.log("SDF")
        let nameList = sessionStorage.getItem("userName").split(" ");
        let processedName = nameList[0][0] + nameList[nameList.length - 1][0];
        avatar.innerText = processedName.toUpperCase();

        userAvatar.classList.remove("disable")
        userAvatar.src = sessionStorage.getItem("userAvatar")
    
}

renderUserNavbar()
renderAvatarFromName()