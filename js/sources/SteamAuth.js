!(function() {
    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        window[rootObjectName].SteamAuth = (function () {
            var userSteam64              = 0;
            var userSteamProfileData     = null;
            var onAuthenticatedCallbacks = [];
            var hasBeenAuthenticated     = false;

            var handleUpdateNavToAuthenticated = function() {
                if (!userSteam64) {
                    handleUpdateNavToRequiresAuthentication();
                }

                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('User is currently authenticated', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                hasBeenAuthenticated = true;

                // Now build the profile display for the user and do highlighting in the DOM
                var userDataStr = window.localStorage.getItem('OAAGGSUP');

                if (userDataStr) {
                    var parts = userDataStr.split(':');
                    var expiration = Number(parts.splice(0, 1));

                    if (expiration > Date.now()) {
                        handleProfileDataForUserAvailable(parts.join(':'));

                        return;
                    }
                }

                // If we got here...userdata doesn't exist, so fetch it
                window.fetch('https://chrisinajar.com:4969/users/' + window[rootObjectName].SteamAuth.currentUserSteam32, {
                    cache: "default",
                })
                    .then(function(response) {
                        response.text()
                            .then(function(responseText) {
                                // Cached for 5 minutes at a time
                                window.localStorage.setItem('OAAGGSUP', (Date.now() + 300000) + ':' + responseText);

                                handleProfileDataForUserAvailable(responseText);
                            })
                            .catch(handleProfileDataForUserUnableToBeResolved);
                    })
                    .catch(handleProfileDataForUserUnableToBeResolved);
            };

            var handleProfileDataForUserAvailable = function(userDataString) {
                // Make a workable object here
                userSteamProfileData = JSON.parse(userDataString);

                window[rootObjectName].awaitModulePrepared('Debug', function(userSteamProfileData) {
                    window[rootObjectName].Debug.writeConsoleMessage('Current authenticated user object', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                    window[rootObjectName].Debug.writeConsoleObject(userSteamProfileData, 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                }.bind(this, userSteamProfileData));

                /**
                 * @var {HTMLElement} $steamProfile
                 */
                var $steamProfile = document.getElementById('steamProfile');

                // In the event this gets run again (Say we are testing, or someone puts something in there as a placeholder etc.) Clear out this element quickly
                $steamProfile.innerHTML = '';

                // TODO: Populate DOM
                if (userSteamProfileData && userSteamProfileData.statusCode && (userSteamProfileData.statusCode === 404)) {
                    window[rootObjectName].awaitModulePrepared('Debug', function() {
                        window[rootObjectName].Debug.writeConsoleMessage('User was not able to be found in BottlePass server!', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                    });

                    // Tell the user to play and maybe link the steam workshop page here?
                    var $OAADownloadLink = document.createElement('a');

                    $OAADownloadLink.classList.add('OAADownloadLink');

                    $OAADownloadLink.setAttribute('target', '_blank');
                    $OAADownloadLink.setAttribute('href', 'https://steamcommunity.com/sharedfiles/filedetails/?id=881541807');
                    $OAADownloadLink.innerHTML = 'Subscribe<br />to play';

                    $steamProfile.appendChild($OAADownloadLink);
                } else if (userSteamProfileData && userSteamProfileData.steamid && userSteamProfileData.profile) {
                    window[rootObjectName].awaitModulePrepared('Debug', function() {
                        window[rootObjectName].Debug.writeConsoleMessage('User found in BottlePass server!', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                    });

                    // Build the nav for your MMR
                    var $nameContainer = document.createElement('div');
                    var $unrankedMMR = document.createElement('div');
                    var $rankedMMR = document.createElement('div');
                    var $MMRContainer = document.createElement('div');

                    var $unrankedMMRNumber = document.createElement('span');
                    var $rankedMMRNumber = document.createElement('span');

                    $nameContainer.innerHTML = userSteamProfileData.profile.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

                    $unrankedMMRNumber.innerHTML = userSteamProfileData.unrankedMMR;
                    $rankedMMRNumber.innerHTML = userSteamProfileData.rankedMMR;

                    $unrankedMMR.appendChild($unrankedMMRNumber);
                    $rankedMMRNumber.appendChild($rankedMMRNumber);

                    $MMRContainer.appendChild($unrankedMMR);
                    $MMRContainer.appendChild($rankedMMR);

                    $steamProfile.appendChild($rankedMMRNumber);

                    $steamProfile.appendChild($nameContainer);
                    $steamProfile.appendChild($MMRContainer);

                    // Make their avatar available in layout?
                    if (userSteamProfileData.profile.avatar) {
                        var $userAvatar = document.createElement('img');

                        $userAvatar.setAttrinute('src', userSteamProfileData.profile.avatar);

                        $steamProfile.appendChild($userAvatar);
                    }
                } else {
                    window[rootObjectName].awaitModulePrepared('Debug', function() {
                        window[rootObjectName].Debug.writeConsoleMessage('User data appears corrupted?', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                    });

                    // TODO: Catch?
                }

                $steamProfile.classList.remove('loading');
                $steamProfile.classList.add('loaded');

                console.log($steamProfile);
                console.log($steamProfile.outerHTML);

                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('Running onAuthenticated callbacks', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                // Highlight any Steam32 segments we have in the DOM
                var items = document.querySelectorAll('.OAAS32_' + window[rootObjectName].SteamAuth.currentUserSteam32);
                var i = 0;
                var j = items.length;

                for (i; i < j; i++) {
                    items[i].classList.add('OAA_currentSteamUser');
                }

                i = 0;
                j = onAuthenticatedCallbacks.length;

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
                // Cached for 1 week at a time
                // TODO: Need to make a clear case for this information!
                window.localStorage.setItem('OAAGGS64', (Date.now() + 604800000) + ':' + userSteam64);

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
                            if (!steamAuthChallenge || (steamAuthChallenge.indexOf(':') === -1)) {
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

                                if (Number(steamAuthSet[0]) > Date.now()) {
                                    userSteam64 = steamAuthSet[1];

                                    handleFetchUserProfileData();
                                } else {
                                    handleUpdateNavToRequiresAuthentication();
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
                    // Split the string into char arrays sop we can do the math manually (Doing the plan math will always fail...)
                    var steam64chars     = userSteam64.split('').reverse();
                    var steamTConstChars = '76561197960265728'.split('').reverse();
                    var steam32Chars     = [];

                    var i = 0;
                    var j = steam64chars.length;

                    var carry = false;
                    var baseInt;
                    var subtInt;
                    var resultInt;

                    // TODO: Maybe there is a case where the 64 is less than the translation constant?
                    for (i; i < j; i++) {
                        baseInt = Number(steam64chars[i]);
                        subtInt = Number(steamTConstChars[i]);

                        // Are we carrying a number from the last operation?
                        if (carry) {
                            baseInt = (baseInt - 1);
                        }

                        carry = false;

                        resultInt = baseInt - subtInt;

                        if (resultInt < 0) {
                            resultInt = (resultInt + 10);

                            carry = true;
                        }

                        steam32Chars.push(resultInt.toString());
                    }

                    return steam32Chars.reverse().join('').replace(/^[0]+/, '');
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
