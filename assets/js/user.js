const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const username = $('#sign-in-username')
const password = $('#sign-in-password')
const toast = $('.toast-wrapper')
const toastMessage = $('.toast-message')
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
        throwToastEmptyFieldLogin();
    } 
    else if (!emailCheck(username.value)) {
        throwInvalidEmail();
    }
    else {
        fetch(allUsersUrl)
            .then(response => response.json())
            .then(data => {
                data.every(user => {
                    if (user.username == username.value && user.password == password.value) {
                        localStorage.setItem("userId", user.userId.toString().trim());
                        localStorage.setItem("login_timestamp", new Date());
                        sessionStorage.setItem("userId", user.userId.toString().trim());
                        sessionStorage.setItem("userName", user.name)
                        location.assign("./app/dashboard.html")

                        canLogin = true;
                        return false;
                    } else {
                        return true;
                    }
                })
                
                if (!canLogin) {
                    throwToastWrongUsernameOrPassword();
                }
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
        throwToastMismatchPassowrd()

    } else if (signUpFirstName.value == '' || signUpLastName.value == '' || signUpUsername.value == '' || signUpPassword.value == '' || signUpPasswordConfirm.value == '') {
        throwToastEmptyField();
    } else if (!emailCheck(signUpUsername.value)) {
        throwInvalidEmail()
    } else if (!passwordCheck(signUpPassword.value)) {
        throwInvalidPassword()
    }
    else {
        fetch(allUsersUrl)
            .then(response => response.json())
            .then(data => {
                data.forEach(user => {
                    if (user.username == signUpUsername.value) {
                        console.log("Existed username")
                        throwToastExistedUsername()
                        validCreateUser = false;
                    } 
                })
            })
            .then(() => {
                if (validCreateUser) {
                    createNewUserAPI()
                }
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
        localStorage.setItem("userId", data.userId.toString().trim());  
        sessionStorage.setItem("userId", data.userId.toString().trim());
        localStorage.setItem("login_timestamp", new Date());
        sessionStorage.setItem("userName", data.name)
        location.assign("./app/dashboard.html")

    })
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// Toast

function throwInvalidPassword() {
    toast.classList.add('enable');
    toast.classList.remove('disable');
    toastMessage.textContent = "Password has to be between 8 to 15 characters which contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric digit, 1 special character";
    setTimeout(() => {

        toast.classList.add('disable');
        toast.classList.remove('enable');
    }, 2000);        
}

function throwInvalidEmail() {
    toast.classList.add('enable');
    toast.classList.remove('disable');
    toastMessage.textContent = "Invalid email format";
    setTimeout(() => {

        toast.classList.add('disable');
        toast.classList.remove('enable');
    }, 2000);    
}

function throwToastEmptyFieldLogin() {
    toast.classList.add('enable');
    toast.classList.remove('disable');
    toastMessage.textContent = "You must fill all fields";
    setTimeout(() => {

        toast.classList.add('disable');
        toast.classList.remove('enable');
    }, 1000);
}


function throwToastWrongUsernameOrPassword() {
    toast.classList.add('enable');
    toast.classList.remove('disable');
    toastMessage.textContent = "Wrong username or password";
    setTimeout(() => {
        toast.classList.add('disable');
        toast.classList.remove('enable');
    }, 1000);
}

function throwToastExistedUsername() {
    toast.classList.add('enable');
    toast.classList.remove('disable');
    toastMessage.textContent = "This username is already in use";
    setTimeout(() => {
        toast.classList.add('disable');
        toast.classList.remove('enable');
    }, 1000);
}

function throwToastMismatchPassowrd() {
    toast.classList.add('enable');
    toast.classList.remove('disable');
    toastMessage.textContent = "Confirmation passward does not match";
    setTimeout(() => {
        toast.classList.add('disable');
        toast.classList.remove('enable');
    }, 1000);
}

function throwToastEmptyField() {
    toast.classList.add('enable');
    toast.classList.remove('disable');
    toastMessage.textContent = "You must fill all fields";
    setTimeout(() => {
        toast.classList.add('disable');
        toast.classList.remove('enable');
    }, 1000);  
}

//////  //////////////////////////////////////////////////////////////////
// Regex

function emailCheck(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}

function passwordCheck(password) {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password)) {
        return true
    }
    return false
}

