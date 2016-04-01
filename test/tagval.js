var assert = require('assert');
var TagVal = require('../build/tagval').TagVal;

describe('TagVal', function() {

  describe('Matchable', function() {

    describe('match', function() {

      it("executes matched tag's function", function() {
        var a = new TagVal.Matchable('TagA', 100);
        var b = new TagVal.Matchable('TagB', 200);
        var x = a.match({
          TagA: function(v) { return v+10; },
          TagB: function(v) { return v+20; },
        });
        var y = b.match({
          TagA: function(v) { return v+10; },
          TagB: function(v) { return v+20; },
        });
        assert.equal(x, 110);
        assert.equal(y, 220);
      });

      it("executes 2nd arg's function if tag doesn't match", function() {
        var c = new TagVal.Matchable('TagC', 200);
        var z = c.match({
          TagA: function(v) { return v+10; },
          TagB: function(v) { return v+20; },
        }, function() { return 300; });
        assert.equal(z, 300);
      });
    });

    describe('when', function() {

      it("executes matched tag's function", function() {
        var a = new TagVal.Matchable('Good', 100);
        var b = new TagVal.Matchable('Bad', 0);
        var x = a.when({
          Good: function(v) { return v+10; },
          Bad: function(v) { return v+20; },
        });
        var y = b.when({
          Good: function(v) { return v+10; },
          Bad: function(v) { return v+20; },
        });
        assert.equal(x, 110);
        assert.equal(y, 20);
      });

      it("returns arg's function if tag doesn't match", function() {
        var c = new TagVal.Matchable('Good', 200);
        var z = c.when({
          Bad: function(v) { return 10; },
        });
        assert.equal(z.tag, 'Good');
        assert.equal(z.val, 200);
      });
    });

    describe('equal', function() {

      it("returns true iff two tagvals have same tag and same value", function() {
        var a = new TagVal.Matchable('A', 10);
        var b = new TagVal.Matchable('B', 10);
        var c = new TagVal.Matchable('A', 10);
        var d = new TagVal.Matchable('B', 20);
        assert.equal(a.equal(b), false);
        assert.equal(a.equal(c), true);
        assert.equal(a.equal(d), false);
        assert.equal(c.equal(a), true);
        assert.equal(d.equal(b), false);
      });
    });

    describe('valEqual', function() {

      it("defines value equality that is used in #equal.", function() {
        // bad example
        var bad_pt_u = new TagVal.Matchable('XY', {x: 10, y: 20});
        var bad_pt_v = new TagVal.Matchable('XY', {x: 10, y: 20});
        assert.equal(bad_pt_u.equal(bad_pt_v), false);
      });
    });
  });

  describe('Option', function() {

    describe('map', function() {

      it("applies function into value of Some", function() {
        var x_opt = TagVal.Some(3)
        var y_opt = TagVal.None()
        var f = function(x){ return x*x; };
        var fx_opt = x_opt.map(f);
        var fy_opt = y_opt.map(f);
        assert.equal(fx_opt.tag, 'Some');
        assert.equal(fx_opt.val, 3*3);
        assert.equal(fy_opt.tag, 'None');
      });
    });

    describe('getOrElse', function() {

      it("Get value if Some, otherwise, return argument", function() {
        var x_opt = TagVal.Some(3);
        var y_opt = TagVal.None();
        assert.equal(x_opt.getOrElse(2), 3);
        assert.equal(y_opt.getOrElse(2), 2);
      });
    });

    describe('getOrElseF', function() {

      it("Get value if Some, otherwise, return function result", function() {
        var x_opt = TagVal.Some(3);
        var y_opt = TagVal.None();
        var z = false;
        assert.equal(x_opt.getOrElseF(function(){
          z = true;
          return 2;
        }), 3);
        assert.equal(z, false);
        assert.equal(y_opt.getOrElseF(function(){ return 2; }), 2);
      });
    });

    describe('toArray', function() {

      it("converts to an array that is empty or has one element", function() {
        var x_opt = TagVal.Some(3);
        var y_opt = TagVal.None();
        assert.deepEqual(x_opt.toArray(), [3]);
        assert.deepEqual(y_opt.toArray(), []);
      });
    });
      
    describe('toStatus', function() {

      it("converts Some(x) to Success(x) and None() to Failure(msg) with message msg.", function() {
        var x_opt = TagVal.Some(3);
        var y_opt = TagVal.None();
        var x_stat = TagVal.Success(3);
        var y_stat = TagVal.Failure('Nothing Found');
        assert.equal(x_opt.toStatus('Nothing Found').equal(x_stat), true);
        assert.equal(y_opt.toStatus('Nothing Found').equal(y_stat), true);
      });

      it("converts None() to Failure('') if no argument passed", function() {
        var n_opt = TagVal.None();
        var n_stat = TagVal.Failure('');
        assert.equal(n_opt.toStatus().equal(n_stat), true);
      });
    });

    describe('toValue', function() {

      it("converts Some(x) to x and None() to undefined", function() {
        var x_opt = TagVal.Some(3);
        var y_opt = TagVal.None();
        assert.equal(x_opt.toValue(), 3);
        assert.equal(y_opt.toValue(), undefined);
      });
    });

    describe('equal', function() {

      it("true if retaining values of two Some's are the same under (===), or two are both None", function() {
        var a_opt = TagVal.Some(5);
        var b_opt = TagVal.Some(3);
        var c_opt = TagVal.Some(5);
        var d_opt = TagVal.None();
        var e_opt = TagVal.None();
        var f_opt = TagVal.None();
        assert.equal(a_opt.equal(b_opt), false);
        assert.equal(a_opt.equal(c_opt), true);
        assert.equal(a_opt.equal(d_opt), false);
        assert.equal(d_opt.equal(e_opt), true);

        // even if you crazily manipulates None's `val` field,
        f_opt.val = "a hidden value of None";
        assert.equal(d_opt.equal(f_opt), true);
      });
    });

    describe('mapEqual', function() {

      it("true if retaining values of two Some's are the same under given function, or two are both None", function() {
        var a_opt = TagVal.Some({ x: "100" });
        var b_opt = TagVal.Some({ x: "100" });
        var c_opt = TagVal.Some({ x: "50" });
        var d_opt = TagVal.None();
        var f = function(a, b) { return a.x === b.x; };
        assert.equal(a_opt.equal(b_opt), false);
        assert.equal(a_opt.mapEqual(b_opt, f), true);
        assert.equal(a_opt.mapEqual(c_opt, f), false);
        assert.equal(a_opt.mapEqual(d_opt, f), false);
      });
    });

    describe('fromValue', function() {

      it("converts undefined to None(), non-undefined value to Some(value)", function() {
        var x = 100;
        var y = undefined;
        var x_opt = TagVal.Some(100);
        var y_opt = TagVal.None();
        assert.equal(TagVal.Option.fromValue(x).equal(x_opt), true);
        assert.equal(TagVal.Option.fromValue(y).equal(y_opt), true);
      });
    });

    describe('fromBool', function() {

      it("converts truthy to Some(true), falsy to None()", function() {
        var x_opt = TagVal.Option.fromBool(true);
        var y_opt = TagVal.Option.fromBool(false);
        var x_to_be = TagVal.Some(true);
        var y_to_be = TagVal.None();
        assert.equal(x_opt.equal(x_to_be), true);
        assert.equal(y_opt.equal(y_to_be), true);
      });
    });
  });

  describe('Status', function() {

    describe('getOrThrow', function() {

      it("gets value if Success and throws msg if Failure(msg)", function() {
        var x_stat = TagVal.Success(20);
        var y_stat = TagVal.Failure("omg!");
        assert.equal(x_stat.getOrThrow(), 20);
        assert.throws(function(){ y_stat.getOrThrow(); }, "omg!");
      });
    });

    describe('toOption', function() {

      it("converts Success(x) to Some(x) and Failure(msg) to None()", function() {
        var x_stat = TagVal.Success(20);
        var y_stat = TagVal.Failure("omg!");
        var x_opt = TagVal.Some(20);
        var y_opt = TagVal.None();
        assert.equal(x_stat.toOption().equal(x_opt), true);
        assert.equal(y_stat.toOption().equal(y_opt), true);
      });
    });

    describe('trying', function() {

      it("evaluates block f and return Success(f()) or Failure(e) if it catches exception e.", function() {
        var succblock = function(){ return 1/2; };
        var failblock = function(){ throw 'AN ERROR'; };
        assert.equal(TagVal.Status.trying(succblock).equal(TagVal.Success(1/2)), true);
        assert.equal(TagVal.Status.trying(failblock).equal(TagVal.Failure('AN ERROR')), true);
      });
    });
  });

  describe('match', function() {

    it("gets { tag: Tag, val: Value } style object and returns function performs like Matchable#match", function() {
      var tv4 = { tag: "even" , val: 4 };
      var tv5 = { tag: "odd" , val: 5 };
      var col = function(tv) { return TagVal.match(tv)({
        even: function(v) { return v/2; },
        odd:  function(v) { return 3*v+1; },
      }); };
      assert.equal(col(tv4), 2);
      assert.equal(col(tv5), 16);
    });
  });
      
  describe('optionFrom', function() {

    it("is same as Option.fromValue", function() {
      assert.equal(TagVal.optionFrom === TagVal.Option.fromValue, true);
    });
  });

  describe('withTry', function() {

    it("is same as Status.trying", function() {
      assert.equal(TagVal.withTry === TagVal.Status.trying, true);
    });
  });
});
