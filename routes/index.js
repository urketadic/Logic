const express = require('express');
const router = express.Router();
const getPodcastReferences = require('../podcasts.js');


router.get('/', function(req, res) {
    res.render('home');
});

router.get('/existentialdeath', function(req, res) {
    res.render('existentialdeath');
});

router.get('/foursteps', function(req, res) {
    res.render('foursteps');
});

router.get('/insights', function(req, res) {
    res.render('insights');
});

router.get('/realtalkfinder', function(req, res) {
    res.render('realtalkfinder');
});

router.get('/selflessness', function(req, res) {
    res.render('selflessness');
});

router.get('/mostimportantinsight', function(req, res) {
    res.render('mostimportantinsight');
});
router.get('/api/podcastreferences',function(req, res) {
    res.json(getPodcastReferences());
}); 

router.get('/*', function(req, res) {
    res.render('error');
});





module.exports = router;

