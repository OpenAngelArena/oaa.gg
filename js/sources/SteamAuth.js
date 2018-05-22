!(function() {
    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        window[rootObjectName].SteamAuth = (function () {
            var userSteam64              = 0;
            var userSteamProfileData     = null;
            var onAuthenticatedCallbacks = [];
            var hasBeenAuthenticated     = false;
            var apiKey                   = '0FA551D64997BEF92A8FC8CBB1ECBA2B'; // TODO: Shouldn't this be linked to the main OAA account instead of mine?

            var handleUpdateNavToAuthenticated = function() {
                if (!userSteam64) {
                    handleUpdateNavToRequiresAuthentication();
                }

                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('User is currently authenticated', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                hasBeenAuthenticated = true;

                // Now build the profile display for the user and do highlighting in the DOM
                // TODO: Maybe we should use an internal proxy instead of a service that might disappear?
                var userDataStr = window.localStorage.getItem('OAAGGSUP');

                if (userDataStr) {
                    var parts = userDataStr.split(':');
                    var expiration = parts.splice(0, 1);

                    if (expiration < Date.now()) {
                        handleProfileDataForUserAvailable(parts.join(':'));
                    }
                }

                // If we got here...userdata doesn't exist, so fetch it
                window.fetch('https://cors.io?https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + apiKey + '&steamids=' + userSteam64, {
                    cache: "default",
                })
                    .then(function(response) {
                        response.text()
                            .then(function(responseText) {
                                // Doing this because browsers can decide to auto-parse this sometimes
                                var response = ((typeof(responseText) === 'string') ? JSON.parse(responseText) : responseText);

                                // Make sure we are only working on the profile we want...
                                /**
                                 * @var {{
                                 *  response: {
                                 *    players: []
                                 *  }
                                 * }} response
                                 */
                                if (response.response && response.response.players) {
                                    var i = 0;
                                    var j = response.response.players.length;
                                    var found = false;

                                    for (i; i < j; i++) {
                                        if (response.response.players[i].steamid && (response.response.players[i].steamid === userSteam64)) {
                                            responseText = JSON.stringify(response.response.players[i]);

                                            found = true;
                                            break;
                                        }
                                    }

                                    if (!found) {
                                        handleProfileDataForUserUnableToBeResolved(new Error('Player data not verified in response!'));

                                        return;
                                    }
                                }

                                window.localStorage.setItem('OAAGGSUP', (Date.now() + 604800000) + ':' + responseText);

                                handleProfileDataForUserAvailable(responseText);
                            })
                            .catch(handleProfileDataForUserUnableToBeResolved)
                    })
                    .catch(handleProfileDataForUserUnableToBeResolved)
            };

            var handleProfileDataForUserAvailable = function(userDataString) {


                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('Running onAuthenticated callbacks', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                var i = 0;
                var j = onAuthenticatedCallbacks.length;

                for (i; i < j; i++) {
                    window[rootObjectName].handleRunCallback(onAuthenticatedCallbacks[i]);
                }
            };

            var handleProfileDataForUserUnableToBeResolved = function(error) {
                window[rootObjectName].awaitModulePrepared('Debug', function(error) {
                    window[rootObjectName].Debug.writeConsoleMessage('User profile data was unable to be fetched!', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                    window[rootObjectName].Debug.writeConsoleObject(error, 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                }.bind(this, error));
            };

            var handleUpdateNavToRequiresAuthentication = function() {
                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('User is not currently authenticated', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                var authButton = document.querySelector('body>nav .steamAuth');

                authButton.classList.remove('loading');

                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('Bound interactions for nav button for authentication', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });
            };

            var handleFetchUserProfileData = function() {
                window.localStorage.setItem('OAAGGS64', (Date.now() + 604800000) + ':' + userSteam64);

                // TODO: Check local cache and either use what is there if it exists and is valid, or fetch a new set of data
                handleUpdateNavToAuthenticated();
            };

            return {
                __init: function() {
                    window[rootObjectName].awaitModulePrepared('URL', function() {
                        // TL`DR, this sets up a browser-side 'session' flow where the response can be read from the URL
                        document.getElementById('steamAuth').setAttribute(
                            'href',
                            'https://steamcommunity.com/openid/login?' +
                                'openid.claimed_id=' + encodeURIComponent('http://specs.openid.net/auth/2.0/identifier_select') + '&' +
                                'openid.identity='   + encodeURIComponent('http://specs.openid.net/auth/2.0/identifier_select') + '&' +
                                'openid.mode='       + encodeURIComponent('checkid_setup') +                                      '&' +
                                'openid.ns='         + encodeURIComponent('http://specs.openid.net/auth/2.0') +                   '&' +
                                'openid.realm='      + encodeURIComponent(window.location.origin) +                               '&' +
                                'openid.return_to='  + encodeURIComponent(window.location.origin + window.location.pathname)
                        );

                        // FIRST, check to see if our LS store has a valid entry that has not expired (We are going to locally store the Steam64 for 1 week)
                        try {
                            var steamAuthChallenge = window.localStorage.getItem('OAAGGS64');

                            // Do we have a valid and non-expired Steam64 in cache?
                            if (!steamAuthChallenge || (!steamAuthChallenge.indexOf(':') > -1)) {
                                // Check our response URL...we might already have this data available
                                var identity = window[rootObjectName].URL.searchParamValue('openid.identity');

                                if (identity && (identity = identity.replace(/^https:\/\/steamcommunity.com\/openid\/id\//, ''))) {
                                    userSteam64 = identity;

                                    handleFetchUserProfileData();
                                } else {
                                    handleUpdateNavToRequiresAuthentication();
                                }
                            } else {
                                var steamAuthSet = steamAuthChallenge.split(':');

                                if (steamAuthSet[0] < Date.now()) {
                                    userSteam64 = steamAuthSet[1];

                                    handleUpdateNavToRequiresAuthentication();
                                } else {
                                    handleFetchUserProfileData();
                                }
                            }
                        } catch (e) {
                            // TODO: Handle private browsing mode maybe?  IOS throws an exception here if we are in private browsing mode
                        }
                    });
                }.bind(this),

                registerOnAuthenticatedCallback: function(callback) {
                    if (hasBeenAuthenticated) {
                        window[rootObjectName].handleRunCallback(callback);
                    } else {
                        onAuthenticatedCallbacks.push(callback);
                    }
                }.bind(this),

                get currentUserSteam32() {
                    return userSteam64 - 76561197960265728;
                },

                get currentUserSteam64() {
                    return userSteam64;
                },
            };
        }());

        window[rootObjectName].modulePrepared('SteamAuth');
        window[rootObjectName].moduleReady(window[rootObjectName].SteamAuth.__init);
    });
}());
