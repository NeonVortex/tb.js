/* Utilities */

/** each (collection, callback, allowsingle)
 ** collection can be single element (only if allowsingle is set to true), array, any list, or a hashmap (only if allowsingle is not set)
 ** return undefined
 **/
each = function (cl, fn) {
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

eachPair = function (cl, fn) {
  for (var k in cl) {
    (function(_k, _v) {
     fn(_k, _v);
     })(k, cl[k]);
  }
};


/** map (collection, callback, allowsingle)
 ** collection can be single element, array, any list
 ** return single element if collection is single element, array if collection is not single element
 **/
map = function (cl, fn) {
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
reduce = function (cl, fn) {
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

isDefined = function(o, fn) {
  var result = typeof(o) != "undefined";
  if (fn && result) {
    fn (o);
  }
  return result; 
};

/* DOM Handling */
/** $ is the namespace for all DOM operation functions
 ** itself is also a function using CSS Selector to query elements
 ** return nodelist
 **/
$ = function(sel) {
  return document.querySelectorAll(sel);
};

/** Generate Stub-ed Functions in namespace
 **
 ** all - Get all matching elements which are descents of the first argument(CSS Selector applies) (IE8+)
 ** function (element = document, selectorString) return a nodelist;
 **
 ** one - Get first matching element (like all but only get first one; fast) (IE8+)
 ** function (element = document, selectorString) 
 ** return a node;
 **
 ** id - Get element by ID
 ** function (element = document, idWithoutPrefix#) i
 ** This utilizes getElementById function which is the fastest query function available
 ** return a node;
 **/
(function(ns) {

  eachPair({
    'all':'querySelectorAll',
    'one':'querySelector',
    'id':'getElementById',
  }, function(fnName, mfnName) {
    ns[fnName] = function (element, arg) {
      return (!arg) ? document[mfnName](element) : element[mfnName](arg);
    };
  });

  eachPair({
    'attr': function(element, key, value) { return value ? element.setAttribute(key, value) : element.getAttribute(key);},
    'css' : function(element, key, value) { return value ? element.style[key] = value : element.style[key];},
    'prop': function(element, key, value) { return value ? element[key] = value : element[key];}
  }, function(fnName, fn) {
    ns[fnName] = function (elements, key, value) {
      return map (elements, function (element) { return fn(element, key, value); });
    };
  });

  /** on(element, eventName, callback, isCaptureBubbling)
   ** Attach event
   ** isCaptureBubbling not working in IE
   **/
  ns.on = function(elements, eventName, fn, captureBubbling) {
    (document.addEventListener) ? 
      each(elements, function (element) { element.addEventListener(eventName, fn, captureBubbling); }) :
      each(elements, function (element) { element.attachEvent("on" + eventName, fn); });
  };

  /** ready (element=document, callback)
   ** When DOM element is ready (IE9+)
   **/
  ns.ready = function (elements, fn) {
    var eventName = "DOMContentLoaded";
    (!fn) ?  ns.on (document, eventName, elements): ns.on (elements, eventName, fn);
  };


  /* Parse HTML or JSON */
  ns.parse = function (str, isJSON) {
    if(!isJSON) {
      var e = document.implementation.createHTMLDocument();
      e.body.innerHTML = str;
      return e.body.children;
    }
    else {
      return JSON.parse(str);
    }
  }

  /** Append, Prepend, Insert elements into a parent element
   ** insert (parentElements, childElements, [fnInsertBeforeElement], [isPrepending]
   ** it will do deep clone on the child elements
   ** child element can be HTML tag string
   ** insertMode : how to insert the child elements
   **   false / undefined - append (default)
   **   true - prepend
   **   function (parent, child) - customize function that
   **     shows how the child should be inserted
   **/
  ns.insert = function (parentElements, childElements, insertMode) {
    var fn = (!insertMode ? function (parentElement, childElement) {
        parentElement.appendChild(childElement);
      } : (typeof(insertMode) == "boolean" ? 
          function (parentElement, childElement) {
            /* Reversed order of children? */
            parentElement.insertBefore(childElement, parentElement.firstChild);
          } : (typeof(insertMode) =="function" ?
            insertMode :
            function () { return; }
            )
          )
      );

    var parsedElements = (typeof(childElements) == "string" || (childElements.length && typeof(childElements[0] == "string"))) ?
      map (childElements, ns.parse) : childElements;
    var toClone = (parentElements.length && !isDefined(parsedElements.length));
    var toConcat = (!isDefined(parentElements.length) && parsedElements.length);
    var toMap = (parentElements.length && parentElements.length == parsedElements.length);

    if (toConcat) {
      each (parsedElements, function (childElement) {
        fn (parentElements, childElement);
      });
    }
    else if (toClone) {
      each (parentElements, function (parentElement) {
        fn (parentElement, parsedElements.cloneNode(true));
      });
    }
    else if (toMap){
      each (parentElements, function (parentElement) {
        isDefined(parsedElements.pop(), function (e) {
          fn (parentElement, e);
        });
      });
    }
    else {
      fn (parentElements, parsedElements);
    }
    
  }
          

  /** Send AJAX request to server
   ** ajax(url, data, [usePost], successCallback, [errorCallback, progressCallback])
   ** url: string
   ** data: string or object; if it is object, it should be as following:
   **   {text: dataString, mimetype : mimetypestring, otherheader : otherheadervalue, ...}
   ** userPost [optional]: use "POST" if true, use "GET" if false or not given
   ** successCallback: function (response, statusCode)
   ** errorCallback: function (response, statusCode)
   ** progressCallback : function (response)
   **/
  ns.ajax = function(url, data, usePost, fnSuc, fnErr, fnProg) {
    if (!fnSuc) {
      fnSuc = usePost;
    }
    else if (!fnErr && typeof(usePost) == "function") {
      fnErr = fnSuc;
      fnSuc = usePost;
    }
    
    var req = new XMLHttpRequest();
    req.open((usePost ? "POST" : "GET"), url, true);

    var prop = {}, text = data;
    if (typeof(data) != "string") {
      text = data.text;
      delete data.text;
      prop = data;
    }
    eachPair (prop, function (k,v) {
      if (k != "mimetype") {
        req.setRequestHeader(k,v);
      }
      else {
        req.overrideMimeType();
      }
    });

    req.onreadystatechange = function () {
      if(req.readystate == 3 && fnProg) {
        fnProg(req.response);
      }
      else if (req.readystate == 4) {
        if (req.status == 200 || req.status == 304) {
          fnSuc(req.response, req.status);
        }
        else if(fnErr) {
          fnErr(req.response, req.status);
        }
      }
    }

    req.send(text);
  };
    

})($);

