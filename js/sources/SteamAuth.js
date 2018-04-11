!(function() {
    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        window[rootObjectName].SteamAuth = (function () {
            var onAuthenticatedCallbacks = [];
            var hasBeenAuthenticated     = false;
            var userManagerInstance      = null;

            var handlePromptUserToAuthenticateWithSteam = function() {

            };

            return {
                __init: function() {
                    window[rootObjectName].awaitModulePrepared('OpenID', function() {
                        // TODO: Do background Steam authentication first, then bind prompted authentication if that fails
                        userManagerInstance = new UserManager();
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
