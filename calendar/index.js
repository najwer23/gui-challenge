document.addEventListener("DOMContentLoaded", () => {

	const LANGUAGE = "en-En";
	let calendar = updateCalendar("12-09-1995");
	calendar = updateCalendar("11-03-1995");
	console.log(calendar)

	function updateCalendar(date) {
		return {
			datePicked: setUpDateByStr(date),
			weekDaysName: getWeekDays("long"),
			weekDaysNameShort: getWeekDays("short"),
			monthsName: getMonths("long"),
			monthsNameShort: getMonths("short"),
			yearMin: 1990,
			yearMax: 2050,
			daysInMonth: daysInMonth(date),
		};
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
		const d = new Date(2017, 0, 2); //monday
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

