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
						hiddeArrowOnWidth: 600
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
			stateArrows();



			const preventClickOnDrag = (e) => {
				e.preventDefault();
				e.stopImmediatePropagation();
			};

			const pointerEventToXY = function (e) {
				var coordinates = { x: 0, y: 0 };
				if (e.type.includes("touch")) {
					coordinates.x = e.changedTouches[0].pageX;
					coordinates.y = e.changedTouches[0].pageY;
				} else if (e.type.includes("mouse")) {
					coordinates.x = e.pageX;
					coordinates.y = e.pageY;
				}
				return coordinates;
			};

			carouselContainer.addEventListener("wheel", function (e) {
				if (!detectIfTranslationIsPossible()) {
					return;
				}

				let a = carouselDataIn[elementName].oneLenghtOfSlider;
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let c = carouselDataIn[elementName].translationX;
				let t = 0;

				t = c + e.wheelDeltaX;

				// left bound
				if (t >= 0 ) {
					t = 0;
				}

				//right bound
				if (t <= -a + b) {
					t = -a + b;
				}

				carouselDataIn[elementName].translationX = t;
				carousel.style.transform = "translateX(" + t + "px)";
				stateArrows();
			});

			carouselContainer.addEventListener("click", function (e) {
				if (e.target.closest(".carousel-arrow.right")) {
					nextPicture();
				}
				if (e.target.closest(".carousel-arrow.left")) {
					prevPicture();
				}
			});

			function stateArrows() {
				let AL = carouselContainer.querySelector(".carousel-arrow.left")
				let AR = carouselContainer.querySelector(".carousel-arrow.right")

				if (window.innerWidth < carouselDataIn[elementName].hiddeArrowOnWidth) {
					AL.style.display = "none"
					AR.style.display = "none"
					return ;
				}

				let a = carouselDataIn[elementName].oneLenghtOfSlider;
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let t = carouselDataIn[elementName].translationX;
				AL.style.display = "block";
				AR.style.display = "block";

				// left bound
				if (t >= 0) {
					AL.style.display = "none";
				}

				// right bound
				if ( t <= -a + b) {
					AR.style.display = "none";
				}
			}

			function prevPicture() {
				if (!detectIfTranslationIsPossible()) {
					return;
				}

				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let c = carouselDataIn[elementName].translationX;
				let d = carouselDataIn[elementName].oneFrame;
				let t = 0;

				// translation left
				t = c + b;

				// align to next object
				let h = b % d;
				t = t - h;

				// left bound
				if (t >= 0) {
					t = 0;
				}

				carousel.style.transform = "translateX(" + t + "px)";
				carouselDataIn[elementName].translationX = t;
				stateArrows()
			}

			function nextPicture() {
				if (!detectIfTranslationIsPossible()) {
					return;
				}

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

				// right bound
				if ( t < -a + b) {
					t = -a + b;
				}

				carousel.style.transform = "translateX(" + t + "px)";
				carouselDataIn[elementName].translationX = t;
				stateArrows()
			}

			function addListenerMulti(el, s, fn) {
				s.split(" ").forEach((e) => el.addEventListener(e, fn, false));
			}

			function detectIfTranslationIsPossible() {
				let a = carouselDataIn[elementName].oneLenghtOfSlider;
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				return a > b;
			}

			//firefox bug fix
			carousel.querySelectorAll(".carousel-item").forEach((item) => {
				item.addEventListener("mousedown", (e) => e.preventDefault());
			});

			window.addEventListener("resize", function (event) {
				calculateWidthForCarousel(elementName);
				stateArrows();
			});

			addListenerMulti(carousel, 'mousedown touchstart', function (e) {
				carouselDataIn[elementName].isMousedownActive = true;
				carouselDataIn[elementName].isMousemoveActive = false;
				carouselDataIn[elementName].mouseStartX = pointerEventToXY(e).x;
				carousel.style.transition = "none";
			});

			addListenerMulti(carousel, 'mouseleave touchcancel', function (e) {
				carouselDataIn[elementName].isMousedownActive = false;
				carousel.style.transition = "transform .5s cubic-bezier(.25, .46, .45, .94)";
			});

			addListenerMulti(carousel, 'mouseup touchend', function (e) {
				carouselDataIn[elementName].isMousedownActive = false;

				if (carouselDataIn[elementName].isMousemoveActive) {
					carousel.addEventListener("click", preventClickOnDrag);
				} else {
					carousel.removeEventListener("click", preventClickOnDrag);
				}

				carouselDataIn[elementName].isMousemoveActive = false;
				carousel.style.transition = "transform .5s cubic-bezier(.25, .46, .45, .94)";
			});

			addListenerMulti(carousel, 'mousemove touchmove', function (e) {
				if (!carouselDataIn[elementName].isMousedownActive) {
					carouselDataIn[elementName].isMousemoveActive = false;
					carousel.removeEventListener("click", preventClickOnDrag);
					return;
				}

				if (!detectIfTranslationIsPossible()) {
					return;
				}

				if (carouselDataIn[elementName].isMousedownActive) {
					e.preventDefault();

					let a = carouselDataIn[elementName].oneLenghtOfSlider;
					let b = carouselDataIn[elementName].oneFrameDisplayed;
					let c = carouselDataIn[elementName].translationX;
					let t = 0;

					carouselDataIn[elementName].isMousemoveActive = true;
					t = ((pointerEventToXY(e).x - carouselDataIn[elementName].mouseStartX) * 1) + c;

					// left bound
					if (t > 0 ) {
						t = 0;
					}

					//right bound
					if (t < -a + b) {
						t = -a + b;
					}

					carouselDataIn[elementName].translationX = t;
					carousel.style.transform = "translateX(" + t + "px)";
					carouselDataIn[elementName].mouseStartX = pointerEventToXY(e).x;
					stateArrows();
				}
			});
		}
});
