!(function() {
    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        window[rootObjectName].SteamAuth = (function () {
            var onAuthenticatedCallbacks = [];
            var hasBeenAuthenticated     = false;
            var userManagerInstance      = null;

            var handleUpdateNavToAuthenticated = function() {

            };

            var handleUpdateNavToRequiresAuthentication = function() {
                var authButton = document.querySelector('body>nav .steamAuth');

                authButton.classList.remove('loading');

                authButton.addEventListener('click', userManagerInstance.signinPopup);
                authButton.addEventListener('tap',   userManagerInstance.signinPopup);
                authButton.addEventListener('touch', userManagerInstance.signinPopup);
            };

            return {
                __init: function() {
                    window[rootObjectName].awaitModulePrepared('OpenID', function() {
                        window[rootObjectName].awaitModulePrepared('Debug', function() {
                            window[rootObjectName].Debug.writeConsoleMessage('Initializing Steam authentication', 'SteamAuth', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                        });

                        Oidc.Log.logger = console;

                        // TODO: Do background Steam authentication first, then bind prompted authentication if that fails
                        userManagerInstance = new Oidc.UserManager({
                            authority: 'https://steamcommunity.com/openid/',
                            client_id: '0FA551D64997BEF92A8FC8CBB1ECBA2B',
                            redirect_uri: window.location.origin + window.location.pathname,
                            scope: 'openid',
                            userStore: new Oidc.WebStorageStateStore({
                                store: window.localStorage
                            }),
                            checkSessionInterval: 30000,
                            popupWindowTarget: window.open,
                            automaticSilentRenew: true,
                        });

                        userManagerInstance.getUser()
                            .then(handleUpdateNavToAuthenticated)
                            .catch(handleUpdateNavToRequiresAuthentication);
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
                    return 0;
                },

                get currentUserSteam64() {
                    return 0;
                },
            };
        }());

        window[rootObjectName].modulePrepared('SteamAuth');
        window[rootObjectName].moduleReady(window[rootObjectName].SteamAuth.__init);
    });
}());
