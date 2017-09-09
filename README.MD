A lightweight and fast Javascript library for Front End Development

Features:

- Fast(query CSS selectors are experimentally than jQuery due to no object wrapping overhead and no compatibility check; 
  thus only IE9+ is supported)

- All functions work with single target as well as collection (like jQuery, except query function)

- No object mapping means all functions are not instance functions.

  In jQuery you might have 
  
      $('#body-container').css('color', 'black');

  Using tbjs, you will do

      $.css($('#body-container), 'color', 'black');



Utilities
all utility functions resides in global namespace as they are very commonly used and should considered built-in

**each** - Apply callback on each element in the collection.
  function (collection, callback, [allowsingle])
  collection can be single element (only if allowsingle is set to true), array, any list, or a hashmap (only if allowsingle is not set)
  return undefined


**map** - Map collection by callback function
  function (collection, callback, [allowsingle])
  collection can be single element (only if allowsingle is set to true), array, any list, or a hashmap (only if allowsingle is not set)
  return single element if collection is single element, array if collection is not single element


**chain** - Chain operations on the target
  function (target, function, ...)


DOM Handling

$ is the namespace for all DOM operation functions 
$ itself is a function too. `$(sel)` is equivalent to `$.all(document, sel)`;


**$.all** - Get all matching elements (CSS Selector applies) (IE8+)

  function ([element = document], selectorString) 
  return a nodelist;
 
**$.one** - Get first matching element (of all) (IE8+)
  function ([element = document], selectorString) 
  return a node;

**$.id** - Get element by ID
  function ([element = document], idWithoutPrefix#) 
  return a node;
 
**$.ready** - Callback when DOM element(s) is/are ready (IE9+)
  function([elements = document], callback)

**$.on** - Attach event listener to element(s)
  function(elements, eventName, callback, isCaptureBubbling)
  isCaptureBubbling not working in IE


**$.attr** - Get/Set attribute of element(s)
  function (elements, attributeName [, attributeValue]
  return undefined if setting, attributeValue(s) if getting

**$.css** - Get/Set css style of element(s)

**$.prop** - Get/Set property of element(s)
  
**$.ajax** - Send AJAX request to server
  function (url, data, [usePost], successCallback, [errorCallback, progressCallback])
  url: string
  data: string or object; if it is object, it should be as following:
    {text: dataString, mimetype : mimetypestring, otherheader : otherheadervalue, ...}
  userPost [optional]: use "POST" if true, use "GET" if false or not given
  successCallback: function (response, statusCode)
  errorCallback [optional]: function (response, statusCode)
  progressCallback [optional]: function (response)
  
