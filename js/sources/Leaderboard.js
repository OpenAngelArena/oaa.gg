!(function() {
    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        window[rootObjectName].Leaderboard = (function () {
            var leaderboardAPIURI = 'https://chrisinajar.com:4969/top/';

            return {
                __init: function() {
                    if (document.getElementById('OAALeaderboard')) {
                        // TODO: LCache this or put the API behind a short life CDN to protect it
                        window.fetch(leaderboardAPIURI, {
                            cache: "default",
                        })
                            .then(window[rootObjectName].Leaderboard.handleOnLeaderboardFetchSuccess)
                            .catch(window[rootObjectName].Leaderboard.handleOnLeaderboardFetchFailure);
                    }
                }.bind(this),

                handleOnLeaderboardFetchSuccess: function(response) {
                    // TODO: Handle a loader on this!
                    response.text().then(function(responseJSON) {
                        /**
                         * @type {{
                         *   steamid: string,
                         *   mmr:     Number,
                         *   ranking: int,
                         *   name:    string,
                         * []}} responseJSON
                         */
                        responseJSON = ((typeof(responseJSON) === 'string') ? JSON.parse(responseJSON) : responseJSON);

                        window[rootObjectName].awaitModulePrepared('Debug', function() {
                            window[rootObjectName].Debug.writeConsoleMessage('Response body converted to object', 'Leaderboard', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                        });

                        var TBody = document.querySelector('#OAALeaderboard tbody');
                        var constructTableRow = function(rowData) {
                            var row = document.createElement('tr');
                            var ranking = document.createElement('td');
                            var name = document.createElement('td');
                            var mmr = document.createElement('td');

                            row.classList.add('OAAS32_' + rowData.steamid); // Used to highlight the current user if we happen to have a Steam ID to look up

                            ranking.innerHTML = rowData.ranking.toString();
                            name.innerHTML = rowData.name.toString();
                            mmr.innerHTML = rowData.mmr.toFixed(2).toLocaleString(); // Format to decimal with 2 digits precision and localise

                            row.appendChild(ranking);
                            row.appendChild(name);
                            row.appendChild(mmr);

                            return row;
                        };

                        // At this point, the response SHOULD be an array
                        var i = 0;
                        var j = responseJSON.length;

                        for (i; i < j; i++) {
                            TBody.appendChild(constructTableRow(responseJSON[i]));
                        }

                        document.querySelector('body>main').classList.add('leaderboardLoaded');


                        var leaderboard = document.querySelector('#OAALeaderboard');
                        leaderboard.classList.add('leaderboardLoaded');
                        leaderboard.parentNode.classList.add('leaderboardLoaded');

                        window[rootObjectName].awaitModulePrepared('Debug', function() {
                            window[rootObjectName].Debug.writeConsoleMessage('Leaderboard written', 'Leaderboard', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                        });

                        // Make sure SteamAuth gets a chance to do highlighting
                        window[rootObjectName].awaitModulePrepared('SteamAuth', function() {
                            var items = document.querySelectorAll('.OAAS32_' + window[rootObjectName].SteamAuth.currentUserSteam32);
                            var i = 0;
                            var j = items.length;

                            for (i; i < j; i++) {
                                items[i].classList.add('OAA_currentSteamUser');
                            }
                        });
                    }).catch(window[rootObjectName].Leaderboard.handleOnLeaderboardFetchFailure);
                },

                handleOnLeaderboardFetchFailure: function(error) {
                    window[rootObjectName].awaitModulePrepared('Debug', function(error) {
                        window[rootObjectName].Debug.writeConsoleMessage('An unexpected error occurred while trying to fetch leaderboard data!', 'Leaderboard', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                        window[rootObjectName].Debug.writeConsoleObject(error, 'Leaderboard', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                    }.bind(this, error))
                },
            }
        }());

        window[rootObjectName].modulePrepared('Leaderboard');
        window[rootObjectName].moduleReady(window[rootObjectName].Leaderboard.__init);
    });
}());
