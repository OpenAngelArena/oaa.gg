/**
 * @var {{
 *   __GRN: String,
 *   [rootInstanceName]: {
 *
 *   }
 * }} window
 */

/** Polyfills **/
/**
 * Polyfill Object.setPrototypeOf
 */
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
        obj.__proto__ = proto;
        return obj;
    };

/**
 * Adds swipe event handlers for devices that use touch
 *
 * All events are fired on touch end, so when touch is released
 *
 * swipeLeft - Swipe left event
 * swipeRight - Swipe right event
 * swipeUp - Swipe up event
 * swipeDown - Swipe down event
 */
(function (doc) {
    /**
     * Bool state if event should be fired on touch end
     *
     * @type {boolean}
     */
    var fireEvent      = true,

        /**
         * Int pixel threshold to allow swipe event after
         *
         * @type {number}
         */
        pixelThreshold = 80,

        /**
         * The coordinates of the touch start
         *
         * @type {{x: number, y: number}}
         */
        startingPoint  = {
            x: 0, y: 0
        },

        /**
         * The coordinates of the touch end
         *
         * @type {{x: number, y: number}}
         */
        endingPoint    = {
            x: 0, y: 0
        },

        /**
         * TObject map of touch event bindings
         *
         * @type {{x: number, y: number}}
         */
        touch          = {
            /**
             * touchStart event handler
             *
             * @param event
             */
            touchstart: function (event) {
                startingPoint = {
                    x: event.touches[0].pageX, y: event.touches[0].pageY
                }
            },

            /**
             * touchMove event handler
             *
             * @param event
             */
            touchmove: function (event) {
                fireEvent = false;

                endingPoint = {
                    x: event.touches[0].pageX, y: event.touches[0].pageY
                }
            },

            /**
             * touchEnd event handler
             *
             * @param event
             */
            touchend: function (event) {
                if (fireEvent) {
                    createEvent(event, 'fc')
                } else {
                    var x                                             = endingPoint.x - startingPoint.x, roundedX = Math.abs(x),
                        y = endingPoint.y - startingPoint.y, roundedY = Math.abs(y);

                    if (Math.max(roundedX, roundedY) > pixelThreshold) {
                        createEvent(event, (roundedX > roundedY ? (x < 0 ? 'swipeLeft' : 'swipeRight') : (y < 0 ? 'swipeUp' : 'swipeDown')));
                    }
                }

                fireEvent = true
            },

            /**
             * touchCancel event handler
             *
             * @param event
             */
            touchcancel: function (event) {
                fireEvent = false
            }
        },

        /**
         * Init and run a custom event for the type of swipe we detected
         *
         * @param event
         * @param name
         * @returns {boolean}
         */
        createEvent    = function (event, name) {
            var customEvent = document.createEvent("CustomEvent");
            customEvent.initCustomEvent(name, true, true, event.target);
            event.target.dispatchEvent(customEvent);
            customEvent = null;
            return false
        };

    // Bind touch listeners
    for (var a in touch) {
        doc.addEventListener(a, touch[a], false);
    }
})(document);

// window.Promise() polyfill
(function (self) {
    // Skip everything if we have the capability already
    // FIX: IOS 10 has failed to get Fetch correct twice, so we are polyfilling over top of it until IOS 11
    if (self.promise || ((/[Ii][Pp]hone/.test(window.navigator.userAgent) && /[Oo][Ss]\s10_?/.test(window.navigator.userAgent)) || (/iPhone10,/i.test(window.navigator.userAgent)))) {
        return;
    }

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function noop() {
    }

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
        return function () {
            fn.apply(thisArg, arguments);
        };
    }

    function Promise(fn) {
        if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
        if (typeof fn !== 'function') throw new TypeError('not a function');
        this._state = 0;
        this._handled = false;
        this._value = undefined;
        this._deferreds = [];

        doResolve(fn, this);
    }

    function handle(self, deferred) {
        while (self._state === 3) {
            self = self._value;
        }
        if (self._state === 0) {
            self._deferreds.push(deferred);
            return;
        }
        self._handled = true;
        Promise._immediateFn(function () {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
            }
            var ret;
            try {
                ret = cb(self._value);
            } catch (e) {
                reject(deferred.promise, e);
                return;
            }
            resolve(deferred.promise, ret);
        });
    }

    function resolve(self, newValue) {
        try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (newValue instanceof Promise) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                } else if (typeof then === 'function') {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
        } catch (e) {
            reject(self, e);
        }
    }

    function reject(self, newValue) {
        self._state = 2;
        self._value = newValue;
        finale(self);
    }

    function finale(self) {
        if (self._state === 2 && self._deferreds.length === 0) {
            Promise._immediateFn(function () {
                if (!self._handled) {
                    Promise._unhandledRejectionFn(self._value);
                }
            });
        }

        for (var i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return;
                done = true;
                resolve(self, value);
            }, function (reason) {
                if (done) return;
                done = true;
                reject(self, reason);
            });
        } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
        }
    }

    Promise.prototype['catch'] = function (onRejected) {
        return this.then(null, onRejected);
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {
        var prom = new (this.constructor)(noop);

        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };

    Promise.all = function (arr) {
        var args = Array.prototype.slice.call(arr);

        return new Promise(function (resolve, reject) {
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
                try {
                    if (val && (typeof val === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                            then.call(val, function (val) {
                                res(i, val);
                            }, reject);
                            return;
                        }
                    }
                    args[i] = val;
                    if (--remaining === 0) {
                        resolve(args);
                    }
                } catch (ex) {
                    reject(ex);
                }
            }

            for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };

    Promise.resolve = function (value) {
        if (value && typeof value === 'object' && value.constructor === Promise) {
            return value;
        }

        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    Promise.reject = function (value) {
        return new Promise(function (resolve, reject) {
            reject(value);
        });
    };

    Promise.race = function (values) {
        return new Promise(function (resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    };

    // Use polyfill for setImmediate for performance gains
    Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) {
            setImmediate(fn);
        }) || function (fn) {
            setTimeoutFunc(fn, 0);
        };

    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
        if (typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
        }
    };

    /**
     * Set the immediate function to execute callbacks
     * @param fn {function} Function to execute
     * @deprecated
     */
    Promise._setImmediateFn = function _setImmediateFn(fn) {
        Promise._immediateFn = fn;
    };

    /**
     * Change the function to execute on unhandled rejection
     * @param {function} fn Function to execute on unhandled rejection
     * @deprecated
     */
    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
        Promise._unhandledRejectionFn = fn;
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Promise;
    } else if (!self.Promise) {
        self.Promise = Promise;
    }

})(this);

// window.fetch polyfill
(function (self) {
    'use strict';

    if (self.fetch) {
        return
    }

    var support = {
        searchParams: 'URLSearchParams' in self,
        iterable:     'Symbol' in self && 'iterator' in Symbol,
        blob:         'FileReader' in self && 'Blob' in self && (function () {
            try {
                new Blob();
                return true
            } catch (e) {
                return false
            }
        })(),
        formData:     'FormData' in self,
        arrayBuffer:  'ArrayBuffer' in self
    };

    function normalizeName(name) {
        if (typeof name !== 'string') {
            name = String(name)
        }
        if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
    }

    function normalizeValue(value) {
        if (typeof value !== 'string') {
            value = String(value)
        }
        return value
    }

    // Build a destructive iterator for the value list
    function iteratorFor(items) {
        var iterator = {
            next: function () {
                var value = items.shift();
                return {done: value === undefined, value: value}
            }
        };

        if (support.iterable) {
            iterator[Symbol.iterator] = function () {
                return iterator
            }
        }

        return iterator
    }

    function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
                this.append(name, value)
            }, this)

        } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                this.append(name, headers[name])
            }, this)
        }
    }

    Headers.prototype.append = function (name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var list = this.map[name];
        if (!list) {
            list = [];
            this.map[name] = list
        }
        list.push(value)
    };

    Headers.prototype['delete'] = function (name) {
        delete this.map[normalizeName(name)]
    };

    Headers.prototype.get = function (name) {
        var values = this.map[normalizeName(name)];
        return values ? values[0] : null
    };

    Headers.prototype.getAll = function (name) {
        return this.map[normalizeName(name)] || []
    };

    Headers.prototype.has = function (name) {
        return this.map.hasOwnProperty(normalizeName(name))
    };

    Headers.prototype.set = function (name, value) {
        this.map[normalizeName(name)] = [normalizeValue(value)]
    };

    Headers.prototype.forEach = function (callback, thisArg) {
        Object.getOwnPropertyNames(this.map).forEach(function (name) {
            this.map[name].forEach(function (value) {
                callback.call(thisArg, value, name, this)
            }, this)
        }, this)
    };

    Headers.prototype.keys = function () {
        var items = [];
        this.forEach(function (value, name) {
            items.push(name)
        });
        return iteratorFor(items)
    };

    Headers.prototype.values = function () {
        var items = [];
        this.forEach(function (value) {
            items.push(value)
        });
        return iteratorFor(items)
    };

    Headers.prototype.entries = function () {
        var items = [];
        this.forEach(function (value, name) {
            items.push([name, value])
        });
        return iteratorFor(items)
    };

    if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries
    }

    function consumed(body) {
        if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true
    }

    function fileReaderReady(reader) {
        return new Promise(function (resolve, reject) {
            reader.onload = function () {
                resolve(reader.result)
            };
            reader.onerror = function () {
                reject(reader.error)
            }
        })
    }

    function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        return fileReaderReady(reader)
    }

    function readBlobAsText(blob) {
        var reader = new FileReader();
        reader.readAsText(blob);
        return fileReaderReady(reader)
    }

    function Body() {
        this.bodyUsed = false;

        this._initBody = function (body) {
            this._bodyInit = body;
            if (typeof body === 'string') {
                this._bodyText = body
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString()
            } else if (!body) {
                this._bodyText = ''
            } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
                // Only support ArrayBuffers for POST method.
                // Receiving ArrayBuffers happens via Blobs, instead.
            } else {
                throw new Error('unsupported BodyInit type')
            }

            if (!this.headers.get('content-type')) {
                if (typeof body === 'string') {
                    this.headers.set('content-type', 'text/plain;charset=UTF-8')
                } else if (this._bodyBlob && this._bodyBlob.type) {
                    this.headers.set('content-type', this._bodyBlob.type)
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
                }
            }
        };

        if (support.blob) {
            this.blob = function () {
                var rejected = consumed(this);
                if (rejected) {
                    return rejected
                }

                if (this._bodyBlob) {
                    return Promise.resolve(this._bodyBlob)
                } else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as blob')
                } else {
                    return Promise.resolve(new Blob([this._bodyText]))
                }
            };

            this.arrayBuffer = function () {
                return this.blob().then(readBlobAsArrayBuffer)
            };

            this.text = function () {
                var rejected = consumed(this);
                if (rejected) {
                    return rejected
                }

                if (this._bodyBlob) {
                    return readBlobAsText(this._bodyBlob)
                } else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as text')
                } else {
                    return Promise.resolve(this._bodyText)
                }
            }
        } else {
            this.text = function () {
                var rejected = consumed(this);
                return rejected ? rejected : Promise.resolve(this._bodyText)
            }
        }

        if (support.formData) {
            this.formData = function () {
                return this.text().then(decode)
            }
        }

        this.json = function () {
            return this.text().then(JSON.parse)
        };

        return this
    }

    // HTTP methods whose capitalization should be normalized
    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

    function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return (methods.indexOf(upcased) > -1) ? upcased : method
    }

    function Request(input, options) {
        options = options || {};
        var body = options.body;
        if (Request.prototype.isPrototypeOf(input)) {
            if (input.bodyUsed) {
                throw new TypeError('Already read')
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
                this.headers = new Headers(input.headers)
            }
            this.method = input.method;
            this.mode = input.mode;
            if (!body) {
                body = input._bodyInit;
                input.bodyUsed = true
            }
        } else {
            this.url = input
        }

        this.credentials = options.credentials || this.credentials || 'omit';
        if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers)
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
            throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body)
    }

    Request.prototype.clone = function () {
        return new Request(this)
    };

    function decode(body) {
        var form = new FormData();
        body.trim().split('&').forEach(function (bytes) {
            if (bytes) {
                var split = bytes.split('=');
                var name = split.shift().replace(/\+/g, ' ');
                var value = split.join('=').replace(/\+/g, ' ');
                form.append(decodeURIComponent(name), decodeURIComponent(value))
            }
        });
        return form
    }

    function headers(xhr) {
        var head = new Headers();
        var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
        pairs.forEach(function (header) {
            var split = header.trim().split(':');
            var key = split.shift().trim();
            var value = split.join(':').trim();
            head.append(key, value)
        });
        return head
    }

    Body.call(Request.prototype);

    function Response(bodyInit, options) {
        if (!options) {
            options = {}
        }

        this.type = 'default';
        this.status = options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = options.statusText;
        this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
        this.url = options.url || '';
        this._initBody(bodyInit)
    }

    Body.call(Response.prototype);

    Response.prototype.clone = function () {
        return new Response(this._bodyInit, {
            status: this.status, statusText: this.statusText, headers: new Headers(this.headers), url: this.url
        })
    };

    Response.error = function () {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
    };

    var redirectStatuses = [301, 302, 303, 307, 308];

    Response.redirect = function (url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
    };

    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;

    self.fetch = function (input, init) {
        return new Promise(function (resolve, reject) {
            var request;
            if (Request.prototype.isPrototypeOf(input) && !init) {
                request = input
            } else {
                request = new Request(input, init)
            }

            var xhr = new XMLHttpRequest();

            function responseURL() {
                if ('responseURL' in xhr) {
                    return xhr.responseURL
                }

                // Avoid security warnings on getResponseHeader when not allowed by CORS
                if (/^X-Request-URL:/mi.test(xhr.getAllResponseHeaders())) {
                    return xhr.getResponseHeader('X-Request-URL')
                }

                return;
            }

            xhr.onload = function () {
                var options = {
                    status: xhr.status, statusText: xhr.statusText, headers: headers(xhr), url: responseURL()
                };
                var body = 'response' in xhr ? xhr.response : xhr.responseText
                resolve(new Response(body, options))
            };

            xhr.onerror = function () {
                reject(new TypeError('Network request failed'))
            };

            xhr.ontimeout = function () {
                reject(new TypeError('Network request failed'))
            };

            xhr.open(request.method, request.url, true);

            if (request.credentials === 'include') {
                xhr.withCredentials = true
            }

            if ('responseType' in xhr && support.blob) {
                xhr.responseType = 'blob'
            }

            request.headers.forEach(function (value, name) {
                xhr.setRequestHeader(name, value)
            });

            xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
        })
    };
    self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170112
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

    // Full polyfill for browsers with no classList support
    // Including IE < Edge missing SVGElement.classList
    if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

        (function (view) {

            "use strict";

            if (!('Element' in view)) return;

            var classListProp = "classList", protoProp = "prototype", elemCtrProto = view.Element[protoProp],
                objCtr                                                             = Object, strTrim = String[protoProp].trim || function () {
                        return this.replace(/^\s+|\s+$/g, "");
                    }, arrIndexOf                                                  = Array[protoProp].indexOf || function (item) {
                        var i = 0, len = this.length;
                        for (; i < len; i++) {
                            if (i in this && this[i] === item) {
                                return i;
                            }
                        }
                        return -1;
                    }
                // Vendors: please allow content code to instantiate DOMExceptions
                , DOMEx                                                            = function (type, message) {
                    this.name = type;
                    this.code = DOMException[type];
                    this.message = message;
                }, checkTokenAndGetIndex                                           = function (classList, token) {
                    if (token === "") {
                        throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
                    }
                    if (/\s/.test(token)) {
                        throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
                    }
                    return arrIndexOf.call(classList, token);
                }, ClassList                                                       = function (elem) {
                    var trimmedClasses                                                          = strTrim.call(elem.getAttribute("class") || ""),
                        classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [], i = 0, len = classes.length;
                    for (; i < len; i++) {
                        this.push(classes[i]);
                    }
                    this._updateClassName = function () {
                        elem.setAttribute("class", this.toString());
                    };
                }, classListProto                                                  = ClassList[protoProp] = [], classListGetter = function () {
                    return new ClassList(this);
                };
            // Most DOMException implementations don't allow calling DOMException's toString()
            // on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function (i) {
                return this[i] || null;
            };
            classListProto.contains = function (token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function () {
                var tokens = arguments, i = 0, l = tokens.length, token, updated = false;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                } while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function () {
                var tokens = arguments, i = 0, l = tokens.length, token, updated = false, index;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                } while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function (token, force) {
                token += "";

                var result = this.contains(token),
                    method = result ? force !== true && "remove" : force !== false && "add";

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.toString = function () {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter, enumerable: true, configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
                    // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
                    if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));

    } else {
        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.

        (function () {
            "use strict";

            var testElement = document.createElement("_");

            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function (method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function (token) {
                        var i, len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function (token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };
            }
            testElement = null;
        }());
    }
}

/** CORE **/

!(function(){
    var rootObjectName = window.__GRN;

    /**
     * @type {{
     *   handleRunCallback:                      Function,
     *   ready:                                  Function,
     *   moduleReady:                            Function,
     *   awaitModulePrepared:                    Function,
     *   modulePrepared:                         Function,
     *   userAgentSupportsPassiveEventListeners: Function,
     * }} window[rootObjectName]
     */
    window[rootObjectName] = (function() {
        // Flag the initial upgrading runtime as upgrading so callbacks don't get lost in the abyss
        if (window[rootObjectName]) {
            window[rootObjectName].u = true;
        }

        /**
         * @var {Array} readyStateQueue
         */
        var readyStateQueue = window[rootObjectName].i || [];

        /**
         * @var {Array} moduleReadyStateQueue
         */
        var moduleReadyStateQueue = window[rootObjectName].j || [];

        /**
         * @var {object} modulePreparedQueue
         */
        var modulePreparedQueue = {};

        /**
         * @var {Array} modulesPrepared
         */
        var modulesPrepared = [];

        /**
         * @var {boolean} passiveEventSupported
         */
        var passiveEventSupported = false;

        /**
         * @var {boolean} DOM_STATE_READY
         */
        var DOM_STATE_READY = false;

        /**
         * @var {boolean} MODULE_READY_STATE
         */
        var MODULE_READY_STATE = false;

        /**
         * @var {undefined} undefined
         */
        var undefined; // Stop people from being mean

        var processReadyStateQueue = function() {
            var i = 0;
            var j = readyStateQueue.length;

            for (i; i < j; i++) {
                window[rootObjectName].handleRunCallback(readyStateQueue[i].callback, readyStateQueue[i].scope);
            }

            DOM_STATE_READY = true;

            window.requestAnimationFrame(function() {
                var i = 0;
                var j = moduleReadyStateQueue.length;

                for (i; i < j; i++) {
                    window[rootObjectName].handleRunCallback(moduleReadyStateQueue[i].callback, moduleReadyStateQueue[i].scope)
                }

                MODULE_READY_STATE = true;
            });
        };

        // Detect passive event listeners
        try {
          var opts = Object.defineProperty({}, 'passive', {
            get: function() {
                passiveEventSupported = true;
            }
          });
          window.addEventListener('test', null, opts);
        } catch (e) {}

        // Check DOMState
        window.requestAnimationFrame(function () {
            window[rootObjectName].awaitModulePrepared('Debug', function() {
                window[rootObjectName].Debug.writeConsoleMessage('Checking document interactive state', 'Core', window[rootObjectName].Debug.LOG_LEVEL_INFO);
            });

            if ((document.readyState === 'interactive') || (document.readyState === 'complete')) {
                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('Document was ready before init, running state queue on next frame', 'Core', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                window.requestAnimationFrame(processReadyStateQueue);
            } else {
                window[rootObjectName].awaitModulePrepared('Debug', function() {
                    window[rootObjectName].Debug.writeConsoleMessage('Document still loading, registered DOMContentLoaded handler', 'Core', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                });

                document.addEventListener('DOMContentLoaded', processReadyStateQueue);
            }
        });

        // Print the debug notice
        if (window.location.search.search(/(\?|&)debug(=|&|$)/) === -1) {
            try {
                console.log('Developer console disengaged for frame [' + window.location + '].  Go to [' + window.location + ((window.location.search) ? '&' : '?') + 'debug] to engage developer console');
            } catch (e) { /* Silent since console log is required for dev consoles to start with */ }
        }

        return {
            /**
             * Safely runs a callback
             *
             * @param {function} callback - The callback to run safely, logging if there is an error
             * @param {object} scope - The object scope to bind for the callback when run
             */
            handleRunCallback: function(callback, scope) {
                if (!scope) {
                    scope = window;
                }

                try {
                    callback.bind(scope);

                    callback();
                } catch (e) {
                    window[rootObjectName].awaitModulePrepared('Debug', function(e, callback, scope) {
                        window[rootObjectName].Debug.writeConsoleMessage('An unexpected error happened while trying to run the callback requested', 'Core', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                        window[rootObjectName].Debug.writeConsoleObject(e, 'Core', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                        window[rootObjectName].Debug.writeConsoleObject(callback, 'Core', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                        window[rootObjectName].Debug.writeConsoleObject(scope, 'Core', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                    }.bind(this, e, callback, scope));
                }
            }.bind(this),

            /**
             * Registers a callback to be run when the DOM is ready, or immediately if the DOM is already prepared
             *
             * @param {function} callback - The callback to run safely, logging if there is an error
             * @param {object} scope - The object scope to bind for the callback when run
             */
            ready: function(callback, scope){
                if (typeof(callback) !== 'function') {
                    window[rootObjectName].awaitModulePrepared('Debug', function(callback, scope) {
                        window[rootObjectName].Debug.writeConsoleObject(callback, 'Core', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                        window[rootObjectName].Debug.writeConsoleObject(scope, 'Core', window[rootObjectName].Debug.LOG_LEVEL_ERROR);
                    }.bind(this, callback, scope));

                    throw new Error('Ready state callbacks MUST be a valid function');
                }

                if (DOM_STATE_READY) {
                    window[rootObjectName].handleRunCallback(callback, scope);
                } else {
                    readyStateQueue.push({
                        callback: callback,
                        scope: scope || this,
                    });
                }
            }.bind(this),

            /**
             * Registers a callback to be run when modules can begin operating
             *
             * @param {function} callback - The callback to run safely, logging if there is an error
             * @param {object} scope - The object scope to bind for the callback when run
             */
            moduleReady: function(callback, scope) {
                if (typeof(callback) !== 'function') {
                    throw new Error('Module ready state callbacks MUST be a valid function');
                }

                if (MODULE_READY_STATE) {
                    window[rootObjectName].handleRunCallback(callback, scope);
                } else {
                    moduleReadyStateQueue.push({
                        callback: callback,
                        scope: scope || this,
                    });
                }
            }.bind(this),

            /**
             * Registers a callback to be run when modules can begin operating
             *
             * @param {string} moduleName - The name of the module to await for
             * @param {function} callback - The callback to run safely, logging if there is an error
             * @param {=object} scope - The object scope to bind for the callback when run
             */
            awaitModulePrepared: function(moduleName, callback, scope) {
                if (typeof(callback) !== 'function') {
                    throw new Error('Module prepared callbacks MUST be a valid function');
                }

                if (!scope) {
                    scope = window;
                }

                if (modulesPrepared.indexOf(moduleName) > -1) {
                    window[rootObjectName].handleRunCallback(callback, scope);
                } else {
                    if (!modulePreparedQueue[moduleName]) {
                        modulePreparedQueue[moduleName] = [];
                    }

                    modulePreparedQueue[moduleName].push({
                        callback: callback,
                        scope: scope,
                    });
                }
            }.bind(this),

            /**
             * Registers that a module has progressed far enough to be usable in the runtime
             *
             * @param {string} moduleName - The name of the module that is now prepared
             */
            modulePrepared: function(moduleName) {
                if (modulesPrepared.indexOf(moduleName) === -1) {
                    // Register the module first so we don't run into a chicken and egg scenario
                    modulesPrepared.push(moduleName);

                    window[rootObjectName].awaitModulePrepared('Debug', function() {
                        window[rootObjectName].Debug.writeConsoleMessage('Module [' + moduleName + '] has registered as prepared', 'Core', window[rootObjectName].Debug.LOG_LEVEL_INFO);
                    }.bind(this, moduleName));

                    if (typeof(modulePreparedQueue[moduleName]) !== 'undefined') {
                        var i = 0;
                        var j = modulePreparedQueue[moduleName].length;

                        for (i; i < j; i++) {
                            window[rootObjectName].handleRunCallback(modulePreparedQueue[moduleName][i].callback, modulePreparedQueue[moduleName][i].scope)
                        }
                    }
                }
            }.bind(this),

            /**
             * Returns if passive event listener support was detected
             *
             * @return {bool}
             */
            userAgentSupportsPassiveEventListeners: function() {
                return passiveEventSupported;
            }.bind(this),
        }
    }((window[rootObjectName] && window[rootObjectName].r) ? window[rootObjectName].r :[]));

    window[rootObjectName].awaitModulePrepared('Debug', function() {
        window[rootObjectName].Debug.writeConsoleMessage('Core systems upgrade completed', 'Core', window[rootObjectName].Debug.LOG_LEVEL_INFO);
        window[rootObjectName].Debug.writeConsoleMessage('Core Systems and modules bound to root name [' + rootObjectName + ']', 'Core', window[rootObjectName].Debug.LOG_LEVEL_INFO);
    });
}());
