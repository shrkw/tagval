TagVal (tagval.js)
======

A simple JavaScript library includes Option class, Status class and their basic class tagged value (TagVal).

Optionクラス、Statusクラス及びその基礎的なタグ付き値のクラス(TagVal)を含む、シンプルなJavaScriptライブラリ

# Documentation

### `TagVal.open()` / `TagVal.close()`
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

### `TagVal.Some(v)`
creates an `Option` object tagged `Some` and retaining value `v`.

### `TagVal.None()`
creates an `Option` object tagged `None` and retaining nothing.

### `TagVal.Option`
### `TagVal.Option.fromValue(v)`
If `v` is undefined or null, it returns an `Option` object tagged `None`,
Otherwise, it returns an `Option` object tagged `Some` and retaining value `v`.

#### `prototype.map(f)`
If tagged `Some`, it applies function `f` to retaining value `x` and returns new `Option` object tagged `Some` and retaining `f(x)`.
If tagged `None`, it returns new `Option` object tagged `None`.

```js
var x = TagVal.Some(20);
var f = function(x){ return x*x; };
var y = x.map(f);
console.log(y.val); // 4000
console.log(x.val); // 20

var n = TagVal.None();
var m = n.map(f);
console.log(m.tag); // "None"
```

#### `prototype.getOrElse(v)`
If tagged `Some`, it returns its retaining value.
If tagged `None`, it returns `v`.
Useful when you want to get specified value and default value.

```js
var a = TagVal.Some(20);
var b = TagVal.None();
console.log(a.getOrElse(40)); // 20
console.log(b.getOrElse(40)); // 40
```

#### `prototype.getOrElseF(f)`
If tagged `Some`, it returns its retaining value.
If tagged `None`, it returns result of `f()`.
This is useful if you don't want to evaluate default value unless needed.

#### `prototype.toArray()`
If tagged `Some`, it returns `[v]`, where `v` is its retaining value.
if tagged `None`, it returns `[]`.

#### `prototype.toStatus(msg)`
If tagged `Some`, it returns new `Status` object tagged `Success` and retaining the same value.
If tagged `None`, it returns new `Status` object tagged `Failure` and retaining `msg`.

#### `prototype.match`
#### `prototype.patch`
#### `prototype.toString`
#### `prototype.equal`
These are inherited method of `Matchable` class.

### `Status`
#### `prototype.getOrThrow`
If tagged `Success`, it returns its retaining value.
If tagged `Failure`, it throws exception with its retaining value.

#### `prototype.toOption`
If tagged `Success`, it returns a new `Option` object tagged `Some` and retaining the same value.
If tagged `Failure`, it returns a new `Option` object tagged `None`.

#### `prototype.match`
#### `prototype.patch`
#### `prototype.toString`
#### `prototype.equal`
These are inherited method of `Matchable` class.

### `Matchable`

#### `prototype.match`
#### `prototype.patch`
#### `prototype.toString`
#### `prototype.equal`
