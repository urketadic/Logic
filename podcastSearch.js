
var
    fuzzySet = require('./fuzzyset.js'),
    fs = require('fs'),
    podRefs = [],
    podRefsById = new Object(),
    topics = [],
    categorizedPodRefs = new Object(),
    requestCache = new Object();
const
    MAX_SEARCH_TERM_SIZE = 40,
    SEARCH_QUALITY_THRESHOLD = 0.7,
    MAX_RESULT_LIMIT = 100,
    MAX_TEXT_LENGTH = 250,
    //Time in milliseconds after cached request gets removed.
    MAX_REQUEST_AGE = 10000,
    CACHE_UPDATE_INTERVAL = 5000;



function cacheRequest(searchTerm, podRefs) {
    requestCache[searchTerm] =
        {
            results: podRefs,
            age: new Date()
        };
}
function updateCache() {
    var keys = Object.keys(requestCache);
    var now = new Date();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var entry = requestCache[key];
        if (entryIsOutdated(now, entry)) {
            delete requestCache[key];
        }
    }
}
function entryIsOutdated(time, entry) {
    return time.getTime() - entry.age.getTime() > MAX_REQUEST_AGE;
}

function initialize() {
    loadPodcastReferences();                
    categorizePodRefs();
    setTopics();
 
    setInterval(updateCache, CACHE_UPDATE_INTERVAL);
}


function loadPodcastReferences() {
     podRefs = JSON.parse(fs.readFileSync('podcastReferences.json', 'utf8'));
     podRefs.forEach((podRef) => podRef._id = podRef._id["$oid"]);
     var copy = podRefs.slice(); 
     for (var i = 0; i < copy.length; i++) {
        podRefsById[copy[i]._id] = copy[i];
     }
     
  
    /*
    var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');
    // Connection URL to mongoDB
    var databaseUrl = 'mongodb://10.10.10.162:27017/PodcastDB';
    MongoClient.connect(databaseUrl, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection("PodcastReferences");

        // Grab a cursor
        var cursor = collection.find();
        cursor.toArray(function (err, arr) {
            if (err) throw err;
            addPodRefDuration(arr);
            podRefs = arr.slice();
            for (var i = 0; i < arr.length; i++) {
                podRefsById[arr[i]._id] = arr[i];
            }
            db.close();
        })
    }); */
    
}
function addPodRefDuration(arr){
    arr = arr.sort((a, b) => {
        return a._id > b._id ? 1 : a._id < b._id ? -1 : 0;
    });
    for(var i = 0; i< arr.length - 1; i++){
        var podRef = arr[i];
        var next = arr[i+1];
        if(podRef.podcast.name === next.podcast.name){
            arr[i].duration = calculateDuration(podRef.time, next.time);
        } else {
            arr[i].duration = calculateDuration(podRef.time,podRef.podcast.duration);
        }
       
    }
    arr[arr.length - 1].duration = calculateDuration(podRef.time,podRef.podcast.duration);
}

function calculateDuration(startStr, endStr){
    var start = parseLocalTimeString(startStr);
    var end   = parseLocalTimeString(endStr);
    var duration = end - start;

    var minutes  = Math.floor( duration / 60);
    var seconds  = duration % 60;

    var minutesString = (minutes <= 9 ? "0" + minutes : minutes);
    var secondsString = (seconds <= 9 ? "0" + seconds : seconds);
    return timeString = "00:" + minutesString + ":" + secondsString;
}
//Returns amount of seconds of time string with format hh:mm:ss
function parseLocalTimeString(timeStr) {
    var arr = timeStr.split(':');
    var minutes = parseInt(arr[1]);
    var seconds = parseInt(arr[2]);
    return minutes * 60 + seconds;
}
//Fills a map of Topic --> Set of PodRefId
function categorizePodRefs() {
    for (var i = 0; i < podRefs.length; i++) {
        var currentTopics = podRefs[i].topics.map(topic => topic.name);
        for (var j = 0; j < currentTopics.length; j++) {
            var topic = currentTopics[j];
            categorizedPodRefs[topic] === undefined ?
                categorizedPodRefs[topic] = [podRefs[i]._id] :
                categorizedPodRefs[topic].push(podRefs[i]._id);

        }
    }
}


function setTopics() {
    topics = Object.keys(categorizedPodRefs);
}

function searchPodcasts(req, res) {    
    if(podRefs.length === 0){
        initialize();
    }
    var searchTerm = req.query.term;
    if (searchTerm.length > MAX_SEARCH_TERM_SIZE)
        searchTerm = searchTerm.slice(0, MAX_SEARCH_TERM_SIZE);
    var maxResults;
    if (req.query.max === undefined) {
        maxResults = MAX_RESULT_LIMIT;
    } else {
        maxResults = parseInt(req.query.max);
    }
    if (maxResults > MAX_RESULT_LIMIT)
        maxResults = MAX_RESULT_LIMIT;
    var cacheEntry = requestCache[searchTerm];
    var results;
    if (cacheEntry !== undefined) {
        results = cacheEntry.results;
    } else {
        var matches = searchTopicsFuzzy(searchTerm, maxResults, topics);
        results = getPodRefs(matches, maxResults);
        //Remove duplicates
        results = results.filter((result, idx, ary) => ary.indexOf(result) === idx); 
        cacheRequest(searchTerm, results);
    }



    res.jsonp(results);
}

function getPodRefs(matches, maxResults) {
    results = [];
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var ids = categorizedPodRefs[match];
        var j = 0;
        while (results.length < maxResults && j < ids.length) {
            var matchedPodRefId = ids[j];
            var matchedPodRef = Object.assign({}, getPodRefById(matchedPodRefId));
            matchedPodRef.topics = matchedPodRef.topics.filter(topic => topic.name === match);
            results.push(matchedPodRef);
            j++;
        }


    }
    return results;

}
function getPodRefById(id) {
    return podRefsById[id];
}
function searchTopicsFuzzy(searchTerm, maxResults, topics) {
    var result = [];
    var wholeTopicMatches = matchWholeTopics(searchTerm, topics);
    var wordMatches = matchWordsOfTopics(searchTerm, topics);

    result = wholeTopicMatches.concat(wordMatches);
    result = result.filter(match => { return match[0] > SEARCH_QUALITY_THRESHOLD });
    if (result.length > maxResults) result = result.slice(0, maxResults);
    return [...new Set(result.map((match) => { return match[1] }))];

}

function matchWholeTopics(searchTerm, topics) {
    var fuzzySet = new FuzzySet(topics);
    var matches = fuzzySet.get(searchTerm, []);
    matches.sort(descRating);

    return matches;
}

function matchWordsOfTopics(searchTerm, topics) {
    var matches = [];
    for (var i = 0; i < topics.length; i++) {
        var topic = topics[i];
        var searchSet = new FuzzySet(topic.split(' '));
        var matchResults = searchSet.get(searchTerm);
        if (matchResults) {
            var matchResult = matchResults.sort(descRating)[0];
            var matchingRating = matchResult[0];
            var topicMatch = [matchingRating, topic];
            matches.push(topicMatch);
        }
    }

    matches.sort(descRating)
    return matches;
}


function descRating(r1, r2) {
    return r2[1] - r1[1];
}

function shortenText(podRef) {
    if (podRef.text.length > MAX_TEXT_LENGTH)
        podRef.text = podRef.text.slice(0, MAX_TEXT_LENGTH).trim() + "...";
}

exports.initialize = initialize;
exports.searchPodcasts = searchPodcasts;


