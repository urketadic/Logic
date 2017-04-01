const fs = require('fs');
const podRefs = JSON.parse(fs.readFileSync("podcastReferences.json","utf8"));
function getPodcastReferences(){
    return podRefs;
}
module.exports = getPodcastReferences