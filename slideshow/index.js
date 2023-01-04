document.addEventListener("DOMContentLoaded", () => {
	var
	slideshow = document.getElementById("slideshow"),
	slideshowSlides = document.getElementById("slideshow-slides"),
	slideshowPrev = document.getElementById("slideshow-prev"),
	slideshowWrapper = document.getElementById("slideshow-wrapper"),
	slideshowNext = document.getElementById("slideshow-next"),
	resizeTimer,
	posX1 = 0,
	posX2 = 0,
	posInitial,
	posFinal,
	threshold = 15,
	slideInfArr = slideshowSlides.getElementsByClassName("slideshow-slide"),
	slidesLength = slideInfArr.length,
	firstSlide = slideInfArr[0],
	lastSlide = slideInfArr[slidesLength - 1],
	cloneFirst = firstSlide.cloneNode(true),
	cloneLast = lastSlide.cloneNode(true),
	index = 0,
	allowShift = true;

	// Clone first and last slide
	slideshowSlides.appendChild(cloneFirst);
	slideshowSlides.insertBefore(cloneLast, firstSlide);
	slideshowWrapper.classList.add("loaded");

	function updateWidthForSlider() {
		index=0;

		document.body.classList.add("resize-animation-stopper");
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			document.body.classList.remove("resize-animation-stopper");
		}, 10);

		slideshow.style.width = 100 + "%";
		slideshowSlides.style.left = -slideshow.clientWidth + "px";
		for (let i = 0; i < slideInfArr.length; i++) {
			slideInfArr[i].style.width = slideshow.clientWidth + "px";
		}
	}

	//resize event
 	window.addEventListener("resize", updateWidthForSlider);

	//update width for slides
	updateWidthForSlider();

	// Mouse events
	slideshowSlides.onmousedown = dragStart;

	// Touch events
	slideshowSlides.addEventListener("touchstart", dragStart);
	slideshowSlides.addEventListener("touchend", dragEnd);
	slideshowSlides.addEventListener("touchmove", dragAction);

	// Click events
	slideshowPrev.addEventListener("click", function () {
		shiftSlide(-1);
	});
	slideshowNext.addEventListener("click", function () {
		shiftSlide(1);
	});

	// Transition events
	slideshowSlides.addEventListener("transitionend", checkIndex);

	function dragStart(e) {
		e = e || window.event;
		e.preventDefault();
		posInitial = slideshowSlides.offsetLeft;

		if (e.type == "touchstart") {
			posX1 = e.touches[0].clientX;
		} else {
			posX1 = e.clientX;
			document.onmouseup = dragEnd;
			document.onmousemove = dragAction;
		}
	}

	function dragAction(e) {
		e = e || window.event;

		if (e.type == "touchmove") {
			posX2 = posX1 - e.touches[0].clientX;
			posX1 = e.touches[0].clientX;
		} else {
			posX2 = posX1 - e.clientX;
			posX1 = e.clientX;
		}
		slideshowSlides.style.left = slideshowSlides.offsetLeft - posX2 + "px";
	}

	function dragEnd(e) {
		posFinal = slideshowSlides.offsetLeft;

		if ((posFinal - posInitial < threshold) && (posFinal - posInitial > -threshold)) {
			console.log("click")
		} else if (posFinal - posInitial < -threshold) {
			shiftSlide(1, "drag");
		} else if (posFinal - posInitial > threshold) {
			shiftSlide(-1, "drag");
		} else {
			slideshowSlides.style.left = posInitial + "px";
		}

		document.onmouseup = null;
		document.onmousemove = null;
	}

	function shiftSlide(dir, action) {
		slideshowSlides.classList.add("shifting");

		if (allowShift) {
			if (!action) {
				posInitial = slideshowSlides.offsetLeft;
			}

			if (dir == 1) {
				slideshowSlides.style.left = posInitial - slideshowWrapper.offsetWidth + "px";
				index++;
			} else if (dir == -1) {
				slideshowSlides.style.left = posInitial + slideshowWrapper.offsetWidth + "px";
				index--;
			}
		}

		allowShift = false;
	}

	function checkIndex() {
		slideshowSlides.classList.remove("shifting");

		if (index == -1) {
			slideshowSlides.style.left = -(slidesLength * slideshowWrapper.offsetWidth) + "px";
			index = slidesLength - 1;
		}

		if (index == slidesLength) {
			slideshowSlides.style.left = -(1 * slideshowWrapper.offsetWidth) + "px";
			index = 0;
		}

		allowShift = true;
	}

});

