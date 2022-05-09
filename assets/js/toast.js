const toastBox = $(".toast-wrapper");
const toastMessage = $(".toast-message");
const toast = $('.toast')

function throwError(message) {
    toastBox.classList.remove("success");
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toast.style.backgroundColor = "var(--red-pastel)";

    toastMessage.innerHTML = message;
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 3000);
}

function throwSuccess(message) {
    toastBox.classList.add("enable");
    toastBox.classList.add("success");
    toast.style.backgroundColor = "var(--green)";
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = message;
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}