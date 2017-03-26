var basePath = "http://10.10.10.162:3000/api/search";
const MAX_TOPICSTRING_LENGTH = 90;

$(document).ready(function () {
    $("#submitButton").click(onSubmitButtonAction);
    $('#searchBar').keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode                        
            e.preventDefault();
            $("#submitButton").click();
        }
    });
});


function onSubmitButtonAction() {

    var inputText = $("#searchBar").val();
    if (inputText === "") alert("Type text in the search bar first.");
    else {
        $("#podRefs").empty();
        inputText = $("#searchBar").val();
        var maxResults = $("#range").val();
        var queryParameters = "?term=" + inputText;
        var uri = basePath + queryParameters;
        $.ajax({
            url: uri,
            dataType: "jsonp"
        }).done(function (podRefs) {
            if (podRefs.length === 0)
                $("#podRefs").append("<p> No podcast with the Topic '" + inputText + "' found. </p>");
            for (var i = 0; i < podRefs.length; i++) {
                var podRef = podRefs[i];
                addTimestampToLink(podRef);
                $("#podRefs").append(createPodcastHTMLView(podRef));
            }
        }).fail(function () { alert("Something went wrong."); });

    }
}

function createPodcastHTMLView(podRef) {
    var topicString = "'";
    if (podRef.topics.length === 1)
        topicString += podRef.topics[0].name + "'";
    else {

        for (var i = 0; i < podRef.topics.length; i++) {
            topicString += podRef.topics[i].name;
            if (i < podRef.topics.length - 1) topicString += ", "
        }
        topicString += "'";
    }
    /*
    if(topicString.length > MAX_TOPICSTRING_LENGTH){
        topicString = topicString.slice(0,MAX_TOPICSTRING_LENGTH - 6) + "...'";
    } */
    var timeString = shortenTimeString(podRef.time);
    var duration = shortenTimeString(podRef.duration);
    var result =
        "<a target=\"_blank\" href=\"" + podRef.podcast.link + "\">" +
        "<div class=\"left podcastContainer my-grey\">" +
        "<img src=\"assets/img/soundcloud-icon.png\"></img>" +
        "<span class=\"textContainer\">" +
        "<p>Found a discussuion in "+ podRef.podcast.name + " at " + timeString + " about the topic: </p>" +
         "<p>" +  topicString + 
        "</div></a>";
    return result;
}
function shortenTimeString(timeString){
    var arr = timeString.split(':');
    if(arr[0] === "00"){
        arr = arr.slice(1);
    }
    return arr.join(":");    
}

function addTimestampToLink(podRef) {
    podRef.podcast.link = createTimeStampLink(podRef.podcast.link, podRef.time);
}


function createTimeStampLink(link, time) {
    var times = time.split(":");
    var hours = times[0];
    var minutes = times[1];
    var seconds = times[2];

    return link + "#t=" +
        hours   + "h" +
        minutes + "m" +
        seconds + "s";
}


