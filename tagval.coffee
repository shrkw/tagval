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
    patch: (fun_table)->
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

    # Apply function to value of Some
    # < Some(v) | None > -> < Some(f(v)) | None >
    map: (f)->
      @match
        Some: (v)-> new Option 'Some', f(v)
        None:    -> new Option 'None'
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

  # Utility constructor function
  Some = (v)-> new Option 'Some', v
  None =    -> new Option 'None'

  # Create Option from undefined-able value
  Option.fromValue = (v)-> if v? then Some(v) else None()

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

  # Simple constructor of Status
  Success = (v)  -> new Status 'Success', v
  Failure = (msg)-> new Status 'Failure', msg

  # open-able TagVal Module
  TagValOpen =
    Matchable: Matchable
    Option: Option
    Some: Some
    None: None
    Status: Status
    Success: Success
    Failure: Failure

  ## open/close TagVal Module
  # For those who want to use TagValOpen's functions (see above) with global,
  # TagVal.open() and TagVal.close() set/unset them to global object.
  is_opened = false
  original_cache = {}
  global_scope = @
  open = do =>
    # main open function
    _open = ->
      if not is_opened
        for key, val of TagValOpen
          original_cache[key] = global_scope[key]
          global_scope[key] = val
        is_opened = true
    _open
  close = do =>
    # main close function
    _close = ->
      if is_opened
        for key, val of original_cache
          global_scope[key] = val
        is_opened = false
    _close

  # TagVal main Module
  TagVal =
    open: open
    close: close
  for key, val of TagValOpen
    TagVal[key] = val

  # Export TagVal for Node.js
  if exports?
    if module? and module.exports?
      exports = module.exports = TagVal
    exports.TagVal = TagVal
  else
    @TagVal = TagVal
