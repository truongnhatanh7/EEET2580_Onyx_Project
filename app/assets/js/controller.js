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
const closeSubmitList = $('.workspace__list-close');
const listNameInput = $(".workspace__add-input");
const toastBox = $(".toast-wrapper");
const toastMessage = $(".toast-message");


////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("click", (event) => {
    if (event.target.closest(".workspace__add-list-wrapper") == null && event.target != addListBtn) {
      closeSubmitList.click();
    }
    let currentList = board.querySelector('.modifying');
    let outsideClick = false;
    let lists = board.querySelectorAll('.workspace__board-list:not(.modifying)')

    lists.forEach((element) => {
      if (element == event.target) {
        outsideClick = true;
      }
    })
    
    if (event.target == board) {
      handleCloseTaskAdd()
    } else if (outsideClick) {
      handleCloseTaskAdd()
    } else if (event.target == addListBtn) {
      handleCloseTaskAdd()
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////

addListBtn.addEventListener("click", (event) => {
    addListSection.classList.add("enable");
    addListSection.classList.remove("disable");
    addListBtn.classList.add("disable");
    addListBtn.classList.remove("enable");
    listNameInput.focus();
    listNameInput.value = "";
    addListBtn.scrollIntoView();
});

closeSubmitList.addEventListener("click", (event) => {
  addListSection.classList.remove("enable");
  addListSection.classList.add("disable");
  addListBtn.classList.remove("disable");
  addListBtn.classList.add("enable");
})

listNameInput.addEventListener("keyup", function(event) {
  event.preventDefault();
    if (event.keyCode == 13) {
        submitList.click();
        addListBtn.click();
    }
});

submitList.addEventListener("click", (event) => {
    if (listNameInput.value != '' && listNameInput.value.length < 25) {
      let listName = listNameInput.value;
      let createListUrl =
          "http://localhost:8080/api/v1/list/" +
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
              let html = `  
                  <div class="workspace__board-list" ondragover="handleDragOver(event)" id="${
                      "list_" + data.listId
                  }">
                    <h1 class="workspace__board-list-header" >
                      ${listName}
                    </h1>
                    <i class="fa-solid fa-xmark workspace__board-list-delete workspace__board-list-delete-icon" onclick="handleDeleteList(event)"></i>
                    <button class="workspace__add-task-btn btn" onclick="handleAddTask(event)">Add task</button>
                    <div class="workspace__add-task-wrapper">
                      <h2 class="workspace__submit-title">Enter new task:</h2>
                      <input type="text" class="workspace__add-input-task">
                      <button class="workspace__submit-task-btn btn">Create</button>
                      <button class="workspace__task-close-btn btn">
                      <i class="fa-solid fa-xmark workspace__task-close"></i>
                      </button>
                    </div>
                  </div>
                `;
              let para = document.createRange().createContextualFragment(html);
              board.insertBefore(para, addListBtnWrapper);
            })
            .then(() => {
              addListBtn.click(); // Rapid insert
              addListSection.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
          })
          resetAddListBtn();

    } else if (listNameInput.value != '' && listNameInput.value.length >= 25) {
      throwToastLongListName();
    } else {
      throwToastEmptyListName();
    }
});

function resetAddListBtn() {
  addListSection.classList.remove("enable");
  addListSection.classList.add("disable");
  addListBtn.classList.remove("disable");
  addListBtn.classList.add("enable");
}

function throwToastLongListName() {
  toastBox.classList.add("enable");
  toastBox.classList.remove("disable");
  toastMessage.innerHTML = "List name is too long!"
  setTimeout(() => {
    toastBox.classList.remove("enable");
    toastBox.classList.add("disable");
  }, 2000)
}

function throwToastEmptyListName() {
  toastBox.classList.add("enable");
  toastBox.classList.remove("disable");
  toastMessage.innerHTML = "List name cannot be empty"
  setTimeout(() => {
    toastBox.classList.remove("enable");
    toastBox.classList.add("disable");
  }, 2000)
}

function handleDeleteList(event) {
  let deleteListUrl = "http://localhost:8080/api/v1/list/" + event.target.parentNode.id.slice(5).toString();
  fetch(deleteListUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  event.target.parentNode.remove();
}


///////////////////////////////////////////////////////////////////////////////////////////////////////

function handleCloseTaskAdd() {
    
    let currentModifier = board.querySelector('.workspace__board-list.modifying')
    if (currentModifier) {
      let taskFactory = currentModifier.querySelector('.workspace__add-task-wrapper')
      taskFactory.classList.remove("enable");
      taskFactory.classList.add("disable");
      let addTaskBtn = currentModifier.querySelector('.workspace__add-task-btn.disable.btn')
      addTaskBtn.classList.add('enable')
      addTaskBtn.classList.remove('disable')
      currentModifier.classList.remove("modifying")
    }

}

function triggerModifying(event) {
  event.stopPropagation();
  event.target.parentNode.classList.add('modifying');
  event.target.classList.add("disable");
  event.target.classList.remove("enable");
}

function submitTaskByKeyboard(event, taskBtn) {
  event.stopPropagation();
  event.preventDefault();
    if (event.keyCode == 13) {
        taskBtn.click();
    }
}

function handleAddTask(event) {
    if (!board.querySelector(".modifying") && addListSection.classList.contains('disable')) {
      triggerModifying(event)
  
      let currentListId = event.target.parentNode.id.slice(5);
      let tempArray = event.target.parentNode.childNodes;
      let taskFactory = tempArray[tempArray.length - 2];
      taskFactory.classList.add("enable");
      taskFactory.classList.remove("disable");
      
  
      let taskInput = taskFactory.querySelector(".workspace__add-input-task");
      let taskBtn = taskFactory.querySelector(".workspace__submit-task-btn");
      taskInput.focus();
      taskInput.addEventListener("keyup", (event) => {
        submitTaskByKeyboard(event, taskBtn)
      });

      let closeBtn = event.target.parentNode.querySelector('.workspace__task-close-btn')
      closeBtn.addEventListener("click", handleCloseTaskAdd)
      closeBtn.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
  
      taskBtn.onclick = debounceTaskAdd(event, taskFactory, taskInput, currentListId);
    } else {
      handleCloseTaskAdd();
    }
}

function debounceTaskAdd(event, taskFactory, taskInput, currentListId) {
    return debounce(
      function() {
        console.log("DB Task add called")
        if (taskInput.value != "" && taskInput.value.length < 50) {
          let createTaskUrl =
              "http://localhost:8080/api/v1/task/" + currentListId.toString();
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
                        <i class="fa-solid fa-pen workspace__board-list-task-edit" onclick="handleTaskSetting(event)"></i>
                      </div>
                  `;

                  let para = document
                      .createRange()
                      .createContextualFragment(html);
                  event.target.parentNode.insertBefore(para, event.target);
              })
              .then(() => {
                rapidInputTask(event, taskFactory, taskInput)
              });
        } 
        else if (taskInput.value != "" && taskInput.value.length >= 50) {
          throwToastLongTaskName();
        }
        else {
          throwToastEmptyTaskName();
        }
    }, 150);
}

function rapidInputTask(event, taskFactory, taskInput) {
  event.target.classList.remove("disable");
  event.target.classList.add("enable");
  taskFactory.classList.add("disable");
  taskFactory.classList.remove("enable");
  taskInput.value = "";
  event.target.parentNode.classList.remove("modifying")
  event.target.parentNode.querySelector(".workspace__add-task-btn").click();
}


function throwToastLongTaskName() {
  toastBox.classList.add("enable");
  toastBox.classList.remove("disable");
  toastMessage.innerHTML = "Task content too long!"
  setTimeout(() => {
    toastBox.classList.remove("enable");
    toastBox.classList.add("disable");
  }, 2000)    
}

function throwToastEmptyTaskName() {
  toastBox.classList.add("enable");
  toastBox.classList.remove("disable");
  toastMessage.innerHTML = "Task content cannot be empty!"
  setTimeout(() => {
    toastBox.classList.remove("enable");
    toastBox.classList.add("disable");
  }, 2000)
}

////////////////////////////////
const taskSetting = $('.workspace__task-setting')
const taskSettingInner = $('.workspace__task-setting-wrapper')
const taskSave = $('.workspace__task-setting-btn')
const taskDelete = $('.workspace__task-delete-btn')
const taskInput = $('.workspace__task-setting-input')
const taskSettingClose = $('.workspace__task-setting-close')
let currentTask = null;
let currentTaskNode = null;

taskSetting.addEventListener('click', (event) => {

  taskSettingClose.click();
})

taskSettingInner.addEventListener('click', (event) => {
  event.stopPropagation();
})

taskInput.addEventListener('keyup', (event) => {

  event.preventDefault();
  if (event.keyCode == 13) {
    taskSave.click();
  }
})

function handleTaskSetting(event) {
  currentTask = event.target.parentNode.id.slice(5)
  currentTaskNode = event.target.parentNode;
  console.log(currentTaskNode.getBoundingClientRect())
  let boundingClientRect = currentTaskNode.getBoundingClientRect()
  console.log("Click: " , currentTask)
  sessionStorage.setItem("currentTask", currentTask);
  taskSetting.classList.add("enable")
  taskSetting.classList.remove("disable")
  taskSettingInner.style.top = boundingClientRect.top + "px";
  taskSettingInner.style.left = boundingClientRect.left + "px";
  taskSettingInner.style.transform = "translateX(0)";
  taskInput.value = currentTaskNode.querySelector('.workspace__board-list-task-content').textContent.trim();
  taskInput.focus();
  console.log("Open: ", sessionStorage.getItem("currentTask"))

}

taskSettingClose.addEventListener("click", (event) => {
  taskInput.value = "";
  taskSetting.classList.add('disable')
  taskSetting.classList.remove('enable')
  currentTaskNode = null;
}) 

taskSave.addEventListener("click", (event) => {
  let editTaskUrl = "http://localhost:8080/api/v1/task/"
  let newTaskContent = taskInput.value
  if (newTaskContent == '') {
    throwToastEmptyTaskName();
  } else if (newTaskContent != '' && newTaskContent.length > 25) {
    throwToastLongTaskName();
  } else {
    sessionStorage.setItem("currentTaskContent", newTaskContent.trim())
    fetch(editTaskUrl ,{
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          taskId: sessionStorage.getItem("currentTask"),
          taskContent: newTaskContent,
      })})
      .then(() => {
        console.log("sole: ", currentTaskNode)
        currentTaskNode.querySelector('.workspace__board-list-task-content').textContent = sessionStorage.getItem("currentTaskContent")
        taskSettingClose.click();
      })
  }
})

taskDelete.addEventListener("click", () => {
  console.log(sessionStorage.getItem("currentTask"))
    let deleteTaskUrl = "http://localhost:8080/api/v1/task/" + sessionStorage.getItem("currentTask")
  fetch(deleteTaskUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  currentTaskNode.remove()
  taskSettingClose.click();
})


function handleDeleteTask(event) {
  let deleteTaskUrl = "http://localhost:8080/api/v1/task/" + event.target.parentNode.id.slice(5).toString()
  fetch(deleteTaskUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  event.target.parentNode.remove()
  
}


////////////////////////////////////////////////////////////////////////
// Dark mode section
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

////////////////////////////////////////////////////////////////////////////////////////////////

//Workspace status 

const statusBtn = $('.workspace__navbar-progress-btn');
const workspaceStatus = $('.workspace__status')
const closeWorkspaceStatus = $('.workspace__status-close-icon')
const preDeleteBtn = $('.workspace__delete-workspace-btn-pre');
const preDeleteInput = $('.workspace__delete-instruction');
const postDeleteBtn = $('.workspace__delete-workspace-btn-post')

statusBtn.addEventListener('click', () => {
  workspaceStatus.style.display = "grid";
})

closeWorkspaceStatus.addEventListener('click', () => {
  workspaceStatus.style.display = "none";

})