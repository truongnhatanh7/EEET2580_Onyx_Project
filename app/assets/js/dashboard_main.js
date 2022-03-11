

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const projectList = $(".dashboard__project-list");
let userId = 1;
main()

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
    for (const workspace of workspaces) {
        console.log(workspace.users)
        // if (workspace.u)
        workspace.users.forEach(user => {
            if (user.userId == userId) {
                let html = `
                <div class="dashboard__project-card">
                    <a href="workspace.html" class="dashboard__project-card-link">
                        <h2 class="dashboard__project-card-name">${workspace.workspaceTitle}</h2>
                    </a>
                </div>
                `;
                let para = document.createRange().createContextualFragment(html);
                projectList.appendChild(para);
            }
        })

    }
}