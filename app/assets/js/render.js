let currentBoardId = sessionStorage.getItem("currentBoardId");
let url = "http://localhost:8080/api/v1/list/" + currentBoardId.toString();
let boardObj;
const workspaceBoard = $(".workspace__board");
const workspaceName = $('.workspace__info-name')
const loading = $('.loading-wrapper');
const showOnlyUrgentCheckbox = $('#show-only-urgent')
const showOnlyUrgentMask = $('.show-urgent-mask')
const showOverdue = $('#show-overdue')
const showOnlyUrgentMaskTick = $('.show-urgent-mask::after')
var showOnlyUrgentFlag = false;
var showOverdueFlag = false;
sessionStorage.setItem('isEditing', '0')

if (sessionStorage.getItem('userId') == null) {
    location.href = "../login2.html";
}

function handleShowOnlyUrgent(event) {
    if (showOnlyUrgentCheckbox.checked) {
        showOnlyUrgentFlag = true;
    } else {
        showOnlyUrgentFlag = false;
    }
    fetchBoardInfo();
    getBoardInfo();
}

function handleShowOverdue(event) {
    if (showOverdue.checked) {
        showOverdueFlag = true;
    } else {
        showOverdueFlag = false;
    }
    fetchBoardInfo();
    getBoardInfo();
}

fetchBoardInfo();
getBoardInfo();

setInterval(function() {
    if (sessionStorage.getItem("isEditing") == '0') {
        fetchBoardInfo();
        getBoardInfo();
    }
}, 1000)

function fetchBoardInfo() {
    let boardUrl = "http://localhost:8080/api/v1/workspace/get-workspace/" + currentBoardId.toString();
    fetch(boardUrl)
        .then(response => response.json())
        .then(data => {
            workspaceName.innerHTML = data.workspaceTitle.trim();
        })
}

function renderBoard(board) {
    let oldBoardLists = $$('.workspace__board-list-scrollable')
    let scrollRule = {}
    let horizontalBoardScrollRule = workspaceBoard.scrollLeft;

    oldBoardLists.forEach((element) => {
        scrollRule[element.parentNode.id] = element.scrollTop
        element.parentNode.remove();
    })

    board.getAllList().forEach(function (list) {
        let listHTML = ``;
        if (list !== undefined) {
            list.tasks.sort(function (a, b) {
                return a.pos - b.pos;
            })
            list.tasks.forEach(function (task) {
                if (task !== undefined) {
                    let isLate = false;
                    let isUrgent = task.priority == 1 ? "" : "disable";
                    let hasNote = true
                    if (task.desc == " " || task.desc == "") {
                        hasNote = false
                    }
                    let dl = task.deadline == undefined ? "No deadline for this task" : new Date(task.deadline).toString().trim();
                    if (showOnlyUrgentFlag && task.priority == 0) {
                        return;
                    }
                    
                    if (task.deadline !== undefined) {
                        let deadlineDay = new Date(task.deadline);
                        if (deadlineDay.getFullYear() == 1970) {
                            dl = "No deadline for this task"
                        } else {
                            dl = deadlineDay.getDate() + "/" + (deadlineDay.getMonth() + 1) + "/" + deadlineDay.getFullYear()
                        }
                        if (deadlineDay < new Date() && deadlineDay.getFullYear() != 1970) {
                            isLate = true;
                            dl += " (Late)"
                        }
                    } else {
                        dl = "No deadline for this task"
                    }
                    if (!isLate && showOverdueFlag) {
                        return;
                    } 

                    let taskHTML = `
                    <div
                        class="workspace__board-list-task
                            ${isLate ? " workspace__board-list-task--deadline " : ""}
                            ${hasNote ? " workspace__board-list-task--noted " : ""}
                        "
                        draggable="true"
                        ondragstart="handleDragStart(event)"
                        ondragend="handleDragEnd(event)"
                        ondrag="handleOnDrag(event)"

                        id="${"task_" + task.taskId}"
                    >
                    <i class="fa-solid fa-fire-flame-curved task-urgent ${isUrgent}"></i>
                    <p
                        class="workspace__board-list-task-content"
                    >
                        ${task.taskContent}
                    </p>
                    <p
                        class="workspace__board-list-task-desc disable"
                    >
                        ${task.desc}
                    </p>
                    <p class="workspace__board-list-task-deadline-content disable"
                    >${dl}
                    </p>
                    <i class="fa-solid fa-pen workspace__board-list-task-edit" onclick="handleTaskSetting(event)"></i>
                    </div>
                    `;
                    listHTML += taskHTML;
                }
            });
            let html = `  
            <div class="workspace__board-list noselect" id="${"list_" + list.listId}" ondragover="handleDragOver(event)">
                <div class="workspace__board-list-header-wrapper">
                <h1 class="workspace__board-list-header">
                    ${list.listName}
                </h1>
                <i class="fa-solid fa-xmark workspace__board-list-delete workspace__board-list-delete-icon" onclick="handleDeleteList(event)"></i>
                </div>
                <div class="workspace__board-list-scrollable">
                    ${listHTML}
                </div>

                <button class="workspace__add-task-btn btn" onclick="handleAddTask(event)">Add task</button>
                <div class="workspace__add-task-wrapper">
                    <h2 class="workspace__submit-title">Enter new task:</h2>
                    <input type="text" class="workspace__add-input-task">
                    <button class="workspace__submit-task-btn btn">Create</button>
                    <button class="workspace__task-close-btn btn">
                    <i class="fa-solid fa-xmark workspace__task-close"></i>
                    </button>
                    
                </div>
            </>
            `;
            let para = document.createRange().createContextualFragment(html);
            workspaceBoard.insertBefore(para, addListBtnWrapper);
            workspaceBoard.scrollLeft = horizontalBoardScrollRule;
            setScrollRule(scrollRule);
        }
    });

    loading.style.visibility = "hidden";
    loading.style.opacity = "0";
    loading.remove();
}

function setScrollRule(scrollRule) {
    for (const [key, value] of Object.entries(scrollRule)) {
        let temp = workspaceBoard.querySelector('#' + key)
        if (temp != null) {
            let list = temp.querySelector('.workspace__board-list-scrollable')
            list.scrollTop = value
        }
    }
}

function getBoardInfo() {
    fetch(url, {
		cache: "no-cache",
		method: 'GET',
		headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
		}
	},	
	
	)
        .then(function (response) {
            return response.json();
        })
        .then(createBoard)
        .then(renderBoard);
}

function createBoard(data) {

    boardObj = new Board();

    data.forEach(function (list) {
        let tempList = new List();
        tempList.setListId(list.listId)
        tempList.setListName(list.name);

        list.tasks.forEach(function (task) {
            let tempTask = new Task()
            tempTask.setPos(task.pos);
            tempTask.setTaskId(task.taskId);
            tempTask.setTaskContent(task.taskContent);
            tempTask.setPriority(task.priority);
            tempTask.setDesc(task.description);
            tempTask.setDeadline(task.deadline);
            tempList.addTask(tempTask);
        });
        boardObj.addList(tempList);
    });

    return boardObj;
}

class Board {
    constructor(boardName, lists, boardId) {
        this.lists = new Array(lists);
        this.boardName = boardName;
        this.boardId = boardId;
    }

    setBoardId(boardId) {
        this.boardId = boardId;
    }

    setBoardName(boardName) {
        this.boardName = boardName;
    }

    addList(list) {
        this.lists.push(list);
    }

    getBoardName() {
        return this.boardName;
    }

    getBoardId() {
        return this.boardId;
    }

    getAllList() {
        return this.lists;
    }
}

class List {
    constructor(listName, tasks, listId) {
        this.listName = listName;
        this.tasks = new Array(tasks);
        this.listId = listId;
    }

    List(listName) {
        this.listName = listName;
    }

    setListId(listId) {
        this.listId = listId;
    }

    getListId(listId) {
        return this.listId;
    }

    setListName(listName) {
        this.listName = listName;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getAllTasks() {
        return this.tasks;
    }
}

class Task {
    constructor(taskContent, taskId, pos, priority, desc, deadline) {
        this.taskContent = taskContent;
        this.taskId = taskId;
        this.pos = pos;
        this.priority = priority;
        this.desc = desc;
        this.deadline = deadline
    }

    setDeadline(deadline) {
        this.deadline = deadline;
    }

    setDesc(desc) {
        this.desc = desc;
    }

    setPos(pos) {
        this.pos = pos;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    getDeadline() {
        return this.deadline;
    }

    getDesc() {
        return this.desc;
    }

    getPriority() {
        return this.priority;
    }

    getPos() {
        return this.pos;
    }

    setTaskId(taskId) {
        this.taskId = taskId;
    }

    setTaskContent(taskContent) {
        this.taskContent = taskContent;
    }

    getTaskContent() {
        return this.taskContent;
    }
}


/////   /   /   ////////////////////////    /       /   //////////////////////////////

const userTaskWrapper = $(".user-task__wrapper");
const userName = $('.user-list-img__name')
function renderUserNavbar() {
    userName.innerText = sessionStorage.getItem("userName")
}


const avatar = $('.user-text-avatar')
function renderAvatarFromName() {
    let nameList = sessionStorage.getItem('userName').split(' ')
    let processedName = nameList[0][0] + nameList[nameList.length - 1][0]
    avatar.innerText = processedName.toUpperCase();
}

renderUserNavbar()
renderAvatarFromName()