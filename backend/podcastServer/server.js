
var
  http = require('http'),
  path = require('path'),
  fuzzySet = require('fuzzyset.js'),
  express = require('express'),
  app = express(),
  podRefs = [],
  podRefsById = new Object(),
  topics = [],
  categorizedPodRefs = new Object(),
  basePath = "/api";
const
  MAX_SEARCH_TERM_SIZE = 40,
  SEARCH_QUALITY_THRESHOLD = 0.7,
  MAX_RESULT_LIMIT = 20,
  MAX_TEXT_LENGTH = 250;



function initialize() {
  loadPodcastReferences();
  setTimeout(() => {
    categorizePodRefs();
    setTopics();
    app.listen(8080);
  }

    , 1000);

}


function loadPodcastReferences() {
  var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
  // Connection URL to mongoDB
  var databaseUrl = 'mongodb://127.0.0.1:27017/PodcastDB';
  MongoClient.connect(databaseUrl, function (err, db) {
    assert.equal(null, err);
    var collection = db.collection("PodcastReferences");

    // Grab a cursor
    var cursor = collection.find();
    cursor.toArray(function (err, arr) {
      if (err) throw err;
      podRefs = arr.slice();
      for (var i = 0; i < arr.length; i++) {
        podRefsById[arr[i]._id] = arr[i];
      }
      db.close();
    })
  });
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

app.get(basePath + '/search', function (req, res) {
  if (req.query.term.length > MAX_SEARCH_TERM_SIZE)
    req.query.term = req.query.term.slice(0, MAX_SEARCH_TERM_SIZE);
  var maxResults;
  if (req.query.max === undefined) {
    maxResults = MAX_RESULT_LIMIT;
  } else {
    maxResults = parseInt(req.query.max);
  }
  if (maxResults > MAX_RESULT_LIMIT)
    maxResults = MAX_RESULT_LIMIT;

  var matches = searchTopicsFuzzy(req.query.term, maxResults, topics);

  var results = getPodRefs(matches, maxResults);

  results.forEach((result) => { shortenText(result) });
  res.jsonp(results);
});

function shortenText(podRef) {
  if (podRef.text.length > MAX_TEXT_LENGTH)
    podRef.text = podRef.text.slice(0, MAX_TEXT_LENGTH).trim() + "...";
}
function getPodRefs(matches, maxResults) {
  results = [];
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    var ids = categorizedPodRefs[match];
    var j = 0;
    while (results.length < maxResults && j < ids.length) {
      var matchedPodRefId = ids[j];
      var matchedPodRef = Object.assign({},getPodRefById(matchedPodRefId));
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

initialize();


