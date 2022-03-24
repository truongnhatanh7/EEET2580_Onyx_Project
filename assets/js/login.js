const signUpButton = document.getElementsByClassName('signup-btn')[0];
const logInButton = document.getElementsByClassName('login-btn')[0];

const panel = document.getElementById('pink-panel');
const container = document.getElementsByClassName('login-container')[0];
const signUpForm = document.getElementsByClassName('signup-container')[0];


signUpButton.addEventListener('click', () => {
    panel.classList.add('right-panel-active');
    container.classList.add('form-container-active');
    signUpForm.classList.add('signup-form-active');
});

logInButton.addEventListener('click', () => {
    panel.classList.remove('right-panel-active');
    container.classList.remove('form-container-active');
    signUpForm.classList.remove('signup-form-active');
});
