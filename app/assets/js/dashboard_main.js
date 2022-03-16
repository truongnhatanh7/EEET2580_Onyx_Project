

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const projectList = $(".dashboard__project-list");
const modalOutter = $(".dashboard__modal-create");
const modalWrapper = $(".dashboard__modal-wrapper");
const modalInput = $('.dashboard__modal-input');
const modalBtn = $('.dashboard__modal-btn');
const projectAddBtn = $(".dashboard__project-add-btn")
let userId = 1;
let haveJustAdded = false;
let latestWorkspaceId = -1;
let currentUser = 1;
let linkWorkspaceUserUrl = "http://localhost:8080/api/v1/user/add-workspace-for-user-by-id/"
let workspaceByUserId = "http://localhost:8080/api/v1/workspace/get-workspace-by-user-id/" + currentUser.toString();
let createUrl = "http://localhost:8080/api/v1/workspace/";
let allWPUrl = "http://localhost:8080/api/v1/workspace/";
let allUsers = "http://localhost:8080/api/v1/user/all-users/"

main()


function main() {
    getWorkspace(renderWorkspace)
}

function getWorkspace(callback) {
    fetch(workspaceByUserId)
        .then(function (response) {
            return response.json();
        })
        .then(callback)

}

function renderWorkspace(workspaces) {

    for (const workspace of workspaces) {

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

}

function handleCardClick(event) {
    sessionStorage.setItem("currentBoardId", event.target.id);
}

////////////////////////////////////////////////////////////////////////
// Modal handling

modalWrapper.onclick = (event) => {
    event.stopPropagation();
}

modalOutter.onclick = (event) => {
    modalOutter.classList.remove('dashboard__modal-create--enable')
    modalOutter.classList.add("dashboard__modal-create--disable")
    
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
}

modalInput.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        modalBtn.click();
    }
})

modalBtn.onclick = (event) => {

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
            let url = linkWorkspaceUserUrl + workspace.workspaceId.toString() + "/" + userId.toString();
            fetch(url,  {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
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
}








