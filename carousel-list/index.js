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
						oneFrame: 300, // width child
						oneFrameDisplayed: 0,
					},
				};

				if (document.querySelector(carouselDataInKeys[i])) {
					calculateWidthForCarousel(carouselDataInKeys[i]);
					addMouseEventsToSlider(carouselDataInKeys[i]);
				}
			}
		}

		function calculateWidthForCarousel(elementName) {
			let carousel = document.querySelector(elementName);
			carouselDataIn[elementName].oneFrameDisplayed = carousel.parentElement.offsetWidth;
			carouselDataIn[elementName].oneLenghtOfSlider = 0;
			document.querySelectorAll(elementName + " .carousel-item img").forEach((x) => {
				x.style.width = carouselDataIn[elementName].oneFrame + "px";
				carouselDataIn[elementName].oneLenghtOfSlider += carouselDataIn[elementName].oneFrame;
			});
		}

		function addMouseEventsToSlider(elementName) {
			const carousel = document.querySelector(elementName);
			const carouselContainer = carousel.parentNode;

			//setInterval(nextPicture, 5000);

			carouselContainer.addEventListener("click", function (e) {
				if (e.target.closest(".carousel-arrow.right")) {
					nextPicture();
				}
				if (e.target.closest(".carousel-arrow.left")) {
					prevPicture();
				}
			});

			function prevPicture() {
				let a = carouselDataIn[elementName].oneLenghtOfSlider;
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let c = carouselDataIn[elementName].translationX;
				let d = carouselDataIn[elementName].oneFrame;
				let t = 0;

				t = c + b;

				// wyrównaj do obiektu
				let h = b % d;
				t = t - h;

				// jesli translacja wieksza niz lewa strona to przesun na sam poczatek
				if (t>0) {
					t=0;
				}

				carousel.style.transform = "translateX(" + t + "px)";
				carouselDataIn[elementName].translationX = t;
			}

			function nextPicture() {
				let a = carouselDataIn[elementName].oneLenghtOfSlider;
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let c = carouselDataIn[elementName].translationX;
				let d = carouselDataIn[elementName].oneFrame;
				let t = 0;

				// standardowa translacja
				t = (c -b);

				// wyrównaj do obiektu
				let h = b % d;
				t = t + h;

				// sprawdz czy przesuniecie jest mozliwe. przesun maksymalnie do ostatniego obiektu
				if (-b + c < -a + b) {
					t = -a + b
				}

				carousel.style.transform = "translateX(" + t + "px)";
				carouselDataIn[elementName].translationX = t;
			}

			//firefox bug fix
			carousel.querySelectorAll(".carousel-item").forEach((item) => {
				item.addEventListener("mousedown", (e) => e.preventDefault());
			});

			window.addEventListener("resize", function (event) {
				calculateWidthForCarousel(elementName);
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
