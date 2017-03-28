$(document).ready(function () {
    if (window.location.href.indexOf('#') !== -1)

        var hash = '#' + window.location.href.split('#')[1];
    var results = $("a.openmodal").toArray().filter(function (a) {
        var href = a.getAttribute('href');
        return href === hash;
    });
    if (results.length > 0) {
        var element = results[0];
        var button = element.children[0];
        if (button.onclick) {
            button.onclick();
        } else if (button.click) {
            button.click();
        }
    }
});