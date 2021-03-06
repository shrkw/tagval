(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  (function(_this) {
    return (function() {
      var Failure, Matchable, None, Option, Some, Status, Success, TagVal, exports, match;
      Matchable = (function() {
        function Matchable(tag, val) {
          this.tag = tag;
          this.val = val;
        }

        Matchable.prototype.match = function(fun_table, fun_default) {
          var fun;
          fun = fun_table[this.tag];
          if (fun != null) {
            return fun.call(this, this.val);
          } else if (fun_default != null) {
            return fun_default.call(this);
          } else {
            return void 0;
          }
        };

        Matchable.prototype.when = function(fun_table) {
          return this.match(fun_table, ((function(_this) {
            return function() {
              return _this;
            };
          })(this)));
        };

        Matchable.prototype.toString = function() {
          return this.tag + "(" + this.val + ")";
        };

        Matchable.prototype.equal = function(a) {
          if (this.tag === a.tag) {
            return this.valEqual(a);
          } else {
            return false;
          }
        };

        Matchable.prototype.valEqual = function(a) {
          return this.val === a.val;
        };

        return Matchable;

      })();
      Option = (function(superClass) {
        extend(Option, superClass);

        function Option(v) {
          if (v != null) {
            Option.__super__.constructor.call(this, 'Some', v);
          } else {
            Option.__super__.constructor.call(this, 'None');
          }
        }

        Option.prototype.map = function(f) {
          return this.match({
            Some: function(v) {
              return new Option(f(v));
            },
            None: function() {
              return new Option(void 0);
            }
          }, (function(_this) {
            return function() {
              throw "An invalid tag for Option object was found: '" + _this.tag + "'.";
            };
          })(this));
        };

        Option.prototype.getOrElse = function(x) {
          return this.match({
            Some: function(v) {
              return v;
            },
            None: function() {
              return x;
            }
          }, (function(_this) {
            return function() {
              throw "An invalid tag for Option object was found: '" + _this.tag + "'.";
            };
          })(this));
        };

        Option.prototype.getOrElseF = function(f) {
          return this.match({
            Some: function(v) {
              return v;
            },
            None: function() {
              return f();
            }
          }, (function(_this) {
            return function() {
              throw "An invalid tag for Option object was found: '" + _this.tag + "'.";
            };
          })(this));
        };

        Option.prototype.toArray = function() {
          return this.match({
            Some: function(v) {
              return [v];
            },
            None: function() {
              return [];
            }
          }, (function(_this) {
            return function() {
              throw "An invalid tag for Option object was found: '" + _this.tag + "'.";
            };
          })(this));
        };

        Option.prototype.toStatus = function(msg) {
          if (msg == null) {
            msg = "";
          }
          return this.match({
            Some: function(v) {
              return new Status('Success', v);
            },
            None: function() {
              return new Status('Failure', msg);
            }
          }, (function(_this) {
            return function() {
              throw "An invalid tag for Option object was found: '" + _this.tag + "'.";
            };
          })(this));
        };

        Option.prototype.toValue = function() {
          return this.match({
            Some: function(v) {
              return v;
            },
            None: function() {
              return void 0;
            }
          });
        };

        Option.prototype.valEqual = function(a) {
          return this.match({
            Some: function(v) {
              return v === a.val;
            },
            None: function() {
              return true;
            }
          });
        };

        Option.prototype.mapEqual = function(a, f) {
          if (this.tag === a.tag) {
            return this.match({
              Some: function(v) {
                return f(v, a.val);
              },
              None: function() {
                return true;
              }
            });
          } else {
            return false;
          }
        };

        return Option;

      })(Matchable);
      Some = function(v) {
        return new Option(v);
      };
      None = function() {
        return new Option(void 0);
      };
      Option.fromValue = function(v) {
        return new Option(v);
      };
      Option.fromBool = function(v) {
        if (v) {
          return Some(true);
        } else {
          return None();
        }
      };
      Status = (function(superClass) {
        extend(Status, superClass);

        function Status() {
          return Status.__super__.constructor.apply(this, arguments);
        }

        Status.prototype.getOrThrow = function() {
          return this.match({
            Success: function(v) {
              return v;
            },
            Failure: function(msg) {
              throw msg;
            }
          }, (function(_this) {
            return function() {
              throw "An invalid tag for Status object was found: '" + _this.tag + "'.";
            };
          })(this));
        };

        Status.prototype.toOption = function() {
          return this.match({
            Success: function(v) {
              return Some(v);
            },
            Failure: function(msg) {
              return None();
            }
          }, (function(_this) {
            return function() {
              throw "An invalid tag for Status object was found: '" + _this.tag + "'.";
            };
          })(this));
        };

        return Status;

      })(Matchable);
      Status.trying = function(f) {
        var e, error;
        try {
          return Success(f());
        } catch (error) {
          e = error;
          return Failure(e);
        }
      };
      Success = function(v) {
        return new Status('Success', v);
      };
      Failure = function(msg) {
        return new Status('Failure', msg);
      };
      match = function(tagval) {
        return function(fun_table, fun_default) {
          var fun;
          fun = fun_table[tagval.tag];
          if (fun != null) {
            return fun.call(tagval, tagval.val);
          } else if (fun_default != null) {
            return fun_default.call(tagval);
          } else {
            return void 0;
          }
        };
      };
      TagVal = {
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
      if (typeof exports !== "undefined" && exports !== null) {
        exports = TagVal;
        return exports.TagVal = TagVal;
      } else {
        return _this.TagVal = TagVal;
      }
    });
  })(this)();

}).call(this);
