
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Workspace status

const statusBtn = $(".workspace__navbar-progress-btn");
const workspaceStatus = $(".workspace__status");
const workspaceStatusWrapper = $(".workspace__status-wrapper");
const workspaceStatusTitle = $(".workspace__status-title");
const closeWorkspaceStatus = $(".workspace__status-close-icon");
const preDeleteBtn = $(".workspace__delete-workspace-btn-pre");
const preDeleteWrapper = $(".workspace__delete-confirmation");
const preDeleteInput = $(".workspace__delete-confirmation-input");
const postDeleteBtn = $(".workspace__delete-workspace-btn-post");
const deleteWorkspaceUrl =
    "http://localhost:8080/api/v1/workspace/delete-workspace/";

statusBtn.addEventListener("click", () => {
    workspaceStatus.classList.add("enable");
    workspaceStatus.classList.remove("disable");
    workspaceStatusTitle.focus();
});

workspaceStatusWrapper.addEventListener("click", (event) => {
    event.stopPropagation();
});

workspaceStatus.addEventListener("click", (event) => {
    closeWorkspaceStatus.click();
});

closeWorkspaceStatus.addEventListener("click", () => {
    workspaceStatus.classList.remove("enable");
    workspaceStatus.classList.add("disable");

    preDeleteWrapper.classList.remove("enable");
    preDeleteWrapper.classList.add("disable");
    preDeleteBtn.classList.remove("disable");
    preDeleteBtn.classList.add("enable");
    preDeleteInput.value = "";
});

preDeleteBtn.addEventListener("click", () => {
    fetch("http://localhost:8080/api/v1/workspace/get-owner/" + sessionStorage.getItem("currentBoardId"))
    .then(
        response => {
            response.text().then(
                text => {
                    if (text != sessionStorage.getItem("userId")) {
                        throwError("Only owner could delete this workspace")
                    } else {
                        preDeleteWrapper.classList.add("enable");
                        preDeleteWrapper.classList.remove("disable");
                        preDeleteBtn.classList.add("disable");
                        preDeleteBtn.classList.remove("enable");

                    }
                }
            )
        }
    )
});

postDeleteBtn.addEventListener("click", () => {
    if (preDeleteInput.value == "delete this workspace") {
        let url = deleteWorkspaceUrl + sessionStorage.getItem("currentBoardId");

        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(location.assign("./dashboard.html"));
    } else {
        throwError("Invalid input")
    }
});


// Collab

const collaboratorList = $(".workspace__collaborator-list");
const addCollaboratorBtn = $(".workspace__add-collaborator-btn");
const addCollaboratorInput = $(".workspace__add-collaborator-input");

fetchUserInWorkspace();



function fetchUserInWorkspace() {
    fetchOwner();
    let workspaceUrl =
        "http://localhost:8080/api/v1/workspace/get-workspace/" +
        sessionStorage.getItem("currentBoardId");
    fetch(workspaceUrl)
        .then((response) => response.json())
        .then((workspace) => {
            return workspace.users;
        })
        .then((users) => {
            renderUserInWorkspace(users);
        })
        .catch(() => {
            throwError("Unexpected error, cannot fetch collaborator")
        })
}

function renderUserInWorkspace(users) {
    if (users.length == 0) {
        collaboratorList.innerHTML = "";
        // Warning to delete workspace if there are no owners
        preDeleteInput.value = "delete this workspace";
        postDeleteBtn.click();
        location.assign("./dashboard.html");
    } else {
        collaboratorList.innerHTML = "";
        users.forEach((user) => {
            if (user.userId == sessionStorage.getItem("currentOwnerId")) {
                return;
            }
            let tempHtml = `
            <div class="workspace__collaborator" id="user_${user.userId} ">
                <h3 class="workspace__collaborator-name" >${user.name}</h3>
                <i class="fa-solid fa-xmark workspace__collaborator-delete" onclick=handleRemoveCollaborator(event)></i>
            </div>
            `;
            let para = document
                .createRange()
                .createContextualFragment(tempHtml);
            collaboratorList.appendChild(para);
        });
    }
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("workspace__collaborator-delete")) {
        handleRemoveCollaborator(event.target.parentNode.id.slice(5));
    }
});

function handleRemoveCollaborator(event) {
    let id = event.target.parentNode.id.slice(5);
    let removeCollaboratorUrl =
        "http://localhost:8080/api/v1/user/remove-user-from-workspace/" +
        sessionStorage.getItem("currentBoardId") +
        "/" +
        id;
    fetch(removeCollaboratorUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(() => {
        fetchUserInWorkspace();
    });
}

addCollaboratorBtn.addEventListener("click", () => {
    if (addCollaboratorInput.value == "") {
        throwError("Invalid input")
    } else {
        let getAllUsersUrl = "http://localhost:8080/api/v1/user/all-users/";
        fetch(getAllUsersUrl)
            .then((response) => response.json())
            .then((users) => {
                let found = false;
                users.forEach((user) => {
                    if (user.username == addCollaboratorInput.value) {
                        found = true;
                        handleAddToWorkspace(user);
                    }
                });
                if (!found) {
                    throwError("User not found!")
                }
            })
            .then(() => {
                addCollaboratorInput.value = "";
                addCollaboratorInput.focus();
            })
            .catch(() => {
                throwError("Unexpected error")
            })
    }
});

function handleAddToWorkspace(user) {
    let addCollaboratorUrl =
        "http://localhost:8080/api/v1/user/add-workspace-for-user-by-id/" +
        sessionStorage.getItem("currentBoardId") +
        "/" +
        user.userId;
    fetch(addCollaboratorUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(() => {
        fetchUserInWorkspace();
    }).then(() => {
        handleEmailUser(user.username);
    })
    ;
}

function handleEmailUser(username) {
    let sendEmailUrl = "http://localhost:8080/api/v1/email/notifyUser/" + username
    fetch(sendEmailUrl, {
        method: "POST",
        body: {
            'Content-Type': 'application/json'
        }
    })
}

//////////////////////////////////  
// const workspaceStatusDeleteSection = $('.workspace__delete-section')

// if (sessionStorage.getItem("userId") != sessionStorage.getItem("currentOwnerId")) {
//     workspaceStatusDeleteSection.remove();
// }
