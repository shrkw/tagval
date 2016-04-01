class Matchable {
  constructor(tag, val){
    this.tag = tag;
    this.val = val;
  }

  match(fun_table, fun_default){
    const fun = fun_table[this.tag];
    if (fun !== undefined) return fun.call(this, this.val);
    else if(fun_default !== undefined) return fun_default.call(this, this.val);
    else return;
  }

  when(fun_table){
    return this.match(fun_table, ()=> {
      return this;
    });
  }

  toString(){
    return `${this.tag}(${this.val})`;
  }

  equal(a){
    if (this.tag === a.tag) return this.valEqual(a);
    else return false;
  }

  valEqual(a){
    return this.val === a.val;
  }
}

function option_unexpected_tag_found(option){
  throw new Error("TagVal.Option Error: Unexpected tag was found: "+option.tag+".");
}

class Option extends Matchable {
  constructor(v){
    if (v !== undefined) super('Some', v);
    else super('None');
  }

  map(f){
    return this.match({
      Some(v){ return new Option(f(v)); },
      None(){ return new Option(); },
    }, ()=> option_unexpected_tag_found(this));
  }

  getOrElse(x){
    return this.match({
      Some(v){ return v; },
      None(){ return x; },
    }, ()=> option_unexpected_tag_found(this));
  }

  getOrElseF(f){
    return this.match({
      Some(v){ return v; },
      None(){ return f(); },
    }, ()=> option_unexpected_tag_found(this));
  }

  toArray(){
    return this.match({
      Some(v){ return [v]; },
      None(){ return []; },
    }, ()=> option_unexpected_tag_found(this));
  }

  toStatus(msg = ""){
    return this.match({
      Some(v){ return new Status('Success', v); },
      None(){ return new Status('Failure', msg); },
    }, ()=> option_unexpected_tag_found(this));
  }

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

  mapEqual(a, f){
    if (this.tag === a.tag) return this.match({
      Some(v){ return f(v, a.val); },
      None(){ return true; },
    });
    else return false;
  }
}

function Some(v){ return new Option(v); }
function None(){ return new Option(); }

Option.fromValue = function(v){
  return new Option(v);
};

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
