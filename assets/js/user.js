const username = $('#sign-in-username')
const password = $('#sign-in-password')
const signInBtn = $('#sign-in-btn')
const allUsersUrl = "http://localhost:8080/api/v1/user/all-users/"
const createNewUser = "http://localhost:8080/api/v1/user"
const showPassword = $('.show-password')
let isShownPassword = false;

showPassword.addEventListener("click", () => {
    showPassword.classList.toggle('show-password-icon')
    if (isShownPassword) {
        password.type = "password"
        isShownPassword = false
    } else {
        password.type = "text"
        isShownPassword = true
    }
})

signInBtn.addEventListener('click', (event) => {
    event.preventDefault()
    let canLogin = false;

    if (username.value == '' || password.value == '') {
        throwError("You must fill all fields")
    } 
    else if (!emailCheck(username.value)) {
        throwError("Invalid email")
    }
    else {
        fetch(allUsersUrl)
            .then(response => response.json())
            .then(data => {
                data.every(user => {
                    if (user.username == username.value && user.password == password.value) {
                        sessionStorage.setItem("userId", user.userId.toString().trim());
                        sessionStorage.setItem("userAvatar", user.avatarURL)
                        sessionStorage.setItem("userName", user.name)
                        location.assign("./app/dashboard.html")

                        canLogin = true;
                        return false;
                    } else {
                        return true;
                    }
                })
                
                if (!canLogin) {
                    throwError("Wrong username or password")
                }
            })
            .catch(() => {
                throwError("The server is down for maintenance. Sorry about that")
            })

    }
})

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const signUpName = $('#sign-up-name')
const signUpFirstName = $('#sign-up-first')
const signUpLastName = $('#sign-up-last')
const signUpUsername = $('#sign-up-username');
const signUpPassword = $('#sign-up-password');
const signUpPasswordConfirm = $('#sign-up-password-retype')
const signUpBtn = $('#sign-up-btn')

signUpBtn.addEventListener('click', () => {
    let validCreateUser = true;
    if (signUpPassword.value != signUpPasswordConfirm.value) {
        throwError("Mismatch password confirmation")

    } else if (signUpFirstName.value == '' || signUpLastName.value == '' || signUpUsername.value == '' || signUpPassword.value == '' || signUpPasswordConfirm.value == '') {
        throwError("You must fill all fields")
    } else if (!emailCheck(signUpUsername.value)) {
        throwError("Invalid email")
    } else if (!passwordCheck(signUpPassword.value)) {
        throwError("Password must have normal characters, uppercase characters, digits, and special characters")
    }
    else {
        fetch(allUsersUrl)
            .then(response => response.json())
            .then(data => {
                data.forEach(user => {

                    if (user.username == signUpUsername.value) {
                        validCreateUser = false;
                    } 
                })
            })
            .then(() => {
                if (validCreateUser) {
                    createNewUserAPI()
                } else {
                    throwError("Invalid information, this account information is already in used")
                }
            })
            .catch(() => {
                throwError("The server is down for maintenance. Sorry about that")
            })
    }
})

function createNewUserAPI() {
    fetch(createNewUser, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name:  signUpFirstName.value + " " + signUpLastName.value,
            username: signUpUsername.value,
            password: signUpPassword.value
        }),
    }).then((response) => {
        return response.json()
    })
    .then(data => {
        sessionStorage.setItem("userId", data.userId.toString().trim());
        sessionStorage.setItem("userAvatar", "")
        sessionStorage.setItem("userName", data.name)
        location.assign("./app/dashboard.html")

    })
    .catch(() => {
        throwError("The server is down for maintenance. Sorry about that")
    })
}