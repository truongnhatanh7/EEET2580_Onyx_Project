"use strict";
const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");
const board = $(".workspace__board");

addListBtn.addEventListener("click", () => {
  let html = `  
    <div class="workspace__board-list" ondragover="handleDragOver(event)">
        <h1 class="workspace__board-list-header" contenteditable="true">List 1</h1>
        <div class="workspace__board-list-task" draggable="true" ondragstart="handleDragStart(event)" ondragend="handleDragEnd(event)">
            <p class="workspace__board-list-task-content">velit3 </p>
        </div>
    </div>
    `;

  let para = document.createRange().createContextualFragment(html);
  board.insertBefore(para, addListBtnWrapper);
});
