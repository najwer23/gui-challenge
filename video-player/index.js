window.onload = function () {
	const inputRange = document.querySelector("#videoDanceAtBarcelona .videoBar");
	const video = document.querySelector("#videoDanceAtBarcelona .video");
	const playButton = document.querySelector("#videoDanceAtBarcelona .play");
	const pauseButton = document.querySelector("#videoDanceAtBarcelona .pause");
	const fullScreenButtonOn = document.querySelector(
		"#videoDanceAtBarcelona .fullScreenOn"
	);
	const fullScreenButtonOff = document.querySelector(
		"#videoDanceAtBarcelona .fullScreenOff"
	);
	const videoWrapper = document.querySelector(
		"#videoDanceAtBarcelona .videoWrapper"
	);
	const seekBar = document.querySelector("#videoDanceAtBarcelona .seekBar");
	const videoTime = document.querySelector("#videoDanceAtBarcelona .videoTime");
	const soundOn = document.querySelector("#videoDanceAtBarcelona .soundOn");
	const soundOff = document.querySelector("#videoDanceAtBarcelona .soundOff");
	const videoControls = document.querySelector(
		"#videoDanceAtBarcelona .videoControls"
	);
	let timeoutOnFullScreen;
	let timeoutOnKey;
	let runTimerOnFullScreen = false;
	document.onkeydown = checkKey;

	playButton.addEventListener("click", playVidoe);
	pauseButton.addEventListener("click", stopVideo);

	//color seekbar in video on chrome
	inputRange.addEventListener("input", function () {
		inputRange.style.setProperty("--val", +inputRange.value);
	});

	soundOn.addEventListener("click", function () {
		video.muted = true;
		soundOn.style.display = "none";
		soundOff.style.display = "block";
	});

	soundOff.addEventListener("click", function () {
		soundOn.style.display = "block";
		soundOff.style.display = "none";
		video.muted = false;
	});

	fullScreenButtonOn.addEventListener("click", function () {
		if (video.requestFullscreen) {
			videoWrapper.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
			videoWrapper.mozRequestFullScreen(); // Firefox
		} else if (video.webkitRequestFullscreen) {
			videoWrapper.webkitRequestFullscreen(); // Chrome and Safari
		} else if (video.msRequestFullscreen) {
			videoWrapper.msRequestFullscreen();
		}
	});

	fullScreenButtonOff.addEventListener("click", function () {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	});

	seekBar.addEventListener("mousedown", function () {
		stopVideo();
	});

	var flagaVideoStop = false;

	seekBar.addEventListener("change", function () {
		stopVideo();
		console.log("change seekbar")
		let time = video.duration * (seekBar.value / 100);
		video.currentTime = time;
		inputRange.style.setProperty("--val", +inputRange.value);
		videoTime.innerHTML = timeInHours(video.currentTime) + " / " + timeInHours(video.duration);

		setTimeout(function () {
			playVidoe();
		}, 500);
	});

	video.addEventListener("timeupdate", function () {
		if (flagaVideoStop) {
			return;
		}
		if (!flagaVideoStop) {
			let value = (100 / video.duration) * video.currentTime;
			seekBar.value = value;
			inputRange.style.setProperty("--val", +inputRange.value);
			videoTime.innerHTML = timeInHours(video.currentTime) + " / " + timeInHours(video.duration);
			if (video.currentTime == video.duration) {
				playButton.style.display = "block";
				pauseButton.style.display = "none";
			}
		}

	});

	function playVidoe() {
		flagaVideoStop = false;
		video.play();
		playButton.style.display = "none";
		pauseButton.style.display = "block";
	}

	function stopVideo() {
		flagaVideoStop = true;
		video.pause();
		playButton.style.display = "block";
		pauseButton.style.display = "none";
	}

	function timeInHours(timeInSeconds) {
		let seconds = Math.floor(+timeInSeconds.toFixed());
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(seconds / 3600);

		seconds = seconds == 60 ? 0 : seconds;
		minutes = minutes == 60 ? 0 : minutes;

		hours = hours < 10 ? "0" + hours : hours;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		return hours + ":" + minutes + ":" + seconds;
	}

	function checkKey(e) {
		e = e || window.event;
		if (runTimerOnFullScreen) {
			videoControls.style.opacity = 1;
		}
		if (e.keyCode == 9) {
			// tab
			videoControls.style.display = "flex";
		}
		if (e.keyCode == 32) {
			//space
			videoControls.style.display = "flex";
			if (video.paused) {
				playVidoe();
			} else {
				stopVideo();
			}
		}
		clearTimeout(timeoutOnKey);
		timeoutOnKey = setTimeout(function () {
			videoControls.style.display = "";
			if (runTimerOnFullScreen) {
				videoControls.style.opacity = 0;
			}
		}, 1500);
	}

	document.addEventListener("fullscreenchange", function () {
		if (document.fullscreenElement) {
			fullScreenButtonOn.style.display = "none";
			fullScreenButtonOff.style.display = "block";
			videoControls.style.opacity = 1;
			runTimerOnFullScreen = true;
		} else {
			fullScreenButtonOn.style.display = "block";
			fullScreenButtonOff.style.display = "none";
			videoControls.style.opacity = 1;
			runTimerOnFullScreen = false;
			clearTimeout(timeoutOnFullScreen);
		}
	});

	document.addEventListener("mousemove", function () {
		if (runTimerOnFullScreen) {
			clearTimeout(timeoutOnFullScreen);
			videoControls.style.opacity = 1;
			timeoutOnFullScreen = setTimeout(function () {
				videoControls.style.opacity = 0;
			}, 1500);
		}
	});
};
