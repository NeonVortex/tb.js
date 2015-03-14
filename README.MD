A lightweight and fast Javascript library for Front End Development

Feature:
- Fast(er than jQuery)
- All functions work with single target as well as collection (like jQuery but no object wrapping overhead, except query function)



Utilities
all utility functions resides in global namespace as they are very commonly used and should considered built-in

each - Apply callback on each element in the collection.
  function (collection, callback, nohash)
  collection can be single element (only if nohash is set to true), array, any list, or a hashmap (only if nohash is not set)
  return undefined


map - Map collection by callback function
  function (collection, callback, nohash)
  collection can be single element (only if nohash is set to true), array, any list, or a hashmap (only if nohash is not set)
  return single element if collection is single element, array if collection is not single element


chain - Chain operations on the target
  function (target, function, ...)


DOM Handling
$ is the namespace for all DOM operation functions; itself is also a function which is alias to $.all


$.all - Get all matching elements (CSS Selector applies) (IE8+)
  function (element = document, selectorString) 
  return a nodelist;
 
$.one - Get first matching element (of all) (IE8+)
  function (element = document, selectorString) 
  return a node;

$.id - Get element by ID
  function (element = document, idWithoutPrefix#) 
  return a node;
 
$.ready - Callback when DOM element(s) is/are ready (IE9+)
  function(elements = document, callback)

$.on - Attach event listener to element(s)
  function(elements, eventName, callback, isCaptureBubbling)
  isCaptureBubbling not working in IE


$.attr - Get/Set attribute of element(s)
  function (elements, attributeName [, attributeValue]
  return undefined if setting, attributeValue(s) if getting

$.css - Get/Set css style of element(s)
$.prop - Get/Set property of element(s)
  
$.ajax - Send AJAX request to server
  function (url, data, [usePost], successCallback, [errorCallback, progressCallback])
  url: string
  data: string or object; if it is object, it should be as following:
    {text: dataString, mimetype : mimetypestring, otherheader : otherheadervalue, ...}
  userPost [optional]: use "POST" if true, use "GET" if false or not given
  successCallback: function (response, statusCode)
  errorCallback [optional]: function (response, statusCode)
  progressCallback [optional]: function (response)
  
