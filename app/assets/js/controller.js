"use strict";

// const workspaceController = require("./workspace_controller.js");

const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");
const addTaskBtn = $(".workspace__add-task-btn");
const board = $(".workspace__board");
const darkModeSwitch = $(".workspace__switch-input");
const darkModeBtn = $('.workspace__navbar-darkmode-wrapper')
const currentTheme = localStorage.getItem('theme');
const tasks = $$('.workspace__board-list-task');
const lists = $$('.workspace__board-list');



addListBtn.addEventListener("click", () => {
  let html = `  
  <div class="workspace__board-list" ondragover="handleDragOver(event)">
  <h1 class="workspace__board-list-header" contenteditable="true">
    List
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

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        darkModeSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');

    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }


}
darkModeSwitch.addEventListener('change', switchTheme);

// renderWorkspace();
// function renderWorkspace() {
//   let currentWorkspaceId = workspaceController.getId();
//   console.log(currentWorkspaceId);
// }