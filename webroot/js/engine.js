"use strict";

function Engine() {
    console.log('Engine');

    //Basic Engine Settings
    this.fps = 8;
    this.loopInterval;
    this.lastRun = microtime(true) * 1000;
    this.engineVariable;
    this.outputElement;

    //StoryTime Specific
    this.partIndex = -1;
    this.messageIndex = -1;
    this.timeout;
    this.queuedMessages = [];
    this.possibleDecissions = [];
}

Engine.prototype = {
    loadStoryData: function(story) {
        console.log('loadStoryData');

        var url = 'http://daphantom.github.io/storytime/webroot/js/data/';

        $.getJSON(url + story + '.json', function(response) {
            this.storyData =  response;
        });
    },

    init: function(variable, element) {
        console.log('init');

        this.loadStoryData('dummy');
        this.partIndex = this.storyData.startIndex;
        this.messageIndex = 0;
        this.engineVariable = variable;
        this.outputElement = element;
    },

    outputMessage: function(message) {
        console.log('outputMessage');

        var output = '<div class="message">';
        output += '<span class="name">' + message.name + '</span>';
        output += ':&nbsp;';
        output += '<span class="text">' + message.text + '</span>';
        output += '</div>';

        this.outputElement.append(output);
    },

    outputDecission: function(message) {
        console.log('outputDecission');

        var output = '<div class="decission">';

        message.decissions.forEach(function(decission) {
            output += '<button type="button" onclick="' + this.engineVariable + '.decide(' + decission.nextIndex + ')" class="btn btn-lg btn-warning">' + decission.text + '</button>';
        }, this);

        output += '</div>';

        this.outputElement.append(output);
    },

    loop: function() {
        console.log('loop');

        this.loopInterval = setInterval($.proxy(function() {
            this.run();
        }, this), 1000 / this.fps);
    },

    run: function() {
        var deltaTime = (microtime(true) * 1000) - this.lastRun;

        this.update(deltaTime);
        this.draw();

        this.lastRun = microtime(true) * 1000;
    },

    stop: function() {
        console.log('stop');

        clearInterval(this.loopInterval);
    },

    update: function(deltaTime) {
        if(this.timeout > 0) {
            this.timeout -= deltaTime;
        }

        if(this.timeout <= 0 || !this.timeout) {
            var message = this.nextMessage();

            if(message) {
                if(typeof message.decissions !== 'undefined') {
                    message.decissions.forEach(function(decission) {
                        this.possibleDecissions.push(decission.nextIndex);
                    }, this);
                }

                this.timeout = message.timeout;
                this.queuedMessages.push(message);
            }
        }
    },

    decide: function(index) {
        if(index > 0) {
            if(this.possibleDecissions.indexOf(index) !== -1) {
                this.partIndex = index;
                this.messageIndex = 0;
                this.possibleDecissions = [];
            }
        }
    },

    nextMessage: function() {
        var message = false;

        if(this.partIndex !== false) {
            message = this.storyData.parts[this.partIndex].messages[this.messageIndex];

            if(typeof message === 'undefined') {
                this.messageIndex = 0;
                this.partIndex = this.storyData.parts[this.partIndex].nextIndex;

                if(this.partIndex) {
                    message = this.storyData.parts[this.partIndex].messages[this.messageIndex];
                }
            }
        }

        if(message) {
            this.messageIndex++;
        }

        return message;
    },

    draw: function() {
        // console.log('draw');

        if(this.queuedMessages.length > 0) {
            this.queuedMessages.forEach(function(message) {
                this.outputMessage(message);

                if(typeof message.decissions !== 'undefined') {
                    this.outputDecission(message);
                }
            }, this);

            this.queuedMessages = [];
        }
    },
};
