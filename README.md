TagVal (tagval.js)
======

A simple JavaScript library includes Option class, Status class and their basic class tagged value (TagVal).

Optionクラス、Statusクラス及びその基礎的なタグ付き値のクラス(TagVal)を含む、シンプルなJavaScriptライブラリ

# Documentation

#### `TagVal.open()` / `TagVal.close()`
Sets and unsets the functions in global object.
Original values are reverted after `close()`.
The functions to be opened are below:

- `Option`
- `Some`
- `None`
- `Status`
- `Success`
- `Failure`
- `Matchable`

Of course, polluting global scope is **dangerous**. If you are still not a perfect lazy man, use alias instead e.g. `var T = TagVal;`.

## Option Class

### `TagVal.Option`
`Option` is a class that expresses "there is something"(Some) or "there is nothing"(None). In fact, this class is a subclass of `Matchable`, which is tagged-value implementation.

For example, these situations below may be when you need `Option`:

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
console.log(x.val); // 20  <- check the original object is not changed

var n = TagVal.None();
var m = n.map(f);
console.log(m.tag); // "None"
```

#### `opt.getOrElse(x)`
- If `opt` is `Some(v)`, it returns `v`.
- If `opt` is `None()`, it returns `x`.

Useful when you want to get specified value or default value.

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

#### `opt.toArray()`
- If `opt` is `Some(v)`, it returns `[v]`.
- if `opt` is `None()`, it returns `[]`.

#### `opt.toStatus(msg)`
- If `opt` is `Some(v)`, it returns new `Status` object `Success(v)`.
- If `opt` is `None()`, it returns new `Status` object `Failure(msg)`.

#### `opt.match`
#### `opt.patch`
#### `opt.toString`
#### `opt.equal`
These are inherited method of `Matchable` class.

## Status Class
### `TagVal.Status`
Status object is a class that express "success with result"(Success) or "failure with message"(Failure).

** let `stat` be a `Status` object below:**

#### `stat.getOrThrow()`
- If `stat` is `Success(v)`, it returns `v`.
- If `stat` is `Failure(msg)`, it throws `msg`.

#### `stat.toOption`
- If `stat` is `Success(v)`, it returns a new `Option` object `Some(v)`.
- If `stat` is `Failure(msg)`, it returns a new `Option` object `None()`.

#### `stat.match`
#### `stat.patch`
#### `stat.toString`
#### `stat.equal`
These are inherited method of `Matchable` class.

## Matchable Class
### TagVal.Matchable
#### `tv.match`
#### `tv.patch`
#### `tv.toString`
#### `tv.equal`
