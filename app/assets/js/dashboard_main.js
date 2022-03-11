

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const projectList = $(".dashboard__project-list");
let userId = 1;
main()

let workspaceIds = []

function main() {
    getWorkspace(renderWorkspace)
}

function getWorkspace(callback) {
    fetch("http://localhost:8080/api/v1/workspace/")
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function renderWorkspace(workspaces) {
    workspaceIds = []
    for (const workspace of workspaces) {
        console.log(workspace)
        workspace.users.forEach(user => {
            if (user.userId == userId) {
                workspaceIds.push(workspace.workspaceId)
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
        })
    }
    console.log(workspaceIds)
}

function handleCardClick(event) {
    localStorage.setItem("currentBoardId", event.target.id);
}