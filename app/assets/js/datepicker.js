var currentDate = new Date();

function datepicker(node) {
    currentDate = new Date();
    renderDay(node, new Date())
    addNext(node);
}

function addNext(node) {
    let next =  $('.datepicker__next');
    currentDate = getNextMonth(currentDate);
    console.log(getNextMonth(currentDate))
    next.addEventListener('click', () => {
        renderDay(node, currentDate);
    })
}

function getNextMonth(date) {
    if (date.getMonth() == 11) {
        return new Date(date.getFullYear() + 1, 0, 1);
    } else {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
}

function renderDay(node, date) {

    let dow = {
        0: "Mon",
        1: "Tue",
        2: "Wed",
        3: "Thu",
        4: "Fri",
        5: "Sat",
        6: "Sun"
    }

    let monthMap = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec"
    }
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    let callendar = node.parentNode.querySelector('.datepicker');
    let callendarHeader = callendar.querySelector('.datepicker__year');
    callendarHeader.textContent = monthMap[month] + " " + year;
    let callendarDaysWrapper = callendar.querySelector('.datepicker__numday-wrapper')
    renderInnerDay(callendarDaysWrapper, day, date);
}

function renderInnerDay(node, startingDay, currentDate) {
    let allCells = node.querySelectorAll('.datepicker__numday');

    allCells.forEach(cell => {
        cell.textContent = -1;
        cell.style.backgroundColor = "white";
    })
    let dayOfMonth = calculateDayOfMonth(currentDate);
    let curDay = 1;
    let endDay = startingDay + dayOfMonth;
    for (let i = startingDay; i < startingDay + dayOfMonth; i++) {
        allCells[i].textContent = curDay;
        curDay++;
    }
    curDay = 1;
    for (let i = startingDay + dayOfMonth; i < allCells.length; i++) {
        allCells[i].textContent = curDay;
        allCells[i].style.backgroundColor = '#ccc';

        curDay++;
    }
    let lastMonthDate = calculateLastDay(currentDate);
    console.log(lastMonthDate);
    for (let i = startingDay - 1; i >= 0; i--) {
        allCells[i].textContent = lastMonthDate;
        allCells[i].style.backgroundColor = '#ccc';
        lastMonthDate--;
    }
}

function calculateLastDay(date) {
    if (date.getMonth() == 0) { // Before Jan -> Dec, Dec has 31 days
        return 31;
    } 
    let d = new Date(date.getFullYear(), date.getMonth(), 0);
    console.log(d)
    return d.getDate();
}

function calculateDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}
