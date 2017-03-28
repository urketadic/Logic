$(document).ready(function () {
    var hashAry = window.location.href.split('#');
    if (hashAry.length > 1) {
        var hash = '#' + hashAry[1];

        //get all hrefs of a elems and look for the hash value of the link.
        var results = $("a.openmodal").toArray().filter(function (a) {
            var href = a.getAttribute('href');
            return href === hash;
        });

        if (results.length > 0) {
            var element = results[0];
            var button = element.children[0];
            button.click();
        }
    }
});


