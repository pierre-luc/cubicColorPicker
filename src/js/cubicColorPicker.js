(function(){

  var CurveSlider = function(element, options){
    var self = this;
    this.element = element;
    this.bezier = [
      {x: 10, y: 80},
      {x: 150, y: 0},
      {x: 300, y: 80}
    ];
    this.value = 0;
    this.percent = 0;

    this.colors = {
      knob: '#88CE02',
      guide: 'gray',
      line: '#7CFC00',
      min: 'orange'
    };

    if (typeof options === 'object'){
      if (typeof options.bezier === 'object'
          && options.bezier.length == 3
          && typeof options.bezier[0].x === 'number'
          && typeof options.bezier[1].x === 'number'
          && typeof options.bezier[2].x === 'number'
          && typeof options.bezier[0].y === 'number'
          && typeof options.bezier[1].y === 'number'
          && typeof options.bezier[2].y === 'number'
      ){
        this.bezier = options.bezier;
      }

      if (typeof options.colors === 'object'){
        for (var i in this.colors){
          if (options.colors[i]){
            this.colors[i] = options.colors[i];
          }
        }
      }
    }

    function makePathFromQuadraticBezier(bezier){
      return "M" + bezier[0].x + " " + bezier[0].y + " Q "
        + bezier[1].x + ' ' + bezier[1].y + ' '
        + bezier[2].x + ' ' + bezier[2].y;
    }

    this.pathStr = makePathFromQuadraticBezier(this.bezier);

    var D = document.createElement('div');

    var svg = document.createElement('svg');
    svg.setAttribute('width', '320px');
    svg.setAttribute('height', '150px');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    element.appendChild(svg);

    var xmlns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS (xmlns, "svg");

    this.path1 = document.createElementNS(xmlns, 'path');{
      this.path1.setAttributeNS(null, 'd', this.pathStr);
      this.path1.setAttributeNS(null, 'stroke', this.colors.guide);
      this.path1.setAttributeNS(null, 'stroke-dasharray', '5,5');
      this.path1.setAttributeNS(null, 'fill', 'transparent');
    }

    this.path2 = document.createElementNS(xmlns, 'path');{
      this.path2.setAttributeNS(null, 'd', this.pathStr);
      this.path2.setAttributeNS(null, 'stroke-width', '7');
      this.path2.setAttributeNS(null, 'stroke', this.colors.line);
      this.path2.setAttributeNS(null, 'fill', 'transparent');
      this.path2.setAttributeNS(null, 'stroke-linecap', 'round');
    }

    this.knob = document.createElementNS(xmlns, 'circle');{
      this.knob.setAttributeNS(null, 'class', 'knob');
      this.knob.setAttributeNS(null, 'r', '25');
      this.knob.setAttributeNS(null, 'fill', this.colors.knob);
      this.knob.setAttributeNS(null, 'stroke-width', '4');
      this.knob.setAttributeNS(null, 'stroke', '#fff');
    };

    svg.appendChild(this.path1);
    svg.appendChild(this.path2);
    svg.appendChild(this.knob);
    element.appendChild(svg);

    $(svg).css('overflow', 'visible');
    $(element).css('overflow', 'visible');

    TweenMax.set('svg', {overflow: "visible"});
    TweenMax.set(this.knob, {x: this.bezier[0].x, y: this.bezier[0].y});

    var tl = new TimelineMax({paused: true})
    .from(this.path2, 1, {
      drawSVG: "0%",
      stroke: this.colors.min,
      ease: Linear.easeNone
    })
    .to(this.knob, 1, {
      bezier: {
        type: "quadratic",
        values: this.bezier
      },
      ease: Linear.easeNone
    }, 0);

    Draggable.create(D, {
      trigger: this.knob,
      type: 'y',
      throwProps: true,
      bounds: {minY: 0, maxY: self.bezier[2].x},
      onDrag: Update,
      onThrowUpdate: Update
    });
    function Update(){
      var percent = Math.abs(this.y / self.bezier[2].x);
      self.percent = percent;

      tl.progress(percent);

      if (parseInt(this.y) != parseInt(self.value)){
        $(self).trigger('valueHasChanged');
      }
      self.value = this.y;
    };

    TweenMax.to(this.path1, 0.5, {
      strokeDashoffset: -10,
      repeat: -1,
      ease: Linear.easeNone
    })
  };
  CurveSlider.prototype.changeKnobColor = function(color){
    this.colors.knob = color;
    this.knob.setAttributeNS(null, 'fill', this.colors.knob);
  }
  CurveSlider.prototype.changeLineColor = function(color){
    this.colors.line = color;
    this.path2.setAttributeNS(null, 'stroke', this.colors.line);
  }

  var gradientIMG = new Image();{
gradientIMG.src = 'data:image/  png;base64,iVBORw0KGgoAAAANSUhEUgAABCwAAAMACAIAAABguWEEAAAVT0lEQVR4XuzXsWqjQRCEwf2h3/+V9wJz0SUWCFqnrkKBUqOZ8X7Pvfesguc5Z/Xj43NPBwDkDIPn7xcAAEQIiBAAABECIgQAABECIgQAQISACAEAQISACAEAECEgQgAARAiIEAAARAiIEAAAEQIiBAAAEQIiBABAhIAIAQBAhIAIAQAQISBCAABECIgQAABECIgQAAARAiIEAAARAiIEAECEgAgBAECEIEIAABAhIELgqwFAzix4MUIAABAhIEIAAEQIiBAAAEQIiBAAABECIgQAQISACAEAQISACAEAECEgQgAAECEgQgAARAiIEAAARAiIEAAAEQIiBABAhIAIAQBAhIAIAQAQISBCAAAQISBCAABECIgQAABECIgQAAARAiIEAECEgAgBAHgncmbB/x4hAAAiBEQIAAAiBEQIAIAIARECACBCQIQAACBCQIQAAIgQECEAAIgQECEAACIERAgAACIERAgAgAgBEQIAIEJAhAAAIEJAhAAAiBAQIQAAiBAQIQAAIgRECAAAIgRECACACAERAgAgQkCEAAAgQkCEAACIEBAh/BYAQM4sWIgQAAARAiIEAECEgAgBAECEgAgBABAhIEIAABAhIEIAAEQIiBAAAEQIiBAAABECIgQAQISACAEAQISACAEAECEgQgAAECEgQgAARAiIEAAARAiIEAAAEQIiBABAhIAIAQBAhIAIAQAQISBCAAAQISBCAOBjQc4sKEQIAAAiBBECAIAIARECACBCQIQAACBCQIQAAIgQECEAAIgQECEAACIERAgAgAgBEQIAgAgBEQIAIEJAhAAAIEJAhAAAiBAQIQAAiBAQIQAAIgRECACACAERAgCACAERAgAgQkCEAAAgQkCEAACIEBAhAACIEDiNCAEAIGcUfGyEAACIEBAhAACIEBAhAAAiBEQIAAAiBEQIAIAIARECACBCQIQAACBCQIQAAIgQECEAAIgQECEAACIERAgAACIERAgAgAgBEQIAIEJAhAAAIEJAhAAAiBAQIQAAiBAQIQAAIgRECAAAIgRECACACAERAsAGIGcW/CZCAAAQISBCAABECIgQAABECIgQAAARAiIEAIAcECEAAIgQECEAACIERAgAACIERAgAgAgBEQIAgAgBEQIAIEJAhAAA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ADkARAgAiBAARAgAIgQAEQIAIuRfABAhACBCABAhAIgQAEQIAIgQAEQIACIEABECACIEABECgAgBQIQAIEIAECEAIEIAECEAiBAARAgAiBCAP8RzFQCQ2wGACAFAhAAgQgAQIQCIEAAQIQCIEABECAAiBABECAAiBAARAoAIAQARAoAIAUCEACBCABAhAIgQABAhAIgQAEQIACIEAEQIACIEABECgAgBgFwBACIEABECgAgBABECgAgBQIQAIEIAQIQAIEIAECEAiBCAX4LcJABECAAiBAARAoAIAUCEAIAIAUCEACBCABAhACBCABAhAIgQAEQIAORmAYgQABAhAIgQAEQIACIEAEQIACIEABECgAgBABECgAgBQIQAIEIAECEAiBAAECEAiBAARAgAIgQARAgAIgQAEQKACAEAEQKACAFAhABN8FwFAPwcIQCIEAAQIQCIEABECAAiBABECAAiBAARAoAIAQARAoAIAUCEACBCABAhAIgQABAhAIgQAEQIACIEAEQIACIEABECgAgBABECIEIAQIQAIEIAECEAiBAAECEAiBAARAgAIgQARAgAIgQAEQKACAFAhAAgQoCvB+QmASBCABAhAIgQAEQIACIEAEQIACIEABECgAgBABECgAgBQIQAIEIAIPdOABAhAIgQAEQIAIgQAEQIACIEABECACIEQIQAgAgBQIQAIEIAECEAIEIAECEAiBAARAgAiBAARAgAIgQAEQKACAFAhACACAFAhAAgQuBjAM9VAEDuAwAgQgAQIQCIEAAQIQCIEABECAAiBAARAoAIAQARAoAIAUCEACBCAECEACBCABAhAIgQABAhADwHACIEABECgAgBQIQAgAgBQIQAIEIAECEAIEIAECEAiBAARAgAIgQAEQIAIgQAEQKACAFAhACACAFAhPBmAHKTABAhAIgQAEQIACIEABECACIEABECgAgBQIQAgAgBQIQAIEIAECEAkPtiAIgQABAhAIgQAEQIACIEABECgAgBABECgAgBQIQAIEIAQIQAIEIAECEAiBAAECEAIgQARAgAIgQAEQKACAEAEQKACAFAhAAgQgBAhPwMgFqEAECuBQARAoAIAUCEAIAIAUCEACBCABAhACBCABAhAIgQAEQIAIgQAEQIACIEABECgAgBQIQAgAgBQIQAIEIAECEAIEIAECEAiBAARAgAiBAAEQIAIgQAEQKACAFAhACACAFAhAAgQgAQIQAgQgAQIQCIEABEyDIAcpsAeK4CAHKTABAhAIgQAEQIACIEABECACIEABECgAgBQIQAgAgBQIQAIEIAECEA8B2mVKtHyVbgcwAAABN0RVh0QXV0aG9yAFNoYWRvd0Nhc3RlcgauzeUAAAAASUVORK5CYII=';}
  var gradientIMGIsLoaded = false;
  gradientIMG.crossOrigin = 'anonymous';
  gradientIMG.onload = function(){
    gradientIMGIsLoaded = true;
  };

  function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
      // IE specific code path to prevent textarea being shown while dialog is visible.
      return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      } catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  function rgba2hex(rgb){
     rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
   return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }

  function div(className){
    var d = document.createElement('div');
    d.setAttribute('class', className);
    return d;
  }

  function makeDOMPicker(root){
    var cube = div('cube');
    cube.appendChild(div('front'));
    cube.appendChild(div('back'));
    cube.appendChild(div('top'));
    cube.appendChild(div('bottom'));
    cube.appendChild(div('left'));
    cube.appendChild(div('right'));

    root.setAttribute('class', ('wrap' + ' ' + root.getAttribute('class')).trim());
    root.appendChild(div('color'));
    root.appendChild(cube);
  }

  var Color = function(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.rgba = null;
    this.toRGBA();
  };
  Color.prototype.toRGBA = function(){
    this.rgba = 'rgba('
      + this.r + ','
      + this.g + ','
      + this.b + ','
      + String(this.a).substring(0, 4)
      +')'
    ;
    return this.rgba;
  };
  Color.prototype.toHex = function(){
    this.toRGBA();
    return rgba2hex(this.rgba);
  };


  var Palette = function(elementPicker){
    this.picker = elementPicker;

    this.element = div('palette');
    this.element.appendChild(div('hex'));
    this.element.appendChild(div('collection'));
    this.picker.appendChild(this.element);
    this.selectedColor = null;
    this.colors = new Map();
  };
  Palette.prototype.addColor = function(colorValue){
    var self = this;

    function changeColor(element){
      self.selectedColor = self.colors.get(element);
      $(self).trigger('colorHasChanged');
    }

    function enter(e){
      var color = self.colors.get(e.toElement);
      var colorStr = color.a == 1 ? color.toHex() : color.toRGBA();
      $(self.element).find('.hex').html(colorStr);
      $(self.element).addClass('show-value');
    }
    function leave(){
      $(self.element).removeClass('show-value');
    }
    function click(e){changeColor(e.toElement);}

    var color = div('color-item');
    var value = div('value');
    color.appendChild(value);

    $(value).css('background-color', colorValue.toRGBA());
    this.element.appendChild(color);

    $(value).on('mouseenter', enter);
    $(value).on('mouseleave', leave);
    $(value).on('click', click);

    var limit = this.colors.size < 12 ? this.colors.size : 12;
    this.colors.set(value, colorValue);

    changeColor(value);

    var offset = 0;
    if (limit >= 12){
      offset = 1;
    }
    var angle = 45 - 180 - (- 25 * (limit - offset) + (25 / 2) * limit);

    var timer = setInterval(function(){
      clearInterval(timer);
      $(color).css('transform', 'rotate(' + angle + 'deg)');

      if (limit >= 12){
          var $e = $(self.element).find('.collection .color-item:first-child');
          $e.find('.value').off('mouseenter', enter);
          $e.find('.value').off('mouseleave', leave);
          $e.find('.value').off('click', click);
          $e.remove();
          self.colors.delete(self.colors.keys().next().value);
        }

      var _timer = setInterval(function(){
        clearInterval(_timer);
        self.element.removeChild(color);
        color.removeAttribute('style');

        $(self.element).find('.collection').append(color);
        $(self.element).find('.collection')
          .css('transform', 'rotate(' + (225 - 25 * (limit - offset) / 2) + 'deg)');
      }, 250);
    }, 50);
  };

  var pickerMap = new Map();

  var CubicColorPicker = function(element){
    if (typeof pickerMap.get(element) !== 'undefined'){
      throw new Error('the picker is already plugged');
    }
    pickerMap.set(element, this);
    var self = this;
    this.element = element;
    this.minimized = false;
    this.palette = new Palette(this.element);
    makeDOMPicker(element);

    var opacitySliderElement = div('opacity-slider');{
      self.opacitySlider = new CurveSlider(opacitySliderElement,{
        colors: {
          min: 'transparent'
        }
      });
      var cube = $(self.element).find('.cube');
      $(self.opacitySlider).on('valueHasChanged', function(){
        self.currentColor.a = 1 - this.percent;
        cube.css('opacity', self.currentColor.a );
        self.rgbMode = self.currentColor.a < 0.98;
        self.update();
      })
    }
    element.appendChild(opacitySliderElement);

    this.rotateR = 45 / 2;
    this.canRotate = 'xr';

    this.seletedColor = null;
    $(this.palette).on('colorHasChanged', function(){
      self.selectedColor = self.palette.selectedColor;
      $(self).trigger('colorHasChanged');
    });

    this.mouse = {
      isDown: false,
      coords: {
        xPercent: 50,
        yPercent: 50,
        oldXPercent: 50,
        oldYPercent: 50,

        xDegree: 0,
        yDegree: 0,
        oldXDegree: 0,
        oldYDegree: 0,

        gradientOffsets: {
          x: 0,
          y: 0
        }
      },

      motionless: {
        counter: 0,
        state: false,
        timer: null
      },

      callbacks: {
        choose: function(e, notAddColor){
            self.selectedColor = self.currentColor;
            if (typeof notAddColor === 'undefined'){
              self.palette.addColor(self.selectedColor);
            }
        },
        move: function(e){
          var w = $(this).width();
          var faceClass = $(e.toElement).attr('class');
            if (faceClass == self.currentFace){
              self.computeRotation(e.offsetX, e.offsetY, w);
            } else {
              var offsets = $(e.toElement).css('background-position').split('px');

              self.mouse.coords.gradientOffsets.x = parseInt(offsets[0]);
              self.mouse.coords.gradientOffsets.y = parseInt(offsets[1]);

              var color;
              if (faceClass == 'top'){
                color = self.context2d.getImageData(e.offsetX - self.mouse.coords.gradientOffsets.x, e.offsetY + self.mouse.coords.gradientOffsets.y / 2, 1, 1);
              } else {
                color = self.context2d.getImageData(e.offsetX - self.mouse.coords.gradientOffsets.x, e.offsetY + self.mouse.coords.gradientOffsets.y * 2, 1, 1);
              }

              self.currentColor = new Color(
                color.data[0],
                color.data[1],
                color.data[2],
                self.currentColor.a
              );
              self.update();
            }

            self.mouse.isDown = e.buttons==1;

            if (self.mouse.isDown){self.mouse.callbacks.choose(e, 'notAddColor');}
        }
      }
    };


    this.mouse.motionless.timer = setInterval(function(){
      if (self.mouse.coords.xPercent != self.mouse.coords.oldXPercent){
        self.mouse.coords.oldXPercent = self.mouse.coords.xPercent;
        self.mouse.motionless.counter = 0;
        return;
      }
      if (self.mouse.coords.oldXPercent == self.mouse.coords.xPercent){
        self.mouse.motionless.counter++;
      }

      var getMotionless = function(){
        return !self.mouse.isDown && self.mouse.motionless.counter == 1;
      }
      self.mouse.motionless.state = getMotionless();

      if (self.mouse.motionless.state){
        if (self.canRotate){
           self.switchFace();
           self.mouse.motionless.counter = 0;
        }
      }
    }, 100);

    this.currentFace = 'left';
    this.currentColor = {r: 0, g: 0, b: 0, a: 1};
    this.rgbMode = false;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 837;
    this.canvas.height = 600;
    this.context2d = this.canvas.getContext('2d');

    if (gradientIMGIsLoaded){
      self.context2d.drawImage(gradientIMG, 0, 0, 837, 600);
    } else {
      gradientIMG.onload = function(){
        self.context2d.drawImage(gradientIMG, 0, 0, 837, 600);
      }
    }

    this.graph = {
      front: {
        angle: 45 / 2,
        xl: 'left',
        xr: 'right',
        switch: {
          a: 45 / 2,
          b: 360 + 45 / 2
        }
      },
      left: {
        angle: 90 + 45 / 2,
        xl: 'back',
        xr: 'front'
      },
      back: {
        angle: 180 + 45 / 2,
        xl: 'right',
        xr: 'left'
      },
      right: {
        angle: 270 + 45 / 2,
        switch: {
          a: 270 + 45 / 2,
          b: -90 + 45 / 2
        },
        xl: 'front',
        xr: 'back'
      },
    };

    this.switchFace();

    $(self.element).find('.cube').mousemove(self.mouse.callbacks.move);
    $(self.element).find('.cube').click(self.mouse.callbacks.choose);

  };

  CubicColorPicker.prototype.update = function(){
    var color = this.rgbMode ? this.currentColor.toRGBA() : this.currentColor.toHex();

    $(this.element).find('.color').html(color);
    $(this.element).css('border-color', color);
    this.opacitySlider.changeKnobColor(color);
    this.opacitySlider.changeLineColor(color);
  };

  CubicColorPicker.prototype.rotate = function(x, y){
    var self = this;
    $(this.element).find('.cube').css({
      transform: 'rotateX(' + y + 'deg) rotateY(' + x + 'deg)'
    });
  }

  CubicColorPicker.prototype.computeRotation = function(x, y, radius){
    this.mouse.coords.xPercent = x * 100 / radius;
    this.mouse.coords.yPercent = y * 100 / radius;
    this.mouse.coords.oldXDegree = this.mouse.coords.xDegree;
    this.mouse.coords.oldYDegree = this.mouse.coords.yDegree;

    var angle = this.graph[this.currentFace].angle;

    if (this.graph[this.currentFace].switchAngle){
      if (!this.graph.switched){
        angle = this.graph[this.currentFace].switchAngle;
        this.graph.switched = true;
      }
    } else {
      this.graph.switched = false;
    }

    this.mouse.coords.xDegree = (angle - this.mouse.coords.xPercent * 45 / 100);
    this.mouse.coords.yDegree = -(45 / 2 - this.mouse.coords.yPercent * 45 / 100);

    var offsets = $(this.element).find('.' + this.currentFace).css('background-position').split('px');
    this.mouse.coords.gradientOffsets = {
      x: parseInt(offsets[0]),
      y: parseInt(offsets[1])
    }

    var color = this.context2d.getImageData(x - this.mouse.coords.gradientOffsets.x, y + this.mouse.coords.gradientOffsets.y / 2, 1, 1);

    this.currentColor = new Color(
      color.data[0],
      color.data[1],
      color.data[2],
      this.currentColor.a
    );
    this.update();
    if (5 < this.mouse.coords.xPercent && this.mouse.coords.xPercent < 95 && 5 < this.mouse.coords.yPercent && this.mouse.coords.yPercent < 95){
      this.rotate(this.mouse.coords.xDegree, this.mouse.coords.yDegree);
      this.canRotate = false;
    }
  };
  CubicColorPicker.prototype.switchFace = function(){
      var self = this;
      if (!this.currentFace || !this.canRotate){return;}

      if (this.graph[this.currentFace].switch){
        var next = this.graph[this.currentFace][this.canRotate];
        if (this.graph[next].switch){
          this.graph[next].angle = this.graph[next].switch.b;
        }
      }

      var hoverTimer = null;

      function getMousedown(){return self.mouse.isDown;}

      var createTimer = function(){
        if (hoverTimer !== null){return;}

        hoverTimer = setInterval(function(){
          clearInterval(hoverTimer);
          if (getMousedown()){
            hoverTimer = null;
            createTimer();
          } else {
            self.switchFace();
          }
        }, 500);
      }

      function mouseenterLeft(){
        createTimer();
        self.canRotate = 'xl';
      }
      function mouseenterRight(){
        createTimer();
        self.canRotate = 'xr';
      }

      function mouseleave(){
        clearInterval(hoverTimer);
        hoverTimer = null;
        self.canRotate = false;
      }

      $(self.element).find('.' + self.graph[self.currentFace].xl).off('mouseenter', mouseenterLeft);
      $(self.element).find('.' + self.graph[self.currentFace].xl).off('mouseleave', mouseleave);
      $(self.element).find('.' + self.graph[self.currentFace].xr).off('mouseenter', mouseenterRight);
      $(self.element).find('.' + self.graph[self.currentFace].xr).off('mouseleave', mouseleave);
      self.currentFace = self.graph[self.currentFace][self.canRotate];
      $(self.element).find('.' + self.graph[self.currentFace].xl).on('mouseenter', mouseenterLeft);
      $(self.element).find('.' + self.graph[self.currentFace].xl).on('mouseleave', mouseleave);
      $(self.element).find('.' + self.graph[self.currentFace].xr).on('mouseenter', mouseenterRight);
      $(self.element).find('.' + self.graph[self.currentFace].xr).on('mouseleave', mouseleave);

      self.canRotate = false;
      var w = $(self.element).find('.cube').width();
      $(self.element).find('.cube').addClass('rotate');
      var timer = setInterval(function(){
        clearInterval(timer);
        $(self.element).find('.cube').removeClass('rotate');
        if (self.graph[self.currentFace].switch){
          self.graph[self.currentFace].angle = self.graph[self.currentFace].switch.a;
        }
      }, 500);

      self.computeRotation(73, self.mouse.coords.yPercent * w / 100, w);
      self.rotate(self.mouse.coords.xDegree, self.mouse.coords.yDegree);
  };

  CubicColorPicker.prototype.copyColor = function(){
    var color = this.selectedColor.a == 1 ? this.selectedColor.toHex() : this.selectedColor.toRGBA();
    console.log(color);
    copyToClipboard(color.toUpperCase());
  };

  if (typeof window.CubicColorPicker === 'undefined'){
    window.CubicColorPicker = CubicColorPicker;
  }
})();
