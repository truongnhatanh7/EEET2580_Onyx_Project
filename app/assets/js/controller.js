"use strict";
const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");
const addTaskBtn = $(".workspace__add-task-btn");
const board = $(".workspace__board");

console.log(addTaskBtn);

addListBtn.addEventListener("click", () => {
  let html = `  
  <div class="workspace__board-list" ondragover="handleDragOver(event)">
  <h1 class="workspace__board-list-header" contenteditable="true">
    List 1
  </h1>

  <button class="workspace__add-task-btn btn" onclick="handleAddTask(event)">Add task</button>
</div>
    `;

  let para = document.createRange().createContextualFragment(html);
  board.insertBefore(para, addListBtnWrapper);
});

function handleAddTask(event) {
  let html = `  
    <div
    class="workspace__board-list-task"
    draggable="true"
    ondragstart="handleDragStart(event)"
    ondragend="handleDragEnd(event)"
    >
    <p
      class="workspace__board-list-task-content"
      contenteditable="true"
    >
      
    </p>
    </div>
    `;

  let para = document.createRange().createContextualFragment(html);
  event.target.parentNode.insertBefore(para, event.target);
};
