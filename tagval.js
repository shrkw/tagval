(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(_this) {
    return (function() {
      var Failure, Matchable, None, Option, Some, Status, Success, TagVal, TagValOpen, close, exports, global_scope, is_opened, key, open, original_cache, val;
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

        Matchable.prototype.patch = function(fun_table) {
          return this.match(fun_table, ((function(_this) {
            return function() {
              return _this;
            };
          })(this)));
        };

        Matchable.prototype.toString = function() {
          return "" + this.tag + "(" + this.val + ")";
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
      Option = (function(_super) {
        __extends(Option, _super);

        function Option() {
          return Option.__super__.constructor.apply(this, arguments);
        }

        Option.prototype.map = function(f) {
          return this.match({
            Some: function(v) {
              return new Option('Some', f(v));
            },
            None: function() {
              return new Option('None');
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

        return Option;

      })(Matchable);
      Some = function(v) {
        return new Option('Some', v);
      };
      None = function() {
        return new Option('None');
      };
      Option.fromValue = function(v) {
        if (v != null) {
          return Some(v);
        } else {
          return None();
        }
      };
      Status = (function(_super) {
        __extends(Status, _super);

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
      Success = function(v) {
        return new Status('Success', v);
      };
      Failure = function(msg) {
        return new Status('Failure', msg);
      };
      TagValOpen = {
        Matchable: Matchable,
        Option: Option,
        Some: Some,
        None: None,
        Status: Status,
        Success: Success,
        Failure: Failure
      };
      is_opened = false;
      original_cache = {};
      global_scope = _this;
      open = (function() {
        var _open;
        _open = function() {
          var key, val;
          if (!is_opened) {
            for (key in TagValOpen) {
              val = TagValOpen[key];
              original_cache[key] = global_scope[key];
              global_scope[key] = val;
            }
            return is_opened = true;
          }
        };
        return _open;
      })();
      close = (function() {
        var _close;
        _close = function() {
          var key, val;
          if (is_opened) {
            for (key in original_cache) {
              val = original_cache[key];
              global_scope[key] = val;
            }
            return is_opened = false;
          }
        };
        return _close;
      })();
      TagVal = {
        open: open,
        close: close
      };
      for (key in TagValOpen) {
        val = TagValOpen[key];
        TagVal[key] = val;
      }
      if (typeof exports !== "undefined" && exports !== null) {
        if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
          exports = module.exports = TagVal;
        }
        return exports.TagVal = TagVal;
      } else {
        return _this.TagVal = TagVal;
      }
    });
  })(this)();

}).call(this);
