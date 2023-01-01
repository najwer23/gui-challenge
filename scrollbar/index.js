document.addEventListener("DOMContentLoaded", () => {

const CLASS_NAME_THUMB_Y = "custom-scrollbar-scroll-thumb";
const CLASS_NAME_SCROLBAR_Y = "custom-scrollbar-scroll";
const SPACE_FOR_SCROLLBAR = 2 * 15;

var scrollbarDataIn = {
    "#container": {
        isMousedownActive: false,
        isMousemoveActive: false,
        translationX: 0,
        mouseStartX: 0,
        translationY: 0,
        mouseStartY: 0,
        changeEvent: false
    }
}

initScrollBar()


function initScrollBar() {
    let scrollbarDataInKeys = Object.keys(scrollbarDataIn)

    for (let i = 0; i < scrollbarDataInKeys.length; i++) {
        if (document.querySelector(scrollbarDataInKeys[i])) {
           createCustomScroll_Y(scrollbarDataInKeys[i])
        }
    }
}

function createCustomScroll_Y(nameOfElement) {
    let element = document.querySelector(nameOfElement);

    if ((element.scrollHeight - element.offsetHeight) == 0) {
        return ;
    }

    element.innerHTML +=
    `
        <div class="${CLASS_NAME_SCROLBAR_Y}">
            <div class="${CLASS_NAME_THUMB_Y}"></div>
        </div>
    `;

    calculateScrollBar(element)
    calculateThumb(element)

    addMouseEventsToScrollbar(nameOfElement)
}

function calculateScrollBar(element) {
    addCss2Element(element.querySelector(`.${CLASS_NAME_SCROLBAR_Y}`), {
        height: 0 + "px"
    })
    addCss2Element(element.querySelector(`.${CLASS_NAME_SCROLBAR_Y}`), {
        height: element.scrollHeight + "px"
    })
}

function calculateThumb(element) {
    let thumbMarginTop = element.scrollTop / element.scrollHeight * element.offsetHeight;
    let thumbHeight = element.offsetHeight * element.offsetHeight / element.scrollHeight;

    addCss2Element(element.querySelector(`.${CLASS_NAME_THUMB_Y}`), {
        marginTop: thumbMarginTop + "px",
        height: thumbHeight + "px"
    })
}

function addCss2Element(element, style) {
    for (const property in style) element.style[property] = style[property];
}

function addMouseEventsToScrollbar(nameOfElement) {
    const pointerEventToXY = function (e) {
        let isTouch = e.type.includes("touch");
        return {
            x: isTouch ? e.changedTouches[0].pageX : e.pageX,
            y: isTouch ? e.changedTouches[0].pageY : e.pageY
        };
    };

    const scrollbarThumb = document.querySelector(nameOfElement + ` .${CLASS_NAME_THUMB_Y}`);
    const scrollbar = document.querySelector(nameOfElement + ` .${CLASS_NAME_SCROLBAR_Y}`);
    const scrollbarContent = document.querySelector(nameOfElement);

    scrollbarContent.addEventListener("scroll", function (e) {
        calculateThumb(this)
        if (!scrollbarDataIn[nameOfElement].isMousedownActive) {
            scrollbarDataIn[nameOfElement].mouseStartY = scrollbarContent.scrollTop / scrollbarContent.scrollHeight * scrollbarContent.offsetHeight + 20;
        }
    })

    window.addEventListener("resize", function (e) {
        calculateScrollBar(scrollbarContent)
        calculateThumb(scrollbarContent)
    })

    addListenerMulti(scrollbar, 'mousedown touchstart', function (e) {
        calculateScrollThmubByMouse(e);
    });

    addListenerMulti(scrollbarThumb, 'mousedown touchstart', function (e) {
        scrollbarDataIn[nameOfElement].isMousedownActive = true;
        scrollbarDataIn[nameOfElement].isMousemoveActive = false;
        scrollbarDataIn[nameOfElement].mouseStartY = pointerEventToXY(e).y;
    });

    addListenerMulti(window, 'mouseleave touchcancel', function (e) {
        scrollbarDataIn[nameOfElement].isMousedownActive = false;
    });

    addListenerMulti(window, 'mouseup touchend', function (e) {
        scrollbarDataIn[nameOfElement].isMousedownActive = false;
        scrollbarDataIn[nameOfElement].isMousemoveActive = false;
    });

    addListenerMulti(window, 'mousemove touchmove', function (e) {
        if (scrollbarDataIn[nameOfElement].isMousedownActive) {
            e.preventDefault();
            calculateScrollThmubByMouse(e);
        }
    });

    function calculateScrollThmubByMouse(e) {
        scrollbarDataIn[nameOfElement].isMousemoveActive = true;
        const momentumY = scrollbarContent.scrollHeight / scrollbarContent.offsetHeight;
        scrollbarDataIn[nameOfElement].translationY = ((pointerEventToXY(e).y - scrollbarDataIn[nameOfElement].mouseStartY) * momentumY) + scrollbarContent.scrollTop + 0.533;
        scrollbarContent.scrollTop = scrollbarDataIn[nameOfElement].translationY
        scrollbarDataIn[nameOfElement].mouseStartY = pointerEventToXY(e).y;
    }
}

function addListenerMulti(el, s, fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}
});
