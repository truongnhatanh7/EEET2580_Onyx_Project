let currentBoardId = localStorage.getItem("currentBoardId");
let url = "http://localhost:8080/api/v1/list/" + currentBoardId;
let board;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const workspaceBoard = $(".workspace__board");
const addListBtn = $(".workspace__add-list-btn");
const addListBtnWrapper = $(".workspace__add-list-wrapper");

getBoardInfo();

function renderBoard(board) {

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
                    >
                    <p
                      class="workspace__board-list-task-content"
                      contenteditable="true"
                    >
                      ${task.taskContent}
                    </p>
                    </div>
                    `;
                    listHTML += taskHTML;
                }
            });
            let html = `  
            <div class="workspace__board-list" ondragover="handleDragOver(event)">
            <h1 class="workspace__board-list-header" contenteditable="true">
              ${list.listName}
            </h1>
                ${listHTML}
            <button class="workspace__add-task-btn btn" onclick="handleAddTask(event)">Add task</button>
            </div>
              `;

            let para = document.createRange().createContextualFragment(html);
            workspaceBoard.insertBefore(para, addListBtnWrapper);
        }
    });
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
	console.log(data);
    board = new Board();

    data.forEach(function (list) {
        let tempList = new List();
        tempList.setListName(list.name);
        list.tasks.forEach(function (task) {
            let tempTask = new Task();
            tempTask.setTaskContent(task.taskContent);
            tempList.addTask(tempTask);
        });
        board.addList(tempList);
    });
    console.log("///dvsavas", board);
    return board;
}

class Board {
    constructor(boardName, lists) {
        this.lists = new Array(lists);
        this.boardName = boardName;
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

    getAllList() {
        return this.lists;
    }
}

class List {
    constructor(listName, tasks) {
        this.listName = listName;
        this.tasks = new Array(tasks);
    }

    List(listName) {
        this.listName = listName;
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
    constructor(taskContent) {
        taskContent = taskContent;
    }

    setTaskContent(taskContent) {
        this.taskContent = taskContent;
    }

    getTaskContent() {
        return this.taskContent;
    }
}