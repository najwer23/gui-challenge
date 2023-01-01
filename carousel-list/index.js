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

			// init with start position
			carousel.style.transform = "translateX(" + 0 + "px)";
			carouselDataIn[elementName].translationX = 0;
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
				let a = carouselDataIn[elementName].oneLenghtOfSlider;
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let c = carouselDataIn[elementName].translationX;
				let d = carouselDataIn[elementName].oneFrame;
				let t = 0;

				// translation left
				t = c + b;

				// align to next object
				let h = b % d;
				t = t - h;

				// if the translation is bigger than the start, move it to the beginning
				if (t > 0) {
					t = 0;
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

				// translation right
				t = c - b;

				// align to next object
				let h = b % d;
				t = t + h;

				// check if the move is possible. move up to the last object
				if (-b + c < -a + b) {
					t = -a + b;
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
		}
});
