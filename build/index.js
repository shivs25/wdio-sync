'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fibersFuture = require('fibers/future');

var _fibersFuture2 = _interopRequireDefault(_fibersFuture);

var _fibers = require('fibers');

var _fibers2 = _interopRequireDefault(_fibers);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var __$Getters__ = [];
var __$Setters__ = [];
var __$Resetters__ = [];

function __GetDependency__(name) {
    return __$Getters__[name]();
}

function __Rewire__(name, value) {
    __$Setters__[name](value);
}

function __ResetDependency__(name) {
    __$Resetters__[name]();
}

var __RewireAPI__ = {
    '__GetDependency__': __GetDependency__,
    '__get__': __GetDependency__,
    '__Rewire__': __Rewire__,
    '__set__': __Rewire__,
    '__ResetDependency__': __ResetDependency__
};
var Future = _fibersFuture2['default'];

__$Getters__['Future'] = function () {
    return Future;
};

__$Setters__['Future'] = function (value) {
    Future = value;
};

__$Resetters__['Future'] = function () {
    Future = _fibersFuture2['default'];
};

var Fiber = _fibers2['default'];

__$Getters__['Fiber'] = function () {
    return Fiber;
};

__$Setters__['Fiber'] = function (value) {
    Fiber = value;
};

__$Resetters__['Fiber'] = function () {
    Fiber = _fibers2['default'];
};

var assign = _objectAssign2['default'];

__$Getters__['assign'] = function () {
    return assign;
};

__$Setters__['assign'] = function (value) {
    assign = value;
};

__$Resetters__['assign'] = function () {
    assign = _objectAssign2['default'];
};

var SYNC_COMMANDS = ['domain', '_events', '_maxListeners', 'setMaxListeners', 'emit', 'addListener', 'on', 'once', 'removeListener', 'removeAllListeners', 'listeners', 'getMaxListeners', 'listenerCount', 'getPrototype'];

var _SYNC_COMMANDS = SYNC_COMMANDS;

__$Getters__['SYNC_COMMANDS'] = function () {
    return SYNC_COMMANDS;
};

__$Setters__['SYNC_COMMANDS'] = function (value) {
    SYNC_COMMANDS = value;
};

__$Resetters__['SYNC_COMMANDS'] = function () {
    SYNC_COMMANDS = _SYNC_COMMANDS;
};

var STACKTRACE_FILTER = /((wdio-sync\/)*(build\/index.js|node_modules\/fibers)|- - - - -)/g;

var _STACKTRACE_FILTER = STACKTRACE_FILTER;

__$Getters__['STACKTRACE_FILTER'] = function () {
    return STACKTRACE_FILTER;
};

__$Setters__['STACKTRACE_FILTER'] = function (value) {
    STACKTRACE_FILTER = value;
};

__$Resetters__['STACKTRACE_FILTER'] = function () {
    STACKTRACE_FILTER = _STACKTRACE_FILTER;
};

var commandIsRunning = false;
var _commandIsRunning2 = commandIsRunning;

__$Getters__['commandIsRunning'] = function () {
    return commandIsRunning;
};

__$Setters__['commandIsRunning'] = function (value) {
    commandIsRunning = value;
};

__$Resetters__['commandIsRunning'] = function () {
    commandIsRunning = _commandIsRunning2;
};

var forcePromises = false;

var _forcePromises = forcePromises;

__$Getters__['forcePromises'] = function () {
    return forcePromises;
};

__$Setters__['forcePromises'] = function (value) {
    forcePromises = value;
};

__$Resetters__['forcePromises'] = function () {
    forcePromises = _forcePromises;
};

var isAsync = function isAsync() {
    if (!global.browser || !global.browser.options) {
        return true;
    }

    return global.browser.options.sync === false;
};

var _isAsync = isAsync;

__$Getters__['isAsync'] = function () {
    return isAsync;
};

__$Setters__['isAsync'] = function (value) {
    isAsync = value;
};

__$Resetters__['isAsync'] = function () {
    isAsync = _isAsync;
};

var sanitizeErrorMessage = function sanitizeErrorMessage(e) {
    var stack = e.stack.split(/\n/g);
    var errorMsg = stack.shift();
    var cwd = process.cwd();

    /**
     * filter out stack traces to wdio-sync and fibers
     * and transform absolute path to relative
     */
    stack = stack.filter(function (e) {
        return !e.match(STACKTRACE_FILTER);
    });
    stack = stack.map(function (e) {
        return '    ' + e.replace(cwd + '/', '').trim();
    });

    /**
     * this is just an assumption but works in most cases
     */
    var errorLine = stack.shift().trim();

    /**
     * correct error occurence
     */
    var lineToFix = stack[stack.length - 1];
    if (lineToFix.indexOf('index.js') > -1) {
        stack[stack.length - 1] = lineToFix.slice(0, lineToFix.indexOf('index.js')) + errorLine;
    } else {
        stack.unshift('    ' + errorLine);
    }

    /**
     * add back error message
     */
    stack.unshift(errorMsg);

    return stack.join('\n');
};

/**
 * Helper method to execute a row of hooks with certain parameters.
 * It will return with a reject promise due to a design decision to not let hooks/service intefer the
 * actual test process.
 *
 * @param  {Function|Function[]} hooks  list of hooks
 * @param  {Object[]} args  list of parameter for hook functions
 * @return {Promise}  promise that gets resolved once all hooks finished running
 */
var _sanitizeErrorMessage = sanitizeErrorMessage;

__$Getters__['sanitizeErrorMessage'] = function () {
    return sanitizeErrorMessage;
};

__$Setters__['sanitizeErrorMessage'] = function (value) {
    sanitizeErrorMessage = value;
};

__$Resetters__['sanitizeErrorMessage'] = function () {
    sanitizeErrorMessage = _sanitizeErrorMessage;
};

var executeHooksWithArgs = function executeHooksWithArgs(hooks, args) {
    if (hooks === undefined) hooks = [];

    /**
     * make sure hooks are an array of functions
     */
    if (typeof hooks === 'function') {
        hooks = [hooks];
    }

    /**
     * make sure args is an array since we are calling apply
     */
    if (!Array.isArray(args)) {
        args = [args];
    }
    hooks = hooks.map(function (hook) {
        return new Promise(function (resolve) {
            var _commandIsRunning = commandIsRunning;
            var result = undefined;

            var execHook = function execHook() {
                commandIsRunning = true;

                try {
                    result = hook.apply(null, args);
                } catch (e) {
                    console.error(e.stack);
                    return resolve(e);
                } finally {
                    commandIsRunning = _commandIsRunning;
                }
                if (result && typeof result.then === 'function') {
                    return result.then(resolve, function (e) {
                        console.error(e.stack);
                        resolve(e);
                    });
                }

                resolve(result);
            };

            /**
             * no need for fiber wrap in async mode
             */
            if (isAsync()) {
                return execHook();
            }

            /**
             * after command hooks require additional Fiber environment
             */
            return Fiber(execHook).run();
        });
    });

    return Promise.all(hooks);
};

/**
 * global function to wrap callbacks into Fiber context
 * @param  {Function} fn  function to wrap around
 * @return {Function}     wrapped around function
 */
var _executeHooksWithArgs = executeHooksWithArgs;

__$Getters__['executeHooksWithArgs'] = function () {
    return executeHooksWithArgs;
};

__$Setters__['executeHooksWithArgs'] = function (value) {
    exports.executeHooksWithArgs = executeHooksWithArgs = value;
};

__$Resetters__['executeHooksWithArgs'] = function () {
    exports.executeHooksWithArgs = executeHooksWithArgs = _executeHooksWithArgs;
};

global.wdioSync = function (fn, done) {
    return function () {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return Fiber(function () {
            var result = fn.apply(_this, args);

            if (typeof done === 'function') {
                done(result);
            }
        }).run();
    };
};

/**
 * wraps a function into a Fiber ready context to enable sync execution and hooks
 * @param  {Function}   fn             function to be executed
 * @param  {String}     commandName    name of that function
 * @param  {Function[]} beforeCommand  method to be executed before calling the actual function
 * @param  {Function[]} afterCommand   method to be executed after calling the actual function
 * @return {Function}   actual wrapped function
 */
var wrapCommand = function wrapCommand(fn, commandName, beforeCommand, afterCommand) {
    if (isAsync()) {
        /**
         * async command wrap
         */
        return function () {
            for (var _len2 = arguments.length, commandArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                commandArgs[_key2] = arguments[_key2];
            }

            return fn.apply(this, commandArgs);
        };
    }

    /**
     * sync command wrap
     */
    return function () {
        var _this2 = this;

        for (var _len3 = arguments.length, commandArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            commandArgs[_key3] = arguments[_key3];
        }

        var future = new Future();
        var futureFailed = false;

        if (forcePromises) {
            return fn.apply(this, commandArgs);
        }

        /**
         * don't execute [before/after]Command hook if a command was executed
         * in these hooks (otherwise we will get into an endless loop)
         */
        if (commandIsRunning) {
            var commandPromise = fn.apply(this, commandArgs);

            /**
             * Try to execute with Fibers and fall back if can't.
             * This part is executed when we want to set a fiber context within a command (e.g. in waitUntil).
             */
            try {
                commandPromise.then(function (commandResult) {
                    /**
                     * extend protoype of result so people can call browser.element(...).click()
                     */
                    future['return'](_applyPrototype2.call(_this2, commandResult));
                }, future['throw'].bind(future));
                return future.wait();
            } catch (e) {
                if (e.message === "Can't wait without a fiber") {
                    return commandPromise;
                }
                throw e;
            }
        }

        commandIsRunning = true;
        var newInstance = this;
        var lastCommandResult = this.lastResult;
        var commandResult = undefined,
            commandError = undefined;
        executeHooksWithArgs(beforeCommand, [commandName, commandArgs]).then(function () {
            /**
             * actual function was already executed in desired catch block
             */
            if (futureFailed) {
                return;
            }

            newInstance = fn.apply(_this2, commandArgs);
            return newInstance.then(function (result) {
                commandResult = result;
                return executeHooksWithArgs(afterCommand, [commandName, commandArgs, result]);
            }, function (e) {
                commandError = e;
                return executeHooksWithArgs(afterCommand, [commandName, commandArgs, null, e]);
            }).then(function () {
                commandIsRunning = false;

                if (commandError) {
                    return future['throw'](commandError);
                }
                _wrapCommands2(newInstance, beforeCommand, afterCommand);

                /**
                 * reset lastResult for all element calls within waitUntil/waitFor commands
                 */
                if (commandName.match(/^(waitUntil|waitFor)/i)) {
                    _this2.lastResult = lastCommandResult;
                }

                return future['return'](_applyPrototype2.call(newInstance, commandResult));
            });
        });

        /**
         * try to execute with Fibers and fall back if can't
         */
        try {
            return future.wait();
        } catch (e) {
            if (e.message === "Can't wait without a fiber") {
                futureFailed = true;
                return fn.apply(this, commandArgs);
            }

            e.stack = sanitizeErrorMessage(e);
            throw e;
        }
    };
};

var _wrapCommand = wrapCommand;

__$Getters__['wrapCommand'] = function () {
    return wrapCommand;
};

__$Setters__['wrapCommand'] = function (value) {
    exports.wrapCommand = wrapCommand = value;
};

__$Resetters__['wrapCommand'] = function () {
    exports.wrapCommand = wrapCommand = _wrapCommand;
};

var isElementsResult = function isElementsResult(result) {
    return typeof result.selector === 'string' && Array.isArray(result.value) && result.value.length && typeof result.value[0].ELEMENT !== undefined;
};

var _isElementsResult = isElementsResult;

__$Getters__['isElementsResult'] = function () {
    return isElementsResult;
};

__$Setters__['isElementsResult'] = function (value) {
    isElementsResult = value;
};

__$Resetters__['isElementsResult'] = function () {
    isElementsResult = _isElementsResult;
};

var is$$Result = function is$$Result(result) {
    return Array.isArray(result) && result.length && result[0].ELEMENT !== undefined;
};

/**
 * enhance result with instance prototype to enable command chaining
 * @param  {Object} result       command result
 * @param  {Object} helperScope  instance scope with prototype of already wrapped commands
 * @return {Object}              command result with enhanced prototype
 */
var _is$$Result = is$$Result;

__$Getters__['is$$Result'] = function () {
    return is$$Result;
};

__$Setters__['is$$Result'] = function (value) {
    is$$Result = value;
};

__$Resetters__['is$$Result'] = function () {
    is$$Result = _is$$Result;
};

var _applyPrototype2 = function applyPrototype(result, helperScope) {
    var _this3 = this;

    /**
     * don't overload result for none objects, arrays and buffer
     */
    if (!result || typeof result !== 'object' || Array.isArray(result) && !isElementsResult(result) && !is$$Result(result) || Buffer.isBuffer(result)) {
        return result;
    }

    /**
     * overload elements results
     */
    if (isElementsResult(result)) {
        result.value = result.value.map(function (el, i) {
            el.selector = result.selector;
            el.value = { ELEMENT: el.ELEMENT };
            el.index = i;
            return el;
        }).map(function (el) {
            var newInstance = Object.setPrototypeOf(Object.create(el), Object.getPrototypeOf(_this3));
            return _applyPrototype2.call(newInstance, el, _this3);
        });
    }

    /**
     * overload $$ result
     */
    if (is$$Result(result)) {
        return result.map(function (el) {
            var newInstance = Object.setPrototypeOf(Object.create(el), Object.getPrototypeOf(_this3));
            return _applyPrototype2.call(newInstance, el, _this3);
        });
    }

    var prototype = {};
    var hasExtendedPrototype = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(Object.getPrototypeOf(this))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var commandName = _step.value;

            if (result[commandName] || SYNC_COMMANDS.indexOf(commandName) > -1) {
                continue;
            }

            this.lastResult = result;

            /**
             * Prefer the helperScope if given which is only the case when we overload elements result.
             * We can't use the `this` prototype because its methods are not wrapped and command results
             * wouldn't be fiberised
             */
            prototype[commandName] = { value: (helperScope || this)[commandName].bind(this) };
            hasExtendedPrototype = true;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (hasExtendedPrototype) {
        var newResult = Object.create(result, prototype);

        /**
         * since status is a command we need to rename the property
         */
        if (typeof result.status !== 'undefined') {
            result._status = result.status;
            delete result.status;
        }

        result = assign(newResult, result);
    }

    return result;
};

/**
 * wraps all WebdriverIO commands
 * @param  {Object}     instance       WebdriverIO client instance (browser)
 * @param  {Function[]} beforeCommand  before command hook
 * @param  {Function[]} afterCommand   after command hook
 */
var _applyPrototype = _applyPrototype2;

__$Getters__['applyPrototype'] = function () {
    return _applyPrototype2;
};

__$Setters__['applyPrototype'] = function (value) {
    _applyPrototype2 = value;
};

__$Resetters__['applyPrototype'] = function () {
    _applyPrototype2 = _applyPrototype;
};

var _wrapCommands2 = function wrapCommands(instance, beforeCommand, afterCommand) {
    var addCommand = instance.addCommand;

    /**
     * if instance is a multibrowser instance make sure to wrap commands
     * of its instances too
     */
    if (instance.isMultiremote) {
        instance.getInstances().forEach(function (browserName) {
            _wrapCommands2(global[browserName], beforeCommand, afterCommand);
        });
    }

    Object.keys(Object.getPrototypeOf(instance)).forEach(function (commandName) {
        if (SYNC_COMMANDS.indexOf(commandName) > -1) {
            return;
        }

        var origFn = instance[commandName];
        instance[commandName] = wrapCommand.call(instance, origFn, commandName, beforeCommand, afterCommand);
    });

    /**
     * no need to overwrite addCommand in async mode
     */
    if (isAsync()) {
        return;
    }

    /**
     * Adding a command within fiber context doesn't require a special routine
     * since everything runs sync. There is no need to promisify the command.
     */
    instance.addCommand = function (fnName, fn, forceOverwrite) {
        var commandGroup = instance.getPrototype();
        var commandName = fnName;
        var namespace = undefined;

        if (typeof fn === 'string') {
            namespace = arguments[0];
            fnName = arguments[1];
            fn = arguments[2];
            forceOverwrite = arguments[3];

            switch (typeof commandGroup[namespace]) {
                case 'function':
                    throw new Error('Command namespace "' + namespace + '" is used internally, and can\'t be overwritten!');
                case 'undefined':
                    commandGroup[namespace] = {};
                    break;
            }

            commandName = namespace + '.' + fnName;
            commandGroup = commandGroup[namespace];
        }

        if (commandGroup[fnName] && !forceOverwrite) {
            throw new Error('Command ' + fnName + ' is already defined!');
        }

        /**
         * If method name is async the user specifies that he wants to use bare promises to handle asynchronicity.
         * First use native addCommand in order to be able to chain with other native commands, then wrap new
         * command again to run it synchronous in the test method.
         * This will allow us to run async custom commands within sync custom commands in a sync way.
         */
        if (fn.name === 'async') {
            addCommand(fnName, function () {
                var state = forcePromises;
                forcePromises = true;

                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                var res = fn.apply(instance, args);
                forcePromises = state;
                return res;
            }, forceOverwrite);
            commandGroup[fnName] = wrapCommand.call(commandGroup, commandGroup[fnName], fnName, beforeCommand, afterCommand);
            return;
        }

        /**
         * for all other cases we internally return a promise that is
         * finished once the Fiber wrapped custom function has finished
         * #functionalProgrammingWTF!
         */
        commandGroup[fnName] = wrapCommand(function () {
            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            return new Promise(function (r) {
                var state = forcePromises;
                forcePromises = false;
                wdioSync(fn, r).apply(instance, args);
                forcePromises = state;
            });
        }, commandName, beforeCommand, afterCommand);
    };
};

/**
 * execute test or hook synchronously
 * @param  {Function} fn         spec or hook method
 * @param  {Number}   repeatTest number of retries
 * @return {Promise}             that gets resolved once test/hook is done or was retried enough
 */
var _wrapCommands = _wrapCommands2;

__$Getters__['wrapCommands'] = function () {
    return _wrapCommands2;
};

__$Setters__['wrapCommands'] = function (value) {
    _wrapCommands2 = value;
};

__$Resetters__['wrapCommands'] = function () {
    _wrapCommands2 = _wrapCommands;
};

var _executeSync2 = function executeSync(fn, beforeRun, afterRun, runErrored) {
    var _this4 = this;

    var repeatTest = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
    var args = arguments.length <= 5 || arguments[5] === undefined ? [] : arguments[5];

    /**
     * if a new hook gets executed we can assume that all commands should have finised
     * with exception of timeouts where `commandIsRunning` will never be reset but here
     */
    commandIsRunning = false;

    return new Promise(function (resolve, reject) {
        try {
            (function () {
                executeHooksWithArgs(beforeRun);
                var res = fn.apply(_this4, args);
                executeHooksWithArgs(afterRun).then(function (hookRes) {
                    if (hookRes && hookRes.length > 0 && hookRes[0]) {
                        hookRes = hookRes[0][0]; // For some reason, this is a nested array
                        if (hookRes.expectationFailedOnRun) {
                            if (repeatTest) {
                                console.log('Repeating test on expectation failed ' + repeatTest);
                                return resolve(_executeSync2(fn, beforeRun, afterRun, runErrored, --repeatTest, args));
                            } else {
                                resolve(res);
                            }
                        } else {
                            resolve(res);
                        }
                    } else {
                        resolve(res);
                    }
                });
            })();
        } catch (e) {
            if (repeatTest) {
                console.log('Repeating test on error ' + repeatTest);
                executeHooksWithArgs(afterRun);
                return resolve(_executeSync2(fn, beforeRun, afterRun, runErrored, --repeatTest, args));
            }
            executeHooksWithArgs(runErrored);
            /**
             * no need to modify stack if no stack available
             */
            if (!e.stack) {
                return reject(e);
            }

            e.stack = e.stack.split('\n').filter(function (e) {
                return !e.match(STACKTRACE_FILTER);
            }).join('\n');
            reject(e);
        }
    });
};

/**
 * execute test or hook asynchronously
 * @param  {Function} fn         spec or hook method
 * @param  {Number}   repeatTest number of retries
 * @return {Promise}             that gets resolved once test/hook is done or was retried enough
 */
var _executeSync = _executeSync2;

__$Getters__['executeSync'] = function () {
    return _executeSync2;
};

__$Setters__['executeSync'] = function (value) {
    _executeSync2 = value;
};

__$Resetters__['executeSync'] = function () {
    _executeSync2 = _executeSync;
};

var _executeAsync2 = function executeAsync(fn) {
    var repeatTest = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var args = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    var result = undefined,
        error = undefined;

    /**
     * if a new hook gets executed we can assume that all commands should have finised
     * with exception of timeouts where `commandIsRunning` will never be reset but here
     */
    commandIsRunning = false;

    try {
        result = fn.apply(this, args);
    } catch (e) {
        error = e;
    } finally {
        /**
         * handle errors that get thrown directly and are not cause by
         * rejected promises
         */
        if (error) {
            if (repeatTest) {
                return _executeAsync2(fn, --repeatTest, args);
            }
            return new Promise(function (_, reject) {
                return reject(error);
            });
        }

        /**
         * if we don't retry just return result
         */
        if (repeatTest === 0 || !result || typeof result['catch'] !== 'function') {
            return new Promise(function (resolve) {
                return resolve(result);
            });
        }

        /**
         * handle promise response
         */
        return result['catch'](function (e) {
            if (repeatTest) {
                return _executeAsync2(fn, --repeatTest, args);
            }

            e.stack = e.stack.split('\n').filter(function (e) {
                return !e.match(STACKTRACE_FILTER);
            }).join('\n');
            return Promise.reject(e);
        });
    }
};

/**
 * runs a hook within fibers context (if function name is not async)
 * it also executes before/after hook hook
 *
 * @param  {Function} hookFn      function that was passed to the framework hook
 * @param  {Function} origFn      original framework hook function
 * @param  {Function} before      before hook hook
 * @param  {Function} after       after hook hook
 * @param  {Number}   repeatTest  number of retries if hook fails
 * @return {Function}             wrapped framework hook function
 */
var _executeAsync = _executeAsync2;

__$Getters__['executeAsync'] = function () {
    return _executeAsync2;
};

__$Setters__['executeAsync'] = function (value) {
    _executeAsync2 = value;
};

__$Resetters__['executeAsync'] = function () {
    _executeAsync2 = _executeAsync;
};

var runHook = function runHook(hookFn, origFn, before, after) {
    var repeatTest = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

    return origFn(function () {
        var _this5 = this;

        // Print errors encountered in beforeHook and afterHook to console, but
        // don't propagate them to avoid failing the test. However, errors in
        // framework hook functions should fail the test, so propagate those.
        return executeHooksWithArgs(before)['catch'](function (e) {
            console.error('Error in beforeHook: ' + e.stack);
        }).then(function () {
            /**
             * user wants handle async command using promises, no need to wrap in fiber context
             */
            if (isAsync() || hookFn.name === 'async') {
                return _executeAsync2.call(_this5, hookFn, repeatTest);
            }

            return new Promise(function (resolve, reject) {
                return Fiber(function () {
                    return _executeSync2.call(_this5, hookFn, function () {}, function () {}, function () {}, repeatTest).then(function () {
                        return resolve();
                    }, reject);
                }).run();
            });
        }).then(function () {
            return executeHooksWithArgs(after)['catch'](function (e) {
                console.error('Error in afterHook: ' + e.stack);
            });
        });
    });
};

/**
 * runs a spec function (test function) within the fibers context
 * @param  {string}   specTitle   test description
 * @param  {Function} specFn      test function that got passed in from the user
 * @param  {Function} origFn      original framework test function
 * @param  {Number}   repeatTest  number of retries if test fails
 * @return {Function}             wrapped test function
 */
var _runHook = runHook;

__$Getters__['runHook'] = function () {
    return runHook;
};

__$Setters__['runHook'] = function (value) {
    runHook = value;
};

__$Resetters__['runHook'] = function () {
    runHook = _runHook;
};

var runSpec = function runSpec(specTitle, specFn, origFn, beforeRun, afterRun, runErrored) {
    var repeatTest = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

    /**
    * user wants handle async command using promises, no need to wrap in fiber context
    */
    if (isAsync() || specFn.name === 'async') {
        return origFn(specTitle, function async() {
            return _executeAsync2.call(this, specFn, repeatTest);
        });
    }
    return origFn(specTitle, function () {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
            return Fiber(function () {
                return _executeSync2.call(_this6, specFn, beforeRun, afterRun, runErrored, repeatTest).then(function () {
                    return resolve();
                }, reject);
            }).run();
        });
    });
};

/**
 * wraps hooks and test function of a framework within a fiber context
 * @param  {Function} origFn               original framework function
 * @param  {string[]} testInterfaceFnNames actual test functions for that framework
 * @return {Function}                      wrapped test/hook function
 */
var _runSpec = runSpec;

__$Getters__['runSpec'] = function () {
    return runSpec;
};

__$Setters__['runSpec'] = function (value) {
    runSpec = value;
};

__$Resetters__['runSpec'] = function () {
    runSpec = _runSpec;
};

var wrapTestFunction = function wrapTestFunction(fnName, origFn, testInterfaceFnNames, before, after, beforeRun, afterRun, runErrored) {
    return function () {
        for (var _len6 = arguments.length, specArguments = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            specArguments[_key6] = arguments[_key6];
        }

        /**
         * Variadic arguments:
         * [title, fn], [title], [fn]
         * [title, fn, retryCnt], [title, retryCnt], [fn, retryCnt]
         */
        var retryCnt = typeof specArguments[specArguments.length - 1] === 'number' ? specArguments.pop() : 0;
        var specFn = typeof specArguments[0] === 'function' ? specArguments.shift() : typeof specArguments[1] === 'function' ? specArguments.pop() : undefined;
        var specTitle = specArguments[0];
        if (testInterfaceFnNames.indexOf(fnName) > -1) {
            if (specFn) return runSpec(specTitle, specFn, origFn, beforeRun, afterRun, runErrored, retryCnt);

            /**
             * if specFn is undefined we are dealing with a pending function
             */
            return origFn(specTitle);
        }
        return runHook(specFn, origFn, before, after, retryCnt);
    };
};

/**
 * [runInFiberContext description]
 * @param  {[type]} testInterfaceFnNames  global command that runs specs
 * @param  {[type]} before               before hook hook
 * @param  {[type]} after                after hook hook
 * @param  {[type]} fnName               test interface command to wrap
 */
var _wrapTestFunction = wrapTestFunction;

__$Getters__['wrapTestFunction'] = function () {
    return wrapTestFunction;
};

__$Setters__['wrapTestFunction'] = function (value) {
    wrapTestFunction = value;
};

__$Resetters__['wrapTestFunction'] = function () {
    wrapTestFunction = _wrapTestFunction;
};

var runInFiberContext = function runInFiberContext(testInterfaceFnNames, before, after, beforeRun, afterRun, runErrored, fnName) {
    var origFn = global[fnName];
    global[fnName] = wrapTestFunction(fnName, origFn, testInterfaceFnNames, before, after, beforeRun, afterRun, runErrored);

    /**
     * support it.skip for the Mocha framework
     */
    if (typeof origFn.skip === 'function') {
        global[fnName].skip = origFn.skip;
    }

    /**
     * wrap it.only for the Mocha framework
     */
    if (typeof origFn.only === 'function') {
        var origOnlyFn = origFn.only;
        global[fnName].only = wrapTestFunction(fnName + '.only', origOnlyFn, testInterfaceFnNames, before, after, beforeRun, afterRun, runErrored);
    }
};

var _runInFiberContext = runInFiberContext;

__$Getters__['runInFiberContext'] = function () {
    return runInFiberContext;
};

__$Setters__['runInFiberContext'] = function (value) {
    exports.runInFiberContext = runInFiberContext = value;
};

__$Resetters__['runInFiberContext'] = function () {
    exports.runInFiberContext = runInFiberContext = _runInFiberContext;
};

exports.wrapCommand = wrapCommand;
exports.wrapCommands = _wrapCommands2;
exports.runInFiberContext = runInFiberContext;
exports.executeHooksWithArgs = executeHooksWithArgs;
exports.executeSync = _executeSync2;
exports.executeAsync = _executeAsync2;
exports.__GetDependency__ = __GetDependency__;
exports.__get__ = __GetDependency__;
exports.__Rewire__ = __Rewire__;
exports.__set__ = __Rewire__;
exports.__ResetDependency__ = __ResetDependency__;
exports.__RewireAPI__ = __RewireAPI__;
exports['default'] = __RewireAPI__;
