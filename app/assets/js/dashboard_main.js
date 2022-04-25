

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const projectList = $(".dashboard__project-list");
const modalOutter = $(".dashboard__modal-create");
const modalWrapper = $(".dashboard__modal-wrapper");
const modalInput = $('.dashboard__modal-input');
const modalBtn = $('.dashboard__modal-btn');
const projectAddBtn = $(".dashboard__project-add-btn")
const dashboardTitle = $('.dashboard__title');
const searchInput = $('.dashboard__search-workspace-input')
const searchBtn = $('.dashboard__search-workspace-btn')
const viewAllBtn = $('.dashboard__view-all-btn')
const filterBtn = $('.dashboard__filter-btn')
const filterOptionsWrapper = $('.dashboard__filter-options')
const filterOptions = $$('.dashboard__filter-option')
let latestWorkspaceId = -1;
//////////////////////////////
let currentUser = sessionStorage.getItem("userId"); // Current user id
//////////////////////////////
let linkWorkspaceUserUrl = "http://localhost:8080/api/v1/user/add-workspace-for-user-by-id/"
let workspaceByUserId = "http://localhost:8080/api/v1/workspace/get-workspace-by-user-id/" + currentUser.toString();
let createUrl = "http://localhost:8080/api/v1/workspace/";
let allWPUrl = "http://localhost:8080/api/v1/workspace/";
let allUsers = "http://localhost:8080/api/v1/user/all-users/";
let totalWorkspaces = 0;
const toastBox = $(".toast-wrapper");
const toastMessage = $(".toast-message");
const finish = false;
const loading = $('.loading-wrapper');
const logOut = $('.user__navbar-progress-btn');
var globalKeyword = "";
let filterCondition = "latest"
let isReversed = false;

if (sessionStorage.getItem('userId') == null) {
    location.href = "../login2.html";
}

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        console.log("cvs")
        filterCondition = option.innerText.toLowerCase();
        console.log(filterCondition)
        getWorkspace(renderWorkspace)

    })
})

logOut.addEventListener('click', () => {
    sessionStorage.removeItem('userId');
    location.href = "../index.html";

})

viewAllBtn.addEventListener('click', () => {
    searchInput.value = "";
    searchBtn.click();
})

filterBtn.addEventListener('click', () => {
    filterOptionsWrapper.classList.toggle('disable')
})

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
main()

searchBtn.onclick = () => {
    globalKeyword = searchInput.value.trim();
    getWorkspace(renderWorkspace)
}

function main() {
    getWorkspace(renderWorkspace)
    setInterval(function() {
        if (sessionStorage.getItem("isEditing") == '0') {
            getWorkspace(renderWorkspace)
        }
    }, 3333000)
}

function getWorkspace(callback) {
    fetch(workspaceByUserId)
        .then(function (response) {
            return response.json();
        })
        .then(callback)

}

function handleFilter(workspaces) {
    if (filterCondition == "a-z") {
        workspaces.sort((a, b) => {
            a.workspaceTitle.localeCompare(b.workspaceTitle)
        })
    } else if (filterCondition == "z-a") {
        workspaces.sort((a, b) => {
            a.workspaceTitle.localeCompare(b.workspaceTitle)
        })
        workspaces.reverse()
    } else if (filterCondition == "latest") {
        workspaces.reverse()
    
    } else {
        return;
    }
}

function renderWorkspace(workspaces) {
    totalWorkspaces = workspaces.length;
    sessionStorage.setItem('totalWorkspaces', totalWorkspaces)    

    let oldWorkspaces = projectList.querySelectorAll('.dashboard__project-card')
    oldWorkspaces.forEach((element, index) => {

            element.remove()
        
    })
    let cur = 0
    handleFilter(workspaces)
    console.log(workspaces)
    // if (latestSort) {
    //     workspaces.reverse()
    // }

    for (const workspace of workspaces) {

        if (workspace.workspaceTitle.includes(globalKeyword)) {
            let html = `
            <div class="dashboard__project-card" onclick="handleCardClick(event)" >
                <a href="./workspace.html" class="dashboard__project-card-link" id="${workspace.workspaceId}">
                    <h2 class="dashboard__project-card-name" id="${workspace.workspaceId}">${workspace.workspaceTitle}</h2>
                </a>
            </div>
            `;
            let para = document.createRange().createContextualFragment(html);
            projectList.appendChild(para);
        }
        cur++;
        
    }

    loading.style.visibility = "hidden";
    loading.style.opacity = "0";
    loading.remove();

}

function handleCardClick(event) {
    sessionStorage.setItem("currentBoardId", event.target.id);
    sessionStorage.setItem('isEditing', '0')
}

////////////////////////////////////////////////////////////////////////
// Modal handling

modalWrapper.onclick = (event) => {
    event.stopPropagation();
    sessionStorage.setItem('isEditing', '1')

}

modalOutter.onclick = (event) => {
    modalOutter.classList.remove('dashboard__modal-create--enable')
    modalOutter.classList.add("dashboard__modal-create--disable")
    sessionStorage.setItem('isEditing', '0')

    
}

////////////////////////////////////////////////////////////////////////
// Add wp handling
// Call post API create new wp 
// Call API add new wp to user 
// Call getWorkspace -> rerender UI

projectAddBtn.onclick = (event) => {
    modalOutter.classList.remove("dashboard__modal-create--disable")
    modalOutter.classList.add('dashboard__modal-create--enable')
    modalInput.focus()
    modalInput.value = '';
}

modalInput.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        modalBtn.click();
    }
})

modalBtn.onclick = (event) => {
    if (modalInput.value != '' && modalInput.value.length < 25) {
        let name = modalInput.value;
        modalOutter.classList.remove('dashboard__modal-create--enable')
        modalOutter.classList.add("dashboard__modal-create--disable")
        
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                workspaceTitle: name
            })
        };
    
        // Create new workspace
        fetch(createUrl, options)
            .then(response => response.json())
            .then(workspace => {
                let url = linkWorkspaceUserUrl + workspace.workspaceId.toString() + "/" + currentUser.toString();
                fetch(url,  {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(() => {
                    let html = `
                    <div class="dashboard__project-card" onclick="handleCardClick(event)" >
                        <a href="./workspace.html" class="dashboard__project-card-link" id="${workspace.workspaceId}">
                            <h2 class="dashboard__project-card-name" id="${workspace.workspaceId}">${workspace.workspaceTitle}</h2>
                        </a>
                    </div>
                    `;
                    let para = document.createRange().createContextualFragment(html);
                    projectList.appendChild(para);
                }
                );
            })

    
            modalInput.value = ''
    } else if (modalInput.value != '' && modalInput.value.length >= 25) {
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
        toastMessage.innerHTML = "Project name cannot be empty"
        setTimeout(() => {
            toastBox.classList.remove("enable");
            toastBox.classList.add("disable");
        }, 2000)
    }
}

////////////////////////////////
paginationRender(0)

function paginationRender(currentPage) {
    let totalPages = sessionStorage.getItem('totalWorkspaces');
    totalPages = Math.floor(totalPages / 4);
    console.log(totalPages)
}







