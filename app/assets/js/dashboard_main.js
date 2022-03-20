

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const projectList = $(".dashboard__project-list");
const modalOutter = $(".dashboard__modal-create");
const modalWrapper = $(".dashboard__modal-wrapper");
const modalInput = $('.dashboard__modal-input');
const modalBtn = $('.dashboard__modal-btn');
const projectAddBtn = $(".dashboard__project-add-btn")
const dashboardTitle = $('.dashboard__title');
let latestWorkspaceId = -1;
let currentUser = 1;
let linkWorkspaceUserUrl = "https://onyx2-backend.herokuapp.com/api/v1/user/add-workspace-for-user-by-id/"
let workspaceByUserId = "https://onyx2-backend.herokuapp.com/api/v1/workspace/get-workspace-by-user-id/" + currentUser.toString();
let createUrl = "https://onyx2-backend.herokuapp.com/api/v1/workspace/";
let allWPUrl = "https://onyx2-backend.herokuapp.com/api/v1/workspace/";
let allUsers = "https://onyx2-backend.herokuapp.com/api/v1/user/all-users/"
const toastBox = $(".toast-wrapper");
const toastMessage = $(".toast-message");
const finish = false;
const loading = $('.loading-wrapper');
let totalWorkspaces = 0;

main()



function main() {
    // setTimeout(() => {
    //     loading.style.visibility = "hidden";
    //     loading.style.opacity = "0";
    //     // loading.remove();

    // }, 3000)
      
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
    totalWorkspaces = workspaces.length;
    if (totalWorkspaces > 1) {
        dashboardTitle.innerHTML += 's'
    }
 
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

    loading.style.visibility = "hidden";
    loading.style.opacity = "0";
    loading.remove();

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








