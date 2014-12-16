TagVal (tagval.js)  [![Build Status][travis-image]][travis-url]
======

A simple JavaScript library includes Option class, Status class and their basic class of Tagged Value.

Optionクラス、Statusクラス及びその基礎的なタグ付き値のクラスを含む、シンプルなJavaScriptライブラリ

# Getting Started

```js
var T = require('tagval');

// with underscore.js
var ar = [3, 5, 6];
function is_even(x){ return x%2 === 0; }
function is_lt_10(x){ return (x > 10); }

var x_opt = T.Option.fromValue(_.find(ar, is_even));
var y_opt = T.Option.fromValue(_.find(ar, is_lt_10));

x_opt.match({
  Some: function(x){ console.log("I got "+x); },
  None: function(){ console.log("nothing"); }
});  // "I got 6"

var y = y_opt.getOrElse(10);
console.log(y); // 10
```

Gracefully in CoffeeScript:

```js
T = require 'tagval'

# with underscore.js
ar = [3, 5, 6]
is_even = (x)-> x%2 is 0
is_lt_10 = (x)-> (x > 10)

x_opt = T.Option.fromValue _.find(ar, is_even)
y_opt = T.Option.fromValue _.find(ar, is_lt_10)

x_opt.match
  Some: (x)-> console.log "I got #{x}"
  None:    -> console.log "nothing"
# "I got 6"

y = y_opt.getOrElse 10
console.log y // 10
```

# Documentation

## Option Class

### `TagVal.Option`
`Option` is a class that expresses "there is something"(Some) or "there is nothing"(None). In fact, this class is a subclass of `Matchable`, which is tagged-value implementation.

For example, following situations may be when you need `Option`:

- finding an element from an array
- handling a setting that user can specifiy optionally

```js
var num_opt = find_num(); // assume it returns `Option`
var DEFAULT = 30;

// when you want to get its content with specifying default value, try
var num = num_opt.getOrElse(DEFAULT);
```

### `TagVal.Some(v)`
creates a new `Option` object tagged `Some` and retaining value `v`.

### `TagVal.None()`
creates a new `Option` object tagged `None` and retaining nothing.

### `TagVal.Option.fromValue(v)`
If `v` is undefined or null, it returns `None()`.

Otherwise, it returns `Some(v)`.

**Let `opt` be a `Option` object below:**

#### `opt.map(f)`
- If `opt` is `Some(x)`, it returns new `Some(f(x))`.
- If `opt` is `None()`, it returns new `None()`.

```js
var x = TagVal.Some(20);
var f = function(x){ return x*x; };
var y = x.map(f);
console.log(y.val); // 4000
console.log(x.val); // 20  <- note that the original object doesn't change

var n = TagVal.None();
var m = n.map(f);
console.log(m.tag); // "None"
```

#### `opt.getOrElse(x)`
- If `opt` is `Some(v)`, it returns `v`.
- If `opt` is `None()`, it returns `x`.

Useful when you want to get value with specifying a default value.
This is a method which will save you from unexpected `undefined`.

```js
var a = TagVal.Some(20);
var b = TagVal.None();
console.log(a.getOrElse(40)); // 20
console.log(b.getOrElse(40)); // 40
```

#### `opt.getOrElseF(f)`
- If `opt` is `Some(v)`, it returns `v`.
- If `opt` is `None()`, it returns result of `f()`.

This is useful when you don't want to evaluate default value unless needed.
This is a method which will save you from unexpected `undefined`.

#### `opt.toArray()`
- If `opt` is `Some(v)`, it returns `[v]`.
- if `opt` is `None()`, it returns `[]`.

#### `opt.toStatus(msg)`
- If `opt` is `Some(v)`, it returns new `Status` object `Success(v)`.
- If `opt` is `None()`, it returns new `Status` object `Failure(msg)`.

#### `opt.toValue()`
- If `opt` is `Some(v)`, it returns `v`.
- If `opt` is `None()`, it returns `undefined`.

It's useful when you are irritating such as "IT HAS SOME VALUE OBVIOUSLY!".
This method is safer than `opt.val` because it can't be certified that val of None is always undefined.

#### `opt.equal(oqt)`
- If `opt` is `Some(v)` and `oqt` is `Some(w)`, it returns `v === w`.
- If `opt` is `None()` and `oqt` is `None()`, it returns `true`.
- Otherwise, `false`.

Because they're still objects, `opt === oqt` may perform unexpected judgement.
If you want to check equality of two Options, this method can be a good choice.
I'm calling this equality is "under `(===)`" since values are still compared with `===`.

Note that this method is inherited from `Matchable`.
If you are creating new subclass of `Matchable`, you can implement `equal`'s behavior with overriding `prototype.valEqual`.

#### `opt.mapEqual(oqt, f)`
- If `opt` is `Some(v)` and `oqt` is `Some(w)`, it returns `f(v, w)`.
- If `opt` is `None()` and `oqt` is `None()`, it returns `true`.
- Otherwise, `false`.

This is an abstract method of `opt.equal`.
If you want to check equality of two Options, and they may have object in its value, then give an equality function to it.
I'm calling this equality is "under `f`".

#### `opt.match`
#### `opt.when`
#### `opt.toString`
These methods are inherited from `Matchable` class. See below.

## Status Class
### `TagVal.Status`
Status object is a class that express "success with result"(Success) or "failure with message"(Failure).

**let `stat` be a `Status` object below:**

#### `stat.getOrThrow()`
- If `stat` is `Success(v)`, it returns `v`.
- If `stat` is `Failure(msg)`, it throws `msg`.

#### `stat.toOption`
- If `stat` is `Success(v)`, it returns a new `Option` object `Some(v)`.
- If `stat` is `Failure(msg)`, it returns a new `Option` object `None()`.

#### `stat.match`
#### `stat.when`
#### `stat.toString`
#### `stat.equal`
These methods are inherited from `Matchable` class. See below.

## Matchable Class
### TagVal.Matchable
Thanks for reading here.

TagVal's basic concept is regarding `{tag: String, val: Value}` as minimum tagged-value interface.

`Matchable` has actually only this two fields, and they are initialized simply:

```js
var tv = new TagVal.Matchable("Tag", value); // I often express as "Tag(value)"

console.log(tv.tag); // "Tag"
console.log(tv.val); // value
```

In addition, `Matchable` has a few, generic methods below. You can inherit it. `Option` and `Status` can be simple good examples of subclass of `Matchable`.

#### `tv.match(table[, default_fun])`
- Assume `tv` is `T(v)`,
- If `table[T]` exists, then returns `table[T](v)`.
- If `table[T]` doesn't exists and default_fun is set, then returns `default_fun()`.
- Otherwise, it returns `undefined`.

With `Option`:
```js
var x_opt = find_something(); // assume it returns `Option` object

var s = x_opt.match({
  Some: function(v){ return "I found "+v+"!"; },
  None: function(){ return "I found nothing."; }
});
console.log(s);
```

Gracefully in CoffeeScript:
```coffee
x_opt = find_something()

s = x_opt.match
  Some: (v) -> "I found #{v}!"
  None:     -> "I found nothing."
```

#### `tv.when(table)`
- Assume `tv` is `T(v)`
- If `table[T]` exists, return `table[T](v)`
- Otherwise, it returns **object itself**.

This is useful when you want to try some functions until one is succeeded.

With `Status`:
```js
x_stat = try_something1()
  .when({ Failure: function(){ return try_something2(); } })
  .when({ Failure: function(){ return try_something3(); } })
  .when({
    Failure: function(){ returns TagVal.Failure("All tries failed."); }
  });
```

Gracefully in CoffeeScript:
```js
x_stat = try_something1()
  .when Failure: -> try_something2()
  .when Failure: -> try_something3()
  .when Failure: -> TagVal.Failure "All tries failed."
```

**Let `tv` be a `Matchable` object below:**

#### `tv.toString()`
returns `"Tag("+value+")"`

#### `tv.equal(tw)`
- If `tv` and `tw` have different tags, it returns `false`
- Otherwise, it returns `tv.valEqual(tw)`

Check two tags are same and then check value equality by `valEqual`.

#### `tv.valEqual(tw)`
- It returns `tv.val === tw.val`.

This method is assumed to be invoked from `equal`.
Subclasses can implement `equal`'s behavior with overriding this method.

## Functional Utilities

#### `TagVal.match(tv)(table)`
It is applicable to arbitrary `{ tag: Tag, val: Value }` object.

In CoffeeScript:
```coffee
tv4 = { tag: "even" , val: 4 }
tv5 = { tag: "odd" , val: 5 }
col = (tv)->
  TagVal.match(tv)
    even: (v)-> v/2
    odd:  (v)-> 3*v+1
expect(col(tv4)).toBe 2
expect(col(tv5)).toBe 16
```

#### `TagVal.open()` / `TagVal.close()`
Sets and unsets the functions in global object.
Original values are reverted after `close()`.
The functions to be opened are below:

- `Some`
- `None`
- `Success`
- `Failure`

Of course, polluting global scope is **dangerous**. If you are still not a perfect lazy man, use alias instead e.g. `var T = TagVal;`.

[travis-url]: https://travis-ci.org/mizukami234/tagval
[travis-image]: http://img.shields.io/travis/mizukami234/tagval.svg