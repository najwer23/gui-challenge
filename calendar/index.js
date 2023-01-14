document.addEventListener("DOMContentLoaded", () => {

	const LANGUAGE = "en-En";
	let calendar = {
		id: "#cal1",
		blockRange: [
			"01-01-2023;14-01-2023",
			"01-01-2024;31-12-2024"
		],
		blockDate: [
			"12-03-2023",
			"15-03-2023",
			"13-02-2023",
			"14-02-2023",
			"15-02-2023"
		]
	}

	calendar = updateCalendar(calendar, getStringFromDate(new Date()));

	document.querySelector(calendar.id).addEventListener("click", function(e) {
		if (this.classList.contains("active")) {
			this.parentNode.querySelector(".cal-container").remove()
			this.classList.remove("active");
		} else {
			createDropdownCalendar(calendar, true);
			this.classList.add("active");
		}
	})

	document.addEventListener("click", function (e) {
    if(!(e.target.closest(".cal-container") || e.target.closest(calendar.id))) {
			if (document.querySelector(".cal-container")) {
				document.querySelector(".cal-container").remove();
				document.querySelector(calendar.id).classList.remove("active");
			}
		}
	});

	console.log(calendar)







	function createDropdownCalendar(calendar, isClick) {
		let calendarElement = document.querySelector(calendar.id);
		let container = document.createElement("div");
		container.className = "cal-container";

		if (isClick) {
			calendar = updateCalendar(calendar, calendarElement.value || calendar.datePicked.short);
		}

		let containerHeader = document.createElement("div");
		containerHeader.className = "cal-header";
		containerHeader.innerHTML = `
			<div class="cal-arrow-left"><</div>
				<div class="cal-current-date" >
					<div class="cal-current-date-day"> ${addZero(calendar.datePicked.dayOfMonth)}</div>
					<div> - </div>
					<div class="cal-current-date-month"> ${addZero(calendar.datePicked.monthReal)} </div>
					<div> - </div>
					<div class="cal-current-date-year"> ${calendar.datePicked.year} </div>
				</div>
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
		let typeClass = "";
		let typeValue = "";

		for (let i = 1; i <= calendar.daysInMonth+startDay; i++) {
			if (i<=startDay) {
				typeValue = "";
				typeClass = "blank";
			} else if (dateIsBlocked(calendar, calendar.datePicked.year, calendar.datePicked.monthReal, i-startDay)) {
				typeValue = i - startDay;
				typeClass = "blocked";
			} else if (i == (calendar.datePicked.dayOfMonth + startDay)) {
				typeValue = i - startDay;
				typeClass = "active";
			} else if (i>startDay) {
		 		typeValue = i - startDay;
				typeClass = "";
			}

			containerDays.innerHTML += `
				<div class="cal-day-number ${typeClass}">${typeValue}</div>
			`;
		}

		container.append(containerHeader)
		container.append(containerDays);
		calendarElement.parentNode.append(container);

		container.addEventListener("click", function (e) {
			// click on arrow left
			if (e.target.classList.contains("cal-arrow-left")) {
				container.remove();
				let dateMinusMonth = getStringFromDate(addMonths(calendar.datePicked.dateObj,-1))
				calendar = updateCalendar(calendar, dateMinusMonth);
				createDropdownCalendar(calendar);
			}

			// click on arrow right
			if (e.target.classList.contains("cal-arrow-right")) {
				container.remove();
				let dateAddMonth = getStringFromDate(addMonths(calendar.datePicked.dateObj,1))
				calendar = updateCalendar(calendar, dateAddMonth);
				createDropdownCalendar(calendar);
			}

			// click on day
			if (e.target.classList.contains("cal-day-number")) {
				if (e.target.classList.contains("blocked")) {
					return;
				}

				removeActiveClassFromChildren(this, ".cal-day-number");
				e.target.classList.add("active");
				calendar = updateCalendar(calendar, getStringFromDate(new Date(calendar.datePicked.year, calendar.datePicked.month, e.target.innerHTML)));
				container.querySelector(".cal-current-date-day").innerHTML = addZero(calendar.datePicked.dayOfMonth)
			}

			if (e.target.classList.contains("cal-current-date-month")) {
				container.remove();
				let calendarElement = document.querySelector(calendar.id);
				let container2 = document.createElement("div");
				container2.className = "cal-container";

				let containerMonths = document.createElement("div");
				containerMonths.className = "cal-months";

				///
				for (let i=0; i<calendar.monthsNameShort.length; i++ ) {
					containerMonths.innerHTML += `
						<div class="cal-month ${i == calendar.datePicked.month ? "active": ""}" value=${i}> ${calendar.monthsNameShort[i]} </div>
					`;
				}

				container2.append(containerMonths);
				calendarElement.parentNode.append(container2);

				container2.addEventListener("click", function (e) {
					if (e.target.classList.contains("cal-month")) {
						container2.remove();
						calendar = updateCalendar(calendar, getStringFromDate(new Date(calendar.datePicked.year, e.target.getAttribute("value"), calendar.datePicked.dayOfMonth)));
						createDropdownCalendar(calendar);
					}
				})
			}

			if (e.target.classList.contains("cal-current-date-year")) {
				createCalendarFullOfYears(container, calendar);
			}
		})
	}

	function createCalendarFullOfYears(oldContainer, calendar) {
		oldContainer.remove();
		let calendarElement = document.querySelector(calendar.id);
		let container2 = document.createElement("div");
		container2.className = "cal-container years";

		let containerYears = document.createElement("div");
		containerYears.className = "cal-years";

		for (let i = calendar.datePicked.year-4; i<=calendar.datePicked.year+4; i++ ) {
			containerYears.innerHTML += `
				<div class="cal-year ${i == calendar.datePicked.year ? "active": ""}" value=${i}> ${i} </div>
			`;
		}

		let containerArrowLeft = document.createElement("div");
		containerArrowLeft.className = "cal-year-container-arrow-left";
		containerArrowLeft.innerHTML += `
			<div class="cal-year-arrow-left"> < </div>
		`;

		let containerArrowRight = document.createElement("div");
		containerArrowRight.className = "cal-year-container-arrow-right";
		containerArrowRight.innerHTML += `
			<div class="cal-year-arrow-right"> > </div>
		`;

		container2.append(containerArrowLeft);
		container2.append(containerYears);
		container2.append(containerArrowRight);

		calendarElement.parentNode.append(container2);

		container2.addEventListener("click", function (e) {
			if (e.target.classList.contains("cal-year")) {
				container2.remove();
				calendar = updateCalendar(calendar, getStringFromDate(new Date(e.target.getAttribute("value"), calendar.datePicked.month, calendar.datePicked.dayOfMonth)));
				createDropdownCalendar(calendar);
			}

			if (e.target.classList.contains("cal-year-arrow-right")) {
				container2.remove();
				calendar = updateCalendar(calendar, getStringFromDate(new Date( calendar.datePicked.year+9, calendar.datePicked.month, calendar.datePicked.dayOfMonth)));
				createCalendarFullOfYears(container2, calendar);
			}

			if (e.target.classList.contains("cal-year-arrow-left")) {
				container2.remove();
				calendar = updateCalendar(calendar, getStringFromDate(new Date( calendar.datePicked.year-9, calendar.datePicked.month, calendar.datePicked.dayOfMonth)));
				createCalendarFullOfYears(container2, calendar);
			}

		})
	}

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

	function addZero(d) {
		return d<10 ? ("0"+d) : d
	}

	function getStringFromDate(d) {
		let month = d.getMonth() + 1;
		let day = d.getDate();
		let year = d.getFullYear();
		return `${addZero(day)}-${addZero(month)}-${year}`;
	}

	function dateIsBlocked(calendar, year, month, day) {

		// check if specific date is blocked
		let arr = calendar.blockDate;
		let dateTest = (new Date(year,month-1,day)).getTime();
		let isBlocked = arr.map(x=>getDateFromString(x).getTime()).includes(dateTest);
		if (isBlocked) return true;

		// check if range is blocked
		arr = calendar.blockRange;
		let s;

		for(let i=0; i<arr.length; i++) {
			s = arr[i].split(";");

			if (( dateTest >= getDateFromString(s[0]).getTime()) && (dateTest <= getDateFromString(s[1]).getTime())) {
				return true;
			}
		}

		return false;
	}


	function updateCalendar(obj, date) {
		if (!dateIsBlocked(obj, setUpDateByStr(date).year, setUpDateByStr(date).monthReal, setUpDateByStr(date).dayOfMonth)) {
			document.querySelector(obj.id).value = setUpDateByStr(date).short;
		}

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

