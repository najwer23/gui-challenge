document.addEventListener("DOMContentLoaded", () => {
    var carouselDataIn = {
			"#carousel1": {
				isMousedownActive: false,
				isMousemoveActive: false,
				translationX: 0,
				mouseStartX: 0,
				children: null,
				oneLenghtOfSlider: 0,
				oneFrame: 0,
			},
		};

		initCarousel();

		function initCarousel() {
			let carouselDataInKeys = Object.keys(carouselDataIn);

			for (let i = 0; i < carouselDataInKeys.length; i++) {
				if (document.querySelector(carouselDataInKeys[i])) {
					calculateWidthForCarousel(carouselDataInKeys[i]);
					calculateProgressBar(carouselDataInKeys[i]);
					addMouseEventsToSlider(carouselDataInKeys[i]);
				}
			}
		}

		function calculateProgressBar(nameOfElement) {
			let progressBarContainer = document.querySelector( nameOfElement + "-progress-bar");
			let numberOfRectangles = Math.ceil(carouselDataIn[nameOfElement].oneLenghtOfSlider / carouselDataIn[nameOfElement].oneFrame);
			let div;

			progressBarContainer.innerHTML = "";

			for (let i = 0; i < numberOfRectangles; i++) {
				div = document.createElement("div");
				div.id = "carousel-progress-bar-item-" + i;
				div.className = "carousel-progress-bar-item";
				if (i == 0) {
					div.classList.add("active");
					translationForProgressBar(0);
				}
				progressBarContainer.appendChild(div);
			}

			function translationForProgressBar(id) {
				let translation =(-carouselDataIn[nameOfElement].oneFrame * id) % carouselDataIn[nameOfElement].oneLenghtOfSlider;
				document.querySelector(nameOfElement).style.transform = "translateX(" + translation + "px)";
				carouselDataIn[nameOfElement].translationX = translation;
			}

			progressBarContainer.addEventListener("click", function (e) {
				if (e.target.matches(".carousel-progress-bar-item")) {
					let id = e.target.id.match(/\d+/)[0];
					translationForProgressBar(id);
					removeActiveClassFromChildren(".carousel-progress-bar-item.active");
					e.target.classList.add("active");
				}
			});
		}

		function removeActiveClassFromChildren(name) {
			let itemsWithActiveClass = document.querySelectorAll(name);
			for (let i = 0; i < itemsWithActiveClass.length; i++) {
				itemsWithActiveClass[i].classList.remove("active");
			}
		}

		function calculateWidthForCarousel(nameOfElement) {
			let carousel = document.querySelector(nameOfElement);
			carouselDataIn[nameOfElement].oneFrame = carousel.parentElement.offsetWidth;
			carouselDataIn[nameOfElement].oneLenghtOfSlider = 0;
			document.querySelectorAll(".carousel-item img").forEach((x) => {
				x.style.width = carouselDataIn[nameOfElement].oneFrame + "px";
				carouselDataIn[nameOfElement].oneLenghtOfSlider += carouselDataIn[nameOfElement].oneFrame;
			});
		}

		function addMouseEventsToSlider(nameOfElement) {
			const carousel = document.querySelector(nameOfElement);
			const carouselContainer = document.querySelector(".carousel-container");

			carouselContainer.addEventListener("click", function (e) {
				if (e.target.closest(".carousel-arrow.right")) {
					nextPicture();
				}
				if (e.target.closest(".carousel-arrow.left")) {
					prevPicture();
				}
			});

			function prevPicture() {
					let translation = (-(carouselDataIn[nameOfElement].oneLenghtOfSlider - carouselDataIn[nameOfElement].oneFrame) + carouselDataIn[nameOfElement].translationX) % carouselDataIn[nameOfElement].oneLenghtOfSlider;
					carousel.style.transform = "translateX(" + translation + "px)";
					carouselDataIn[nameOfElement].translationX = translation;
					addClassActiveToProgressBar();
			}

			function nextPicture() {
				let translation = (-carouselDataIn[nameOfElement].oneFrame + carouselDataIn[nameOfElement].translationX) % carouselDataIn[nameOfElement].oneLenghtOfSlider;
				carousel.style.transform = "translateX(" + translation + "px)";
				carouselDataIn[nameOfElement].translationX = translation;
				addClassActiveToProgressBar();
			}

			function addClassActiveToProgressBar() {
				let choosenframe = Math.floor(Math.abs( carouselDataIn[nameOfElement].translationX / carouselDataIn[nameOfElement].oneFrame) % (carouselDataIn[nameOfElement].oneLenghtOfSlider / carouselDataIn[nameOfElement].oneFrame));
				removeActiveClassFromChildren(".carousel-progress-bar-item.active");
				document.querySelector("#carousel-progress-bar-item-" + choosenframe).classList.add("active");
			}

			//firefox bug fix
			carousel.querySelectorAll(".carousel-item").forEach((item) => {
				item.addEventListener("mousedown", (e) => e.preventDefault());
			});

			window.addEventListener("resize", function (event) {
				calculateWidthForCarousel(nameOfElement);
				calculateProgressBar(nameOfElement);
			});

			var THRESHOLD = 15;
			var x = (y = x1 = y1 = 0);
			var recordedTime = new Date().getTime();
			setSwipesEvent(carousel);

			function setSwipesEvent(element) {
				element.addEventListener("touchstart", function (e) {
					50 < new Date().getTime() - recordedTime && ((x = parseInt(e.changedTouches[0].pageX, 10)),
					(y = parseInt(e.changedTouches[0].pageY, 10)),
					(recordedTime = new Date().getTime()));
				});

				element.addEventListener("touchend", function (e) {
					x1 = x;
					y1 = y;
					x = parseInt(e.changedTouches[0].pageX, 10);
					y = parseInt(e.changedTouches[0].pageY, 10);
					recordedTime = new Date().getTime();
					direct(element);
				});

				element.addEventListener("mousedown", function (e) {
					50 < new Date().getTime() - recordedTime &&
						((x = e.clientX),
						(y = e.clientY),
						(recordedTime = new Date().getTime()));
				});

				element.addEventListener("mouseup", function (e) {
					x1 = x;
					y1 = y;
					x = e.clientX;
					y = e.clientY;
					recordedTime = new Date().getTime();
					direct(element);
				});
			}

			function direct(element) {
				if (!( parseInt(Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1)), 10) < THRESHOLD)) {
					if (x1 - x > Math.abs(y - y1)) {
						//console.log("left")
						nextPicture();
					}
					if (x - x1 > Math.abs(y - y1)) {
						//console.log("right")
						prevPicture();
					}
					if (y1 - y > Math.abs(x - x1)) {
						//console.log("up")
					}
					if (y - y1 > Math.abs(x - x1)) {
						//console.log("down")
					}
				} else {
					if (element.id == f1.id) {
						//if click
					}
				}
			}
		}
});
