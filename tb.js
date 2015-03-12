$each = function (cl, fn) {
    if (cl.length) {
        for (var i = 0; i < cl.length; i++) {
            (function (_el,_i) {
                fn(_el, i);
            })(cl[i], i);
        }
    }
    else {
        for (var k in cl) {
            (function(_k, _v) {
                fn(_k, _v);
            })(k, cl[k]);
        }
    }
};

$map = function (cl, fn) {
    var result = [];
    if (cl.length) {
        for (var i = 0; i < cl.length; i++) {
            (function (_el,_i, _result) {
                _result.push(fn(_el, i));
            })(cl[i], i, result);
        }
    }
    else {
        for (var k in cl) {
            (function(_k, _v, _result) {
                _result.push(fn(_k, _v));
            })(k, cl[k], result);
        }
    }
    return result;
};


$chain = function() {
    for(var i = 1; i < arguments.length; i++) {
        (function(obj, fn) {
            fn(obj);
        })(arguments[0], arguments[i]);
    }
};


$ = function() {
    return $.all.apply(window, arguments);
};

$.queryFunctionMapping = {
    'all':'querySelectorAll',
    'one':'querySelector',
    'id':'getElementById',
};

$each($.queryFunctionMapping, function(n, fnn) {
    $[n] = function (el, s) {
        if (!s) {
            return document[fnn](el);
        }
        else {
            return el[fnn](s);
        }
    };
});

$.setFunctionMapping = {
    'attr': function(el,k,v) { el.setAttribute(k,v);},
    'css' : function(el,k,v) { el.style[k] = v;},
    'prop': function(el,k,v) { el[k] = v;}
};

$each($.setFunctionMapping, function(n, fn) {
    $[n] = function (el, k, v) {
        if (el.length) {
            $each (el, function (em) {
                fn(em, k, v);
            });
        }
        else {
            fn(el, k, v);
        }
    };
});

$.getFunctionMapping = {
    '_attr' : function(el,k) { return el.getAttribute(k);},
    '_css'  : function(el,k) { return el.style[k];},
    '_prop' : function(el,k) { return el[k];}
};

$each($.getFunctionMapping, function(n, fn) {
    $[n] = function (el, k) {
        if (el.length) {
            return $map (el, function (em) {
                return fn(em, k);
            });
        }
        else {
            return fn(el, k);
        }
    };
});

