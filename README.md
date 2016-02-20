TagVal (tagval.js)  [![Build Status][travis-image]][travis-url]
======

Tagged union, discriminated union, variant or sum type.. for JavaScript.

# Example

### JavaScript
```js
var T = require('tagval');

// with underscore.js
var nums = [3, 5, 6];
function is_even(x){ return x%2 === 0; }
function is_gt_10(x){ return (x > 10); }

var optional_x = T.Option.fromValue(_.find(nums, is_even));
var optional_y = T.Option.fromValue(_.find(nums, is_gt_10));

optional_x.match({
  Some: function(x){ console.log("I got "+x); },
  None: function(){ console.log("nothing"); }
});  // output: I got 6

var y = optional_y.getOrElse(10);
console.log(y); // 10
```

### Coffee Script
```js
T = require 'tagval'

# with underscore.js
nums = [3, 5, 6]
is_even = (x)-> x%2 is 0
is_gt_10 = (x)-> (x > 10)

optional_x = T.Option.fromValue _.find(nums, is_even)
optional_y = T.Option.fromValue _.find(nums, is_gt_10)

optional_x.match
  Some: (x)-> console.log "I got #{x}"
  None:    -> console.log "nothing"
# output: I got 6

y = optional_y.getOrElse 10
console.log y # 10
```

# `TagVal.Option` class
`Option` is a class which expresses "something x"(Some) or "nothing"(None).

### Example

```js
// Finding a number from collection.
var optionalX = find_num(); // assume it returns `Option`
var DEFAULT_X = 30;

// Try to set the found number or 30 by default.
var x = optionalX.getOrElse(DEFAULT_X);
```

### API

| method | detail |
|----|----|
| `TagVal.Some(v)` | creates a new `Option` object tagged `Some` with `v` in the value. |
| `TagVal.None()` | creates a new `Option` object tagged `None`. |
| `TagVal.Option.fromValue(v)` | creates `Some(v)` if `v` is neither `undefined` nor `null`. |
| `TagVal.optionFrom(v)` | alias of `TagVal.Option.fromValue(v)` |
| `TagVal.fromBool(v)` | If `v` is truthy, it returns `Some(true)` |
| `opt.map(f)` | `Some(x)` to `Some(f(x))` / nothing to `None()` |
| `opt.getOrElse(x)` | `Some(y)` to `y` / `None()` to `x` |
| `opt.getOrElseF(f)` | `Some(y)` to `y` / `None()` to `f()` |
| `opt.toArray()` | `Some(y)` to `[y]` / `None()` to `[]` |
| `opt.toStatus(msg)` | `Some(v)` to `Success(v)` / `None()` to `Failure(msg)` |
| `opt.toValue()` | `Some(v)` to `v` / `None()` to `undefined` |
| `opt.equal(y)` | If `opt=Some(x) and y=Some(y)` then `x === y`, and true if both are `None()`, otherwise `false`. |
| `opt.mapEqual(y, f)` | If `opt=Some(x) and y=Some(y)` then `f(x, y)`, and true if both are `None()`, otherwise `false`. |
| `opt.match` | see `Matchable` |
| `opt.when` | see `Matchable` |
| `opt.toString` | see `Matchable` |

# `TagVal.Status` class
Status object is a class that express "success with result"(Success) or "failure with message"(Failure).

### API

| method | detail |
|----|----|
| `TagVal.Status.trying(f)` | `Success(f())` or `Failure(e)` if caught an exception `e`. |
| `TagVal.withTry` | alias of `TagVal.Status.trying`|
| `stat.getOrThrow() `| `Success(v)` to `v` / `throw msg` if `Failure(msg)`|
| `stat.toOption()` | `Success(v)` to `Some(v)` / `Failure(msg)` to `None()` |
| `stat.match` | see `Matchable` |
| `stat.when` | see `Matchable` |
| `stat.toString` | see `Matchable` |
| `stat.equal` | see `Matchable` |

# `TagVal.Matchable` class
TagVal's basic concept is regarding `{tag: String, val: Value}` as minimum tagged-value interface. `Matchable` has actually only this two fields, and they are initialized simply:

```js
var value = "some value"
var tv = new TagVal.Matchable("Tag", value); // I often express as "Tag(value)"

console.log(tv.tag); // Tag
console.log(tv.val); // value
```

In addition, `Matchable` has a few, generic methods below. You can inherit it. `Option` and `Status` are subclasses of `Matchable`.

### API

| method | detail |
|----|----|
| `tv.match(table[, default_fun])` | `table[T](v)` if `table[T]` exists. Next, `default_fun(v)` if `default_fun` exists. Otherwise `undefined`. |
| `tv.when(table)` | `table[T](v)` if `table[T]` exists, otherwise returns object itself. |
| `tv.toString()` | `Tag( value.toString() )` |
| `tv.equal(y)` | `tv.valEqual(y)` if same tag, otherwise `false` |
| `tv.valEqual(y)` | `tv.val === y.val` |
| `TagVal.match(tv)(table)` | `match` method for arbitrary `{ tag: Tag, value: Value }` |

#### `Matchable#when` example:

In JavaScript:
```js
x_stat = try_something1()
  .when({ Failure: function(){ return try_something2(); } })
  .when({ Failure: function(){ return try_something3(); } })
  .when({
    Failure: function(){ returns TagVal.Failure("All tries failed."); }
  });
```

In CoffeeScript:
```js
x_stat = try_something1()
  .when Failure: -> try_something2()
  .when Failure: -> try_something3()
  .when Failure: -> TagVal.Failure "All tries failed."
```

[travis-url]: https://travis-ci.org/mizukami234/tagval
[travis-image]: http://img.shields.io/travis/mizukami234/tagval.svg
