document.addEventListener("DOMContentLoaded", () => {

	const LANGUAGE = "en-En";
	let calendar = {
		id: "#cal1",
		yearMin: 1990,
		yearMax: 2050,
	}
	calendar = updateCalendar(calendar, getStringFromDate(new Date()));

	console.log(calendar)







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

