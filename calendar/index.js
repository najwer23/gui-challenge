document.addEventListener("DOMContentLoaded", () => {

	const LANGUAGE = "en-En";
	const WEEK_DAYS = getWeekDays("long");
	const WEEK_DAYS_SHORT = getWeekDays("short");
	const MONTHS = getMonths("long")
	const MONTHS_SHORT = getMonths("short")

	let date = setUpDateByStr("12-03-2022");

	console.log(date);
	console.log(WEEK_DAYS);
	console.log(WEEK_DAYS_SHORT);
	console.log(MONTHS)
	console.log(MONTHS_SHORT)

	// dd-mm-yyyy
	function setUpDateByStr(s) {
		let p = s.split("-")
		let day = p[0];
		let month = p[1];
		let year = p[2]

		let d = new Date(year,month-1,day)

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

