const loginSwitch = $('#login-switch')
const signUpSwitch = $('#sign-up-switch')
const loginForm = $('.sign-in-wrapper')
const signUpForm = $('.sign-up-wrapper')
const returnHome = $$('.return-home')

signUpSwitch.addEventListener('click', () => {
    loginForm.classList.add('disable')
    loginForm.classList.remove('enable')
    signUpForm.classList.remove('disable')
    signUpSwitch.classList.add('enable')
})

loginSwitch.addEventListener('click', () => {
    loginForm.classList.remove('disable')
    loginForm.classList.add('enable')
    signUpForm.classList.add('disable')
    signUpSwitch.classList.remove('enable')
})


for (returnHomeBtn of returnHome) {
    returnHomeBtn.addEventListener('click', () => {
        location.assign("/index.html")
    })
}