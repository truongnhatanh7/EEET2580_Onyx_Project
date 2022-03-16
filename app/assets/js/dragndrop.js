"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const draggables = $$(".workspace__board-list-task");
const containers = $$(".workspace__board-list");

function handleDragStart(event) {
    event.target.classList.add("workspace__board-list-task--dragging");
    
}

function handleDragEnd(event) {
    event.target.classList.remove("workspace__board-list-task--dragging");
}

function handleDragOver(event) {
    const container = event.target
    event.preventDefault();
    console.log("yes")
    if ((container.classList['0'] === 'workspace__board-list')) {
        const afterElement = getDragAfterElement(container, event.clientY);
        const draggable = $(".workspace__board-list-task--dragging");
        const addTaskBtn = container.children[container.children.length - 2]
        if (afterElement == null) {
          container.insertBefore(draggable, addTaskBtn);
        } else {
          container.insertBefore(draggable, afterElement);
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
