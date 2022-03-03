'use strict'
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const draggables = $$('.workspace__board-list-task')
const containers = $$('.workspace__board-list')

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('workspace__board-list-task--dragging')

    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('workspace__board-list-task--dragging')

    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        console.log(afterElement)
        const draggable = $('.workspace__board-list-task--dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        } else {
            // console.log('befroe')
            container.insertBefore(draggable, afterElement)
        }
    })

})

function getDragAfterElement(container, yMousePos) {
    const draggableElements = [...container.querySelectorAll('.workspace__board-list-task:not(.workspace__board-list-task--dragging)')]
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = yMousePos - box.top - box.height / 2
        if (offset < 0 && offset > closest.offest) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offest: Number.NEGATIVE_INFINITY }).element

}