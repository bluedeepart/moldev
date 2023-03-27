(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Coveo"));
	else if(typeof define === 'function' && define.amd)
		define(["Coveo"], factory);
	else if(typeof exports === 'object')
		exports["CoveoPsMolDevExtension"] = factory(require("Coveo"));
	else
		root["CoveoPsMolDevExtension"] = factory(root["Coveo"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(2);
var UrlUtils_1 = __webpack_require__(3);
exports.UrlUtils = UrlUtils_1.UrlUtils;
var HttpUtils_1 = __webpack_require__(4);
exports.HttpUtils = HttpUtils_1.HttpUtils;
var CustomEvents_1 = __webpack_require__(5);
exports.CustomEvents = CustomEvents_1.CustomEvents;
var PsMolDevHelper_1 = __webpack_require__(6);
exports.PsMolDevHelper = PsMolDevHelper_1.PsMolDevHelper;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

String.prototype.getInitials = function (glue) {
    if (glue === void 0) { glue = true; }
    var initials = this.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g) || [];
    if (glue) {
        return initials.join('');
    }
    return initials;
};
String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};
/**
* Camelize a string, cutting the string by multiple separators like
* hyphens, underscores and spaces.
*
* @return string Camelized text
*/
String.prototype.camelize = function () {
    return this.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
        if (p2)
            return p2.toUpperCase();
        return p1.toLowerCase();
    });
};
/**
 * Decamelizes a string with/without a custom separator (underscore by default).
 *
 * @param str String in camelcase
 * @param separator Separator for the new decamelized string.
 */
String.prototype.decamelize = function (separator) {
    separator = typeof separator === 'undefined' ? '_' : separator;
    return this
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UrlUtils = /** @class */ (function () {
    function UrlUtils() {
    }
    UrlUtils.getUrlParams = function (query) {
        if (!query) {
            return {};
        }
        var parser = document.createElement('a');
        var search = '';
        parser.href = query;
        var hash = parser.hash.substring(1);
        if (hash) {
            var hashParser = document.createElement('a');
            hashParser.href = hash;
            search = hashParser.search.substring(1);
        }
        else {
            search = parser.search.substring(1);
        }
        search = search || query;
        return (/^[?#]/.test(search) ? search.slice(1) : search)
            .split('&')
            .reduce(function (params, param) {
            var _a = param.split('='), key = _a[0], value = _a[1];
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
        }, {});
    };
    UrlUtils.getLocationFromUri = function (query) {
        if (!query) {
            return {};
        }
        var anchor = document.createElement('a');
        anchor.href = query;
        var retVal = {
            href: anchor.href,
            pathname: anchor.pathname,
            hostname: anchor.hostname,
            host: anchor.host,
            search: anchor.search,
            protocol: anchor.protocol,
            hash: anchor.hash
        };
        return retVal;
    };
    return UrlUtils;
}());
exports.UrlUtils = UrlUtils;
;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HttpUtils = /** @class */ (function () {
    function HttpUtils() {
    }
    HttpUtils.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        };
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    };
    return HttpUtils;
}());
exports.HttpUtils = HttpUtils;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CustomEvents = /** @class */ (function () {
    function CustomEvents() {
    }
    CustomEvents.yourCustomEvent = 'yourCustomEvent';
    return CustomEvents;
}());
exports.CustomEvents = CustomEvents;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PsMolDevHelper = /** @class */ (function () {
    function PsMolDevHelper() {
    }
    PsMolDevHelper.yourHelperMethod = function () {
        return '';
    };
    return PsMolDevHelper;
}());
exports.PsMolDevHelper = PsMolDevHelper;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Webpack output a library target with a temporary name.
// It does not take care of merging the namespace if the global variable already exists.
// If another piece of code in the page use the Coveo namespace (eg: extension), then they get overwritten
// This code swap the current module to the "real" Coveo variable, without overwriting the whole global var.
// This is to allow end user to put CoveoPSComponents.js before or after the main CoveoJsSearch.js, without breaking
Object.defineProperty(exports, "__esModule", { value: true });
function swapVar(scope) {
    if (window['Coveo'] == undefined) {
        window['Coveo'] = scope;
    }
    else {
        _.each(_.keys(scope), function (k) {
            window['Coveo'][k] = scope[k];
        });
    }
}
exports.swapVar = swapVar;


/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));
// your ui components here
var UpdatePlaceholder_1 = __webpack_require__(15);
exports.UpdatePlaceholder = UpdatePlaceholder_1.UpdatePlaceholder;
var ConditionalRendering_1 = __webpack_require__(16);
exports.ConditionalRendering = ConditionalRendering_1.ConditionalRendering;
var SwapVar_1 = __webpack_require__(7);
SwapVar_1.swapVar(this);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var UpdatePlaceholder = /** @class */ (function (_super) {
    __extends(UpdatePlaceholder, _super);
    function UpdatePlaceholder(element, options, bindings) {
        var _this = _super.call(this, element, UpdatePlaceholder.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, UpdatePlaceholder, options);
        _this.bind.onRootElement(coveo_search_ui_1.AnalyticsEvents.changeAnalyticsCustomData, function (args) { return _this.handleChangeAnalyticsCustomData(args); });
        return _this;
    }
    UpdatePlaceholder.prototype.handleChangeAnalyticsCustomData = function (args) {
        if (args.actionCause == coveo_search_ui_1.analyticsActionCauseList.interfaceChange.name) {
            if (args.metaObject.interfaceChangeTo == this.options.tabId) {
                document.querySelector('.CoveoSearchbox input')['placeholder'] = this.options.newPlaceholder;
            }
            else {
                document.querySelector('.CoveoSearchbox input')['placeholder'] = this.options.defaultPlaceholder;
            }
        }
    };
    UpdatePlaceholder.ID = 'UpdatePlaceholder';
    /**
     * The options for the component
     * @componentOptions
     */
    UpdatePlaceholder.options = {
        newPlaceholder: Coveo.ComponentOptions.buildStringOption({ defaultValue: '' }),
        defaultPlaceholder: Coveo.ComponentOptions.buildStringOption({ defaultValue: '' }),
        tabId: Coveo.ComponentOptions.buildStringOption({ defaultValue: '' })
    };
    return UpdatePlaceholder;
}(coveo_search_ui_1.Component));
exports.UpdatePlaceholder = UpdatePlaceholder;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(UpdatePlaceholder);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coveo_search_ui_1 = __webpack_require__(0);
var ConditionalRendering = /** @class */ (function (_super) {
    __extends(ConditionalRendering, _super);
    function ConditionalRendering(element, options, bindings, result) {
        var _this = _super.call(this, element, ConditionalRendering.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = coveo_search_ui_1.ComponentOptions.initComponentOptions(element, ConditionalRendering, options);
        if (_this.options.compareValue && _this.options.values) {
            _this.render();
        }
        return _this;
    }
    ConditionalRendering.prototype.render = function () {
        if (this.options.values.indexOf(this.options.compareValue) != -1) {
            if (this.result.raw.sfisvisibleinpkb == "false") {
                this.element.innerHTML = '';
            }
        }
    };
    ConditionalRendering.ID = 'ConditionalRendering';
    /**
     * The options for the component
     * @componentOptions
     */
    ConditionalRendering.options = {
        compareValue: coveo_search_ui_1.ComponentOptions.buildStringOption({ defaultValue: '' }),
        values: coveo_search_ui_1.ComponentOptions.buildListOption()
    };
    return ConditionalRendering;
}(coveo_search_ui_1.Component));
exports.ConditionalRendering = ConditionalRendering;
coveo_search_ui_1.Initialization.registerAutoCreateComponent(ConditionalRendering);


/***/ })
/******/ ]);
});