"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const draggables = $$(".workspace__board-list-task");
const containers = $$(".workspace__board-list");


function handleDragStart(event) {
    
    event.target.classList.add("workspace__board-list-task--dragging");
    sessionStorage.setItem("currentTask", event.target.id.slice(5))
  sessionStorage.setItem('isEditing', '1')

}

function handleDragEnd(event) {
  sessionStorage.setItem('isEditing', '0')

    event.target.classList.remove("workspace__board-list-task--dragging");
    if (sessionStorage.getItem("currentTask") != event.target.parentNode.id) { // Avoid same list
      let deleteTaskUrl =
          "http://localhost:8080/api/v1/task/" + event.target.id.slice(5)

      let taskContent = event.target.textContent.trim();

      fetch(deleteTaskUrl, {
          cache: "no-cache",
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
          },
      });
      console.log("\n///////MOVE//////\n")
      console.log("delete task invoked")

      let listId = event.target.parentNode.id.slice(5)
      if (event.target.parentNode.id.slice(5) == '') { // If event.target return board-list-scrollable
            listId = event.target.parentNode.parentNode.id.slice(5) // Change it to the outer parent
      }
          let createTaskUrl =
              "http://localhost:8080/api/v1/task/" + listId;
                fetch(createTaskUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  taskContent: taskContent,
              }),
          }).then(response => response.json())
          .then(data => {
            console.log("create task invoked\n/////////\n")
            event.target.id = "task_" + data.taskId.toString();
          })
 

    }

}

function handleOnDrag(event) {
    event.preventDefault();
}

function handleDragOver(event) {
    // const containerFake = $('.workspace__board-list.modifying');
    // const container = containerFake.querySelector(".workspace__board-list-scrollable")
    let container = event.target.parentNode
    event.preventDefault();
    if (container.classList["0"] === "workspace__board-list-scrollable") {
        const afterElement = getDragAfterElement(container, event.clientY);
        let draggable = $(".workspace__board-list-task--dragging");
        const addTaskBtn = container.parentNode.querySelector('.workspace__add-task-btn');
        if (afterElement == null) {
            container.parentNode.insertBefore(draggable, addTaskBtn);
        } else {
            container.insertBefore(draggable, afterElement);
        }

    } else {
        let draggable = $(".workspace__board-list-task--dragging");
        container = event.target.querySelector('.workspace__board-list-scrollable')
        if (draggable != null && container != null) {
            container.appendChild(draggable)
        }

    }
}

function getDragAfterElement(container, yMousePos) {
    // Use y because the boundaries are in current container

    const draggableElements = [
        ...container.querySelectorAll(
            ".workspace__board-list-task:not(.workspace__board-list-task--dragging)"
        ),
    ]; // Convert node list to array

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
