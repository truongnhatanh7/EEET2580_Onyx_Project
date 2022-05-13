let currentBoardId = sessionStorage.getItem("currentBoardId");
let url = "https://onyx2-backend.herokuapp.com/api/v1/list/" + currentBoardId.toString();
let boardObj;
const workspaceBoard = $(".workspace__board");
const workspaceName = $('.workspace__info-name')
const showOnlyUrgentCheckbox = $('#show-only-urgent')
const showNotedCheckbox = $('#show-noted')
const showOnlyUrgentMask = $('.show-urgent-mask')
const showOverdue = $('#show-overdue')
const showOnlyUrgentMaskTick = $('.show-urgent-mask::after')
var showOnlyUrgentFlag = false;
var showOverdueFlag = false;
var showNotedFlag = false;

if (sessionStorage.getItem('userId') == null) {
    location.href = "../login.html";
}

let eventSource = new EventSource("https://onyx2-backend.herokuapp.com/api/v1/sse/notification/" + sessionStorage.getItem("currentBoardId"))
let totalPosToFetch = 0;
let currentPosToFetch = 0;
let firstTimeSetPos = false;
let setPosStarting = false;

// How I hack this SSE:
// SSE just send information in 1 direction
// So I use frontend to trigger backend SSE with a message
// Then I decode this message and do some manipulation on it
// The result is the 'pos' might be fetched intensely, but the UI
// just update for 1 time, ONE TIME!
eventSource.onmessage = (message) => {
    console.log("message: ", message.data)
    if (message.data.includes("switchList")) {
        // Starting the checking procedure
        // Why?
        // after switchList -> setPos for x time
        setPosStarting = true;
    }
    else if (message.data.includes("setPos") && setPosStarting) {
        // In this step
        // I count for x time
        // Then render only 1
        // This way, there will be NO GLITCH in UI, and crazy data in backend
        currentPosToFetch += 1
        if (currentPosToFetch == message.data.split(' ')[2]) {
            getBoardInfo()
            setPosStarting = false;
            currentPosToFetch = 0;
        }
    }
    else if (!setPosStarting && message.data.includes(sessionStorage.getItem("currentBoardId"))) {
        // Other operation
        getBoardInfo();
    }

}


function handleShowOnlyUrgent(event) {
    if (showOnlyUrgentCheckbox.checked) {
        showOnlyUrgentFlag = true;
    } else {
        showOnlyUrgentFlag = false;
    }
    getBoardInfo();
}

function handleShowNoted(event) {
    if (showNotedCheckbox.checked) {
        showNotedFlag = true;
    } else {
        showNotedFlag = false;
    }
    getBoardInfo();
}

function handleShowOverdue(event) {
    if (showOverdue.checked) {
        showOverdueFlag = true;
    } else {
        showOverdueFlag = false;
    }
    getBoardInfo();
}

fetchBoardInfo();
getBoardInfo();

function fetchBoardInfo() {

    let boardUrl = "https://onyx2-backend.herokuapp.com/api/v1/workspace/get-workspace/" + currentBoardId.toString();
    fetch(boardUrl)
        .then(response => response.json())
        .then(data => {
            workspaceName.innerHTML = data.workspaceTitle.trim();
        })
        .catch(() => {
            throwError("The server is down for maintenance. Sorry about that")
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
    board.forEach(list => {
        let listHTML = ``;
        if (list !== undefined) {
            list.tasks.sort(function (a, b) {
                return a.pos - b.pos;
            })
            list.tasks.forEach((task) => {
                if (task !== undefined) {
                    let isLate = false;
                    let isUrgent = task.priority == 1 ? "" : "disable";
                    let hasNote = true
                    if (task.description == " " || task.description == "") {
                        hasNote = false
                    }
                    if (!hasNote && showNotedFlag) {
                        return;
                    }
                    let dl = task.deadline == undefined ? "No deadline for this task" : new Date(task.deadline).toString().trim();
                    if (showOnlyUrgentFlag && task.priority == 0) {
                        return;
                    }
                    
                    if (task.deadline !== undefined) {
                        let deadlineDay = new Date(task.deadline);
                        if (deadlineDay.getFullYear() == 1970) {
                            dl = "No deadline"
                        } else {
                            dl = deadlineDay.getDate() + "/" + (deadlineDay.getMonth() + 1) + "/" + deadlineDay.getFullYear()
                        }
                        if (deadlineDay < new Date() && deadlineDay.getFullYear() != 1970) {
                            isLate = true;
                            dl += " (Late)"
                        }
                    } else {
                        dl = "No deadline"
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
                        ${task.description}
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
                    ${list.name}
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
    loading.classList.add('disable')
    window.style.pointerEvents = "auto";
}

function setScrollRule(scrollRule) {
    for (const [key, value] of Object.entries(scrollRule)) {
        let temp = workspaceBoard.querySelector('#' + key)
        if (temp != null) {
            let list = temp.querySelector('.workspace__board-list-scrollable')
            list.scrollTop = value;
        }
    }



}

function getBoardInfo() {
    console.log("Re-render")
    loading.classList.remove('disable')
    // window.style.pointerEvents = "none";
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
        .then(renderBoard);
}
