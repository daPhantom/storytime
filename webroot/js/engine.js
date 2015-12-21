"use strict";

function Engine() {
    this.fps = 30;
    this.loopInterval;
    this.index = -1;
    this.timeout;
    this.outputElement;
    this.queuedMessages = [];

    this.loadStoryData('dummy');
}

Engine.prototype = {
    loadStoryData: function(story) {
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
                            name: 'Dum My',
                            text: 'Hello?!',
                            timeout: 1000,
                        },
                        {
                            name: 'Dum My',
                            text: 'Anyone?!',
                            timeout: 500,
                        },
                    ],
                    nextIndex: false
                }
            ]
        }
    },

    init: function(element) {
        this.loadStoryData('dummy');
        this.index = this.storyData.startIndex;
        this.outputElement = element;
    },

    outputMessage: function(message) {
        var output = '<div class="message">';
        output += '<span class="name">' + message.name + '</span>';
        output += ':&nbsp;';
        output += '<span class="text">' + message.text + '</span>';
        output += '</div>';

        this.outputElement.append(output);
    },

    loop: function() {
        this.loopInterval = setInterval($.proxy(function() {
            this.run();
        }, this), 1000 / this.fps);
    },

    run: function() {
        console.log(this.dump());
    },

    stop: function() {
        clearInterval(this.loopInterval);
    },

    dump: function() {
        this.storyData.parts[this.index].messages.forEach(function(message) {
            this.outputMessage(message);
        }, this);

    },

    sayHello: function() {
        alert('Hello!');
    }
};
