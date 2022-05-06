if (sessionStorage.getItem('userId') == null) {
    location.href = "../login.html";
}

const returnBtn = $('.return__wrapper')

returnBtn.addEventListener('click', () => {
    history.back();
})

const modifyEmailTrigger = $('.modify-email-icon');
const modifyEmailWrapper = $('.user-form__modify-email-wrapper');
const modifyPasswordTrigger = $('.modify-password-icon');
const modifyPasswordWrapper = $('.user-form__modify-password-wrapper')
const modifyNameTrigger = $('.modify-name-icon');
const modifyNameWrapper = $('.user-form__modify-name-wrapper')
const modifyAvatarTrigger = $('.modify-avatar-icon')
const modifyAvatarWrapper = $('.user-form__modify-avatar-wrapper')

const emailInput = $('.modify-email-input');
const oldPasswordInput = $('.modify-old-password');
const newPasswordInput = $('.modify-new-password');
const retypeNewPassword = $('.modify-new-password-retype');
const firstNameInput = $('.modify-first-name')
const lastNameInput = $('.modify-last-name')
const avatarInput = $('.modify-avatar')

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
    const url = "https://api.cloudinary.com/v1_1/dbyasuo/image/upload";

    const formData = new FormData();
    console.log(avatarInput.files[0])
    formData.append("file", avatarInput.files[0])
    formData.append("upload_preset", "vdfx4jbe");
    fetch(url, {
        method: "POST",
        body: formData
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        fetch("http://localhost:8080/api/v1/user/edit-avatar/" + sessionStorage.getItem("userId") + "/" + data.url)
    });
})

cancelBtnAvatar.addEventListener('click', () => {
    modifyAvatarTrigger.click();
})

saveBtnName.addEventListener('click', () => {
    if (firstNameInput.value != "" && lastNameInput.value != "") {
        fetch("http://localhost:8080/api/v1/user/edit-name/" + sessionStorage.getItem("userId") + "/" + firstNameInput.value + " " + lastNameInput.value,
        {
                method: 'PATCH'
        })
        .then(() => {
            cancelBtnName.click();
        })
        .then(() => {
            throwSuccess("Success")
        })
    } else {
        throwError("Invalid input")
    }
})

cancelBtnName.addEventListener('click', () => {
    modifyNameTrigger.click();
})

saveBtnEmail.addEventListener('click', () => {
    let uniqueEmailFlag = true;
    fetch("http://localhost:8080/api/v1/user/all-users/")
    .then(response => response.json())
    .then((users) => {
        users.forEach(user => {
            if (user.username.toLowerCase() == emailInput.value.toLowerCase()) {
                uniqueEmailFlag = false;
            }
        })
    })
    .then(() => {
        if (emailInput.value != "" && emailCheck(emailInput.value) && uniqueEmailFlag) { // TODO: check valid email
            fetch("http://localhost:8080/api/v1/user/edit-username/" + sessionStorage.getItem("userId") + "/" + emailInput.value, {
                method: 'PATCH'
            })
            .then(() => {
                cancelBtnEmail.click();
            })
            .then(() => {
                throwSuccess("Success")
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
})

cancelBtnEmail.addEventListener('click', () => {
    modifyEmailTrigger.click();
})

cancelBtnPassword.addEventListener('click', () => {
    modifyPasswordTrigger.click();
})

saveBtnPassword.addEventListener('click', () => {
    let correctOldPassword = true;
    fetch("http://localhost:8080/api/v1/user/all-users/")
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
        if (oldPasswordInput.value == '' 
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
            fetch("http://localhost:8080/api/v1/user/edit-password/" + sessionStorage.getItem("userId") + "/" + newPasswordInput.value, {
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
        }
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// Sign out

const signOutBtn = $('.sign-out-btn')
signOutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('userId');
    location.href = "../index.html";
})

