var hashLookup = new Array();
    hashLookup['#step_1'] = "Step 1";
    hashLookup['#step_2'] = "Step 2";
    hashLookup['#step_3'] = "Step 3";
    hashLookup['#step_4'] = "Step 4";
    hashLookup['#did_i_click'] = "Did I click?";
    hashLookup['#insights_tree'] = "Insights Tree";

var reverseHashLookup = new Array();
    reverseHashLookup['Step 1'] = "#step_1";
    reverseHashLookup['Step 2'] = "#step_2";
    reverseHashLookup['Step 3'] = "#step_3";
    reverseHashLookup['Step 4'] = "#step_4";
    reverseHashLookup['Did I click?'] = "#did_i_click";
    reverseHashLookup['Insights Tree'] = "#insights_tree";

function getHashByText(text){
    return reverseHashLookup[text];
}
function getTextByHash(hash){
    return hashLookup[hash];
}

window.onpopstate = changeSelectedElement;
$(document).ready(changeSelectedElement);
$(document).keyup(function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code === 37 || code === 39){ //left arrow, right arrow 
        onSingleShift(e);
    }
});

function changeSelectedElement() {
        var hash = window.location.hash;
        if (hash.length > 0) {
        var timeLineElements = $('.events li a');
        var foundElements = timeLineElements.filter(function () {
            return $(this).text() === getTextByHash(hash);
        });
        if (foundElements.length > 0 && !foundElements.hasClass("selected")) {
            foundElements.first().click();
        }
    } else {
        window.location.hash = "#step_1";
    }
}

function onTimeLineChange(event) {
    var hash = window.location.hash;
    var text = event.target.text;
    if (text !== getTextByHash(hash)) {
        window.history.pushState({}, "TestTitle", getHashByText(text));
    }

}
function onSingleShift(event) {
    var oldHash = window.location.hash;
    setTimeout(function () {
        $('.events li a').each(function () {
            var currentElement = $(this);
            var currentHash = getHashByText(currentElement.text());
            if (currentElement.hasClass("selected") && oldHash !== currentHash) {
                window.history.pushState({}, "TestTitle", currentHash);
            }
        });
    }, 100);
}



$('.events li a').click(onTimeLineChange);
$('.next').click(onSingleShift);
$('.prev').click(onSingleShift);
$('.nextbtn').click(onSingleShift);



