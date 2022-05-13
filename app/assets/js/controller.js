"use strict";

const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");
const addTaskBtn = $(".workspace__add-task-btn");
const board = $(".workspace__board");

const tasks = $$(".workspace__board-list-task");
const lists = $$(".workspace__board-list");
const addListSection = $(".workspace__add-wrapper");
const submitList = $(".workspace__submit-btn");
const closeSubmitList = $(".workspace__list-close");
const listNameInput = $(".workspace__add-input");

const loading = $('.loading')

////////////////////////////////////////////////////////////////////////////////
// Board

board.addEventListener("wheel", (event) => {
    if (!event.deltaY) {
        return;
    }
    if (event.target.classList.contains("workspace__board")) {
        event.target.scrollLeft += event.deltaY + event.deltaX;
        event.preventDefault();
    }
});

fetchOwner();
function fetchOwner() {
    loading.classList.remove('disable')
    fetch("https://onyx2-backend.herokuapp.com/api/v1/workspace/get-owner/" + sessionStorage.getItem("currentBoardId"))
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem("currentOwnerId", data);
    })
    .catch(() => {
        throwError("Unexpected error, cannot fetch owner")
    })
    .finally(() => {
        loading.classList.add('disable')
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////


document.addEventListener("click", (event) => {
    event.stopPropagation();
    if (
        event.target.closest(".workspace__add-list-wrapper") == null &&
        event.target != addListBtn
    ) {
        // Escape add list
        closeSubmitList.click();
    }

    let outsideClick = false;
    let lists = board.querySelectorAll(
        ".workspace__board-list:not(.modifying)"
    );

    lists.forEach((element) => {
        if (element == event.target) {
            outsideClick = true;
        } 
    });

    if (event.target == board 
        || outsideClick
        || event.target == addListBtn
        || event.target.classList.contains("workspace__board-list-task-edit")
        ) {
        event.preventDefault();
        handleCloseTaskAdd();
    }


});

////////////////////////////////////////////////////////////////////////////////////////////////

addListBtn.addEventListener("click", (event) => {
    addListSection.classList.add("enable");
    addListSection.classList.remove("disable");
    addListBtn.classList.add("disable");
    addListBtn.classList.remove("enable");
    listNameInput.focus();
    listNameInput.value = "";
    addListBtn.scrollIntoView();
});

closeSubmitList.addEventListener("click", (event) => {
    addListSection.classList.remove("enable");
    addListSection.classList.add("disable");
    addListBtn.classList.remove("disable");
    addListBtn.classList.add("enable");
});

listNameInput.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        submitList.click();
        addListBtn.click();
    }
});

submitList.addEventListener("click", (event) => {
    if (listNameInput.value != "" && listNameInput.value.length < 25) {
        let listName = listNameInput.value;
        if (listName.includes("<") || listName.includes(">")) {
            throwError("Invalid input")
            return;
        }
        let createListUrl =
            "https://onyx2-backend.herokuapp.com/api/v1/list/" +
            sessionStorage.getItem("currentBoardId").toString();
        fetch(createListUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: listNameInput.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                let html = `  
                <div class="workspace__board-list" id="${
                    "list_" + data.listId
                }">
                <div class="workspace__board-list-header-wrapper">
                    <h1 class="workspace__board-list-header" >${
                        listName
                    }</h1>
                    <i class="fa-solid fa-xmark workspace__board-list-delete workspace__board-list-delete-icon" onclick="handleDeleteList(event)"></i>
                </div>

                <div class="workspace__board-list-scrollable" ondragover="handleDragOver(event)">
                
                </div>

                    <button class="workspace__add-task-btn btn" onclick="handleAddTask(event)">Add task</button>
                    <div class="workspace__add-task-wrapper">
                        <h2 class="workspace__submit-title">Enter new task:</h2>
                        <input type="text" class="workspace__add-input-task">
                        <button class="workspace__submit-task-btn btn">Create</button>
                        <button class="workspace__task-close-btn btn">
                            <i class="fa-solid fa-xmark workspace__task-close"></i>
                        </button>
                    </div>
                </div>
                `;
                let para = document
                    .createRange()
                    .createContextualFragment(html);
                board.insertBefore(para, addListBtnWrapper);
            })
            .then(() => {
                addListBtn.click(); // Rapid insert
                addListSection.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest",
                });
            });
        resetAddListBtn();
    } else if (listNameInput.value != "" && listNameInput.value.length >= 25) {
        throwError("List name is too long!");
    } else {
        throwError("Empty list name");
    }
});

function resetAddListBtn() {
    addListSection.classList.remove("enable");
    addListSection.classList.add("disable");
    addListBtn.classList.remove("disable");
    addListBtn.classList.add("enable");
}

////////////////////////////////////////////////////////////////
const delListConfirmationBox = $('.workspace__list-del-confirmation-wrapper')
const delListConfirmation = $('.workspace__list-del-confirmation')
const delListConfirmationHeader = $('.list-del__message')
const delListConfirmationAccept = $('.list-del__accept')
const delListConfirmationDecline = $('.list-del__decline')
let toBeDeleteListId = -1;

delListConfirmationBox.addEventListener('click', (event) => {
    if (event.target.classList.contains("workspace__list-del-confirmation-wrapper")) {
        delListConfirmationDecline.click();
    }
})

function handleDeleteList(event) {
    delListConfirmationBox.classList.remove('disable')
    delListConfirmationHeader.innerText = "Do you want to remove \"" + event.target.parentNode.querySelector(".workspace__board-list-header").innerText + "\" ?" 
    toBeDeleteListId = event.target.parentNode.parentNode.id.slice(5).toString();

}

delListConfirmationAccept.addEventListener("click", () => {
    let deleteListUrl = "https://onyx2-backend.herokuapp.com/api/v1/list/" + toBeDeleteListId
    fetch(deleteListUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(() => {
        delListConfirmationDecline.click();
    })
    .then(() => {
        throwSuccess("Deleted")
    });
})

delListConfirmationDecline.addEventListener("click", () => {
    delListConfirmationBox.classList.add('disable')
})




///////////////////////////////////////////////////////////////////////////////////////////////////////
// Task


function handleCloseTaskAdd() {
    let currentModifier = board.querySelector(
        ".workspace__board-list.modifying"
    );
    if (currentModifier) {
        let taskFactory = currentModifier.querySelector(
            ".workspace__add-task-wrapper"
        );
        taskFactory.classList.remove("enable");
        taskFactory.classList.add("disable");
        let addTaskBtn = currentModifier.querySelector(
            ".workspace__add-task-btn.disable.btn"
        );
        addTaskBtn.classList.add("enable");
        addTaskBtn.classList.remove("disable");
        currentModifier.classList.remove("modifying");
    }
}

function triggerModifying(event) {
    event.stopPropagation();
    event.target.parentNode.classList.add("modifying");
    event.target.classList.add("disable");
    event.target.classList.remove("enable");
}

function submitTaskByKeyboard(event, taskBtn) {
    event.preventDefault();
    if (event.keyCode == 13) {
        taskBtn.click();
    }
}

function handleAddTask(event) {
    if (
        !board.querySelector(".modifying") &&
        addListSection.classList.contains("disable")
    ) {
        triggerModifying(event);

        let currentListId = event.target.parentNode.id.slice(5);
        let tempArray = event.target.parentNode.childNodes;
        let taskFactory = tempArray[tempArray.length - 2];
        taskFactory.classList.add("enable");
        taskFactory.classList.remove("disable");

        let taskInput = taskFactory.querySelector(".workspace__add-input-task");
        let taskBtn = taskFactory.querySelector(".workspace__submit-task-btn");
        taskInput.focus();
        taskInput.addEventListener("keyup", (event) => {
            submitTaskByKeyboard(event, taskBtn);
        });

        let closeBtn = event.target.parentNode.querySelector(
            ".workspace__task-close-btn"
        );
        closeBtn.addEventListener("click", handleCloseTaskAdd);
        closeBtn.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
        });

        taskBtn.onclick = debounceTaskAdd(
            event,
            taskFactory,
            taskInput,
            currentListId
        );
    } else {
        handleCloseTaskAdd();
    }
}

function debounceTaskAdd(event, taskFactory, taskInput, currentListId) {
    return debounce(function () {

        let currentList = $("#list_" + currentListId);
        let allTasks = currentList.querySelectorAll(
            ".workspace__board-list-task"
        );
        handleCloseTaskAdd();
        if (taskInput.value != "" && taskInput.value.length < 50) {
            let createTaskUrl =
                "https://onyx2-backend.herokuapp.com/api/v1/task/" + currentListId.toString();
            fetch(createTaskUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskContent: taskInput.value,
                    pos: allTasks.length, // Set last position in the list
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    let html = `  
                        <div
                        class="workspace__board-list-task"
                        draggable="true"
                        ondragstart="handleDragStart(event)"
                        ondragend="handleDragEnd(event)"
                        id="${"task_" + data.taskId}"
                        >
                            <p class="workspace__board-list-task-content">
                                ${taskInput.value}
                            </p>
                            <i class="fa-solid fa-pen workspace__board-list-task-edit" onclick="handleTaskSetting(event)"></i>
                        </div>
                    `;

                    let para = document
                        .createRange()
                        .createContextualFragment(html);
                        event.target.parentNode
                        .querySelector(".workspace__board-list-scrollable")
                        .appendChild(para);
                })
                .then(() => {
                    rapidInputTask(event, taskFactory, taskInput);
                });
        } else if (taskInput.value != "" && taskInput.value.length >= 50) {
            throwError("Long task name")
        } else {
            throwError("Empty task name");
        }
    }, 150);
}

function rapidInputTask(event, taskFactory, taskInput) {
    // event.target.classList.remove("disable");
    // event.target.classList.add("enable");
    // taskFactory.classList.add("disable");
    // taskFactory.classList.remove("enable");
    // taskInput.value = "";
    // event.target.parentNode.classList.remove("modifying");
    // event.target.parentNode.querySelector(".workspace__add-task-btn").click();
}