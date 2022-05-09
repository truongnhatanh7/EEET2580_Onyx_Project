

////////////////////////////////////////////////////////////////////////
// Dark mode section
////////////////////////////////////////////////////////////////////////

const darkModeSwitch = $(".workspace__switch-input");
const darkModeBtn = $(".workspace__navbar-darkmode-wrapper");
const darkIcon = $(".workspace-darkmode");
const lightIcon = $(".workspace-lightmode");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
        darkIcon.classList.add('disable');
        darkModeSwitch.checked = true;
    } else {
        lightIcon.classList.add('disable');
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        darkIcon.classList.add('disable');
        lightIcon.classList.remove('disable');
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        darkIcon.classList.remove('disable');
        lightIcon.classList.add('disable');
    }
}
darkModeSwitch.addEventListener("change", switchTheme);