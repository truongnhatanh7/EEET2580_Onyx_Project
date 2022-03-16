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
    onfocusout="handleTaskOutFocus(event)"
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
  event.target.parentNode.childNodes[event.target.parentNode.childNodes.length - 4].childNodes[1].focus()
};

function handleTaskOutFocus(event) {
  // Procedure:
  // Send API request to create new task
  // Send API request to add task to current list

  sessionStorage.setItem("taskContent",event.target.innerHTML);
  sessionStorage.setItem("listId", event.target.parentNode.parentNode.id.slice(5)); 
  
  let createTaskUrl = "http://localhost:8080/api/v1/task/" + sessionStorage.getItem("listId").toString()

  fetch(createTaskUrl, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        taskContent: sessionStorage.getItem("taskContent")
    })
  })
}

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

// const observer = new MutationObserver( mutationRecords => {
//   mutationRecords.forEach((record) => {
//     console.log(record.target)
//   })
// })

// observer.observe(board, {
//   attributes: true,
//   characterData: true,
//   childList: true,
//   subtree: true,
//   attributeOldValue: true,
//   characterDataOldValue: true
// })