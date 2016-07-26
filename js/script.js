"use strict";

// verification : existence of the object Live
if (typeof Live === 'undefined') {

    /**
     * Namespace : Live
     * This Namespace build a ticker that shows live matches based on API data.
     */
    var Live = {

        // Properties
        properties: {
            response: false,
            textNodes: {
                errorDetection: document.createTextNode('Sorry, error detection...'),
            },
        },

        // Elements
        elements: {
            bodyElement: document.querySelector('body'),
            contentLive: document.querySelector('#live--matches'),
            newTags: {
                H2Tag: document.createElement('h2'),
                H3Tag: document.createElement('h3'),
                H4Tag: document.createElement('h4'),
                divTag: document.createElement('div'),
                liTag: document.createElement("li"),
            },
        },

        // Initialisation
        init: function() {
            Live.json.GetJsonData();
        },

        json: {

            /**
             * GET JSON data from external URL
             * Error management detection
             */
            GetJsonData: function() {

                // create and add Json src
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "http://api.unicdn.net/v1/feeds/sportsbook/event/live.jsonp?app_id=ca7871d7&app_key=5371c125b8d99c8f6b5ff9a12de8b85a&callback=Live.json.GetStringJson";
                Live.elements.bodyElement.appendChild(script);

                setTimeout(function() {

                    if (Live.properties.response = !true) {

                        Live.json.errorBox();
                    }

                }, 3000);
            },


            /**
             * Build create error box 
             */
            errorBox: function() {
                // add CSS class > H3 (title error)
                Live.elements.newTags.H3Tag.className = 'titleError';
                Live.elements.newTags.H3Tag.appendChild(Live.properties.textNodes.errorDetection);
                
                // add CSS class > div (content error)
                Live.elements.newTags.divTag.className = "data-screen";
                Live.elements.newTags.divTag.appendChild(Live.elements.newTags.H3Tag);

                Live.elements.contentLive.appendChild(Live.elements.newTags.divTag);
            },

            /**
             * GET info JSON data from external URL
             */
            GetStringJson: function(data) {

                var liveData = [];

                for (var i = 0; i < data.liveEvents.length; i++) {

                    if (data.liveEvents.length != 0 && data.liveEvents[i].liveData.score) {

                        // Tansform changedDate by Date and time 
                        var d = new Date(data.liveEvents[i].event.start),
                            transformdDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(),
                            hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours(),
                            minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes(),
                            formattedTime = hours + ":" + minutes;

                        transformdDate = transformdDate + ", " + formattedTime;

                        var event = {};
                        event.scoreOne = data.liveEvents[i].liveData.score.home;
                        event.scoreTwo = data.liveEvents[i].liveData.score.away;
                        event.teamOne = data.liveEvents[i].event.homeName;
                        event.teamTwo = data.liveEvents[i].event.awayName;
                        event.sport = data.liveEvents[i].event.sport;
                        event.dateTime = transformdDate;
                        event.id = data.liveEvents[i].event.id;
                        liveData.push(event)

                    }

                }


                // stockage JSON in the local storage
                var date = new Date(),
                    expTime = date.getTime() + (60 * 2 * 1000);

                if (localStorage.getItem('expTime') === null && localStorage.getItem('liveData') === null) {
                    
                    localStorage.setItem("expTime", expTime);
                    localStorage.setItem("liveData", JSON.stringify(liveData));

                }

                // call HTML
                Live.json.HTMLwrapperBet();

            },


            /**
             * Create HTML by JavaScript
             */
            HTMLwrapperBet: function() {

                var liveData = JSON.parse(localStorage.getItem("liveData"));

                for (var i = 0; i < liveData.length; i++) {

                    // all text node in array
                    var textNodes = [
                        document.createTextNode('Place a bet'),
                        document.createTextNode(liveData[i].dateTime),
                        document.createTextNode(liveData[i].teamOne + " - " + liveData[i].teamTwo),
                        document.createTextNode(liveData[i].scoreOne + " - " + liveData[i].scoreTwo)
                    ];

                    var wrapperBet = document.createElement("li");

                    var H3Bet = document.createElement("h3");
                    H3Bet.appendChild(textNodes[3]);

                    var spanBet = document.createElement("span"),
                        icon = liveData[i].sport;
                    spanBet.className = icon.toLowerCase();
                    spanBet.appendChild(textNodes[2]);

                    var H4Bet = document.createElement("h4");
                    H4Bet.appendChild(spanBet);
                    H4Bet.className = "teams";

                    var pBet = document.createElement("p");
                    pBet.appendChild(textNodes[1]);
                    pBet.className = "date";

                    var InternalLink = document.createElement("a");
                    InternalLink.setAttribute('href', "http://www.unibet.com/betting#/event/live/" + liveData[i].id);
                    InternalLink.target = "_blank";
                    InternalLink.title = 'Place a bet: ' + liveData[i].teamOne + " - " + liveData[i].teamTwo
                    InternalLink.appendChild(textNodes[0]);

                    wrapperBet.appendChild(H3Bet);
                    wrapperBet.appendChild(H4Bet);
                    wrapperBet.appendChild(pBet);
                    wrapperBet.appendChild(InternalLink);

                    Live.elements.contentLive.appendChild(wrapperBet);

                }

            },

        },

    };

    Live.init();

} else {
    alert('Object Live always ready');
}