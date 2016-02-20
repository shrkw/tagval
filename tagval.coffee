do =>

  # Base class of tagged value
  class Matchable
    
    # Constructor
    # Matchable class doesn't know that what tags are valid. So, we
    # recommend to use Maker to create instance generator of Matchable class
    # or its extended class.
    constructor: (@tag, @val)->

    # General tag matching
    match: (fun_table, fun_default)->
      fun = fun_table[@tag]
      if fun? then fun.call(@, @val)
      else if fun_default? then fun_default.call(@) else undefined

    # Partial tag matching
    # This is same as `match` except that it returns object itself
    # when the function table doesn't have matched key for its tag.
    when: (fun_table)->
      @match fun_table, (=> @)

    # Stringify
    toString: ->
      "#{@tag}(#{@val})"

    ## Equality
    # You can implement equality function easily.
    # Only you have to do is to override `valEqual` method, which
    # checks object's `val` equals another object's `val`
    equal: (a)->
      if @tag is a.tag then @valEqual(a) else false
    valEqual: (a)->
      @val is a.val

  ## Option Class
  # Option is generally means "some value or none".
  # It saves people from hell of undefined. Also some utility methods
  # are implemented.
  class Option extends Matchable

    # Constructor
    constructor: (v)->
      if v? then super('Some', v) else super('None')

    # Apply function to value of Some
    # < Some(v) | None > -> < Some(f(v)) | None >
    map: (f)->
      @match
        Some: (v)-> new Option f(v)
        None:    -> new Option undefined
      , => throw "An invalid tag for Option object was found: '#{@tag}'."

    # Gets value of Some or returns a default value
    getOrElse: (x)->
      @match
        Some: (v)-> v
        None:    -> x
      , => throw "An invalid tag for Option object was found: '#{@tag}'."

    # Gets value of Some or returns function result
    getOrElseF: (f)->
      @match
        Some: (v)-> v
        None:    -> f()
      , => throw "An invalid tag for Option object was found: '#{@tag}'."

    # Convert to other type
    toArray: ->
      @match
        Some: (v)-> [v]
        None:    -> []
      , => throw "An invalid tag for Option object was found: '#{@tag}'."

    # Convert to Status type with message of Failure
    toStatus: (msg = "")->
      @match
        Some: (v)-> new Status 'Success', v
        None:    -> new Status 'Failure', msg
      , => throw "An invalid tag for Option object was found: '#{@tag}'."

    # Convert to value
    toValue: ->
      @match
        Some: (v)-> v
        None:    -> undefined

    # Value Equality
    valEqual: (a)->
      @match
        Some: (v)-> v is a.val
        None:    -> true

    # Map Equality
    mapEqual: (a, f)->
      if @tag is a.tag
        @match
          Some: (v)-> f(v, a.val)
          None:    -> true
      else false

  # Utility constructor function
  Some = (v)-> new Option v
  None =    -> new Option undefined

  # Create Option from undefined-able value
  Option.fromValue = (v)-> new Option v

  # Create Option from Boolean value. true to Some(true), false to None.
  Option.fromBool = (v)-> if v then Some true else None()

  ## Status Class
  # Status is a simple type that means "Success or Failure".
  # This is the same as Option except that it is assumed Failure may
  # have its message. It's useful to express Ajax responses.
  class Status extends Matchable

    # get value of Success or throw message of Failure
    getOrThrow: ->
      @match
        Success: (v)  -> v
        Failure: (msg)-> throw msg
      , => throw "An invalid tag for Status object was found: '#{@tag}'."

    # Convert to Option with throwing away the message of Failure!
    toOption: ->
      @match
        Success: (v)  -> Some(v)
        Failure: (msg)-> None()
      , => throw "An invalid tag for Status object was found: '#{@tag}'."

  # try evaluating function with wrapping exception as Failure(e)
  Status.trying = (f)->
    try
      Success(f())
    catch e
      Failure(e)

  # Simple constructor of Status
  Success = (v)  -> new Status 'Success', v
  Failure = (msg)-> new Status 'Failure', msg

  # Functional Utilities
  match = (tagval)->
    (fun_table, fun_default)-> 
      fun = fun_table[tagval.tag]
      if fun? then fun.call(tagval, tagval.val)
      else if fun_default? then fun_default.call(tagval) else undefined

  # TagVal main Module
  TagVal =
    Matchable: Matchable
    Option: Option
    Status: Status
    Some: Some
    None: None
    Success: Success
    Failure: Failure
    match: match
    optionFrom: Option.fromValue
    withTry: Status.trying

  # Export TagVal for Node.js
  if exports?
    exports = TagVal
    exports.TagVal = TagVal
  else
    @TagVal = TagVal
