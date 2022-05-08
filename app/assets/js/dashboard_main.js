if (sessionStorage.getItem("userId") == null) {
    location.href = "../login.html";
}

const projectList = $(".dashboard__project-list");
const modalOutter = $(".dashboard__modal-create");
const modalWrapper = $(".dashboard__modal-wrapper");
const modalInput = $(".dashboard__modal-input");
const modalBtn = $(".dashboard__modal-btn");
const projectAddBtn = $(".dashboard__project-add-btn");
const dashboardTitle = $(".dashboard__title");
const searchInput = $(".dashboard__search-workspace-input");
const searchBtn = $(".dashboard__search-workspace-btn");
const viewAllBtn = $(".dashboard__view-all-btn");
const filterBtn = $(".dashboard__filter-btn");
const filterOptionsWrapper = $(".dashboard__filter-options");
const filterOptions = $$(".dashboard__filter-option");
let latestWorkspaceId = -1;
let currentUser = sessionStorage.getItem("userId"); // Current user id
let linkWorkspaceUserUrl =
    "http://localhost:8080/api/v1/user/add-workspace-for-user-by-id/";
let workspaceByUserId =
    "http://localhost:8080/api/v1/workspace/get-workspace-by-user-id/" +
    currentUser.toString();
let createUrl = "http://localhost:8080/api/v1/workspace/";
let allWPUrl = "http://localhost:8080/api/v1/workspace/";
let allUsers = "http://localhost:8080/api/v1/user/all-users/";
let totalWorkspaces = 0;
const finish = false;


var globalKeyword = "";
let filterCondition = "latest";
let isReversed = false;
let currentPage = 0;

window.addEventListener("keyup", event => {
    event.preventDefault();
    if (event.key == 'Enter') {
        searchBtn.click();
    }
})

// document.addEventListener("click", (event) => {
//     if (
//         !event.target.classList.contains("dashboard__filter-option") &&
//         !event.target.classList.contains("dashboard__filter-btn")
//     ) {
//         // filterOptionsWrapper.classList.add('disable');
//     }
// });

filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        filterCondition = option.innerText.toLowerCase();
        getWorkspace(renderWorkspace);
    });
});

viewAllBtn.addEventListener("click", () => {
    currentPage = 0;
    searchInput.value = "";
    searchBtn.click();
});

main();

searchBtn.onclick = () => {
    globalKeyword = searchInput.value.trim();
    filterCondition = "latest";
    currentPage = 0;
    getWorkspace(renderWorkspace);
};

function main() {
    getWorkspace(renderWorkspace);
    setInterval(function () {
        if (sessionStorage.getItem("isEditing") == "0") {
            getWorkspace(renderWorkspace);
        }
    }, 3000);
}

function getWorkspace(callback) {
    fetch(workspaceByUserId)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function handleFilter(workspaces) {
    if (filterCondition == "a-z") {
        workspaces.sort((a, b) => {
            if (
                a.workspaceTitle.toLowerCase() > b.workspaceTitle.toLowerCase()
            ) {
                return 1;
            } else {
                return -1;
            }
        });
    } else if (filterCondition == "z-a") {
        workspaces.sort((a, b) => {
            if (
                a.workspaceTitle.toLowerCase() > b.workspaceTitle.toLowerCase()
            ) {
                return 1;
            } else {
                return -1;
            }
        });
        workspaces.reverse();
    } else if (filterCondition == "latest") {
        workspaces.reverse();
    } else {
        return;
    }
}

function renderWorkspace(workspaces) {
    totalWorkspaces = workspaces.length;

    let oldWorkspaces = projectList.querySelectorAll(
        ".dashboard__project-card"
    );
    oldWorkspaces.forEach((element) => {
        element.remove();
    });
    let cur = 0;
    handleFilter(workspaces);
    let newTotalWorkspaces = 0;
    
    workspaces = workspaces.filter((workspace) =>
    workspace.workspaceTitle.includes(globalKeyword)
    );

    for (const workspace of workspaces) {
        if (cur >= currentPage * 4 && cur < currentPage * 4 + 4) {
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
        newTotalWorkspaces += 1;
        cur++;
    }
    paginationRender(newTotalWorkspaces);
}

function handleCardClick(event) {
    sessionStorage.setItem("currentBoardId", event.target.id);
    sessionStorage.setItem("isEditing", "0");
}

////////////////////////////////////////////////////////////////////////
// Modal handling

modalWrapper.onclick = (event) => {
    event.stopPropagation();
    sessionStorage.setItem("isEditing", "1");
};

modalOutter.onclick = (event) => {
    modalOutter.classList.remove("dashboard__modal-create--enable");
    modalOutter.classList.add("dashboard__modal-create--disable");
    sessionStorage.setItem("isEditing", "0");
};

////////////////////////////////////////////////////////////////////////
// Add wp handling
// Call post API create new wp
// Call API add new wp to user
// Call getWorkspace -> rerender UI

projectAddBtn.onclick = (event) => {
    modalOutter.classList.remove("dashboard__modal-create--disable");
    modalOutter.classList.add("dashboard__modal-create--enable");
    modalInput.focus();
    modalInput.value = "";
};

modalInput.addEventListener("keyup", (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        modalBtn.click();
    }
});

modalBtn.onclick = (event) => {
    if (modalInput.value != "" && modalInput.value.length < 25) {
        let name = modalInput.value;
        modalOutter.classList.remove("dashboard__modal-create--enable");
        modalOutter.classList.add("dashboard__modal-create--disable");
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                workspaceTitle: name,
            }),
        };

        // Create new workspace
        fetch(createUrl, options)
            .then((response) => response.json())
            .then((workspace) => {
                let url =
                    linkWorkspaceUserUrl +
                    workspace.workspaceId.toString() +
                    "/" +
                    currentUser.toString();
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(() => {
                        let html = `
                    <div class="dashboard__project-card" onclick="handleCardClick(event)" >
                        <a href="./workspace.html" class="dashboard__project-card-link" id="${workspace.workspaceId}">
                            <h2 class="dashboard__project-card-name" id="${workspace.workspaceId}">${workspace.workspaceTitle}</h2>
                        </a>
                    </div>
                    `;
                        let para = document
                            .createRange()
                            .createContextualFragment(html);
                        projectList.appendChild(para);
                    })
                    .then(() => {
                        currentPage = 0;
                        getWorkspace(renderWorkspace);
                    });
            });

        modalInput.value = "";
    } else if (modalInput.value != "" && modalInput.value.length >= 25) {
        throwError("List name is too long!")
    } else {
        throwError("Empty project name!")
    }
};

////////////////////////////////
// Pagination
// Receive totalPages and render new UI for pagination

const pagination = $(".dashboard__pagination-wrapper");
let pages = 0;
function paginationRender(totalPages) {
    totalPages = Math.ceil(totalPages / 4);
    pages = totalPages;
    pagination.innerHTML = "";
    if (totalPages > 1) {
        let html = `
        <button class="dashboard__pagination-prev dashboard__pagination-btn btn" onclick=handlePaginationPrev(event)>Previous</button>
        `;
        let para = document.createRange().createContextualFragment(html);
        pagination.appendChild(para);
        let activeClass = "";
        for (let i = 0; i < totalPages; i++) {
            if (i == currentPage) {
                activeClass = "dashboard__pagination-btn--active";
            } else {
                activeClass = "";
            }
            html = `
            <button class="dashboard__pagination-btn btn ${activeClass}" onclick=handlePageClick(event)>${
                i + 1
            }</button>
            `;
            para = document.createRange().createContextualFragment(html);
            pagination.appendChild(para);
        }
        html = `
        <button class="dashboard__pagination-next dashboard__pagination-btn btn" onclick=handlePaginationNext(event)>Next</button>
        `;
        para = document.createRange().createContextualFragment(html);
        pagination.appendChild(para);
    }
}

function handlePageClick(event) {
    let allPages = $$(
        ".dashboard__pagination-btn:not(.dashboard__pagination-prev):not(.dashboard__pagination-next)"
    );
    allPages.forEach((page) => {
        if (currentPage + 1 != page.textContent) {
            page.classList.remove("dashboard__pagination-btn--active");
        }
    });
    currentPage = event.target.textContent - 1;
    getWorkspace(renderWorkspace);
    event.target.classList.add("dashboard__pagination-btn--active");
}

function handlePaginationPrev(event) {
    if (currentPage - 1 >= 0) {
        currentPage -= 1;
        getWorkspace(renderWorkspace);
    }
}

function handlePaginationNext(event) {
    if (currentPage + 1 <= pages - 1) {
        currentPage += 1;
        getWorkspace(renderWorkspace);
    }
}
