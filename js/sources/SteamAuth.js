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

                    $nameContainer.classList.add('SteamUserName');

                    $unrankedMMRNumber.innerHTML = userSteamProfileData.unrankedMMR;
                    $rankedMMRNumber.innerHTML = userSteamProfileData.rankedMMR;

                    $unrankedMMRNumber.classList.add('OAAUnrankedMMRValue');
                    $rankedMMRNumber.classList.add('OAARankedMMRValue');

                    $unrankedMMR.classList.add('OAAUnrankedMMR');
                    $rankedMMR.classList.add('OAARankedMMR');

                    $MMRContainer.classList.add('OAAMMRValues');

                    $unrankedMMR.appendChild($unrankedMMRNumber);
                    $rankedMMR.appendChild($rankedMMRNumber);

                    $MMRContainer.appendChild($unrankedMMR);
                    $MMRContainer.appendChild($rankedMMR);

                    $steamProfile.appendChild($nameContainer);
                    $steamProfile.appendChild($MMRContainer);

                    // Make their avatar available in layout?
                    if (userSteamProfileData.profile.avatar) {
                        var $userAvatar = document.createElement('img');

                        $userAvatar.setAttribute('src', userSteamProfileData.profile.avatar);

                        $userAvatar.classList.add('SteamUserAvatar');

                        // Aside Avatar for the moment
                        // $steamProfile.appendChild($userAvatar);
                    }
                } else {
                    window[rootObjectName].awaitModulePrepared('Debug', function() {
                        window[rootObjectName].Debug.writeConsoleMessage('User data appears corrupted?', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                    });

                    // TODO: Catch?
                }

                var steamAuthElements = document.querySelectorAll('.steamAuth');
                var i = 0;
                var j = steamAuthElements.length;

                for (i; i < j; i++) {
                    steamAuthElements[i].classList.remove('loading');
                    steamAuthElements[i].classList.add('authenticated');
                }

                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('Running onAuthenticated callbacks', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                // Highlight any Steam32 segments we have in the DOM
                var items = document.querySelectorAll('.OAAS32_' + window[rootObjectName].SteamAuth.currentUserSteam32);
                i = 0;
                j = items.length;

                for (i; i < j; i++) {
                    items[i].classList.add('OAA_currentSteamUser');
                }

                i = 0;
                j = onAuthenticatedCallbacks.length;

                for (i; i < j; i++) {
                    window[rootObjectName].handleRunCallback(onAuthenticatedCallbacks[i]);
                }

                window[rootObjectName].modulePrepared('SteamAuth');
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

                window[rootObjectName].modulePrepared('SteamAuth');
            };

            var handleFetchUserProfileData = function() {
                // Cached for 1 week at a time
                // TODO: Need to make a clear case for this information!
                window.localStorage.setItem('OAAGGS64', (Date.now() + 604800000) + ':' + userSteam64);

                handleUpdateNavToAuthenticated();
            };

            return {
                __init: function() {
                    // Make sure SS has our button markup
                    var l = document.querySelector('a[href="#OAALoader"]');

                    if (l) {
                        var replacement = document.createElement('div');

                        replacement.classList.add('steamAuth');
                        replacement.classList.add('loading');

                        replacement.innerHTML = '<div class="steamLoader"> <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default"> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(0 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(30 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.08333333333333333s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(60 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.16666666666666666s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(90 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.25s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(120 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.3333333333333333s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(150 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.4166666666666667s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(180 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(210 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5833333333333334s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(240 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.6666666666666666s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(270 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.75s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(300 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.8333333333333334s" repeatCount="indefinite"></animate> </rect> <rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#AAAAAA" transform="rotate(330 50 50) translate(0 -30)"> <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.9166666666666666s" repeatCount="indefinite"></animate> </rect> </svg> </div> <div id="steamProfile"></div> <a id="steamAuth"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 233 233"> <path fill="#233950" d="m4.8911 150.01c14.393 48.01 58.916 82.99 111.61 82.99 64.34 0 116.5-52.16 116.5-116.5 0-64.341-52.16-116.5-116.5-116.5-61.741 0-112.26 48.029-116.25 108.76 7.5391 12.66 10.481 20.49 4.6411 41.25z"/> <path fill="#FFFFFF" d="m110.5 87.322c0 0.196 0 0.392 0.01 0.576l-28.508 41.412c-4.618-0.21-9.252 0.6-13.646 2.41-1.937 0.79-3.752 1.76-5.455 2.88l-62.599-25.77c0.00049 0-1.4485 23.83 4.588 41.59l44.254 18.26c2.222 9.93 9.034 18.64 19.084 22.83 16.443 6.87 35.402-0.96 42.242-17.41 1.78-4.3 2.61-8.81 2.49-13.31l40.79-29.15c0.33 0.01 0.67 0.02 1 0.02 24.41 0 44.25-19.9 44.25-44.338 0-24.44-19.84-44.322-44.25-44.322-24.4 0-44.25 19.882-44.25 44.322zm-6.84 83.918c-5.294 12.71-19.9 18.74-32.596 13.45-5.857-2.44-10.279-6.91-12.83-12.24l14.405 5.97c9.363 3.9 20.105-0.54 23.997-9.9 3.904-9.37-0.525-20.13-9.883-24.03l-14.891-6.17c5.746-2.18 12.278-2.26 18.381 0.28 6.153 2.56 10.927 7.38 13.457 13.54s2.52 12.96-0.04 19.1m51.09-54.38c-16.25 0-29.48-13.25-29.48-29.538 0-16.275 13.23-29.529 29.48-29.529 16.26 0 29.49 13.254 29.49 29.529 0 16.288-13.23 29.538-29.49 29.538m-22.09-29.583c0-12.253 9.92-22.191 22.14-22.191 12.23 0 22.15 9.938 22.15 22.191 0 12.254-9.92 22.183-22.15 22.183-12.22 0-22.14-9.929-22.14-22.183z"/> </svg> <span>Login<br />with Steam</span> </a>';

                        l.parentNode.replaceChild(replacement, l);

                        // And keep styling too
                        var style = document.createElement('style');

                        style.innerHTML = '@-webkit-keyframes -nav-mmr-rotate-unranked{0%,20%,80%,100%{opacity:1;-webkit-transform:none;transform:none}30%,70%{opacity:0;-webkit-transform:rotateX(180deg);transform:rotateX(180deg)}}@keyframes -nav-mmr-rotate-unranked{0%,20%,80%,100%{opacity:1;-webkit-transform:none;transform:none}30%,70%{opacity:0;-webkit-transform:rotateX(180deg);transform:rotateX(180deg)}}@-webkit-keyframes -nav-mmr-rotate-ranked{0%,20%,80%,100%{opacity:0;-webkit-transform:rotateX(180deg);transform:rotateX(180deg)}30%,70%{opacity:1;-webkit-transform:none;transform:none}}@keyframes -nav-mmr-rotate-ranked{0%,20%,80%,100%{opacity:0;-webkit-transform:rotateX(180deg);transform:rotateX(180deg)}30%, 70%{opacity:1;-webkit-transform:none;transform:none}}.steamAuth .OAADownloadLink, .steamAuth .steamLoader, .steamAuth #steamProfile, .steamAuth #steamProfile .OAAMMRValues, .steamAuth #steamAuth {display:-webkit-box;display:-webkit-flex;display:flex}.steamAuth > * {transition:.4s ease-out}.steamAuth {position:relative}.steamAuth:not(.loading) .steamLoader, .steamAuth:not(.loaded) .steamLoader {opacity:0;pointer-events:none}.steamAuth.loading #steamAuth, .steamAuth.loading .steamProfile {opacity:0;pointer-events:none}.steamAuth.loaded #steamAuth {opacity:0;pointer-events:none}.steamAuth.authenticated .steamLoader, .steamAuth.authenticated #steamAuth {opacity:0;pointer-events:none}.steamAuth.authenticated #steamProfile {pointer-events:all}.steamAuth .OAADownloadLink {text-align:center;line-height:1.4em;padding:2px;height:100%;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center}.steamAuth .steamLoader {position:absolute;width:100%;height:100%;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center}.steamAuth #steamProfile {position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;-webkit-box-direction:normal;-webkit-box-orient:vertical;-webkit-flex-direction:column;flex-direction:column}.steamAuth #steamProfile .SteamUserName {text-align:center;font-weight:bold;font-size:1.1rem;padding:2px}.steamAuth #steamProfile .OAARankedMMR {position:absolute;top:0;right:0;left:0;bottom:0;padding:1px 2px;-webkit-animation:-nav-mmr-rotate-ranked 6s linear infinite;animation:-nav-mmr-rotate-ranked 6s linear infinite}.steamAuth #steamProfile .OAARankedMMR::before {content:\'Ranked:\'}.steamAuth #steamProfile .OAAMMRValues {text-align:center;margin-top:auto;position:relative;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center}.steamAuth #steamProfile .OAAMMRValues>*{-webkit-backface-visibility:hidden;backface-visibility:hidden}.steamAuth #steamProfile .OAAUnrankedMMR {padding:1px 2px;-webkit-animation:-nav-mmr-rotate-unranked 6s linear infinite;animation:-nav-mmr-rotate-unranked 6s linear infinite}.steamAuth #steamProfile .OAAUnrankedMMR::before{content:\'Unranked:\'}.steamAuth #steamAuth{background:transparent;color:#FFFFFF;border:0;cursor:pointer;padding:7px 11px;position:relative;z-index:10;-webkit-align-items:center;align-items:center}.steamAuth #steamAuth:hover{color:#00BC8C;background:rgba(0,0,0,0.2)}.steamAuth #steamAuth svg{width:2em;height:2em;margin-right:.4em}';

                        document.head.appendChild(style);
                    }

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
                    if (!hasBeenAuthenticated) {
                        return '0';
                    }

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

        window[rootObjectName].moduleReady(window[rootObjectName].SteamAuth.__init);
    });
}());
