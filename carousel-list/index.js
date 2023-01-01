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
						boundLeft: false,
						boundRight: false
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

			carousel.addEventListener("scroll", function (e) {
				console.log(12);
			});

			function stateArrows() {
				let AL = carouselContainer.querySelector(".carousel-arrow.left")
				let AR = carouselContainer.querySelector(".carousel-arrow.right")

				AL.style.display = carouselDataIn[elementName].boundLeft ? "none" : "block"
				AR.style.display = carouselDataIn[elementName].boundRight ? "none" : "block"
			}

			function prevPicture() {
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let c = carouselDataIn[elementName].translationX;
				let d = carouselDataIn[elementName].oneFrame;
				let t = 0;
				carouselDataIn[elementName].boundLeft = false;
				carouselDataIn[elementName].boundRight = false;

				// translation left
				t = c + b;

				// align to next object
				let h = b % d;
				t = t - h;

				// left bound
				if (t >= 0) {
					t = 0;
					carouselDataIn[elementName].boundLeft = true;
				}

				carousel.style.transform = "translateX(" + t + "px)";
				carouselDataIn[elementName].translationX = t;
				stateArrows()
			}

			function nextPicture() {
				let a = carouselDataIn[elementName].oneLenghtOfSlider;
				let b = carouselDataIn[elementName].oneFrameDisplayed;
				let c = carouselDataIn[elementName].translationX;
				let d = carouselDataIn[elementName].oneFrame;
				let t = 0;
				carouselDataIn[elementName].boundRight = false;
				carouselDataIn[elementName].boundLeft = false;

				// translation right
				t = c - b;

				// align to next object
				let h = b % d;
				t = t + h;

				// right bound
				if ( t < -a + b) {
					t = -a + b;
					carouselDataIn[elementName].boundRight = true;
				}

				carousel.style.transform = "translateX(" + t + "px)";
				carouselDataIn[elementName].translationX = t;
				stateArrows()
			}

			//firefox bug fix
			carousel.querySelectorAll(".carousel-item").forEach((item) => {
				item.addEventListener("mousedown", (e) => e.preventDefault());
			});

			window.addEventListener("resize", function (event) {
				calculateWidthForCarousel(elementName);
			});

			function addListenerMulti(el, s, fn) {
				s.split(" ").forEach((e) => el.addEventListener(e, fn, false));
			}

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

				if (carouselDataIn[elementName].isMousedownActive) {
					e.preventDefault();

					let a = carouselDataIn[elementName].oneLenghtOfSlider;
					let b = carouselDataIn[elementName].oneFrameDisplayed;
					let c = carouselDataIn[elementName].translationX;
					let t = 0;
					carouselDataIn[elementName].boundRight = false;
					carouselDataIn[elementName].boundLeft = false;

					carouselDataIn[elementName].isMousemoveActive = true;
					t = ((pointerEventToXY(e).x - carouselDataIn[elementName].mouseStartX) * 1) + c;

					// left bound
					if (t > 0 ) {
						t = 0;
						carouselDataIn[elementName].boundLeft = true;
					}

					//right bound
					if (t < -a + b) {
						t = -a + b;
						carouselDataIn[elementName].boundRight = true;
					}

					carouselDataIn[elementName].translationX = t;
					carousel.style.transform = "translateX(" + t + "px)";
					carouselDataIn[elementName].mouseStartX = pointerEventToXY(e).x;
					stateArrows();
				}
			});
		}
});
