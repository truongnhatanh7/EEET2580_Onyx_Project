let currentDate;

function datepicker(node) {
    let tempDate = new Date()
    currentDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
    renderDay(node, currentDate)
    addNext(node);
    addPrev(node);
}

function addNext(node) {
    let next =  $('.datepicker__next');
    next.addEventListener('click', () => {
        currentDate = getNextMonth(currentDate);
        renderDay(node, currentDate);
    })
}

function addPrev(node) {
    let prev = $('.datepicker__prev');
    prev.addEventListener('click', () => {
        currentDate = getPrevMonth(currentDate);
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

function getPrevMonth(date) {
    if (date.getMonth() == 1) {
        return new Date(date.getFullYear() - 1, 12, 1);
    } else {
        return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    }
}

function renderDay(node) {
    // Para "date" has to start at day 1
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

    let day = currentDate.getDay();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    console.log("Starting day: ", day)
    let callendar = node.parentNode.querySelector('.datepicker');
    let callendarHeader = callendar.querySelector('.datepicker__year');
    callendarHeader.textContent = monthMap[month] + " " + year;
    let callendarDaysWrapper = callendar.querySelector('.datepicker__numday-wrapper')
    console.log(day)
    renderInnerDay(callendarDaysWrapper, day - 1, currentDate);
}

function renderInnerDay(node, startingDay, currentDate) {
    let allCells = node.querySelectorAll('.datepicker__numday');
    if (startingDay < 0) {
        startingDay = 6; // -1 is Sunday
    }

    // Reset css for cells
    allCells.forEach(cell => {
        cell.textContent = -1;
        cell.classList.add('reset');
        cell.classList.remove('numday_disable')
    })

    let dayOfMonth = calculateDayOfMonth(currentDate);
    console.log(currentDate)
    console.log("Day of month: " + dayOfMonth);
    let curDay = 1;
    let endDay = startingDay + dayOfMonth;
    // Fill 1 -> days in that month
    for (let i = startingDay; i < startingDay + dayOfMonth; i++) {
        allCells[i].textContent = curDay;
        curDay++;
    }

    // Fill end
    curDay = 1;
    for (let i = endDay; i < allCells.length; i++) {
        allCells[i].textContent = curDay;
        allCells[i].classList.add('numday_disable');
        curDay++;
    }

    // Fill start
    let lastMonthDate = calculateLastDay(currentDate);
    for (let i = startingDay - 1; i >= 0; i--) {
        allCells[i].textContent = lastMonthDate;
        allCells[i].classList.add('numday_disable');

        lastMonthDate--;
    }

    let allActiveCells = node.querySelectorAll('.datepicker__numday:not(.numday_disable)')
    allActiveCells.forEach(cell => {
        cell.onclick = () => {
            console.log(node)
            // taskSettingDatepicker.innerText = new Date(currentDate.getFullYear(), currentDate.getMonth(), cell.innerText).toISOString();
            console.log("Selected month ", currentDate.getMonth())
            console.log("Selected year ", currentDate.getFullYear())
            let tempDay =  new Date(currentDate.getFullYear(), currentDate.getMonth(), cell.innerText)
            let tzoffset = tempDay.getTimezoneOffset() * 60000;
            console.log(tzoffset);
            let localISOTime = (new Date(tempDay.getTime() - tzoffset)).toISOString();
            sessionStorage.setItem("deadline", localISOTime)
            // fetch patch
            datepickerJS.classList.add('disable')

        }
    })
}

function calculateLastDay(date) {
    if (date.getMonth() == 0) { // Before Jan -> Dec, Dec has 31 days
        return 31;
    } 
    let d = new Date(date.getFullYear(), date.getMonth(), 0);
    return d.getDate();
}

function calculateDayOfMonth(date) {
    console.log("Inner func calculateDayOfMonth: ", date)
    let d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log(d);
    return d.getDate();
}
