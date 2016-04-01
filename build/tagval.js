"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Matchable = function () {
  function Matchable(tag, val) {
    _classCallCheck(this, Matchable);

    this.tag = tag;
    this.val = val;
  }

  _createClass(Matchable, [{
    key: "match",
    value: function match(fun_table, fun_default) {
      var fun = fun_table[this.tag];
      if (fun !== undefined) return fun.call(this, this.val);else if (fun_default !== undefined) return fun_default.call(this, this.val);else return;
    }
  }, {
    key: "when",
    value: function when(fun_table) {
      var _this = this;

      return this.match(fun_table, function () {
        return _this;
      });
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.tag + "(" + this.val + ")";
    }
  }, {
    key: "equal",
    value: function equal(a) {
      if (this.tag === a.tag) return this.valEqual(a);else return false;
    }
  }, {
    key: "valEqual",
    value: function valEqual(a) {
      return this.val === a.val;
    }
  }]);

  return Matchable;
}();

function option_unexpected_tag_found(option) {
  throw new Error("TagVal.Option Error: Unexpected tag was found: " + option.tag + ".");
}

var Option = function (_Matchable) {
  _inherits(Option, _Matchable);

  function Option(v) {
    _classCallCheck(this, Option);

    if (v !== undefined) {
      ;

      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Option).call(this, 'Some', v));
    } else {
      ;

      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Option).call(this, 'None'));
    }return _possibleConstructorReturn(_this2);
  }

  _createClass(Option, [{
    key: "map",
    value: function map(f) {
      var _this3 = this;

      return this.match({
        Some: function Some(v) {
          return new Option(f(v));
        },
        None: function None() {
          return new Option();
        }
      }, function () {
        return option_unexpected_tag_found(_this3);
      });
    }
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

function Some(v) {
  return new Option(v);
}
function None() {
  return new Option();
}

Option.fromValue = function (v) {
  return new Option(v);
};

Option.fromBool = function (v) {
  if (v) return Some(true);else return None();
};

function status_unexpected_tag_found(status) {
  throw new Error("TagVal.Status Error: Unexpected tag was found: " + status.tag + ".");
}

var Status = function (_Matchable2) {
  _inherits(Status, _Matchable2);

  function Status() {
    _classCallCheck(this, Status);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Status).apply(this, arguments));
  }

  _createClass(Status, [{
    key: "getOrThrow",
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
  }, {
    key: "toOption",
    value: function toOption() {
      var _this11 = this;

      return this.match({
        Success: function Success(v) {
          return Some(v);
        },
        Failure: function Failure(msg) {
          return None();
        }
      }, function () {
        return status_unexpected_tag_found(_this11);
      });
    }
  }]);

  return Status;
}(Matchable);

Status.trying = function (f) {
  try {
    return Success(f());
  } catch (e) {
    return Failure(e);
  }
};

function Success(v) {
  return new Status('Success', v);
}
function Failure(msg) {
  return new Status('Failure', msg);
}

function match(tagval) {
  return function (fun_table, fun_default) {
    var fun = fun_table[tagval.tag];
    if (fun !== undefined) return fun.call(tagval, tagval.val);else if (fun_default !== undefined) return fun_default.call(tagval);else return undefined;
  };
}

var optionFrom = Option.fromValue;
var withTry = Status.trying;

var TagVal = {
  Matchable: Matchable,
  Option: Option,
  Status: Status,
  Some: Some,
  None: None,
  Success: Success,
  Failure: Failure,
  match: match,
  optionFrom: Option.fromValue,
  withTry: Status.trying
};

exports.Matchable = Matchable;
exports.Option = Option;
exports.Status = Status;
exports.Some = Some;
exports.None = None;
exports.Success = Success;
exports.Failure = Failure;
exports.match = match;
exports.optionFrom = optionFrom;
exports.withTry = withTry;
exports.TagVal = TagVal;