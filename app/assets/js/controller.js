"use strict";

// const workspaceController = require("./workspace_controller.js");

const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");
const addTaskBtn = $(".workspace__add-task-btn");
const board = $(".workspace__board");
const darkModeSwitch = $(".workspace__switch-input");
const darkModeBtn = $(".workspace__navbar-darkmode-wrapper");
const currentTheme = localStorage.getItem("theme");
const tasks = $$(".workspace__board-list-task");
const lists = $$(".workspace__board-list");
const addListSection = $('.workspace__add-wrapper')
const submitList = $('.workspace__submit-btn')
const listNameInput = $('.workspace__add-input')

addListBtn.addEventListener("click", (event) => {
  
  addListSection.classList.add('enable')
  addListSection.classList.remove('disable')
  addListBtn.classList.add('disable')
  addListBtn.classList.remove('enable')

});

submitList.addEventListener('click', (event) => {

  // console.log(listNameInput.value)
  // TODO: If value is null -> toast message
  let createListUrl = "http://localhost:8080/api/v1/list/" + sessionStorage.getItem("currentBoardId").toString();
  fetch(createListUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              name: listNameInput.value,
          }),
        })
        .then(response => response.json())
        .then(data => {
          // Update list id
              let html = `  
                <div class="workspace__board-list" ondragover="handleDragOver(event)" id="${"list_" + data.listId}">
                  <h1 class="workspace__board-list-header" >
                    ${listNameInput.value}
                  </h1>
                  <button class="workspace__add-task-btn btn" onclick="handleAddTask(event)">Add task</button>
                  <div class="workspace__add-task-wrapper">
                    <h2 class="workspace__submit-title">Enter new task:</h2>
                    <input type="text" class="workspace__add-input-task">
                    <button class="workspace__submit-task-btn btn">Create</button>
                  </div>
                </div>
              `;
              let para = document.createRange().createContextualFragment(html);
              board.insertBefore(para, addListBtnWrapper);
          }
        ).then(() => {
          console.log("List api call")
        })

  addListSection.classList.remove('enable')
  addListSection.classList.add('disable')
  addListBtn.classList.remove('disable')
  addListBtn.classList.add('enable')

})

function handleAddTask(event) {
    event.target.classList.add('disable')
    event.target.classList.remove('enable')

    let currentListId = event.target.parentNode.id.slice(5)
    let tempArray = event.target.parentNode.childNodes
    let taskFactory = tempArray[tempArray.length - 2]
    taskFactory.classList.add('enable')
    taskFactory.classList.remove('disable')

    let taskInput = taskFactory.querySelector('.workspace__add-input-task')
    let taskBtn = taskFactory.querySelector('.workspace__submit-task-btn')

    taskBtn.onclick = () => {
          let createTaskUrl =
        "http://localhost:8080/api/v1/task/" +
        currentListId.toString()
        fetch(createTaskUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            taskContent: taskInput.value,
        }),
    })
    .then(() => {
          let html = `  
          <div
          class="workspace__board-list-task"
          draggable="true"
          ondragstart="handleDragStart(event)"
          ondragend="handleDragEnd(event)"
          id="${"task_"}"
          >
          <p
            class="workspace__board-list-task-content"

          >
            ${taskInput.value}
          </p>
          </div>
          `;

        let para = document.createRange().createContextualFragment(html);
        event.target.parentNode.insertBefore(para, event.target);
    })
    .then(() => {console.log("Task API call")
    event.target.classList.remove('disable')
    event.target.classList.add('enable')
    taskFactory.classList.add('disable')
    taskFactory.classList.remove('enable')
  });
    }
}

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
