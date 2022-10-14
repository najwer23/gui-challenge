document.addEventListener("DOMContentLoaded", () => {
    var carouselDataIn = {
			"#carousel1": {},
			"#carousel2": {}
		};

		initCarousel();

		function initCarousel() {
			let carouselDataInKeys = Object.keys(carouselDataIn);

			for (let i = 0; i < carouselDataInKeys.length; i++) {

				carouselDataIn[carouselDataInKeys[i]] = {
					...carouselDataIn[carouselDataInKeys[i]],
					...{
						isMousedownActive: false,
						isMousemoveActive: false,
						translationX: 0,
						mouseStartX: 0,
						oneLenghtOfSlider: 0,
						oneFrame: 0,
					}
				}

				if (document.querySelector(carouselDataInKeys[i])) {
					calculateWidthForCarousel(carouselDataInKeys[i]);
					calculateProgressBar(carouselDataInKeys[i]);
					addMouseEventsToSlider(carouselDataInKeys[i]);
				}
			}
		}

		function calculateProgressBar(elementName) {
			let carousel = document.querySelector(elementName)
			let progressBarContainer = carousel.parentNode.parentNode.querySelector(".carousel-progress-bar");
			let numberOfRectangles = Math.ceil(carouselDataIn[elementName].oneLenghtOfSlider / carouselDataIn[elementName].oneFrame);
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
				let translation =(-carouselDataIn[elementName].oneFrame * id) % carouselDataIn[elementName].oneLenghtOfSlider;
				document.querySelector(elementName).style.transform = "translateX(" + translation + "px)";
				carouselDataIn[elementName].translationX = translation;
			}

			progressBarContainer.addEventListener("click", function (e) {
				if (e.target.matches(".carousel-progress-bar-item")) {
					let id = e.target.id.match(/\d+/)[0];
					translationForProgressBar(id);
					removeActiveClassFromChildren(this,".carousel-progress-bar-item.active");
					e.target.classList.add("active");
				}
			});
		}

		function removeActiveClassFromChildren(container, name) {
			let itemsWithActiveClass = container.querySelectorAll(name);
			for (let i = 0; i < itemsWithActiveClass.length; i++) {
				itemsWithActiveClass[i].classList.remove("active");
			}
		}

		function calculateWidthForCarousel(elementName) {
			let carousel = document.querySelector(elementName);
			carouselDataIn[elementName].oneFrame = carousel.parentElement.offsetWidth;
			carouselDataIn[elementName].oneLenghtOfSlider = 0;
			document.querySelectorAll(elementName + " .carousel-item img").forEach((x) => {
				x.style.width = carouselDataIn[elementName].oneFrame + "px";
				carouselDataIn[elementName].oneLenghtOfSlider += carouselDataIn[elementName].oneFrame;
			});
		}

		function addMouseEventsToSlider(elementName) {
			const carousel = document.querySelector(elementName);
			const carouselContainer = carousel.parentNode;

			carouselContainer.addEventListener("click", function (e) {
				if (e.target.closest(".carousel-arrow.right")) {
					nextPicture();
				}
				if (e.target.closest(".carousel-arrow.left")) {
					prevPicture();
				}
			});

			function prevPicture() {
					let translation = (-(carouselDataIn[elementName].oneLenghtOfSlider - carouselDataIn[elementName].oneFrame) + carouselDataIn[elementName].translationX) % carouselDataIn[elementName].oneLenghtOfSlider;
					carousel.style.transform = "translateX(" + translation + "px)";
					carouselDataIn[elementName].translationX = translation;
					addClassActiveToProgressBar();
			}

			function nextPicture() {
				let translation = (-carouselDataIn[elementName].oneFrame + carouselDataIn[elementName].translationX) % carouselDataIn[elementName].oneLenghtOfSlider;
				carousel.style.transform = "translateX(" + translation + "px)";
				carouselDataIn[elementName].translationX = translation;
				addClassActiveToProgressBar();
			}

			function addClassActiveToProgressBar() {
				let choosenframe = Math.floor(Math.abs( carouselDataIn[elementName].translationX / carouselDataIn[elementName].oneFrame) % (carouselDataIn[elementName].oneLenghtOfSlider / carouselDataIn[elementName].oneFrame));
				removeActiveClassFromChildren(document.querySelector(elementName).parentNode.parentNode, ".carousel-progress-bar-item.active");
				document.querySelector(elementName).parentNode.parentNode.querySelector("#carousel-progress-bar-item-" + choosenframe).classList.add("active");
			}

			//firefox bug fix
			carousel.querySelectorAll(".carousel-item").forEach((item) => {
				item.addEventListener("mousedown", (e) => e.preventDefault());
			});

			window.addEventListener("resize", function (event) {
				calculateWidthForCarousel(elementName);
				calculateProgressBar(elementName);
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
				}, { passive: true});

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
					if (element.id == "carousel1") {
						//if click
						console.log(1)
					}
				}
			}
		}
});
