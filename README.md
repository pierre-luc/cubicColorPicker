CubicColorPicker
================

Installation
------------
```bash
npm install cubicColorPicker
```

Demo
----

[click here to see the demo](http://codepen.io/pierre-luc/full/GqyxqG)

Dependencies
------------
````html
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/gsap/src/minified/TimelineMax.min.js"></script>
<script src="node_modules/gsap/src/minified/TweenMax.min.js"></script>
<script src="node_modules/gsap/src/minified/utils/Draggable.min.js"></script>

<link rel="stylesheet" href="dist/css/cubicColorPicker.css">
<script src="dist/js/cubicColorPicker.min.js"></script>
```

Usage
-----
```javascript
var picker = new CubicColorPicker(element);

$(picker).on('colorHasChanged', function(){
  picker.copyColor(); // copy the color into the clipboard
});
```

![preview](http://puu.sh/q44zS/5e0e96c2e0.png)
