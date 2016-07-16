CubicColorPicker
================
Demo
----

[click here to see the demo](http://codepen.io/pierre-luc/pen/GqyxqG)

Dependencies (managed with npm soon)
------------
- https://code.jquery.com/jquery-2.2.4.min.js
- https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js
- https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/utils/Draggable.min.js
- https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/DrawSVGPlugin.js?r=6
- https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/ThrowPropsPlugin.min.js

Usage
-----
```javascript
var picker = new CubicColorPicker(element);

$(picker).on('colorHasChanged', function(){
  picker.copyColor(); // copy the color into the clipboard
});
```

![preview](http://puu.sh/q44zS/5e0e96c2e0.png)
