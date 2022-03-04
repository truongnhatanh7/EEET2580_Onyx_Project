'use strict'
const addListBtn = $('.workspace__add-list-btn')
const board = $('.workspace__board')


addListBtn.addEventListener('click', () => {
    console.log('yes')
    let html =       `  <div class="workspace__board-list">
    <h1 class="workspace__board-list-header" contenteditable="true">List 1</h1>
    <div class="workspace__board-list-task" draggable="true">
        <p class="workspace__board-list-task-content">velit3 </p>
    </div>
</div>`
    let para = document.createRange().createContextualFragment(html)
    board.appendChild(para)
})


