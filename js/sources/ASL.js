!(function() {
    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        /**
         * @type {{
         *   _scheduleAnimationCheck:      Function,
         *   _scheduleResizeRecalculation: Function,
         *   registerScrollCallback:       Function,
         *   registerScrollContainer:      Function,
         *   getLazyMap:                   Function,
         * }} window[rootObjectName].ASL
         */
        window[rootObjectName].ASL = (function() {
            /**
             * The default threshold to load images off of the screen.
             *
             * @type {number} - The flotval percentage of the screen to allow callbacks to be run for the registered element
             */
            var defaultThreshold = .5;

            /**
             * The complete map of all registered and unloaded lazy items
             *
             * @type {Array}
             */
            var lazyMap = [];

            /**
             * State - True if a scroll check is scheduled for the next animation frame
             *
             * @type {boolean}
             */
            var scrollCheckScheduled = false;

            /**
             * State - True if a resize recalculation check is scheduled
             *
             * @type {boolean}
             */
            var resizeRecalculationScheduled = false;

            /**
             * State - True if the event handlers are currently attached
             *
             * @type {boolean}
             */
            var scrollHandlerRegistered = false;

            /**
             * Schedules an animation frame check for a scroll event to load in items
             */
            var scheduleAnimationCheck = function() {
                if (!scrollCheckScheduled) {
                    scrollCheckScheduled = true;

                    window.requestAnimationFrame(checkLazyElements);
                }
            };

            /**
             * Schedules a resize recalculation check when the DOM size changes
             */
            var scheduleResizeRecalculation = function(){
                if (!resizeRecalculationScheduled) {
                    resizeRecalculationScheduled = true;

                    window.requestAnimationFrame(recalculateLazyElements);
                }
            };

            /**
             * Checks all registered lazy elements against the current DOM bounds to see if they need to load in.  Calculations are based on the cached bounding boxes
             */
            var checkLazyElements = function() {
                // Find the client bounds now
                var windowHeight = window.innerHeight;
                var scrollTop = window.pageYOffset;
                var i = 0;
                var j = lazyMap.length;
                var threshold;
                var item;

                for (i; i < j; i++) {
                    // Check if the element is in bounds
                    item = lazyMap[i];
                    threshold = item.threshold;

                    if (
                        (item.lazyProps.threshTop <= (scrollTop + (windowHeight + (windowHeight * threshold)))) &&
                        (item.lazyProps.threshBottom >= (scrollTop - (windowHeight * threshold)))
                    ) {
                        if (item.scrollCallback) {
                            item.scrollCallback(item.$element);
                        }

                        // Delete the element
                        lazyMap.splice(i, 1);

                        // We need to decrement the counters when the array is changed
                        i--;
                        j--;
                    }
                }

                if (!lazyMap.length) {
                    window.removeEventListener('scroll', scheduleAnimationCheck);
                    window.removeEventListener('resize', scheduleResizeRecalculation);
                    scrollHandlerRegistered = false;
                }

                scrollCheckScheduled = false;
            };

            /**
             * Loops through all registered elements and recalculates the bounding boxes for each of them
             */
            var recalculateLazyElements = function() {
                // So the user went and resized the window.  Recalculate all of the lazy element positions so they can be cached.  THIS IS BLOCKING!
                var i = 0;
                var j = lazyMap.length;
                var scrollTop = window.pageYOffset;
                var bounds;

                for (i; i < j; i++) {
                    if (lazyMap[i].$element) {
                        bounds = lazyMap[i].$element.getBoundingClientRect();

                        lazyMap[i].lazyProps.threshTop = (parseInt(bounds.top) + scrollTop);
                        lazyMap[i].lazyProps.threshBottom = (parseInt(bounds.bottom) + scrollTop);
                    } else {
                        lazyMap.splice(i, 1);

                        i--;
                        j--;
                    }
                }

                resizeRecalculationScheduled = false;

                // Now Check the lazy elements, as they may now be on screen and need to be loaded
                checkLazyElements();
            };

            return {
                /**
                 * Schedules an animation check to happen on the next paint
                 *
                 * @function
                 *
                 * @private
                 */
                _scheduleAnimationCheck: function() {
                    scheduleAnimationCheck();
                },

                /**
                 * Schedules an resize recalculation on the next paint
                 *     DO NOT DO THIS UNLESS YOU ABSOLUTELY HAVE TO!
                 *
                 * @function
                 *
                 * @private
                 */
                _scheduleResizeRecalculation: function() {
                    scheduleResizeRecalculation();
                },

                /**
                 * Registers a new element that may be lazily loaded
                 *
                 * @function
                 *
                 * @param {Element}element - The DOMElement to use for the bounds of all calculations
                 * @param {Function}loadCallback - The function callback used to run the load logic for the registered element
                 *                                    Is passed the element registered as a parameter
                 * @param {=float}threshold - The optional threshold to load in the element off the screen
                 *
                 * @throws Error - Whenever an invalid callback or invalid element is provided
                 */
                registerScrollCallback: function(element, loadCallback, threshold) {
                    if ((element instanceof Element) && (typeof(loadCallback) === 'function')) {
                        /**
                         * @type {ClientRect}
                         */
                        var rects = element.getBoundingClientRect();

                        /**
                         * @type {number}
                         */
                        var scrollTop = window.pageYOffset;

                        lazyMap.push({
                            $element: element,
                            lazyProps: {
                                threshTop: (parseInt(rects.top) + scrollTop),
                                threshBottom: (parseInt(rects.bottom) + scrollTop)
                            },
                            threshold: (threshold) ? threshold : defaultThreshold,
                            scrollCallback: loadCallback
                        });

                        if (!scrollHandlerRegistered) {
                            window.addEventListener('scroll', scheduleAnimationCheck);
                            window.addEventListener('resize', scheduleResizeRecalculation);

                            scrollHandlerRegistered = true;
                        }

                        // Schedule an animation frame check to instantly load elements already on the screen
                        scheduleAnimationCheck();

                        return true;
                    }

                    throw new Error('Must provide a valid element and callback for lazy loader');
                },

                /**
                 * Binds a container to act as a new scroll binding for the abstract scroll loader
                 *
                 * @function
                 *
                 * @param node
                 * @param requiresRecalc
                 *
                 * @returns {boolean}
                 */
                registerScrollContainer: function(node, requiresRecalc) {
                    if (node instanceof Node) {
                        node.addEventListener('scroll', window[rootObjectName].ASL._scheduleAnimationCheck);
                        node.addEventListener('resize', window[rootObjectName].ASL._scheduleResizeRecalculation);

                        if (requiresRecalc) {
                            node.addEventListener('scroll', window[rootObjectName].ASL._scheduleResizeRecalculation);
                        }

                        return true;
                    }

                    throw new TypeError('Scroll Container Node must be instance of node');
                },

                /**
                 * Gets the current registered lazy map
                 *
                 * @function
                 *
                 * @return Array|layMap - The map of all unloaded lazy elements
                 */
                getLazyMap: function() {
                    return lazyMap;
                }
            }
        }());

        window[rootObjectName].modulePrepared('ASL');
    });
}());
