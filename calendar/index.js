document.addEventListener("DOMContentLoaded", () => {

	const LANGUAGE = "en-En";
	let calendar = {
		id: "#cal1",
		yearMin: 1990,
		yearMax: 2050,
	}
	// calendar = updateCalendar(calendar, getStringFromDate(new Date()));
	calendar = updateCalendar(calendar, "11-02-2023");
	createDropdownCalendar(calendar);

	console.log(calendar)


	function createDropdownCalendar(calendar) {
		let calendarElement = document.querySelector(calendar.id);
		let container = document.createElement("div");
		container.className = "cal-container";

		let containerHeader = document.createElement("div");
		containerHeader.className = "cal-header";
		containerHeader.innerHTML = `
			<div class="cal-arrow-left"><</div>
			<div> ${calendar.datePicked.short} </div>
			<div class="cal-arrow-right">></div>
		`;

		let containerDays = document.createElement("div");
		containerDays.className = "cal-days";

		for (let i=0; i<calendar.weekDaysNameShort.length; i++ ) {
			containerDays.innerHTML += `
				<div class="cal-day"> ${calendar.weekDaysNameShort[i]} </div>
			`;
		}

		let startDay = getDateFromString("01-"+ calendar.datePicked.monthReal + "-" + calendar.datePicked.year).getDay();
		for (let i = 1; i <= calendar.daysInMonth+startDay; i++) {

			if (i<=startDay) {
				containerDays.innerHTML += `
					<div class="cal-day-number blank"></div>
				`;
			}

			if (i == (calendar.datePicked.dayOfMonth + startDay)) {
				containerDays.innerHTML += `
					<div class="cal-day-number active"> ${[i - startDay]} </div>
				`;
				continue;
			}

			if (i>startDay) {
				containerDays.innerHTML += `
					<div class="cal-day-number"> ${[i-startDay]} </div>
				`;
			}
		}

		container.append(containerHeader)
		container.append(containerDays);
		calendarElement.value = calendar.datePicked.short;
		calendarElement.parentNode.append(container);


		container.addEventListener("click", function (e) {

			// click on arrow left
			if (e.target.className == "cal-arrow-left") {
				container.remove();
				let dateMinusMonth = getStringFromDate(addMonths(calendar.datePicked.dateObj,-1))
				calendar = updateCalendar(calendar, dateMinusMonth);
				createDropdownCalendar(calendar);
			}

			// click on arrow right
			if (e.target.className == "cal-arrow-right") {
				container.remove();
				let dateAddMonth = getStringFromDate(addMonths(calendar.datePicked.dateObj,1))
				calendar = updateCalendar(calendar, dateAddMonth);
				createDropdownCalendar(calendar);
			}

			// click on day
			if (e.target.className == "cal-day-number") {
				removeActiveClassFromChildren(this, ".cal-day-number");
				e.target.classList.add("active");
				calendar = updateCalendar(calendar, getStringFromDate(new Date(calendar.datePicked.year, calendar.datePicked.month, e.target.innerHTML)));
				calendarElement.value = calendar.datePicked.short;
			}
		})

	}

	document.querySelector(calendar.id).addEventListener("click", function (e) {

	})
	// carouselContainer.addEventListener("click", function (e) {
	// 	if (e.target.closest(".carousel-arrow.right")) {
	// 		nextPicture();
	// 	}
	// 	if (e.target.closest(".carousel-arrow.left")) {
	// 		prevPicture();
	// 	}
	// });

	function removeActiveClassFromChildren(container, name) {
		let itemsWithActiveClass = container.querySelectorAll(name);
		for (let i = 0; i < itemsWithActiveClass.length; i++) {
			itemsWithActiveClass[i].classList.remove("active");
		}
	}

	function addMonths(date, months) {
		let d = date.getDate();
		date.setMonth(date.getMonth() + +months);
		if (date.getDate() != d) {
			date.setDate(0);
		}
		return date;
	}

	function getStringFromDate(d) {
		let month = d.getMonth() + 1;
		let day = d.getDate();
		let year = d.getFullYear();
		return `${day<10? "0"+day : day}-${month<10? "0"+month : month}-${year}`
	}

	function updateCalendar(obj, date) {
		return {...obj, ...{
			datePicked: setUpDateByStr(date),
			weekDaysName: getWeekDays("long"),
			weekDaysNameShort: getWeekDays("short"),
			monthsName: getMonths("long"),
			monthsNameShort: getMonths("short"),
			daysInMonth: daysInMonth(date),
		}};
	}

	function daysInMonth(s) {
		let d = getDateFromString(s);
		return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
	}

	function getDateFromString(s) {
		let p = s.split("-");
		return new Date( p[2], p[1] - 1, p[0]);
	}

	// dd-mm-yyyy
	function setUpDateByStr(s) {
		let d = getDateFromString(s)

		return {
			dateObj: d,
			short: s,
			month: d.getMonth(),
			monthReal: d.getMonth() + 1,
			monthName: d.toLocaleDateString(LANGUAGE, { month: "long" }),
			monthNameShort: d.toLocaleDateString(LANGUAGE, { month: "short" }),
			year: d.getFullYear(),
			ms: d.getTime(),
			dayOfMonth: d.getDate(),
			dayOfWeekNumber: d.getDay(),
			dayOfWeekName: d.toLocaleDateString(LANGUAGE, { weekday: "long" }),
			dayOfWeekNameShort: d.toLocaleDateString(LANGUAGE, { weekday: "short" }),
			timeZone: d.getTimezoneOffset(),
		};
	}

	function getWeekDays(type) {
		const d = new Date(2017, 0, 1); // sunday
		const weekDays = [];
		for (i = 0; i < 7; i++) {
			weekDays.push(d.toLocaleDateString(LANGUAGE, { weekday: type }));
			d.setDate(d.getDate() + 1);
		}
		return weekDays;
	}

	function getMonths(type) {
		const months = [];
		const d = new Date();
		for (let i = 0; i < 12; i++) {
			d.setMonth(i);
			months.push(d.toLocaleString(LANGUAGE, { month: type }));
		}
		return months;
	}
});

