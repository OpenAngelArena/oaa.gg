!(function() {
    // DO NOT register debug if the frame has it disengaged!
    if (window.location.search.search(/(\?|&)debug(=|&|$)/) === -1) {
        return false;
    }

    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        /**
         * @type {{
         *   writeConsoleMessage: Function,
         *   writeConsoleObject:  Function,
         *   writeConsoleTable:   Function,
         *   LOG_LEVEL_LOG:       Number,
         *   LOG_LEVEL_INFO:      Number,
         *   LOG_LEVEL_DEBUG:     Number,
         *   LOG_LEVEL_WARN:      Number,
         *   LOG_LEVEL_ERROR:     Number,
         * }} window[rootObjectName].Debug
         */
        window[rootObjectName].Debug = (function () {
            var constants = {
                'LOG_LEVEL_LOG':   1,
                'LOG_LEVEL_INFO':  2,
                'LOG_LEVEL_DEBUG': 3,
                'LOG_LEVEL_WARN':  4,
                'LOG_LEVEL_ERROR': 5
            };
    
            var validateConsoleLevel = function (level) {
                var keys = Object.keys(constants),
                    i = 0,
                    j = keys.length;
    
                for (i; i < j; i++) {
                    if (constants[keys[i]] === level) {
                        return level;
                    }
                }
    
                return constants['LOG_LEVEL_LOG'];
            };
    
            var determineConsoleCallback = function (level) {
                // Alright...I need to explain this
                // Due to limitations in FireFox and IOS, we need to do a lot here that doesn't seem necessary
                // FireFox and IOS might not support some of the function levels
                // IOS relies on "this" actually just being window.console and will cause type errors otherwise
                try {
                    switch (level) {
                        case constants['LOG_LEVEL_INFO']:
    
                            if (window.console.info) {
                                return window.console.info.bind(window.console);
                            } else {
                                return window.console.log.bind(window.console);
                            }
                            break;
    
                        case constants['LOG_LEVEL_DEBUG']:
    
                            if (window.console.debug) {
                                return window.console.debug.bind(window.console);
                            } else {
                                return window.console.log.bind(window.console);
                            }
                            break;
    
                        case constants['LOG_LEVEL_WARN']:
    
                            if (window.console.warn) {
                                return window.console.warn.bind(window.console);
                            } else {
                                return window.console.log.bind(window.console);
                            }
                            break;
    
                        case constants['LOG_LEVEL_ERROR']:
    
                            if (window.console.error) {
                                return window.console.error.bind(window.console);
                            } else {
                                return window.console.log.bind(window.console);
                            }
                            break;
    
                        default:
    
                            return console.log;
                    }
                } catch(e) {
                    return window.console.log.bind(window.console);
                }
            };
    
            var printCallTrace = function () {
                console.trace();
            };
    
            var formatModule = function (module) {
                return '[' + module.trim() + ']';
            };
    
            return {
                /**
                 * Writes a console message
                 *
                 * @param message
                 * @param module
                 * @param consoleLevel
                 * @param includeTrace
                 */
                writeConsoleMessage: function (message, module, consoleLevel, includeTrace) {
                    determineConsoleCallback(validateConsoleLevel(consoleLevel))(((module) ? formatModule(module) + ' ' : '') + message);
    
                    if (includeTrace) {
                        printCallTrace();
                    }
                },
    
                /**
                 * Writes a console object
                 *
                 * @param object
                 * @param module
                 * @param consoleLevel
                 * @param includeTrace
                 */
                writeConsoleObject:  function (object, module, consoleLevel, includeTrace) {
                    var consoleCallback = determineConsoleCallback(validateConsoleLevel(consoleLevel));
    
                    if (module) {
                        consoleCallback('------ ' + formatModule(module) + ' ------');
                        consoleCallback(object);
                        consoleCallback('------ ' + formatModule(module) + ' ------');
                    } else {
                        consoleCallback('------ ------ ------');
                        consoleCallback(object);
                        consoleCallback('------ ------ ------');
                    }
    
                    if (includeTrace) {
                        printCallTrace();
                    }
                },
    
                /**
                 * Writes an object to the console as a table
                 *
                 * @param object
                 */
                writeConsoleTable:   function (object) {
                    console.table(object);
                },
                get LOG_LEVEL_LOG() {
                    return constants['LOG_LEVEL_LOG'];
                },
                get LOG_LEVEL_INFO() {
                    return constants['LOG_LEVEL_INFO'];
                },
                get LOG_LEVEL_DEBUG() {
                    return constants['LOG_LEVEL_DEBUG'];
                },
                get LOG_LEVEL_WARN() {
                    return constants['LOG_LEVEL_WARN'];
                },
                get LOG_LEVEL_ERROR() {
                    return constants['LOG_LEVEL_ERROR'];
                }
            }
        }());
    
        window[rootObjectName].modulePrepared('Debug');
    });
}());
