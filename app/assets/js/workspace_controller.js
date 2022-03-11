
let currentWorkspaceId = -1;

export function setId(id) {
    this.currentWorkspaceId = id;
}

export function getId() {
    return this.currentWorkspaceId;
}