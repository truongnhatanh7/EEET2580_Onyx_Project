"use strict";

const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");
const addTaskBtn = $(".workspace__add-task-btn");
const board = $(".workspace__board");
const darkModeSwitch = $(".workspace__switch-input");
const darkModeBtn = $(".workspace__navbar-darkmode-wrapper");
const currentTheme = localStorage.getItem("theme");
const tasks = $$(".workspace__board-list-task");
const lists = $$(".workspace__board-list");
const addListSection = $(".workspace__add-wrapper");
const submitList = $(".workspace__submit-btn");
const closeSubmitList = $(".workspace__list-close");
const listNameInput = $(".workspace__add-input");
const toastBox = $(".toast-wrapper");
const toastMessage = $(".toast-message");

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

////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("onmousedown", (event) => {
    sessionStorage.setItem("isEditing", "1");
});

document.addEventListener("onmouseup", (event) => {
    sessionStorage.setItem("isEditing", "0");
});

document.addEventListener("click", (event) => {
    if (
        event.target.closest(".workspace__add-list-wrapper") == null &&
        event.target != addListBtn
    ) {
        // Escape add list
        closeSubmitList.click();
    }

    // let currentList = board.querySelector('.modifying');
    let outsideClick = false;
    let lists = board.querySelectorAll(
        ".workspace__board-list:not(.modifying)"
    );

    lists.forEach((element) => {
        if (element == event.target) {
            outsideClick = true;
        }
    });

    if (event.target == board) {
        handleCloseTaskAdd();
    } else if (outsideClick) {
        handleCloseTaskAdd();
    } else if (event.target == addListBtn) {
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
            throwInvalidInput();
            return;
        }
        let createListUrl =
            "http://localhost:8080/api/v1/list/" +
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
                    <h1 class="workspace__board-list-header" >
                      ${listName}
                    </h1>
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
        throwToastLongListName();
    } else {
        throwToastEmptyListName();
    }
});

function resetAddListBtn() {
    addListSection.classList.remove("enable");
    addListSection.classList.add("disable");
    addListBtn.classList.remove("disable");
    addListBtn.classList.add("enable");
}

function throwToastLongListName() {
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = "List name is too long!";
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}

function throwToastEmptyListName() {
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = "List name cannot be empty";
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}

function handleDeleteList(event) {
    let deleteListUrl =
        "http://localhost:8080/api/v1/list/" +
        event.target.parentNode.parentNode.id.slice(5).toString();
    fetch(deleteListUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    event.target.parentNode.parentNode.remove();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

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
        sessionStorage.setItem("isEditing", "0");
    }
}

function triggerModifying(event) {
    event.stopPropagation();
    event.target.parentNode.classList.add("modifying");
    event.target.classList.add("disable");
    event.target.classList.remove("enable");
    sessionStorage.setItem("isEditing", "1");
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
        console.log("DB Task add called");
        let currentList = $("#list_" + currentListId);
        let allTasks = currentList.querySelectorAll(
            ".workspace__board-list-task"
        );

        if (taskInput.value != "" && taskInput.value.length < 50) {
            let createTaskUrl =
                "http://localhost:8080/api/v1/task/" + currentListId.toString();
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
                      <p
                        class="workspace__board-list-task-content"

                      >
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
            throwToastLongTaskName();
        } else {
            throwToastEmptyTaskName();
        }
    }, 150);
}

function rapidInputTask(event, taskFactory, taskInput) {
    event.target.classList.remove("disable");
    event.target.classList.add("enable");
    taskFactory.classList.add("disable");
    taskFactory.classList.remove("enable");
    taskInput.value = "";
    event.target.parentNode.classList.remove("modifying");
    event.target.parentNode.querySelector(".workspace__add-task-btn").click();
}

function throwToastLongTaskName() {
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = "Task content too long!";
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}

function throwToastEmptyTaskName() {
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = "Task content cannot be empty!";
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}

////////////////////////////////
// Task setting

const taskSetting = $(".workspace__task-setting");
const taskSettingInner = $(".workspace__task-setting-wrapper");
const taskSave = $(".workspace__task-setting-btn");
const taskDelete = $(".workspace__task-delete-btn");
const taskInput = $(".workspace__task-setting-input");
const taskSettingClose = $(".workspace__task-setting-close");
const taskSettingUrgent = $('.workspace__task-setting-urgent')
const taskSettingDesc = $('.workspace__task-setting-desc')
const taskSettingDatepicker = $('.workspace__task-setting-datepicker')
const taskDeadline = $('.workspace__task-deadline');
const datepickerJS = $('.datepicker')
let descContent = ''
let isUrgent = false;
let currentTask = null;
let currentTaskNode = null;

datepicker(taskSettingDatepicker);
taskSettingDatepicker.addEventListener('click', () => {
    datepickerJS.classList.remove('disable');
})

taskSettingUrgent.addEventListener("click", (event) => {
    let priority = "0";
    if (!isUrgent) {
        priority = "1"
    }
    // BUG OX-L1: change this to hidden node in the html, render.js will render fire icon
    // Change button to unmark and vice versa
    console.log(isUrgent);
    let url = 'http://localhost:8080/api/v1/task/setPriority/' + currentTask + "/" + priority
    console.log(url)
    if (currentTask != null) {
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    
    taskSettingClose.click();
})

taskSetting.addEventListener("click", (event) => {
    taskSettingClose.click();
});

taskSettingInner.addEventListener("click", (event) => {
    event.stopPropagation();
});

taskInput.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode == 13) {
        taskSave.click();
    }
});

function handleTaskSetting(event) {
    // Get current task content
    currentTask = event.target.parentNode.id.slice(5);
    currentTaskNode = event.target.parentNode;
    renderTaskSettingUrgent();

    let boundingClientRect = currentTaskNode.getBoundingClientRect();
    sessionStorage.setItem("currentTask", currentTask); // Save current editing task's id
    sessionStorage.setItem("isEditing", "1");
    taskSetting.classList.add("enable");
    taskSetting.classList.remove("disable");

    // Reposition modal
    taskSettingInner.style.top = boundingClientRect.top + "px";
    taskSettingInner.style.left = boundingClientRect.left + "px";
    taskSettingInner.style.transform = "translateX(0)";

    // Take task clickcontent
    taskInput.value = currentTaskNode
        .querySelector(".workspace__board-list-task-content")
        .innerText.trim();
    taskInput.focus();
    renderTaskDesc();
    renderDeadline();
}

function renderDeadline() {
    let deadline = currentTaskNode.querySelector('.workspace__board-list-task-deadline-content.disable').innerText;
    if (deadline != undefined) {
        taskDeadline.innerText = deadline;
    }
}

function renderTaskDesc() {
    descContent = currentTaskNode.querySelector('.workspace__board-list-task-desc.disable').innerText.trim();
    taskSettingDesc.value = descContent;
}

function renderTaskSettingUrgent() {
    isUrgent = currentTaskNode.querySelector('.task-urgent').classList.contains('disable') ? false : true;
    if (isUrgent) {
        taskSettingUrgent.innerText = "Unmark urgent";
    } else {
        taskSettingUrgent.innerText = "Mark as urgent";
    }
    console.log(isUrgent)
}

taskSettingClose.addEventListener("click", (event) => {
    currentTaskNode.querySelector('.workspace__board-list-task-desc.disable').textContent = descContent
    sessionStorage.setItem("isEditing", "0");
    taskInput.value = "";
    taskSetting.classList.add("disable");
    taskSetting.classList.remove("enable");
    // currentTaskNode = null;
});

taskSettingDesc.addEventListener('keyup', (event) => {
    //TODO: Handle input validation desc
    // console.log(taskSettingDesc.value.split("\n"))
    // if(event.keyCode == 13 && taskSettingDesc.value.split("\n").length >= 3) { 
    //     // taskSettingDesc.setAttribute('disabled', "")
    //     return;
    // } 
})

taskSave.addEventListener("click", (event) => {
    let editTaskUrl = "http://localhost:8080/api/v1/task/";
    let newTaskContent = taskInput.value;
    if (newTaskContent.includes("<") || newTaskContent.includes(">")) {
        throwInvalidInput();
        return;
    } 
    if (newTaskContent == "") {
        throwToastEmptyTaskName();
    } else if (newTaskContent != "" && newTaskContent.length > 25) {
        throwToastLongTaskName();
    } else {
        sessionStorage.setItem("currentTaskContent", newTaskContent.trim());
        fetch(editTaskUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskId: sessionStorage.getItem("currentTask"),
                taskContent: newTaskContent,
            }),
        }).then(() => {
            currentTaskNode.querySelector(
                ".workspace__board-list-task-content"
            ).textContent = sessionStorage.getItem("currentTaskContent");

        })
        .then(() => {
            if (taskSettingDesc.value != '') {
                console.log("modiying desc")
                fetch(editTaskUrl + "setDesc/" + sessionStorage.getItem("currentTask"), {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: taskSettingDesc.value.trim()
                })
            }
        })
        .then(() => {
            let editTaskDeadline = "http://localhost:8080/api/v1/task/setDeadline/" + sessionStorage.getItem("currentTask") + "?time=";
            let time = sessionStorage.getItem("deadline");
            if (time != "") {
                fetch(editTaskDeadline + time, {
                    method: 'PATCH' 
                })
                .then(() => {
                    currentTaskNode.querySelector('.workspace__board-list-task-deadline-content.disable').innerText = sessionStorage.getItem("deadline")
                })
                .then(() => {
                    sessionStorage.setItem("deadline", "");
        
                })
            }
        })
        .then(() => {
            sessionStorage.setItem("isEditing", "0");
            taskSettingClose.click();
        })
    }

    
});

taskDelete.addEventListener("click", () => {
    console.log(sessionStorage.getItem("currentTask"));
    let deleteTaskUrl =
        "http://localhost:8080/api/v1/task/" +
        sessionStorage.getItem("currentTask");
    fetch(deleteTaskUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    currentTaskNode.remove();
    taskSettingClose.click();
});

function handleDeleteTask(event) {
    let deleteTaskUrl =
        "http://localhost:8080/api/v1/task/" +
        event.target.parentNode.id.slice(5).toString();
    fetch(deleteTaskUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    event.target.parentNode.remove();
}

////////////////////////////////////////////////////////////////////////
// Dark mode section
////////////////////////////////////////////////////////////////////////

if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
        darkModeSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
}
darkModeSwitch.addEventListener("change", switchTheme);

////////////////////////////////////////////////////////////////////////////////////////////////

//Workspace status

const statusBtn = $(".workspace__navbar-progress-btn");
const workspaceStatus = $(".workspace__status");
const workspaceStatusWrapper = $(".workspace__status-wrapper");
const workspaceStatusTitle = $(".workspace__status-title");
const closeWorkspaceStatus = $(".workspace__status-close-icon");
const preDeleteBtn = $(".workspace__delete-workspace-btn-pre");
const preDeleteWrapper = $(".workspace__delete-confirmation");
const preDeleteInput = $(".workspace__delete-confirmation-input");
const postDeleteBtn = $(".workspace__delete-workspace-btn-post");
const deleteWorkspaceUrl =
    "http://localhost:8080/api/v1/workspace/delete-workspace/";

statusBtn.addEventListener("click", () => {
    workspaceStatus.classList.add("enable");
    workspaceStatus.classList.remove("disable");
    workspaceStatusTitle.focus();
});

workspaceStatusWrapper.addEventListener("click", (event) => {
    event.stopPropagation();
});

workspaceStatus.addEventListener("click", (event) => {
    closeWorkspaceStatus.click();
});

closeWorkspaceStatus.addEventListener("click", () => {
    workspaceStatus.classList.remove("enable");
    workspaceStatus.classList.add("disable");

    preDeleteWrapper.classList.remove("enable");
    preDeleteWrapper.classList.add("disable");
    preDeleteBtn.classList.remove("disable");
    preDeleteBtn.classList.add("enable");
    preDeleteInput.value = "";
});

preDeleteBtn.addEventListener("click", () => {
    preDeleteWrapper.classList.add("enable");
    preDeleteWrapper.classList.remove("disable");
    preDeleteBtn.classList.add("disable");
    preDeleteBtn.classList.remove("enable");
});

postDeleteBtn.addEventListener("click", () => {
    if (preDeleteInput.value == "delete this workspace") {
        let url = deleteWorkspaceUrl + sessionStorage.getItem("currentBoardId");

        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(location.assign("./dashboard.html"));
    } else {
        throwInvalidInput();
    }
});

function throwInvalidInput() {
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = "Invalid input";
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}

function throwUnknownError() {
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = "Unknown error";
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}

///////////////////////////////////////////////////////////////
// Collab

const collaboratorList = $(".workspace__collaborator-list");
const addCollaboratorBtn = $(".workspace__add-collaborator-btn");
const addCollaboratorInput = $(".workspace__add-collaborator-input");

fetchUserInWorkspace();

function fetchUserInWorkspace() {
    let workspaceUrl =
        "http://localhost:8080/api/v1/workspace/get-workspace/" +
        sessionStorage.getItem("currentBoardId");
    fetch(workspaceUrl)
        .then((response) => response.json())
        .then((workspace) => {
            workspaceStatusTitle.textContent = workspace.workspaceTitle;
            return workspace.users;
        })
        .then((users) => {
            renderUserInWorkspace(users);
        });
}

function renderUserInWorkspace(users) {
    if (users.length == 0) {
        collaboratorList.innerHTML = "";
        // Warning to delete workspace
        preDeleteInput.value = "delete this workspace";
        postDeleteBtn.click();
        location.assign("./dashboard.html");
    } else {
        collaboratorList.innerHTML = "";
        users.forEach((user) => {
            let tempHtml = `
      <div class="workspace__collaborator" id="user_${user.userId} ">
        <h3 class="workspace__collaborator-name" >${user.name}</h3>
        <i class="fa-solid fa-xmark workspace__collaborator-delete" onclick=handleRemoveCollaborator(event)></i>
      </div>
      `;
            let para = document
                .createRange()
                .createContextualFragment(tempHtml);
            collaboratorList.appendChild(para);
        });
    }
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("workspace__collaborator-delete")) {
        handleRemoveCollaborator(event.target.parentNode.id.slice(5));
    }
});

function handleRemoveCollaborator(event) {
    console.log("Remove collaborator invoked")

    let id = event.target.parentNode.id.slice(5);
    let removeCollaboratorUrl =
        "http://localhost:8080/api/v1/user/remove-user-from-workspace/" +
        sessionStorage.getItem("currentBoardId") +
        "/" +
        id;
    fetch(removeCollaboratorUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(() => {
        fetchUserInWorkspace();
    });
}

addCollaboratorBtn.addEventListener("click", () => {
    if (addCollaboratorInput.value == "") {
        throwInvalidInput();
    } else {
        let getAllUsersUrl = "http://localhost:8080/api/v1/user/all-users/";
        fetch(getAllUsersUrl)
            .then((response) => response.json())
            .then((users) => {
                let found = false;
                users.forEach((user) => {
                    if (user.username == addCollaboratorInput.value) {
                        found = true;
                        handleAddToWorkspace(user);
                    }
                });
                if (!found) {
                    throwUserNotFound();
                }
            });
    }
});

function handleAddToWorkspace(user) {
    let addCollaboratorUrl =
        "http://localhost:8080/api/v1/user/add-workspace-for-user-by-id/" +
        sessionStorage.getItem("currentBoardId") +
        "/" +
        user.userId;
    fetch(addCollaboratorUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(() => {
        fetchUserInWorkspace();
    });
}

function throwUserNotFound(username) {
    toastBox.classList.add("enable");
    toastBox.classList.remove("disable");
    toastMessage.innerHTML = "Username: " + username + " not found!";
    setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000);
}
