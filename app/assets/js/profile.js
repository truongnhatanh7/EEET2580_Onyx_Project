if (sessionStorage.getItem('userId') == null) {
    location.assign("../login.html");
}

let lastLocation = sessionStorage.getItem('lastLocation')
const returnBtn = $('.return__wrapper')
returnBtn.addEventListener('click', () => {
    if (lastLocation.includes('dashboard')) {
        location.assign('./dashboard.html')
    } else if (lastLocation.includes('workspace')) {
        location.assign('./workspace.html')
    } else {
        history.back();
    }
})

const modifyEmailTrigger = $('.modify-email-icon');
const modifyEmailWrapper = $('.user-form__modify-email-wrapper');
const modifyPasswordTrigger = $('.modify-password-icon');
const modifyPasswordWrapper = $('.user-form__modify-password-wrapper')
const modifyNameTrigger = $('.modify-name-icon');
const modifyNameWrapper = $('.user-form__modify-name-wrapper')
const modifyAvatarTrigger = $('.modify-avatar-icon')
const modifyAvatarWrapper = $('.user-form__modify-avatar-wrapper')
const modifyThemeTrigger = $('.modify-theme-icon')

const loading = $('.loading')

const emailInput = $('.modify-email-input');
const oldPasswordInput = $('.modify-old-password');
const newPasswordInput = $('.modify-new-password');
const retypeNewPassword = $('.modify-new-password-retype');
const firstNameInput = $('.modify-first-name')
const lastNameInput = $('.modify-last-name')
const avatarInput = $('.modify-avatar')
const themeInput = $('#darkmode-switch')

////////////////////////////////////////////////////////////////////////////////////////////////
// Trigger

modifyThemeTrigger.addEventListener('click', () => {
    themeInput.click();
})

modifyAvatarTrigger.addEventListener('click', () => {
    modifyAvatarWrapper.classList.toggle('disable');
})

modifyEmailTrigger.addEventListener('click', () => {
    modifyEmailWrapper.classList.toggle('disable');
})

modifyPasswordTrigger.addEventListener('click', () => {
    modifyPasswordWrapper.classList.toggle('disable');
})

modifyNameTrigger.addEventListener('click', () => {
    modifyNameWrapper.classList.toggle('disable')
})

const saveBtnEmail = $('.user-form__modify-btn--save-email');
const cancelBtnEmail = $('.user-form__modify-btn--cancel-email')
const saveBtnPassword = $('.user-form__modify-btn--save-password')
const cancelBtnPassword = $('.user-form__modify-btn--cancel-password')
const saveBtnName = $('.user-form__modify-btn--save-name')
const cancelBtnName = $('.user-form__modify-btn--cancel-name')
const saveBtnAvatar = $('.user-form__modify-btn--save-avatar')
const cancelBtnAvatar = $('.user-form__modify-btn--cancel-avatar')

saveBtnAvatar.addEventListener('click', () => {
    loading.classList.remove('disable')
    const url = "https://api.cloudinary.com/v1_1/dbyasuo/image/upload";
    const formData = new FormData();
    console.log(avatarInput.files[0])
    formData.append("file", avatarInput.files[0])
    formData.append("upload_preset", "vdfx4jbe");
    if (avatarInput.files[0].type.includes('image')) {
        fetch(url, {
            method: "POST",
            body: formData
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            fetch("https://onyx2-backend.herokuapp.com/api/v1/user/edit-avatar?" 
            + new URLSearchParams({
                userId: sessionStorage.getItem('userId'),
                avatar: data.url
            }), {
                method: "PATCH"
            })
            .then(() => {
                sessionStorage.setItem("userAvatar", data.url)
            })
        })
        .then(() => {
            throwSuccess("Success")
        })
        .catch(() => {
            throwError("Unexpected error")
        })
        .finally(() => {
            cancelBtnAvatar.click();
            loading.classList.add('disable')
        });
    } else {
        throwError("Invalid file type")
        loading.classList.add('disable')
    }
})

cancelBtnAvatar.addEventListener('click', () => {
    modifyAvatarTrigger.click();
})

saveBtnName.addEventListener('click', () => {
    if (firstNameInput.value != "" && lastNameInput.value != "") {
        loading.classList.remove('disable')
        fetch("https://onyx2-backend.herokuapp.com/api/v1/user/edit-name/" + sessionStorage.getItem("userId") + "/" + firstNameInput.value + " " + lastNameInput.value,
        {
                method: 'PATCH'
        })
        .then(() => {
            cancelBtnName.click();
        })
        .then(() => {
            throwSuccess("Success")
            loading.classList.add('disable')

        })
        .catch(() => {
            throwError("Unexpected error")
        })
        .finally(() => {
            sessionStorage.setItem("userName", firstNameInput.value + " " + lastNameInput.value)
            loading.classList.add('disable')
        })
        
        
    } else {
        throwError("Invalid input")
    }
})

cancelBtnName.addEventListener('click', () => {
    modifyNameTrigger.click();
})

saveBtnEmail.addEventListener('click', () => {
    loading.classList.remove('disable')
    let uniqueEmailFlag = true;
    fetch("https://onyx2-backend.herokuapp.com/api/v1/user/all-users/")
    .then(response => response.json())
    .then((users) => {
        console.log(users)
        users.forEach(user => {
            if (user.username.toLowerCase() == emailInput.value.toLowerCase()) {
                uniqueEmailFlag = false;
            }
        })
    })
    .then(() => {
        if (emailInput.value != "" && emailCheck(emailInput.value) && uniqueEmailFlag) { // TODO: check valid email
            fetch("https://onyx2-backend.herokuapp.com/api/v1/user/edit-username/" + sessionStorage.getItem("userId") + "/" + emailInput.value, {
                method: 'PATCH'
            })
            .then(() => {
                cancelBtnEmail.click();
            })
            .then(() => {
                throwSuccess("Success")
            })
            .catch(() => {
                throwError("Unexpected error")
            })
        } else {
            if (!uniqueEmailFlag) {
                throwError("Please use another email address")
            } else {
                throwError("Invalid email")
            }
        }
    })
    .then(() => {
        emailInput.value = ""
    })
    .catch(() => {
        throwError("Unexpected error")
    })
    .finally(() => {
        loading.classList.add('disable')
    })
})

cancelBtnEmail.addEventListener('click', () => {
    modifyEmailTrigger.click();
})

cancelBtnPassword.addEventListener('click', () => {
    modifyPasswordTrigger.click();
})

saveBtnPassword.addEventListener('click', () => {
    let correctOldPassword = true;
    fetch("https://onyx2-backend.herokuapp.com/api/v1/user/all-users/")
    .then(response => response.json())
    .then((users) => {
        users.forEach(user => {
            if (user.userId == sessionStorage.getItem('userId')
                && user.password != oldPasswordInput.value
            ) {
                correctOldPassword = false;
            }
        })
    }).then(() => {
        if (correctOldPassword && newPasswordInput.value == oldPasswordInput.value) {
            throwError("New password is the old password")
        }
        else if (oldPasswordInput.value == '' 
            || newPasswordInput.value == '' 
            || retypeNewPassword.value == ''
            || !passwordCheck(newPasswordInput.value)
            ) {
            oldPasswordInput.value = ""
            newPasswordInput.value = ""
            retypeNewPassword.value = ""
            if (!correctOldPassword) {
                throwError("Incorrrect old password")
            } else {
                throwError("Invalid password")
            }
        } else {
            fetch("https://onyx2-backend.herokuapp.com/api/v1/user/edit-password/" + sessionStorage.getItem("userId") + "/" + newPasswordInput.value, {
                method: 'PATCH'
            })
            .then(() => {
                oldPasswordInput.value = ""
                newPasswordInput.value = ""
                retypeNewPassword.value = ""
                cancelBtnPassword.click();
            })
            .then(() => {
                throwSuccess("Success")
            })
            .catch(() => {
                throwError("Unexpected error")
            })
        }
    })
    .catch(() => {
        throwError("Unexpected error")
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// Sign out

const signOutBtn = $('.sign-out-btn')
signOutBtn.addEventListener('click', () => {
    // sessionStorage.removeItem('userId');
    sessionStorage.clear();
    localStorage.clear();
    location.href = "../index.html";
})


