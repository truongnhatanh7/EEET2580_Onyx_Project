let currentBoardId = sessionStorage.getItem("currentBoardId");
let url = "http://localhost:8080/api/v1/list/" + currentBoardId.toString();
let board;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const workspaceBoard = $(".workspace__board");
const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");
const workspaceName = $('.workspace__info-name')
const loading = $('.loading-wrapper');
sessionStorage.setItem('isEditing', '0')


fetchBoardInfo();
getBoardInfo();

setInterval(function() {
    if (sessionStorage.getItem("isEditing") == '0') {
        fetchBoardInfo();
        getBoardInfo();
    }
}, 2000)

function fetchBoardInfo() {
    let boardUrl = "http://localhost:8080/api/v1/workspace/get-workspace/" + currentBoardId.toString();
    fetch(boardUrl)
        .then(response => response.json())
        .then(data => {
            workspaceName.innerHTML = data.workspaceTitle.trim();
        })
}

function renderBoard(board) {
    let oldBoardLists = $$('.workspace__board-list')
    oldBoardLists.forEach((element) => {
        element.remove();
    })

    board.getAllList().forEach(function (list) {
        let listHTML = ``;

        if (list !== undefined) {
            list.tasks.forEach(function (task) {
                if (task !== undefined) {
                    let taskHTML = `  
                    <div
                    class="workspace__board-list-task"
                    draggable="true"
                    ondragstart="handleDragStart(event)"
                    ondragend="handleDragEnd(event)"
                    ondrag="handleOnDrag(event)"

                    id="${"task_" + task.taskId}"
                    >
                    <p
                      class="workspace__board-list-task-content"
                    >
                      ${task.taskContent}
                    </p>
                        <i class="fa-solid fa-pen workspace__board-list-task-edit" onclick="handleTaskSetting(event)"></i>
                    </div>
                    `;
                    listHTML += taskHTML;

                }
            });
            let html = `  
            <div class="workspace__board-list" id="${"list_" + list.listId}" ondragover="handleDragOver(event)">
                <h1 class="workspace__board-list-header">
                    ${list.listName}
                </h1>
                <i class="fa-solid fa-xmark workspace__board-list-delete workspace__board-list-delete-icon" onclick="handleDeleteList(event)"></i>

                    ${listHTML}
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
            workspaceBoard.insertBefore(para, addListBtnWrapper);
        }
    });

    loading.style.visibility = "hidden";
    loading.style.opacity = "0";
    loading.remove();
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

    board = new Board();

    data.forEach(function (list) {
        let tempList = new List();
        tempList.setListId(list.listId)
        tempList.setListName(list.name);

        list.tasks.forEach(function (task) {
            let tempTask = new Task()
            tempTask.setTaskId(task.taskId);
            tempTask.setTaskContent(task.taskContent);
            tempList.addTask(tempTask);
        });
        board.addList(tempList);
    });

    return board;
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
    constructor(taskContent, taskId) {
        this.taskContent = taskContent;
        this.taskId = taskId;
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
