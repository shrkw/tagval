"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing tagged value.
 */

var Matchable = function () {
  /**
   * Creates taggad value object.
   * @param {string} tag - Tag name.
   * @param {any} val - Contained value.
   */

  function Matchable(tag, val) {
    _classCallCheck(this, Matchable);

    this.tag = tag;
    this.val = val;
  }

  /**
   * Tag divided pattern matching.
   * @param {object} fun_table - Map from tag to function.
   * @param {function} fun_default - Default function used when the tag doesn't exist in keys of `fun_table`.
   * @return - Result value of matched function, otherwise `undefined`.
   */


  _createClass(Matchable, [{
    key: "match",
    value: function match(fun_table, fun_default) {
      var fun = fun_table[this.tag];
      if (fun !== undefined) return fun.call(this, this.val);else if (fun_default !== undefined) return fun_default.call(this, this.val);else return;
    }

    /**
     * Partial application of tag divided pattern matching.
     * @param {object} fun_table - Map from tag to function.
     * @return - Result value of matched function, otherwise **object itself**.
     */

  }, {
    key: "when",
    value: function when(fun_table) {
      var _this = this;

      return this.match(fun_table, function () {
        return _this;
      });
    }

    /**
     * Stringify function.
     * @return {string} - Formatted `Tag(value.toString())`,
     */

  }, {
    key: "toString",
    value: function toString() {
      return this.tag + "(" + this.val + ")";
    }

    /**
     * Equality function.
     * @param {Matchable} tv - Compared object.
     * @return {boolean} - `false` unless both tags are the same, and return the result of `valEqual`.
     */

  }, {
    key: "equal",
    value: function equal(tv) {
      if (this.tag === tv.tag) return this.valEqual(tv);else return false;
    }

    /**
     * Value equality function.
     * Subclasses can override this function to implement equality.
     * @param {Matchable} tv - Compared object.
     * @return {boolean} - return the equality of both values.
     */

  }, {
    key: "valEqual",
    value: function valEqual(tv) {
      return this.val === tv.val;
    }
  }]);

  return Matchable;
}();

function option_unexpected_tag_found(option) {
  throw new Error("TagVal.Option Error: Unexpected tag was found: " + option.tag + ".");
}

/**
 * Class representing **something x** or **nothing**.
 */

var Option = function (_Matchable) {
  _inherits(Option, _Matchable);

  /**
   * Creates new Option object. **You don't need to use this.** Use [Some]{@link Some} and [None]{@link None} instead.
   * @param {any} val - (Optional) Value to be contained with tagged `Some`.
   * @return {Option} - Returns `Some(val)` if `val` is specified, otherwise `None()`.
   */

  function Option(val) {
    _classCallCheck(this, Option);

    if (val !== undefined && val !== null) {
      ;

      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Option).call(this, 'Some', val));
    } else {
      ;

      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Option).call(this, 'None'));
    }return _possibleConstructorReturn(_this2);
  }

  /**
   * Apply function to contained value.
   * @param {function} fn - Function to apply.
   * @return {Option} - `Some(fn(val))` if `Some(val)`, otherwise `None()`.
   */


  _createClass(Option, [{
    key: "map",
    value: function map(fn) {
      var _this3 = this;

      return this.match({
        Some: function Some(v) {
          return _Some(fn(v));
        },
        None: function None() {
          return _None();
        }
      }, function () {
        return option_unexpected_tag_found(_this3);
      });
    }

    /**
     * Extract some value with default value.
     * @param {any} x - Default value.
     * @return - `val` if `Some(val)`, otherwise `x`.
     */

  }, {
    key: "getOrElse",
    value: function getOrElse(x) {
      var _this4 = this;

      return this.match({
        Some: function Some(v) {
          return v;
        },
        None: function None() {
          return x;
        }
      }, function () {
        return option_unexpected_tag_found(_this4);
      });
    }

    /**
     * Extract some value with default lazy value.
     * @param {function} f - Lazy function returns default value.
     * @return - `val` if `Some(val)`, otherwise `f()`.
     */

  }, {
    key: "getOrElseF",
    value: function getOrElseF(f) {
      var _this5 = this;

      return this.match({
        Some: function Some(v) {
          return v;
        },
        None: function None() {
          return f();
        }
      }, function () {
        return option_unexpected_tag_found(_this5);
      });
    }

    /**
     * Convert to Array.
     * @return - `[val]` if `Some(val)`, otherwise `[]`.
     */

  }, {
    key: "toArray",
    value: function toArray() {
      var _this6 = this;

      return this.match({
        Some: function Some(v) {
          return [v];
        },
        None: function None() {
          return [];
        }
      }, function () {
        return option_unexpected_tag_found(_this6);
      });
    }

    /**
     * Convert to Status object with failure message.
     * @param {any} msg - Message passed to failure.
     * @return {Status} - `Success(val)` if `Some(val)`, otherwise `Failure(msg)`.
     */

  }, {
    key: "toStatus",
    value: function toStatus() {
      var _this7 = this;

      var msg = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

      return this.match({
        Some: function Some(v) {
          return new Status('Success', v);
        },
        None: function None() {
          return new Status('Failure', msg);
        }
      }, function () {
        return option_unexpected_tag_found(_this7);
      });
    }

    /**
     * Convert to value.
     * @return - Value if `Some(val)`, otherwise `undefined`.
     */

  }, {
    key: "toValue",
    value: function toValue() {
      var _this8 = this;

      return this.match({
        Some: function Some(v) {
          return v;
        },
        None: function None() {
          return undefined;
        }
      }, function () {
        return option_unexpected_tag_found(_this8);
      });
    }
  }, {
    key: "valEqual",
    value: function valEqual(a) {
      return this.match({
        Some: function Some(v) {
          return v === a.val;
        },
        None: function None() {
          return true;
        }
      });
    }

    /**
     * Higher order equality application.
     * @param {Option} a - Compared object.
     * @param {function} f - Equality function.
     * @return - return `f(this.val, a.val)` if both are `Some` and return `true` if both are `None`, otherwise `false`.
     */

  }, {
    key: "mapEqual",
    value: function mapEqual(a, f) {
      if (this.tag === a.tag) return this.match({
        Some: function Some(v) {
          return f(v, a.val);
        },
        None: function None() {
          return true;
        }
      });else return false;
    }
  }]);

  return Option;
}(Matchable);

/**
 * Creates `Some` tagged Option.
 * @param {any} v - Contained value.
 * @return {Option} - `Some` tagged Option object.
 */


function _Some(v) {
  return new Option(v);
}

/**
 * Creates `None` tagged Option.
 * @return {Option} - `None` tagged Option object.
 */
function _None() {
  return new Option();
}

/**
 * Creates Option object from value.
 * @param {any} v - Value passed to Option.
 * @return {Option} - `Some(val)` if `v` is exist, otherwise `None()`.
 */
Option.fromValue = function (v) {
  return new Option(v);
};

/**
 * Creates Option object from boolean.
 * @param {boolean} v - Value passed to Option.
 * @return {Option} - `Some(true)` if `v` is truthy, otherwise `None()`.
 */
Option.fromBool = function (v) {
  if (v) return _Some(true);else return _None();
};

function status_unexpected_tag_found(status) {
  throw new Error("TagVal.Status Error: Unexpected tag was found: " + status.tag + ".");
}

/**
 * Class representing "Success with something" or "Failure with message".
 */

var Status = function (_Matchable2) {
  _inherits(Status, _Matchable2);

  function Status() {
    _classCallCheck(this, Status);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Status).apply(this, arguments));
  }

  _createClass(Status, [{
    key: "getOrThrow",

    /**
     * Get the value if Success, otherwise throw Failure message.
     * @return - `val` if `Success(val)`.
     */
    value: function getOrThrow() {
      var _this10 = this;

      return this.match({
        Success: function Success(v) {
          return v;
        },
        Failure: function Failure(msg) {
          throw msg;
        }
      }, function () {
        return status_unexpected_tag_found(_this10);
      });
    }

    /**
     * Convert to Option Class.
     * @return {Option} - `Some(v)` if `Success(v)`, otherwise `None()`
     */

  }, {
    key: "toOption",
    value: function toOption() {
      var _this11 = this;

      return this.match({
        Success: function Success(v) {
          return _Some(v);
        },
        Failure: function Failure(msg) {
          return _None();
        }
      }, function () {
        return status_unexpected_tag_found(_this11);
      });
    }
  }]);

  return Status;
}(Matchable);

/**
 * Utility procedure wrapper function that always returns a Status class object.
 * @param {function} f - Function to be tried.
 * @return {Status} - `Success(f())` if `f()` doesn't throw any error `e`, otherwise returns `Failure(e)`.
 */


Status.trying = function (f) {
  try {
    return Success(f());
  } catch (e) {
    return Failure(e);
  }
};

/**
 * Creates `Success` tagged Status.
 * @param {any} v - Contained value.
 * @return {Status} - `Success` tagged Status object.
 */
function Success(v) {
  return new Status('Success', v);
}

/**
 * Creates `Failure` tagged Status.
 * @param {any} msg - Contained value.
 * @return {Status} - `Failure` tagged Status object.
 */
function Failure(msg) {
  return new Status('Failure', msg);
}

/**
 * Generates pattern matcher function used in [Matchable#match]{@link Matchable#match}.
 * @param {Object} tagval - Object formatted as `{ tag: String, val: Any }`.
 * @return {function} - Pattern match function which accepts table of functions like.
 */
function match(tagval) {
  return function (fun_table, fun_default) {
    var fun = fun_table[tagval.tag];
    if (fun !== undefined) return fun.call(tagval, tagval.val);else if (fun_default !== undefined) return fun_default.call(tagval);else return undefined;
  };
}

/**
 * Alias of [Option.fromValue]{@link Option.fromValue}.
 */
var optionFrom = Option.fromValue;

/**
 * Alias of [Status.trying]{@link Status.withTry}.
 */
var withTry = Status.trying;

var TagVal = {
  Matchable: Matchable,
  Option: Option,
  Status: Status,
  Some: _Some,
  None: _None,
  Success: Success,
  Failure: Failure,
  match: match,
  optionFrom: Option.fromValue,
  withTry: Status.trying
};

// browser support
if (window !== undefined) {
  window.TagVal = TagVal;
}

exports.Matchable = Matchable;
exports.Option = Option;
exports.Status = Status;
exports.Some = _Some;
exports.None = _None;
exports.Success = Success;
exports.Failure = Failure;
exports.match = match;
exports.optionFrom = optionFrom;
exports.withTry = withTry;
exports.TagVal = TagVal;