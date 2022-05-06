const userTaskWrapper = $(".user-task__wrapper");
const userName = $(".user-list-img__name");
const userAvatar = $(".user-avatar");
function renderUserNavbar() {
    userName.innerText = sessionStorage.getItem("userName");
}

const avatar = $(".user-text-avatar")
userTaskWrapper.addEventListener('click', () => {
    location.href = './profile.html'
})

function renderAvatarFromName() {
    if (sessionStorage.getItem("userAvatar") == undefined
    || sessionStorage.getItem("userAvatar") == null
    || sessionStorage.getItem("userAvatar") == ''
    ) {
        let nameList = sessionStorage.getItem("userName").split(" ");
        let processedName = nameList[0][0] + nameList[nameList.length - 1][0];
        avatar.innerText = processedName.toUpperCase();
        console.log("fadfads");
    } else {
        userAvatar.src = sessionStorage.getItem("userAvatar")
    }
}