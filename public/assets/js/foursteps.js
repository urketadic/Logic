window.onpopstate = changeSelectedElement;
$(document).ready(changeSelectedElement);


function changeSelectedElement() {
    var urlAry = window.location.href.split("#");
    if (urlAry.length > 1) {
        var hash = urlAry[1];
        var timeLineElements = $('.events li a');
        var foundElement = timeLineElements.filter(function () {
            return $(this).text() === hash;
        });
        if (foundElement && !foundElement.hasClass("selected")) {
            foundElement.click();
        }
    } else {
        window.location.hash = "Step 1";
    }
}

function onTimeLineChange(event) {
    if (event.target.text !== window.location.href.split("#")[1]) {
        window.history.pushState({}, "TestTitle", "#" + event.target.text);
    }

}
function onSingleShift(event) {
    var oldHash = window.location.hash;
    setTimeout(function () {
        $('.events li a').each(function () {
            var currentElement = $(this);

            if (currentElement.hasClass("selected") && oldHash !== '#'+currentElement.text()) {
                window.history.pushState({}, "TestTitle", "#" + currentElement.text());
            }
        });
    }, 100);
}



$('.events li a').click(onTimeLineChange);
$('.next').click(onSingleShift);
$('.prev').click(onSingleShift);



