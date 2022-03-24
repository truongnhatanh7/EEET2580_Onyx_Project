const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const username = $('#login-username')
const password = $('#login-password')
const toast = $('.toast-wrapper')
const toastMessage = $('.toast-message')
const signInBtn = $('#sign-in')
const allUsersUrl = "http://localhost:8080/api/v1/user/all-users/"
const createNewUser = "http://localhost:8080/api/v1/user"

signInBtn.addEventListener('click', (event) => {
    event.preventDefault()
    if (username.value == '' || password.value == '') {
        throwToastEmptyFieldLogin()
    } else {
        fetch(allUsersUrl)
            .then(response => response.json())
            .then(data => {
                data.every(user => {
                    if (user.username == username.value && user.password == password.value) {
                        localStorage.setItem("userId", user.userId.toString().trim());
    
                        location.assign("./app/dashboard.html")
                        return false;
                    } else {
                        return true;
                    }
                })
            })
            .then(() => {
                throwToastWrongUsernameOrPassword();
            })
    }
})

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

////////////////////////////////////////////////////////////////////////
const signUpName = $('#name')
const signUpUsername = $('#user-name');
const signUpPassword = $('#user-password');
const signUpPasswordConfirm = $('#confirm-password')
const signUpBtn = $('#sign-up')
console.log(signUpBtn)
signUpBtn.addEventListener('click', () => {
    console.log(signUpPassword.value)
    console.log(signUpPasswordConfirm.value)

    let validCreateUser = true;
    if (signUpPassword.value != signUpPasswordConfirm.value) {
        throwToastMismatchPassowrd()

    } else if (signUpName == '' || signUpUsername.value == '' || signUpPassword.value == '' || signUpPasswordConfirm.value == '') {
        throwToastEmptyField();
    }
    
    else {
        fetch(allUsersUrl)
            .then(response => response.json())
            .then(data => {
   
                data.forEach(user => {
                    console.log(user)
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
    console.log("create new user...")
    fetch(createNewUser, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name:  signUpName.value,
            username: signUpUsername.value,
            password: signUpPassword.value
        }),
    }).then((response) => {
        return response.json()
    })
    .then(data => {
        localStorage.setItem("userId", data.userId.toString().trim());  
        location.assign("./app/dashboard.html")
    })
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

