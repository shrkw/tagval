/**
 * Class representing tagged value.
 */
class Matchable {
  /**
   * Creates taggad value object.
   * @param {string} tag - Tag name.
   * @param {any} val - Contained value.
   */
  constructor(tag, val){
    this.tag = tag;
    this.val = val;
  }

  /**
   * Tag divided pattern matching.
   * @param {object} fun_table - Map from tag to function.
   * @param {function} fun_default - Default function used when the tag doesn't exist in keys of `fun_table`.
   * @return - Result value of matched function, otherwise `undefined`.
   */
  match(fun_table, fun_default){
    const fun = fun_table[this.tag];
    if (fun !== undefined) return fun.call(this, this.val);
    else if(fun_default !== undefined) return fun_default.call(this, this.val);
    else return;
  }

  /**
   * Partial application of tag divided pattern matching.
   * @param {object} fun_table - Map from tag to function.
   * @return - Result value of matched function, otherwise **object itself**.
   */
  when(fun_table){
    return this.match(fun_table, ()=> {
      return this;
    });
  }

  /**
   * Stringify function.
   * @return {string} - Formatted `Tag(value.toString())`,
   */
  toString(){
    return `${this.tag}(${this.val})`;
  }

  /**
   * Equality function.
   * @param {Matchable} tv - Compared object.
   * @return {boolean} - `false` unless both tags are the same, and return the result of `valEqual`.
   */
  equal(tv){
    if (this.tag === tv.tag) return this.valEqual(tv);
    else return false;
  }

  /**
   * Value equality function.
   * Subclasses can override this function to implement equality.
   * @param {Matchable} tv - Compared object.
   * @return {boolean} - return the equality of both values.
   */
  valEqual(tv){
    return this.val === tv.val;
  }
}

function option_unexpected_tag_found(option){
  throw new Error("TagVal.Option Error: Unexpected tag was found: "+option.tag+".");
}

/**
 * Class representing **something x** or **nothing**.
 */
class Option extends Matchable {
  /**
   * Creates new Option object.
   * @param {any} val - (Optional) Value to be contained with tagged `Some`.
   * @return {Option} - Returns `Some(val)` if `val` is specified, otherwise `None()`.
   */
  constructor(val){
    if (val !== undefined) super('Some', val);
    else super('None');
  }

  /**
   * Apply function to contained value.
   * @param {function} fn - Function to apply.
   * @return {Option} - `Some(fn(val))` if `Some(val)`, otherwise `None()`.
   */
  map(fn){
    return this.match({
      Some(v){ return Some(fn(v)); },
      None(){ return None(); },
    }, ()=> option_unexpected_tag_found(this));
  }

  /**
   * Extract some value with default value.
   * @param {any} x - Default value.
   * @return - `val` if `Some(val)`, otherwise `x`.
   */
  getOrElse(x){
    return this.match({
      Some(v){ return v; },
      None(){ return x; },
    }, ()=> option_unexpected_tag_found(this));
  }

  /**
   * Extract some value with default lazy value.
   * @param {function} f - Lazy function returns default value.
   * @return - `val` if `Some(val)`, otherwise `f()`.
   */
  getOrElseF(f){
    return this.match({
      Some(v){ return v; },
      None(){ return f(); },
    }, ()=> option_unexpected_tag_found(this));
  }

  /**
   * Convert to Array.
   * @return - `[val]` if `Some(val)`, otherwise `[]`.
   */
  toArray(){
    return this.match({
      Some(v){ return [v]; },
      None(){ return []; },
    }, ()=> option_unexpected_tag_found(this));
  }

  /**
   * Convert to Status object with failure message.
   * @param {any} msg - Message passed to failure.
   * @return {Status} - `Success(val)` if `Some(val)`, otherwise `Failure(msg)`.
   */
  toStatus(msg = ""){
    return this.match({
      Some(v){ return new Status('Success', v); },
      None(){ return new Status('Failure', msg); },
    }, ()=> option_unexpected_tag_found(this));
  }

  /**
   * Convert to value.
   * @return - Value if `Some(val)`, otherwise `undefined`.
   */
  toValue(){
    return this.match({
      Some(v){ return v; },
      None(){ return undefined; },
    }, ()=> option_unexpected_tag_found(this));
  }

  valEqual(a){
    return this.match({
      Some(v){ return v === a.val; },
      None(){ return true; },
    });
  }

  /**
   * Higher order equality application.
   * @param {Option} a - Compared object.
   * @param {function} f - Equality function.
   * @return - return `f(this.val, a.val)` if both are `Some` and return `true` if both are `None`, otherwise `false`.
   */
  mapEqual(a, f){
    if (this.tag === a.tag) return this.match({
      Some(v){ return f(v, a.val); },
      None(){ return true; },
    });
    else return false;
  }
}

/**
 * Creates `Some` tagged Option. Alias of `new Option(val)`.
 * @param {any} v - Contained value.
 * @return {Option} - `Some` tagged Option object.
 */
function Some(v){ return new Option(v); }

/**
 * Creates `None` tagged Option. Alias of `new Option()`.
 * @return {Option} - `None` tagged Option object.
 */
function None(){ return new Option(); }

/**
 * Creates Option object from value.
 * @param {any} v - Value passed to Option.
 * @return {Option} - `Some(val)` if `v` is exist, otherwise `None()`.
 */
Option.fromValue = function(v){
  return new Option(v);
};

/**
 * Creates Option object from boolean.
 * @param {boolean} v - Value passed to Option.
 * @return {Option} - `Some(true)` if `v` is truthy, otherwise `None()`.
 */
Option.fromBool = function(v){
  if (v) return Some(true);
  else return None();
};

function status_unexpected_tag_found(status){
  throw new Error("TagVal.Status Error: Unexpected tag was found: "+status.tag+".");
}

class Status extends Matchable {
  getOrThrow(){
    return this.match({
      Success(v){ return v; },
      Failure(msg){ throw msg; },
    }, ()=> status_unexpected_tag_found(this));
  }

  toOption(){
    return this.match({
      Success(v){ return Some(v); },
      Failure(msg){ return None(); },
    }, ()=> status_unexpected_tag_found(this));
  }
}

Status.trying = function(f){
  try {
    return Success(f());
  } catch(e) {
    return Failure(e);
  }
}

function Success(v){ return new Status('Success', v); }
function Failure(msg){ return new Status('Failure', msg); }

function match(tagval){
  return function(fun_table, fun_default){
    const fun = fun_table[tagval.tag];
    if (fun !== undefined) return fun.call(tagval, tagval.val);
    else if (fun_default !== undefined) return fun_default.call(tagval);
    else return undefined;
  };
}

const optionFrom = Option.fromValue;
const withTry = Status.trying;

const TagVal = {
  Matchable: Matchable,
  Option: Option,
  Status: Status,
  Some: Some,
  None: None,
  Success: Success,
  Failure: Failure,
  match: match,
  optionFrom: Option.fromValue,
  withTry: Status.trying,
};

export {
  Matchable,
  Option,
  Status,
  Some,
  None,
  Success,
  Failure,
  match,
  optionFrom,
  withTry,
  TagVal
}
