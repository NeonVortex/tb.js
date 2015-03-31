/* Utilities */

var _ = {};

(function(ns){

/** each (collection, callback)
 ** collection can be single element, array, any list
 ** return undefined
 **/
ns.each = function (cl, fn) {
  if (Array.isArray(cl) || cl.length) {
    for (var i = 0; i < cl.length; i++) {
      (function (_el,_i) {
       fn(_el, i);
       })(cl[i], i);
    }
  }
  else {
    fn (cl, 0);
  }
};

ns.eachPair = function (cl, fn) {
  for (var k in cl) {
    (function(_k, _v) {
     fn(_k, _v);
     })(k, cl[k]);
  }
};


/** map (collection, callback)
 ** collection can be single element, array, any list
 ** return single element if collection is single element, array if collection is not single element
 **/
ns.map = function (cl, fn) {
  var result = [];
  if (Array.isArray(cl) || cl.length) {
    for (var i = 0; i < cl.length; i++) {
      (function (_el,_i, _result) {
       _result.push(fn(_el, i));
       })(cl[i], i, result);
    }
  }
  else {
    result = fn(cl, 0);
  }
  return result;
};

/** reduce
 ** only work with single element and array; not hashmap
 **/
ns.reduce = function (cl, fn) {
  if (Array.isArray(cl) || cl.length) {
    var cur = cl[0];
    for(var i = 1; i < cl.length; i++) {
      (function(x,y) {
        cur = fn(x,y);
      })(cur, cl[i]);
    }
    return cur;
  }
  else {
    return cl;
  }
}


ns.isDefined = function(o, fn) {
  var result = typeof(o) != "undefined";
  if (fn && result) {
    fn (o);
  }
  return result; 
};

ns.global = Function("return this;")();

ns.ns = function (o) {
  ns.eachPair(ns, function(k,v) {
    o[k] = v;
  });
};

})(_);

/* Add utils to global namespace */
_.isDefined(_.global, function(global) {
  global._ = _;
});
