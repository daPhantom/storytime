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
}

Engine.prototype = {
    loadStoryData: function(story) {
        console.log('loadStoryData');

        var url = 'http://fotoosman.de/storytime/data/'

        // $.getJSON(url + story + '.json', function(response) {
        //     this.storyData =  response;
        // });

        this.storyData = {
            startIndex: 0,
            parts: [
                {
                    messages: [
                        {
                            name: 'Unknown',
                            text: 'Hello?!',
                            timeout: 1500,
                        },
                        {
                            name: 'Unknown',
                            text: 'Anyone?!',
                            timeout: 4000,
                        },
                        {
                            name: 'Unknown',
                            text: 'Can you read me?!',
                            timeout: 3500,
                        },
                        {
                            name: 'Unknown',
                            text: 'I am scared!',
                            decissions: [
                                {
                                    text: 'Who are you?',
                                    nextIndex: 1,
                                },
                                {
                                    text: 'What happened?',
                                    nextIndex: 2,
                                }
                            ],
                            timeout: 0,
                        },
                    ],
                    nextIndex: false
                },
                {
                    messages: [
                        {
                            name: 'Unknown',
                            text: 'Whoa you can really read me? Cool...',
                            timeout: 3000,
                        },
                        {
                            name: 'Unknown',
                            text: 'Of course. Forgot about my manners.',
                            timeout: 3000,
                        },
                        {
                            name: 'Dum My',
                            text: 'My name is Dum My!',
                            timeout: 0,
                        },
                    ],
                    nextIndex: false
                },
                {
                    messages: [
                        {
                            name: 'Unknown',
                            text: 'Whoa you can really read me? Cool...',
                            timeout: 3000,
                        },
                        {
                            name: 'Unknown',
                            text: 'I don\'t really know what happened.',
                            timeout: 3000,
                        },
                        {
                            name: 'Unknown',
                            text: 'There was a huge explosion and...',
                            timeout: 3000,
                        },
                        {
                            name: 'Unknown',
                            text: '... I can\'t remember!',
                            timeout: 3000,
                        },
                    ],
                    nextIndex: false
                }
            ]
        }
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
                this.timeout = message.timeout;
                this.queuedMessages.push(message);
            }
        }
    },

    decide: function(index) {
        this.partIndex = index;
        this.messageIndex = 0;
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
