
describe 'TagVal', ->

  describe 'Matchable', ->

    describe 'match', ->

      it "executes matched tag's function", ->
        a = new TagVal.Matchable 'TagA', 100
        b = new TagVal.Matchable 'TagB', 200
        x = a.match
          TagA: (v)-> v+10
          TagB: (v)-> v+20
        y = b.match
          TagA: (v)-> v+10
          TagB: (v)-> v+20
        expect(x).toBe 110
        expect(y).toBe 220
      it "executes 2nd arg's function if tag doesn't match", ->
        c = new TagVal.Matchable 'TagC', 200
        z = c.match
          TagA: (v)-> v+10
          TagB: (v)-> v+20
        , -> 300  # default function here
        expect(z).toBe 300

    describe 'patch', ->

      it "executes matched tag's function", ->
        a = new TagVal.Matchable 'Good', 100
        b = new TagVal.Matchable 'Bad', 0
        x = a.patch
          Good: (v)-> v+10
          Bad: (v)-> v+20
        y = b.patch
          Good: (v)-> v+10
          Bad: (v)-> v+20
        expect(x).toBe 110
        expect(y).toBe 20

      it "returns arg's function if tag doesn't match", ->
        c = new TagVal.Matchable 'Good', 200
        z = c.patch
          Bad: (v)-> 10
        expect(z.tag).toBe 'Good'
        expect(z.val).toBe 200

    describe 'equal', ->

      it "returns true iff two tagvals have same tag and same value", ->
        a = new TagVal.Matchable 'A', 10
        b = new TagVal.Matchable 'B', 10
        c = new TagVal.Matchable 'A', 10
        d = new TagVal.Matchable 'B', 20
        expect(a.equal(b)).toBe false
        expect(a.equal(c)).toBe true
        expect(a.equal(d)).toBe false
        expect(c.equal(a)).toBe true
        expect(d.equal(b)).toBe false

    describe 'valEqual', ->

      it "defines value equality that is used in #equal.", ->
        # bad example
        bad_pt_u = new TagVal.Matchable 'XY', {x: 10, y: 20}
        bad_pt_v = new TagVal.Matchable 'XY', {x: 10, y: 20}
        expect bad_pt_u.equal(bad_pt_v)
          .toBe false
        # because two instances are different.
        # need to override #valEqual to check equality for value
        # good example
        class TestPoint extends TagVal.Matchable
          valEqual: (a)-> # override valEqual
            @match
              XY: -> @val.x is a.val.x and @val.y is a.val.y
              ZW: -> @val.z is a.val.z and @val.w is a.val.w
        a = new TestPoint 'XY', {x: 10, y: 20}
        b = new TestPoint 'XY', {x: 10, y: 20}
        c = new TestPoint 'XY', {x: 20, y: 20}
        d = new TestPoint 'ZW', {z: 10, w: 20}
        expect(a.equal(b)).toBe true
        expect(b.equal(c)).toBe false
        expect(d.equal(a)).toBe false

  describe 'Option', ->

    describe 'map', ->

      it "apply function into value of Some", ->
        x_opt = TagVal.Some(3)
        y_opt = TagVal.None()
        f = (x) -> x*x
        fx_opt = x_opt.map f
        fy_opt = y_opt.map f
        expect(fx_opt.tag).toBe 'Some'
        expect(fx_opt.val).toBe 3*3
        expect(fy_opt.tag).toBe 'None'

    describe 'getOrElse', ->

      it "Get value if Some, otherwise, return argument", ->
        x_opt = TagVal.Some(3)
        y_opt = TagVal.None()
        expect(x_opt.getOrElse(2)).toBe 3
        expect(y_opt.getOrElse(2)).toBe 2

    describe 'getOrElseF', ->

      it "Get value if Some, otherwise, return function result", ->
        x_opt = TagVal.Some(3)
        y_opt = TagVal.None()
        z = false
        expect(x_opt.getOrElseF ->
          z = true
          2
        ).toBe 3
        expect(z).toBe false
        expect(y_opt.getOrElseF(-> 2)).toBe 2

    describe 'toArray', ->

      it "converts to an array that is empty or has one element", ->
        x_opt = TagVal.Some(3)
        y_opt = TagVal.None()
        expect(x_opt.toArray()).toEqual [3]
        expect(y_opt.toArray()).toEqual []
      
    describe 'toStatus', ->

      it "converts Some(x) to Success(x) and None() to Failure(msg) with message msg.", ->
        x_opt = TagVal.Some(3)
        y_opt = TagVal.None()
        x_stat = TagVal.Success(3)
        y_stat = TagVal.Failure('Nothing Found')
        expect(x_opt.toStatus('Nothing Found').equal(x_stat)).toBe true
        expect(y_opt.toStatus('Nothing Found').equal(y_stat)).toBe true

      it "converts None() to Failure('') if no argument passed", ->
        n_opt = TagVal.None()
        n_stat = TagVal.Failure('')
        expect(n_opt.toStatus().equal(n_stat)).toBe true

    describe 'toValue', ->

      it "converts Some(x) to x and None() to undefined", ->
        x_opt = TagVal.Some(3)
        y_opt = TagVal.None()
        expect(x_opt.toValue()).toBe 3
        expect(y_opt.toValue()).toBe undefined

    describe 'equal', ->

      it "true if retaining values of two Some's, or two are both None", ->
        a_opt = TagVal.Some(5)
        b_opt = TagVal.Some(3)
        c_opt = TagVal.Some(5)
        d_opt = TagVal.None()
        e_opt = TagVal.None()
        f_opt = TagVal.None()
        expect(a_opt.equal(b_opt)).toBe false
        expect(a_opt.equal(c_opt)).toBe true
        expect(a_opt.equal(d_opt)).toBe false
        expect(d_opt.equal(e_opt)).toBe true

        # even if someone crazily manipulates None's `val` field,
        f_opt.val = "a hidden value of None"
        expect(d_opt.equal(f_opt)).toBe true

    describe 'fromValue', ->

      it "converts undefined to None(), non-undefined value to Some(value)", ->
        x = 100
        y = undefined
        x_opt = TagVal.Some(100)
        y_opt = TagVal.None()
        expect(TagVal.Option.fromValue(x).equal(x_opt)).toBe true
        expect(TagVal.Option.fromValue(y).equal(y_opt)).toBe true

  describe 'Status', ->

    describe 'getOrThrow', ->

      it "gets value if Success and throws msg if Failure(msg)", ->
        x_stat = TagVal.Success(20)
        y_stat = TagVal.Failure("omg!")
        expect -> x_stat.getOrThrow()
          .not.toThrow()
        expect(x_stat.getOrThrow()).toBe 20
        expect -> y_stat.getOrThrow()
          .toThrow("omg!")

    describe 'toOption', ->

      it "converts Success(x) to Some(x) and Failure(msg) to None()", ->
        x_stat = TagVal.Success(20)
        y_stat = TagVal.Failure("omg!")
        x_opt = TagVal.Some(20)
        y_opt = TagVal.None()
        expect(x_stat.toOption().equal(x_opt)).toBe true
        expect(y_stat.toOption().equal(y_opt)).toBe true

  describe 'open', ->

    it "overwrites functions on global scope", ->
      TagVal.open()
      expect(Matchable is TagVal.Matchable).toBe true
      expect(Option is TagVal.Option).toBe true
      expect(Some is TagVal.Some).toBe true
      expect(None is TagVal.None).toBe true
      expect(Status is TagVal.Status).toBe true
      expect(Success is TagVal.Success).toBe true
      expect(Failure is TagVal.Failure).toBe true
      TagVal.close()

  describe 'close', ->

    it "reverts #open's pollution over global scope", ->
      TagVal.open()
      TagVal.close()
      expect(Matchable isnt TagVal.Matchable).toBe true
      expect(Option isnt TagVal.Option).toBe true
      expect(Some isnt TagVal.Some).toBe true
      expect(None isnt TagVal.None).toBe true
      expect(Status isnt TagVal.Status).toBe true
      expect(Success isnt TagVal.Success).toBe true
      expect(Failure isnt TagVal.Failure).toBe true
      
      window.Matchable = "抹茶"
      TagVal.open()
      expect(Matchable is TagVal.Matchable).toBe true      
      TagVal.close()
      expect(Matchable is "抹茶").toBe true
