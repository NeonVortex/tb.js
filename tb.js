/* Utilities */

/** each (collection, callback, allowsingle)
 ** collection can be single element (only if allowsingle is set to true), array, any list, or a hashmap (only if allowsingle is not set)
 ** return undefined
 **/
each = function (cl, fn, allowsingle) {
  if (cl.length) {
    for (var i = 0; i < cl.length; i++) {
      (function (_el,_i) {
       fn(_el, i);
       })(cl[i], i);
    }
  }
  else if (!allowsingle){
    for (var k in cl) {
      (function(_k, _v) {
       fn(_k, _v);
       })(k, cl[k]);
    }
  }
  else {
    fn (cl, 0);
  }
};

/** map (collection, callback, allowsingle)
 ** collection can be single element (only if allowsingle is set to true), array, any list, or a hashmap (only if allowsingle is not set)
 ** return single element if collection is single element, array if collection is not single element
 **/
map = function (cl, fn, allowsingle) {
  var result = [];
  if (cl.length) {
    for (var i = 0; i < cl.length; i++) {
      (function (_el,_i, _result) {
       _result.push(fn(_el, i));
       })(cl[i], i, result);
    }
  }
  else if (!allowsingle) {
    for (var k in cl) {
      (function(_k, _v, _result) {
       _result.push(fn(_k, _v));
       })(k, cl[k], result);
    }
  }
  else {
    result = fn(cl, 0);
  }
  return result;
};


/** chain (target, function, ...)
 ** chain operations on the target
 **/
chain = function() {
  for(var i = 1; i < arguments.length; i++) {
    (function(obj, fn) {
      fn(obj);
    })(arguments[0], arguments[i]);
  }
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

  each({
    'all':'querySelectorAll',
    'one':'querySelector',
    'id':'getElementById',
  }, function(fnName, mfnName) {
    ns[fnName] = function (element, arg) {
      return (!arg) ? document[mfnName](element) : element[mfnName](arg);
    };
  });

  each({
    'attr': function(element, key, value) { return value ? element.setAttribute(key, value) : element.getAttribute(key);},
    'css' : function(element, key, value) { return value ? element.style[key] = value : element.style[key];},
    'prop': function(element, key, value) { return value ? element[key] = value : element[key];}
  }, function(fnName, fn) {
    ns[fnName] = function (elements, key, value) {
      return map (elements, function (element) { return fn(element, key, value); }, true);
    };
  });

  /** on(element, eventName, callback, isCaptureBubbling)
   ** Attach event
   ** isCaptureBubbling not working in IE
   **/
  ns.on = function(elements, eventName, fn, captureBubbling) {
    (document.addEventListener) ? 
      each(elements, function (element) { element.addEventListener(eventName, fn, captureBubbling); }, true) :
      each(elements, function (element) { element.attachEvent("on" + eventName, fn); }, true);
  };

  /** ready (element=document, callback)
   ** When DOM element is ready (IE9+)
   **/
  ns.ready = function (elements, fn) {
    var eventName = "DOMContentLoaded";
    (!fn) ?  ns.on (document, eventName, elements): ns.on (elements, eventName, fn);
  };


   /** create ([parentElement,] elementType);
   ** Create a DOM element and append to parent element
   ** if element is not provided, it just creates an unattached element
   ** fn is function(element, parentElement) before appending
   ** return the new created element
   **/ 
  ns.create = function (parentElements, elementType, fn) {
    if (!elementType) {
      return document.createElement(parentElement);
    }
    else {
      return map (parentElements, function (parentElement) {
        var element = document.createElement(elementType);
        fn && fn(element, parentElement;
        parentElement.appendChild(element);
        return element;
      }, true)
    }
  }

  /** Append, Prepend, Insert elements into a parent element
   ** insert (parentElements, childElements, [fnInsertBeforeElement], [isPrepending]
   ** if parentElements is plural, it will do deep clone on the child elements
   ** child element can be HTML tag string
   ** insertMode : how to insert the child elements
   **   false / undefined - append (default)
   **   true - prepend
   **   function (parent, child) that returns another element - customize function that
   **     shows how the child should be inserted
   **/
  ns.insert = function (parentElements, childElements, insertMode) {
    var fn = (!insertMode ? function (parentElement, childElement) {
        parentElement.appendChild(childElement);
      } : (typeof(insertMode) == "boolean" ? 
          function (parentElement, childElement) {
            /* Reversed order of children? */
            parentElement.insertBefore(childElement, parentElement.firstChild);
          } : (typeof(insertMode) == "function" ?
            insertMode :
            return;
            )
          )
      );

    each (parentElements, function (parentElement) {
      each (childElements, function (childElement) {
        fn (parentElement, childElement);
      });
    });
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
    else if (!fnErr) && typeof(usePost) == "function") {
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
    each (prop, function (k,v) {
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
      else (req.readystate == 4) {
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

