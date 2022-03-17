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
const listNameInput = $(".workspace__add-input");
const toastBox = $(".toast-wrapper");
const toastMessage = $(".toast-message");

addListBtn.addEventListener("click", (event) => {
    addListSection.classList.add("enable");
    addListSection.classList.remove("disable");
    addListBtn.classList.add("disable");
    addListBtn.classList.remove("enable");
    listNameInput.value = "";
    listNameInput.focus();
});



listNameInput.addEventListener("keyup", function(event) {
  event.preventDefault();
    if (event.keyCode == 13) {
        submitList.click();
    }
});

submitList.addEventListener("click", (event) => {
    if (listNameInput.value != '' && listNameInput.value.length < 25) {

      let createListUrl =
          "https://onyx2-backend.herokuapp.com/api/v1/list/" +
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
              // Update list id
              let html = `  
                  <div class="workspace__board-list" ondragover="handleDragOver(event)" id="${
                      "list_" + data.listId
                  }">
                    <h1 class="workspace__board-list-header" >
                      ${listNameInput.value}
                    </h1>
                    <i class="fa-solid fa-xmark workspace__board-list-delete workspace__board-list-delete-icon" onclick="handleDeleteList(event)"></i>
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
          })
      
      addListSection.classList.remove("enable");
      addListSection.classList.add("disable");
      addListBtn.classList.remove("disable");
      addListBtn.classList.add("enable");

    } else if (listNameInput.value != '' && listNameInput.value.length >= 25) {
      toastBox.classList.add("enable");
      toastBox.classList.remove("disable");
      toastMessage.innerHTML = "List name is too long!"
      setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
      }, 2000)
    } else {
      toastBox.classList.add("enable");
      toastBox.classList.remove("disable");
      toastMessage.innerHTML = "List name canot be empty"
      setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
      }, 2000)
    }
});



function handleAddTask(event) {
    if (addListSection.classList.contains("disable")) {
      event.target.classList.add("disable");
      event.target.classList.remove("enable");
  
      let currentListId = event.target.parentNode.id.slice(5);
      let tempArray = event.target.parentNode.childNodes;
      let taskFactory = tempArray[tempArray.length - 2];
      taskFactory.classList.add("enable");
      taskFactory.classList.remove("disable");
  
  
  
      let taskInput = taskFactory.querySelector(".workspace__add-input-task");
      let taskBtn = taskFactory.querySelector(".workspace__submit-task-btn");
      taskInput.focus();
      taskInput.addEventListener("keyup", (event) => {
          event.preventDefault();
            if (event.keyCode == 13) {
                taskBtn.click();
            }
      });
  
      taskBtn.onclick = debounce(function() {
          if (taskInput.value != "" && taskInput.value.length < 50) {
            let createTaskUrl =
                "https://onyx2-backend.herokuapp.com/api/v1/task/" + currentListId.toString();
            fetch(createTaskUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskContent: taskInput.value,
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
                        <i class="fa-solid fa-xmark workspace__board-list-task-delete workspace__board-list-delete-icon" onclick="handleDeleteTask(event)"></i>
                        </div>
                    `;
    
                    let para = document
                        .createRange()
                        .createContextualFragment(html);
                    event.target.parentNode.insertBefore(para, event.target);
                })
                .then(() => {
                    event.target.classList.remove("disable");
                    event.target.classList.add("enable");
                    taskFactory.classList.add("disable");
                    taskFactory.classList.remove("enable");
                    taskInput.value = "";
                });
          } 
          else if (taskInput.value != "" && taskInput.value.length >= 50) {
            toastBox.classList.add("enable");
            toastBox.classList.remove("disable");
            toastMessage.innerHTML = "Task content too long!"
            setTimeout(() => {
              toastBox.classList.remove("enable");
              toastBox.classList.add("disable");
            }, 2000)          
          }
          else {
            toastBox.classList.add("enable");
            toastBox.classList.remove("disable");
            toastMessage.innerHTML = "Task content cannot be empty!"
            setTimeout(() => {
              toastBox.classList.remove("enable");
              toastBox.classList.add("disable");
            }, 2000)
          }
      }, 100);
    }
    else if (addListSection.classList.contains("enable")) {
      toastBox.classList.add("enable");
      toastBox.classList.remove("disable");
      toastMessage.innerHTML = "Resolve list name first!"
      setTimeout(() => {
        toastBox.classList.remove("enable");
        toastBox.classList.add("disable");
    }, 2000)
    console.log(addListSection.classList)
  }
    
    
}


function handleDeleteTask(event) {
  let deleteTaskUrl = "https://onyx2-backend.herokuapp.com/api/v1/task/" + event.target.parentNode.id.slice(5).toString()
  fetch(deleteTaskUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  event.target.parentNode.remove()
  
}
function handleDeleteList(event) {
  let deleteListUrl = "https://onyx2-backend.herokuapp.com/api/v1/list/" + event.target.parentNode.id.slice(5).toString();
  fetch(deleteListUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  event.target.parentNode.remove();
}

////////////////////////////////////////////////////////////////////////
// Dark mode section

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

/////////////////////////////////
