

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
let hitSave = false;
let prevPriority;
let descContent = ''
let isUrgent = false;
let currentTask = null;
let currentTaskNode = null;
let taskDelCount = 0;
let oldTaskName = "";



datepicker(taskSettingDatepicker);

taskSettingDatepicker.addEventListener('click', () => {
    datepickerJS.classList.toggle('disable');
})

taskSettingUrgent.addEventListener("click", (event) => {
    let urgentIcon = currentTaskNode.querySelector('.task-urgent')
    urgentIcon.classList.toggle('disable')
    if (urgentIcon.classList.contains('disable')) {
        taskSettingUrgent.innerText = "Mark as urgent"
    } else {
        taskSettingUrgent.innerText = "Unmark urgent"
    }
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
    try {
        hitSave = false;
        // Get current task content
        currentTask = event.target.parentNode.id.slice(5);
        currentTaskNode = event.target.parentNode;
        renderTaskSettingUrgent();
        renderTaskDesc();
        renderDeadline();
        prevPriority = currentTaskNode.querySelector('.task-urgent').classList.contains('disable') ? "0" : "1";
    
        let boundingClientRect = currentTaskNode.getBoundingClientRect();
        sessionStorage.setItem("currentTask", currentTask); // Save current editing task's id
        sessionStorage.setItem("isEditing", "1");
        taskSetting.classList.add("enable");
        taskSetting.classList.remove("disable");
        let windowHeight = window.outerHeight;
        let divisionBreakpoint = Math.floor(windowHeight / 2)
        if (boundingClientRect.top > divisionBreakpoint) { // Reverse column
            taskSettingInner.style.top = (boundingClientRect.top - 334 + 55) + "px";
            taskSettingInner.style.flexDirection = "column-reverse";
            taskSettingDesc.style.marginBottom = "8px";
            datepickerJS.style.top = "74px";
        } else { // Normal column
            taskSettingInner.style.flexDirection = "column";
            taskSettingDesc.style.marginBottom = "0px";
            taskSettingInner.style.top = boundingClientRect.top + "px";
            datepickerJS.style.top = "-8px";
    
        }
        // Reposition modal
        taskSettingInner.style.left = boundingClientRect.left + "px";
        taskSettingInner.style.transform = "translateX(0)";
    
        // Take task clickcontent
        taskInput.value = oldTaskName = currentTaskNode
            .querySelector(".workspace__board-list-task-content")
            .innerText.trim();
        
        taskInput.focus();
    } catch (e) {
        console.log("Fremline close triggered")
    }

}

function renderDeadline() {
    try {
        let deadline = currentTaskNode.querySelector('.workspace__board-list-task-deadline-content.disable').innerText;
        if (deadline != undefined) {
            taskDeadline.innerHTML = "Deadline: " + deadline + '<i class="fa-solid fa-pen deadline-change-icon"></i>';
        }
    } catch (e) {
        console.log("Fremline")
    }
}

function renderTaskDesc() {
    try {
        descContent = currentTaskNode.querySelector('.workspace__board-list-task-desc.disable').innerText.trim();
        taskSettingDesc.value = descContent;
    } catch (e) {
        console.log("Fremline")
    }
}

function renderTaskSettingUrgent() {
    try {
        isUrgent = currentTaskNode.querySelector('.task-urgent').classList.contains('disable') ? false : true;
        if (isUrgent) {
            taskSettingUrgent.innerText = "Unmark urgent";
        } else {
            taskSettingUrgent.innerText = "Mark as urgent";
        }
    } catch (e) {
        console.log("Fremline")
    }

}

taskSettingClose.addEventListener("click", (event) => {
    taskSave.click();
});

taskSave.addEventListener("click", (event) => {
    console.log(oldTaskName)
    let invalidTaskName = false;
    hitSave = true;
    let editTaskUrl = "http://localhost:8080/api/v1/task/";
    let newTaskContent = taskInput.value;
    if (newTaskContent.includes("<") || newTaskContent.includes(">")) {
        throwError("Invalid input")
        return;
    } 
    if (newTaskContent == "") {
        throwError("Empty task name!")
    } else if (newTaskContent != "" && newTaskContent.length > 25) {
        throwError("Task name is too long!")
        taskInput.value = oldTaskName;

    } else {
        loading.classList.remove('disable')
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
                fetch(editTaskUrl + "setDesc/" + sessionStorage.getItem("currentTask"), {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: taskSettingDesc.value.trim()
                })
            } else {
                fetch(editTaskUrl + "setDesc/" + sessionStorage.getItem("currentTask"), {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: " "
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
            let priority = "1";
            if (currentTaskNode.querySelector('.task-urgent').classList.contains("disable")) {
                priority = "0"
            }
            let url = 'http://localhost:8080/api/v1/task/setPriority/' + currentTask + "/" + priority;
            if (currentTask != null) {
                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        })
        .then(() => {
            sessionStorage.setItem("isEditing", "0");
        })
        .then(() => {
            if (!hitSave) {
                let tempTaskUrgent = currentTaskNode.querySelector('.task-urgent');
                if (prevPriority == "1") {
                    tempTaskUrgent.classList.remove('disable');
                } else {
                    tempTaskUrgent.classList.add('disable')
                }
            }
            currentTaskNode.querySelector('.workspace__board-list-task-desc.disable').textContent = descContent
            taskDelCount = 0;
        })
        .catch(() => {
            throwError("Unexpected error")
        })
        .finally(() => {
            sessionStorage.setItem("isEditing", "0");
            taskDelete.innerText = "Delete task";
            taskSetting.classList.add("disable");
            taskSetting.classList.remove("enable");
            loading.classList.add('disable')
            datepickerJS.classList.add('disable');
            taskInput.value = "";
        })
    }

    
});

taskDelete.addEventListener("click", () => {
    if (taskDelCount > 0) {
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
        taskDelCount = 0;
    } else {
        taskDelete.innerHTML = "Confirm delete?";
        taskDelCount += 1;
    }
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