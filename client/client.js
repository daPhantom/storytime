var PIXI = require('pixi.js');

var data = require('./data/story.json');

if(typeof data === 'object') {
    console.log('story data loaded successfully');
    console.log(data);
} else {
    console.error('error loading story data');
}
