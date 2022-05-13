"use strict";
const draggables = $$(".workspace__board-list-task");
const containers = $$(".workspace__board-list");
var allPosToFetch = 0;

function handleDragStart(event) {
    event.target.classList.add("workspace__board-list-task--dragging");
    sessionStorage.setItem("currentTask", event.target.id.slice(5));
    sessionStorage.setItem("isEditing", "1");
}

function handleDragEnd(event) {
    console.log("drag end")
    loading.classList.remove('disable')
    event.target.classList.remove("workspace__board-list-task--dragging");
    let parent = event.target.parentNode;
    let listId = parent.id.slice(5);
    if (event.target.parentNode.id.slice(5) == "") {
        // If event.target return board-list-scrollable
        parent = parent.parentNode;
        listId = parent.id.slice(5); // Change it to the outer parent
    }

    if (!parent.classList.contains('workspace__board-list')) {
        return;
    }

    let moveTaskUrl = "https://onyx2-backend.herokuapp.com/api/v1/task/switchList/" + listId;
    fetch(moveTaskUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            taskId: event.target.id.slice(5),
        }),
    })
    .then(() => {
        let allTasks = parent.querySelectorAll(".workspace__board-list-task");
        console.log("all tasks", allTasks.length)
        let cur = 0;
        fetch("https://onyx2-backend.herokuapp.com/api/v1/sse/num-setpos/" + allTasks.length, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(() => {
            allTasks.forEach((task) => {
                setPos(task.id.slice(5), cur++)
            });
        })
    })
    .finally(() => {
        console.log("set pos done")
    })

}

function setPos(taskId, pos) {
    fetch("https://onyx2-backend.herokuapp.com/api/v1/task/setPos/" + taskId + "/" + pos, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(() => {
        loading.classList.add('disable')
    })
}

function handleOnDrag(event) {
    event.preventDefault();
}

function handleDragOver(event) {
    let container = event.target.parentNode;
    event.preventDefault();
    if (container.classList["0"] === "workspace__board-list-scrollable") {
        const afterElement = getDragAfterElement(container, event.clientY);
        let draggable = $(".workspace__board-list-task--dragging");
        const addTaskBtn = container.parentNode.querySelector(
            ".workspace__add-task-btn"
        );
        if (afterElement == null) {
            container.parentNode.insertBefore(draggable, addTaskBtn);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    } else {
        let draggable = $(".workspace__board-list-task--dragging");
        container = event.target.querySelector(
            ".workspace__board-list-scrollable"
        );
        if (draggable != null && container != null) {
            container.appendChild(draggable);
        }
    }
}

function getDragAfterElement(container, yMousePos) {
    // Use y because the boundaries are in current container
    const draggableElements = [
        ...container.querySelectorAll(
            ".workspace__board-list-task:not(.workspace__board-list-task--dragging)"
        ),
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect(); // Get current box
            const offset = yMousePos - box.top - box.height / 2; // If mouseY near center of current child -> negative value but we need the negative one AND closest to 0
            if (offset < 0 && offset > closest.offest) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offest: Number.NEGATIVE_INFINITY }
    ).element;
}
