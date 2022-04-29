const loginSwitch = $('#login-switch')
const signUpSwitch = $('#sign-up-switch')
const loginForm = $('.sign-in-wrapper')
const signUpForm = $('.sign-up-wrapper')
const returnHome = $$('.return-home')


window.addEventListener("keyup", handleSignInKeyUp)


signUpSwitch.addEventListener('click', () => {
    loginForm.classList.add('disable')
    loginForm.classList.remove('enable')
    signUpForm.classList.remove('disable')
    signUpSwitch.classList.add('enable')
    console.log("remove sign in");
    window.removeEventListener("keyup", handleSignInKeyUp);
    window.addEventListener("keyup", handleSignUpKeyUp);
})

loginSwitch.addEventListener('click', () => {
    loginForm.classList.remove('disable')
    loginForm.classList.add('enable')
    signUpForm.classList.add('disable')
    signUpSwitch.classList.remove('enable')
    console.log("remove sign up")
    window.removeEventListener("keyup", handleSignUpKeyUp)
    window.addEventListener("keyup", handleSignInKeyUp)

    
})

function handleSignUpKeyUp(event) {
    console.log("from sign up");
    event.preventDefault()
    if (event.keyCode === 13) {
        signUpBtn.click();
    }
}

function handleSignInKeyUp(event) {
    console.log("from sign in");
    event.preventDefault()
    if (event.keyCode === 13) {
        signInBtn.click();
    }
}


for (returnHomeBtn of returnHome) {
    returnHomeBtn.addEventListener('click', () => {
        location.assign("/index.html")
    })
}