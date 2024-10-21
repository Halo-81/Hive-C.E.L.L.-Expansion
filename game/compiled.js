(function() {
  window.featureDetect = function() {
    var e;
    try {
      localStorage.setItem('test', 'testVal');
      if (localStorage.test !== 'testVal') {
        throw new Error;
      }
      localStorage.removeItem('test');
    } catch (_error) {
      e = _error;
      $('body').append("<div class=\"col-lg-4 center\">\n  <h2>Browser Problems</h2>\n  <div>Your browser won't currently run the game due to a lack of <em>Local Storage</em>. Depending on your browser, you have a couple of options.</div>\n  <ul>\n    <li><strong>First</strong> - Check to see if your browser is asking if you want to allow this site to store information on your computer, a popup or a bar along the top of the window. If it is, say yes and refresh the page.</li>\n    <li><strong>Firefox</strong> - Options > Advanced - > Network = un-check \"Tell me when a website asks to store data for offline use\"</li>\n    <li><strong>Chrome</strong> - Settings > Show Advanced Settings > Privacy > Content Settings > Cookies > Allow local data to be set.</li>\n    <li><strong>Other</strong> - Unsure. You need to enable Local Storage. It's probably somewhere under the privacy settings in your browser.</li>\n  </ul>\n</div>");
      return;
    }
    return true;
  };

}).call(this);

(function() {
  var addAttrs, addBackground, optionList, ref, textLine;

  String.rate = function(number) {
    switch (number) {
      case 1 / 4:
        return 'a quarter';
      case 1 / 3:
        return 'a third';
      case 1 / 2:
        return 'half';
      case 2 / 3:
        return 'two thirds';
      case 1:
        return '';
      case 2:
        return 'twice';
      case 3:
        return 'three times';
      default:
        return number.toString();
    }
  };

  Object.defineProperty(Number.prototype, 'toWord', {
    value: function() {
      return {
        0: 'zero',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight',
        9: 'nine',
        10: 'ten',
        11: 'eleven'
      }[this] || Number(this).toString();
    }
  });

  Object.defineProperty(Number.prototype, 'rounded', {
    value: function() {
      return Number(this).toFixed(1).replace(".0", "");
    }
  });

  Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  });

  Object.defineProperty(Array.prototype, 'wordJoin', {
    value: function() {
      var str;
      str = this.slice(0, -1).join(', ');
      str += ' and ' + this[this.length - 1];
      return str;
    }
  });

  Math.sum = function(items) {
    var j, len, sum, val;
    sum = 0;
    for (j = 0, len = items.length; j < len; j++) {
      val = items[j];
      sum += val;
    }
    return sum;
  };

  Math.sumObject = function(items) {
    var key, sum, val;
    sum = 0;
    for (key in items) {
      val = items[key];
      sum += val;
    }
    return sum;
  };

  Math.randomRound = function(number) {
    var result;
    result = Math.floor(number);
    if (Math.random() < number % 1) {
      result += 1;
    }
    return result;
  };

  Math.keyChoice = function(items) {
    var choice;
    if (items instanceof Array) {
      choice = Math.floor(Math.random() * items.length);
      return choice;
    }
    return Math.choice(Object.keys(items));
  };

  Math.choice = function(items) {
    return items[Math.keyChoice(items)];
  };

  Math.otherChoice = function(items, last) {
    var choice;
    choice = Math.choice(items);
    while (choice === last) {
      choice = Math.choice(items);
    }
    return choice;
  };

  Math.weightedChoice = function(weights) {
    var choice, key, sum, value;
    sum = Math.sumObject(weights);
    choice = Math.floor(Math.random() * sum);
    for (key in weights) {
      value = weights[key];
      choice -= value;
      if (choice <= 0) {
        return key;
      }
    }
  };

  String.randomName = function(names, maxLength) {
    var chains, newLetter, ref, start, string;
    if (maxLength == null) {
      maxLength = 7;
    }
    ref = String.randomName.chains(names), chains = ref[0], start = ref[1];
    string = Math.choice(start).split('');
    newLetter = function() {
      var last, next;
      last = string[string.length - 3] + string[string.length - 2] + string[string.length - 1];
      next = Math.choice(chains[last]);
      return next;
    };
    while (string[string.length - 1] && string.length <= maxLength) {
      string.push(newLetter());
    }
    string.pop();
    string[0] = string[0].toUpperCase();
    return string.join('');
  };

  String.randomName.chains = function(names) {
    var chains, start;
    chains = {};
    start = [];
    names.forEach(function(name) {
      var i, j, next, ref, results, token;
      start.push(name.substr(0, 3).toLowerCase());
      results = [];
      for (i = j = 0, ref = name.length - 3; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        token = name.substr(i, 3).toLowerCase();
        next = name[i + 3];
        chains[token] || (chains[token] = []);
        results.push(chains[token].push(next != null ? next.toLowerCase() : void 0));
      }
      return results;
    });
    return [chains, start];
  };


  /*
  Formatting guide:
  
    New <page>
      || attr="val"
      <div>Tags will be appended to the page, until a text starts</div>
  
    Start new <text>
      -- Can be followed by contents
      Each new line after this starts a new paragraph.
      <button>Any line that starts with a tag won't be wrapped in a paragraph.</button>
      `Natalie This text will be quoted in Natalie's colors`
  
      Extra new lines will be ignored.
      -- After a text has started in a page, any following texts will keep the current background / character art.
  
    Start full <text>
      --|
  
    Continue last <text>
      -->
  
    Quote text:
    `D quoted text` transforms to <q class="D">quoted text</q>
   */

  $.render = function(element) {
    var index, j, len, line, lines, page, pages, parent, ref;
    if (!element || typeof element !== 'string') {
      return element || $('');
    }
    pages = $('<div></div>');
    ref = lines = element.split("\n");
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      line = ref[index];
      line = line.trim().replace(/`([a-zA-Z]*) (.+?)`/g, "<q class='$1'>$2</q>");
      if (line.match(/^\|\|/)) {
        pages.append(page = $('<page></page>'));
        addAttrs(page, line);
        addBackground(page, pages);
      } else if (line.match(/--/)) {
        textLine(line, pages);
      } else if (line) {
        page = pages.children().last();
        parent = page.find('text').length ? page.find('text') : page;
        parent.append('<p>' + line + '</p>');
      }
    }
    if (pages.children().length) {
      return pages.children();
    } else {
      return false;
    }
  };

  textLine = function(line, pages) {
    var page, text;
    page = pages.children().last();
    if (page.find('text').length) {
      page = page.clone();
      page.find('text').remove();
      pages.append(page);
    }
    text = line.match(/^-->/) ? pages.find('text').last().clone() : line.match(/^--\|/) ? $('<text class="full"></text>') : $('<text></text>');
    page.append(text);
    line = line.replace(/--\|?>?/, '');
    return text.append('<p>' + line + '</p>');
  };

  addAttrs = function(element, text) {
    var attr, j, len, match, ref, results;
    ref = text.match(/\w+=".+?"/g) || [];
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      attr = ref[j];
      match = attr.match(/(\w+)="(.+?)"/);
      results.push(element.attr(match[1], match[2]));
    }
    return results;
  };

  addBackground = function(element) {
    var bg;
    if (element.attr('bg')) {
      bg = 'url("game/images/' + element.attr('bg') + '.jpg")';
    } else {
      bg = element.prev().css('background-image');
    }
    if (bg && bg !== 'none') {
      return element.css('background-image', bg);
    }
  };

  window.toggle = function(options, selected) {
    options = optionList(options, selected);
    return "<span class=\"btn-group toggle\">" + (options.join('')) + "</span>";
  };

  window.bigOptions = function(options, selected) {
    var join;
    options = optionList(options, selected);
    join = '</div><div class="col-md-4 col-xs-6">';
    return "<div class=\"bigOptions row\"><div class=\"col-md-4 col-xs-6\">" + (options.join(join)) + "</div></div>";
  };

  window.dropdown = function(options, selected) {
    var lis;
    lis = optionList(options, selected);
    return "<button type=\"button\" class=\"btn btn-default dropdown-toggle inline\">" + options[selected] + "</button><span class=\"dropdown-menu inline\"><span>" + (lis.join('</span><span>')) + "</span></span>";
  };

  window.options = function(texts, titles) {
    var buttons, index, text;
    if (titles == null) {
      titles = [];
    }
    buttons = (function() {
      var j, len, results;
      results = [];
      for (index = j = 0, len = texts.length; j < len; index = ++j) {
        text = texts[index];
        results.push("<button class=\"btn btn-default\" title=\"" + (titles[index] || "") + "\">" + text + "</button>");
      }
      return results;
    })();
    return "<options>" + (buttons.join("")) + "</options>";
  };

  optionList = function(options, selected) {
    var _id, checked, key, name, option;
    name = 'o-' + Math.random();
    options = (function() {
      var results;
      results = [];
      for (key in options) {
        option = options[key];
        _id = 'o-' + Math.random();
        checked = selected === key ? 'checked' : '';
        results.push("<input type=\"radio\" id=\"" + _id + "\" value=\"" + key + "\" " + checked + " name=\"" + name + "\"><label for=\"" + _id + "\">" + option + "</label>");
      }
      return results;
    })();
    return options;
  };


  /*
    Based on dragScroll by James Climer. https://github.com/jaclimer/JQuery-DraggScroll
   */

  if ((ref = $.fn) != null) {
    ref.dragScroll = function(bounds) {
      var $scrollArea, dragging;
      dragging = false;
      $scrollArea = $(this);
      $scrollArea.on('mousedown touchstart', function(e) {
        e.preventDefault();
        return dragging = {
          x: e.pageX,
          y: e.pageY,
          top: $(this).scrollTop(),
          left: $(this).scrollLeft()
        };
      });
      $("body").on('mouseup mouseleave touchend touchcancel', function() {
        return dragging = false;
      });
      return $("body").on('mousemove touchmove', function(e) {
        if (!dragging) {
          return;
        }
        $scrollArea.scrollLeft(Math.min(bounds.right, Math.max(bounds.left, dragging.left - e.pageX + dragging.x)));
        return $scrollArea.scrollTop(Math.min(bounds.bottom, Math.max(bounds.top, dragging.top - e.pageY + dragging.y)));
      });
    };
  }

  Date.prototype.addDays = function(days) {
    var dat;
    dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  };

}).call(this);

(function() {
  var Collection, GameObject, isGameObjectClass, partMatches, simpleMatch,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  isGameObjectClass = function(obj) {
    var ref;
    return typeof obj === 'function' && ((ref = obj.prototype) != null ? ref.valid : void 0);
  };

  window.GameObject = GameObject = (function() {
    GameObject.schema = {
      strict: true
    };

    function GameObject(data, objects, path) {
      var key, value;
      if (objects != null) {
        objects.push(this);
      }
      for (key in this) {
        value = this[key];
        if (key !== 'constructor') {
          if (value instanceof Collection) {
            this[key] = Object.create(this[key]);
            if (objects) {
              this[key].init(value, objects, path + '|' + key);
            }
          } else if (isGameObjectClass(value)) {
            this[key] = new value(null, objects, path + '|' + key);
          }
        }
      }
      for (key in data) {
        value = data[key];
        if (this[key] instanceof Collection) {
          $.extend(this[key], value);
        } else {
          this[key] = value;
        }
      }
    }

    GameObject.prototype.className = function() {
      var target;
      target = this.constructor;
      while (target.schema.type !== target) {
        target = target.__super__.constructor;
      }
      if (target === this.constructor) {
        return target.name;
      }
      return target.name + '|' + this.constructor.name;
    };

    GameObject.prototype.valid = function() {
      var _class, level, ref, result;
      level = this.constructor;
      while (!level.schema) {
        level = (ref = level.__super__) != null ? ref.constructor : void 0;
      }
      result = SchemaInspector.validate(level.schema, this);
      if (!result.valid) {
        _class = this.constructor.__super__.constructor.name;
        throw new Error(_class + " " + this.constructor.name + " is invalid: \n" + result.format());
      }
      return true;
    };

    GameObject.prototype["export"] = function(ids, paths, path) {
      var data, key, value;
      if (indexOf.call(ids, this) >= 0) {
        return paths[ids.indexOf(this)];
      }
      ids.push(this);
      paths.push(path);
      data = {
        '_': this.className()
      };
      for (key in this) {
        if (!hasProp.call(this, key)) continue;
        value = this[key];
        if (value instanceof Collection || value instanceof GameObject) {
          value = value["export"](ids, paths, path + '|' + key);
        }
        if ((value != null) && typeof value !== 'function') {
          data[key] = value;
          if (typeof data[key] === 'object' && $.isEmptyObject(data[key])) {
            delete data[key];
          }
        }
      }
      return data;
    };

    GameObject.prototype.matches = function(conditions, context) {
      if (typeof conditions === 'string') {
        return g.getItem(conditions) === this;
      }
      return partMatches(this, conditions, context);
    };

    return GameObject;

  })();

  window.Collection = Collection = (function() {
    function Collection(data) {
      $.extend(this, data);
    }

    Object.defineProperty(Collection.prototype, 'init', {
      value: function(data, objects, path) {
        var _class, key, results1, value;
        objects.push(this);
        results1 = [];
        for (key in data) {
          value = data[key];
          if (isGameObjectClass(value)) {
            results1.push(this[key] = new value(null, objects, path + '|' + key));
          } else if (value instanceof GameObject) {
            results1.push(this[key] = value);
          } else if (typeof value === 'object' && value._) {
            _class = value._.split('|');
            this[key] = new window[_class[0]][_class[1]](value, objects, path + '|' + key);
            results1.push(delete this[key]._);
          } else {
            results1.push(this[key] = value);
          }
        }
        return results1;
      }
    });

    Object.defineProperty(Collection.prototype, 'export', {
      value: function(ids, paths, path) {
        var data, key, proto, value;
        if (indexOf.call(ids, this) >= 0) {
          return paths[ids.indexOf(this)];
        }
        ids.push(this);
        paths.push(path);
        data = {};
        proto = Object.getPrototypeOf(this);
        for (key in this) {
          value = this[key];
          data[key] = (typeof value["export"] === "function" ? value["export"](ids, paths, path + '|' + key) : void 0) || value;
          if (data[key] == null) {
            delete data[key];
          } else {
            if (simpleMatch(proto[key], data[key])) {
              delete data[key];
            }
          }
        }
        return data;
      }
    });

    Object.defineProperty(Collection.prototype, 'matches', {
      value: function(conditions) {
        var key, target, value;
        for (key in conditions) {
          value = conditions[key];
          target = key[0] === '|' ? g.getItem(key) : this[key];
          if (!value) {
            return !target;
          }
          if (typeof value === 'string') {
            return target === g.getItem(value);
          }
          if ((target != null ? target.matches : void 0) && !target.matches(value, this)) {
            return false;
          }
          if (!target) {
            return value.optional;
          }
          if (!partMatches(target, value, this)) {
            return false;
          }
        }
        return this;
      }
    });

    Object.defineProperty(Collection.prototype, 'fill', {
      value: function(conditions, last) {
        var item, key, ref, value;
        if (last == null) {
          last = (ref = g.last) != null ? ref.context : void 0;
        }
        for (key in conditions) {
          value = conditions[key];
          if (key[0] === '|') {
            continue;
          } else if (typeof value === 'string') {
            this[key] = g.getItem(value);
          } else if (value.path) {
            if (item = g.getItem(value.path)) {
              this[key] = item;
            }
          } else {
            if (last[key]) {
              this[key] = last[key];
            }
          }
        }
        for (key in conditions) {
          value = conditions[key];
          if (value.fill) {
            this[key] = value.fill.call(this);
          }
        }
        return this;
      }
    });

    Object.defineProperty(Collection.prototype, 'asArray', {
      value: function() {
        var i, list;
        list = [];
        i = 0;
        while (this[i]) {
          list.push(this[i]);
          i++;
        }
        return list;
      }
    });

    Object.defineProperty(Collection.prototype, 'push', {
      value: function(item) {
        var index, j, len;
        index = this.length;
        for (j = 0, len = arguments.length; j < len; j++) {
          item = arguments[j];
          this[index] = item;
          index++;
        }
        return this;
      }
    });

    Object.defineProperty(Collection.prototype, 'pop', {
      value: function() {
        var index, item;
        index = 0;
        while (this[index + 1]) {
          index++;
        }
        item = this[index];
        delete this[index];
        return item;
      }
    });

    Object.defineProperty(Collection.prototype, 'shift', {
      value: function() {
        var first, index;
        first = this[0];
        delete this[0];
        index = 0;
        while (this[index + 1]) {
          this[index] = this[index + 1];
          delete this[index + 1];
          index++;
        }
        return first;
      }
    });

    Object.defineProperty(Collection.prototype, 'unshift', {
      value: function(item) {
        var index, ref;
        index = 0;
        while (this[index]) {
          ref = [item, this[index]], this[index] = ref[0], item = ref[1];
          index++;
        }
        return this[index] = item;
      }
    });

    Object.defineProperty(Collection.prototype, 'remove', {
      value: function(index) {
        if (typeof index === 'string') {
          index = parseInt(index, 10);
        }
        if (typeof index !== 'number') {
          index = this.indexOf(index);
          if (index < 0) {
            throw new Error('Index not found');
          }
        }
        while (this[index + 1]) {
          this[index] = this[index + 1];
          index++;
        }
        delete this[index];
        return this.reArray();
      }
    });

    Object.defineProperty(Collection.prototype, 'reArray', {
      value: function(index) {
        var j, key, len, ref, values;
        values = [];
        ref = Object.keys(this);
        for (j = 0, len = ref.length; j < len; j++) {
          key = ref[j];
          if (!(!isNaN(parseInt(key, 10)))) {
            continue;
          }
          values.push(this[key]);
          if (this[key].key) {
            this[key].key = values.length - 1;
          }
          delete this[key];
        }
        return $.extend(this, values);
      }
    });

    Object.defineProperty(Collection.prototype, 'length', {
      get: function() {
        var index;
        index = 0;
        while (this[index]) {
          index++;
        }
        return index;
      }
    });

    Object.defineProperty(Collection.prototype, 'objectLength', {
      get: function() {
        return Object.keys(this).length;
      }
    });

    Object.defineProperty(Collection.prototype, 'filter', {
      value: function(compare) {
        var key, results, value;
        results = new Collection;
        for (key in this) {
          value = this[key];
          if (compare(value)) {
            results[key] = value;
          }
        }
        return results;
      }
    });

    Object.defineProperty(Collection.prototype, 'indexOf', {
      value: function(item) {
        var key, value;
        for (key in this) {
          value = this[key];
          if (value === item) {
            return Number(key);
          }
        }
        return -1;
      }
    });

    Object.defineProperty(Collection.prototype, 'findIndex', {
      value: function(compare) {
        var key, value;
        for (key in this) {
          value = this[key];
          if (compare(value, key)) {
            return key;
          }
        }
      }
    });

    Object.defineProperty(Collection.prototype, 'find', {
      value: function(compare) {
        return this[this.findIndex(compare)];
      }
    });

    return Collection;

  })();

  Collection.partMatches = partMatches = function(value, condition, context) {
    if (!Collection.numericComparison(value, condition)) {
      return false;
    }
    if (condition.is && !Collection.oneOf(value, condition.is)) {
      return false;
    }
    if (condition.isnt && Collection.oneOf(value, condition.isnt)) {
      return false;
    }
    if (condition.matches && !condition.matches(value, context)) {
      return false;
    }
    return true;
  };

  simpleMatch = function(parent, child) {
    var key, value;
    if (parent === child) {
      return true;
    }
    if (!(parent && child)) {
      return false;
    }
    if (typeof parent === 'object') {
      for (key in parent) {
        value = parent[key];
        if (child[key] !== value) {
          return false;
        }
      }
      for (key in child) {
        value = child[key];
        if (parent[key] !== value) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  Collection.numericComparison = function(target, val) {
    if (target >= val.lt || target > val.lte) {
      return false;
    }
    if (target <= val.gt || target < val.gte) {
      return false;
    }
    if (val.eq != null) {
      if (val.eq instanceof Array) {
        if (!val.eq.some(function(c) {
          return target === c;
        })) {
          return false;
        }
      } else if (target !== val.eq) {
        return false;
      }
    }
    return true;
  };

  Collection.oneOf = function(target, items) {
    if (items instanceof Array) {
      return items.some(function(c) {
        return target === c || target instanceof c;
      });
    }
    return target === items || (typeof items === 'function') && target instanceof items;
  };

}).call(this);

(function() {
  var Game, applyAddRemove, dayList, months, recursiveCopy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.add = function(item) {
    var _class, classes, j, len, location, ref;
    classes = [
      [Person], [Place, Game.prototype.map], [ResearchJob, Place.Research.prototype.jobs], [RoomJob, Place.Rooms.prototype.jobs], [
        Job, function(item) {
          if (item.prototype.place) {
            return Game.prototype.map[item.prototype.place].prototype.jobs[item.name] = item;
          }
        }
      ], [
        Page, function(item) {
          if (RoomJob[item.name]) {
            return RoomJob[item.name].prototype.next = item;
          } else if (ResearchJob[item.name]) {
            return ResearchJob[item.name].prototype.next = item;
          } else if (Job[item.name]) {
            return Job[item.name].prototype.next = item;
          }
        }
      ]
    ];
    for (j = 0, len = classes.length; j < len; j++) {
      ref = classes[j], _class = ref[0], location = ref[1];
      if (!(item.prototype instanceof _class)) {
        continue;
      }
      _class[item.name] = item;
      if (typeof location === 'function') {
        location(item);
      } else if (location) {
        location[item.name] = item;
      }
      break;
    }
    return item;
  };

  window.Game = Game = (function(superClass) {
    var startDate;

    extend(Game, superClass);

    Game.schema = {
      type: Game,
      properties: {
        day: {
          type: 'integer',
          gte: 0
        },
        weather: {
          type: 'string',
          match: /calm|storm/
        },
        version: {
          type: 'integer'
        },
        depravity: {
          type: 'integer'
        },
        men: {
          type: 'integer'
        },
        women: {
          type: 'integer'
        },
        virgins: {
          type: 'integer'
        },
        milk: {
          type: 'integer',
          optional: true
        },
        cum: {
          type: 'integer',
          optional: true
        },
        resistance: {
          type: 'integer',
          optional: true
        }
      },
      strict: true
    };

    Game.passDay = [];

    Game.update = [];

    function Game(gameData) {
      var i, item, j, k, key, l, len, len1, len2, m, objects, ref, ref1, ref2, ref3, results, updates, value;
      updates = gameData ? (function() {
        results = [];
        for (var j = ref = gameData.version || 0, ref1 = Game.update.length; ref <= ref1 ? j < ref1 : j > ref1; ref <= ref1 ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this) : [];
      for (k = 0, len = updates.length; k < len; k++) {
        i = updates[k];
        if ((ref2 = Game.update[i].pre) != null) {
          ref2.call(gameData);
        }
      }
      objects = [];
      Game.__super__.constructor.call(this, null, objects, '');
      for (l = 0, len1 = objects.length; l < len1; l++) {
        item = objects[l];
        for (key in item) {
          value = item[key];
          if (typeof value === 'string' && value[0] === '|') {
            item[key] = this.getItem(value);
          }
        }
      }
      this.version = Game.update.length;
      if (!gameData) {
        return;
      }
      recursiveCopy.call(this, this, gameData);
      for (m = 0, len2 = updates.length; m < len2; m++) {
        i = updates[m];
        if ((ref3 = Game.update[i].post) != null) {
          ref3.call(this);
        }
      }
      return;
    }

    Game.prototype["export"] = function() {
      return Game.__super__["export"].call(this, [], [], '');
    };

    Game.prototype.day = 0;

    Game.prototype.depravity = 0;

    Game.prototype.men = 0;

    Game.prototype.women = 0;

    Game.prototype.virgins = 0;

    Game.prototype.version = 0;

    Game.prototype.mapImage = "Map";

    Game.prototype.getItem = function(path) {
      var first, j, len, part, target;
      if (typeof path === 'string') {
        if (path === '|') {
          return this;
        }
        path = path.split('|');
        first = path.shift();
        if (first) {
          throw new Error(first + '|' + path.join('|') + ' is a bad path');
        }
      }
      target = this;
      for (j = 0, len = path.length; j < len; j++) {
        part = path[j];
        target = target != null ? target[part] : void 0;
      }
      return target;
    };

    Game.prototype.setGameInfo = function() {
      var e, element, j, k, len, len1, ref, ref1, stat;
      element = $('.nav');
      $('.day', element).html(this.date);
      $('.depravity', element).html(this.depravity);
      $('.space', element).html((this.men + this.women + this.virgins) + "/" + this.space);
      e = function(stat) {
        return $('.' + stat, element);
      };
      ref = ['men', 'women', 'virgins'];
      for (j = 0, len = ref.length; j < len; j++) {
        stat = ref[j];
        e(stat).html(this[stat]);
      }
      ref1 = ['milk', 'cum', 'resistance'];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        stat = ref1[k];
        if (this[stat] != null) {
          e(stat).removeClass('hidden').html(this[stat]);
        } else {
          e(stat).addClass('hidden');
        }
      }
      return element.addTooltips();
    };

    startDate = new Date(2021, 9, 31);

    Object.defineProperty(Game.prototype, 'month', {
      get: function() {
        return months[startDate.addDays(this.day).getMonth()];
      }
    });

    Object.defineProperty(Game.prototype, 'dayOfMonth', {
      get: function() {
        return startDate.addDays(this.day).getDate();
      }
    });

    Object.defineProperty(Game.prototype, 'date', {
      get: function() {
        return this.month + " " + dayList[this.dayOfMonth];
      }
    });

    Game.prototype.applyEffects = function(effects, context) {
      var amount, j, len, ref, results, stat;
      applyAddRemove.call(this, effects);
      ref = ['depravity', 'virgins', 'women', 'men', 'milk', 'cum', 'resistance'];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        stat = ref[j];
        if (!(effects[stat] && (this[stat] != null))) {
          continue;
        }
        amount = typeof effects[stat] === 'string' ? context[effects[stat]] : effects[stat];
        if (stat === 'women' || stat === 'men' || stat === 'virgins') {
          amount = Math.min(amount, this.freeSpace);
        }
        g[stat] += Math.randomRound(amount);
        results.push(g[stat] = Math.max(g[stat], 0));
      }
      return results;
    };

    Object.defineProperty(Game.prototype, 'space', {
      get: function() {
        var job, key, location, name, ref, ref1, space;
        space = 6;
        ref = g.map;
        for (name in ref) {
          location = ref[name];
          ref1 = location.jobs;
          for (key in ref1) {
            job = ref1[key];
            if (job instanceof Job.Dungeon) {
              space += 6;
            }
          }
        }
        return space;
      }
    });

    Object.defineProperty(Game.prototype, 'freeSpace', {
      get: function() {
        return Math.max(this.space - g.men - g.women - g.virgins, 0);
      }
    });

    return Game;

  })(GameObject);

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  dayList = [null, '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'];

  recursiveCopy = function(obj, data) {
    var _class, e, key, ref, ref1, results, value;
    results = [];
    for (key in data) {
      value = data[key];
      if (key !== '_') {
        if (typeof value === 'object') {
          _class = (ref = value._) != null ? ref.split('|') : void 0;
          if (value._ && ((ref1 = obj[key]) != null ? ref1.constructor.name : void 0) !== _class[1]) {
            try {
              obj[key] = new window[_class[0]][_class[1]]({}, [], '');
            } catch (_error) {
              e = _error;
              console.error("Unable to find window." + _class[0] + "." + _class[1]);
            }
          }
          if (obj[key] instanceof GameObject || obj[key] instanceof Collection) {
            results.push(recursiveCopy.call(this, obj[key], value));
          } else {
            results.push(obj[key] = value);
          }
        } else if (typeof value === 'string' && value[0] === '|') {
          results.push(obj[key] = this.getItem(value));
        } else {
          results.push(obj[key] = value);
        }
      }
    }
    return results;
  };

  applyAddRemove = function(effects) {
    var key, parts, property, ref, ref1, result, results, value;
    ref = effects.remove || {};
    for (key in ref) {
      value = ref[key];
      parts = key.split('|');
      property = parts.pop();
      result = this.getItem(parts.join('|'))[property];
      if (result != null ? result.removeAs : void 0) {
        result.removeAs(property);
      } else {
        delete this.getItem(parts.join('|'))[property];
        if (this.getItem(parts.join('|'))[property]) {
          this.getItem(parts.join('|'))[property] = false;
        }
      }
    }
    ref1 = effects.add || {};
    results = [];
    for (key in ref1) {
      value = ref1[key];
      parts = key.split('|');
      property = parts.pop();
      result = typeof value === 'function' ? new value : value;
      if (result.addAs) {
        results.push(result.addAs(property));
      } else {
        results.push(this.getItem(parts.join('|'))[property] = result);
      }
    }
    return results;
  };

  Game.passDay.push(function() {
    return g.applyEffects({
      resistance: -2
    });
  });

}).call(this);

(function() {
  var Page, PlayerOptionPage, checkGetItem, conditionsSchema,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  conditionsSchema = {
    optional: true,
    type: 'object',
    items: {
      type: ['string', 'object', 'boolean'],
      pattern: /^\|[a-zA-Z0-9\|]+$/,
      properties: {
        fill: {
          type: 'function',
          optional: true
        },
        optional: {
          eq: true,
          optional: true
        },
        eq: {
          type: ['number', 'string', 'array'],
          items: {
            type: ['number', 'string']
          },
          optional: true
        },
        lt: {
          type: 'number',
          optional: true
        },
        lte: {
          type: 'number',
          optional: true
        },
        gt: {
          type: 'number',
          optional: true
        },
        gte: {
          type: 'number',
          optional: true
        },
        is: {
          type: ['array', 'function'],
          optional: true,
          items: [
            {
              type: 'function'
            }
          ]
        },
        isnt: {
          type: ['array', 'function'],
          optional: true,
          items: [
            {
              type: 'function'
            }
          ]
        },
        matches: {
          type: 'function',
          optional: true
        },
        label: {
          type: 'function',
          optional: true
        }
      },
      exec: function(schema, item) {
        if (!item.is && indexOf.call(Object.keys(item), 'is') >= 0) {
          return this.report('".is" is undefined');
        }
      }
    }
  };

  conditionsSchema.items.properties['*'] = conditionsSchema;

  window.Page = Page = (function(superClass) {
    extend(Page, superClass);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.valueOf = function() {
      return 'Page';
    };

    Page.schema = {
      type: Page,
      strict: true,
      properties: {
        conditions: conditionsSchema,
        text: {
          type: 'function',
          exec: function(schema, text) {
            var match;
            text = text.toString();
            match = text.match(/\|\|/g);
            if ((match != null ? match.length : void 0) > 26) {
              return this.report("can't have more than 25 ||s in one text block");
            }
          }
        },
        effects: {
          type: 'object',
          optional: true,
          properties: {
            add: {
              type: 'object',
              optional: true,
              properties: {
                '*': {
                  type: 'function'
                }
              }
            },
            remove: {
              type: 'object',
              optional: true,
              properties: {
                '*': {
                  type: 'function'
                }
              }
            },
            depravity: {
              type: ['integer', 'string'],
              optional: true
            },
            men: {
              type: ['integer', 'string'],
              optional: true
            },
            women: {
              type: ['integer', 'string'],
              optional: true
            },
            virgins: {
              type: ['integer', 'string'],
              optional: true
            }
          }
        },
        apply: {
          type: 'function',
          optional: true
        },
        next: {
          optional: true,
          type: [Page, 'function', 'boolean']
        },
        context: {
          type: Collection,
          optional: true
        },
        ignoreNew: {
          eq: true,
          optional: true
        }
      }
    };

    Page.prototype["export"] = function(ids, paths, path) {
      if (this.hasOwnProperty('context')) {
        return Page.__super__["export"].call(this, ids, paths, path);
      }
    };

    Page.prototype.context = new Collection;

    Page.prototype.contextMatch = function() {
      return this.context.matches(this.conditions);
    };

    Page.prototype.couldMatch = function() {
      var key, ref, target, val;
      ref = this.conditions;
      for (key in ref) {
        val = ref[key];
        if (key[0] === '|') {
          if (checkGetItem(key, val, this.context)) {
            continue;
          } else {
            return false;
          }
        }
        if (val.optional || val.fill || val.matches || $.isEmptyObject(val)) {
          continue;
        }
        target = g.getItem(val);
        if (!target) {
          return false;
        }
        if (!Collection.numericComparison(target, val)) {
          return false;
        }
      }
      return true;
    };

    Page.prototype.contextFill = function(last) {
      return this.context = (new Collection).fill(this.conditions, last);
    };

    Page.prototype.show = function() {
      var div;
      if (this.conditions && !this.context.objectLength) {
        this.contextFill();
      }
      div = $.render(this.text.call(this.context));
      div.appendTo('#content').addTooltips();
      div.not(div[0]).css('display', 'none');
      return div.data('page', this);
    };

    Page.prototype.apply = function() {
      var base, name1;
      this.show();
      if (this.effects) {
        g.applyEffects(this.effects, this.context);
      }
      if (typeof g !== "undefined" && g !== null) {
        g.setGameInfo();
      }
      g.last = this;
      (base = g.events)[name1 = this.constructor.name] || (base[name1] = []);
      g.events[this.constructor.name].unshift(g.day);
      if (g.events[this.constructor.name].length > 10) {
        g.events[this.constructor.name].pop();
      }
    };

    Page.prototype.isNew = function() {
      var key, name, next, ref, ref1, val;
      if (this.ignoreNew) {
        return false;
      }
      if (!g.events[this.constructor.name]) {
        return this.constructor.name;
      }
      if (this.next instanceof Page) {
        next = new this.constructor.prototype.next;
        return this.next.isNew();
      } else if (((ref = this.next) != null ? ref.prototype : void 0) instanceof Page) {
        next = new this.next;
        return this.next.isNew();
      }
      ref1 = this.constructor.next;
      for (key in ref1) {
        val = ref1[key];
        next = new val;
        next.contextFill(this.context);
        if (next.couldMatch() && (name = next.isNew())) {
          return name;
        }
      }
      return false;
    };

    return Page;

  })(GameObject);

  Game.prototype.queue = new Collection;

  Game.schema.properties.queue = {
    type: Collection,
    items: {
      type: Page
    }
  };

  Game.prototype.events = new Collection;

  Game.schema.properties.events = {
    type: Collection,
    properties: {
      '*': {
        type: 'array',
        minLength: 0,
        maxLength: 10,
        items: {
          type: 'integer'
        }
      }
    }
  };

  Page.sumStat = function(stat, context, people) {
    var key, person, sum;
    if (people == null) {
      people = g.people;
    }
    sum = 0;
    for (key in context) {
      person = context[key];
      if (people[key] || key <= 10) {
        sum += person[stat] || 0;
      }
    }
    return sum;
  };

  Page.randomMatch = function() {
    var i, index, len, page, ref, ref1, results, weights;
    weights = {};
    results = {};
    ref = this.constructor.next;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      page = ref[index];
      if (typeof page === 'function') {
        page = new page;
      }
      page.contextFill();
      if (page.contextMatch()) {
        results[index] = page;
        weights[index] = Math.max(1, 8 - (((ref1 = g.events[page.constructor.name]) != null ? ref1.length : void 0) || 0));
      }
    }
    return results[Math.weightedChoice(weights)];
  };

  Page.trueRandom = function() {
    var i, len, match, page, ref;
    match = [];
    ref = this.constructor.next;
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      if (typeof page === 'function') {
        page = new page;
      }
      page.contextFill();
      if (page.contextMatch()) {
        match.push(page);
      }
    }
    return Math.choice(match);
  };

  Page.firstMatch = function() {
    var i, len, page, ref;
    ref = this.constructor.next;
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      if (typeof page === 'function') {
        page = new page;
      }
      page.contextFill();
      if (page.contextMatch()) {
        return page;
      }
    }
  };

  Page.firstNew = function() {
    var i, len, page, ref;
    ref = this.constructor.next;
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      if (typeof page === 'function') {
        page = new page;
      }
      page.contextFill();
      if (page.contextMatch() && !g.events[page.constructor.name]) {
        return page;
      }
    }
  };

  window.PlayerOptionPage = PlayerOptionPage = (function(superClass) {
    extend(PlayerOptionPage, superClass);

    function PlayerOptionPage() {
      return PlayerOptionPage.__super__.constructor.apply(this, arguments);
    }

    PlayerOptionPage.prototype.show = function() {
      var element, next;
      element = PlayerOptionPage.__super__.show.call(this);
      next = this.constructor.next;
      $('button', element).click(function(e) {
        var nextPage;
        e.preventDefault();
        nextPage = next[$(this).html()];
        g.queue.unshift(new nextPage);
        Game.gotoPage();
        return false;
      });
      return element;
    };

    PlayerOptionPage.prototype.next = false;

    return PlayerOptionPage;

  })(Page);

  checkGetItem = function(key, val, context) {
    var target;
    target = g.getItem(key);
    if (!val) {
      return target == null;
    }
    if (!(target || val.optional)) {
      return false;
    }
    if (!Collection.partMatches(target, val, context)) {
      return false;
    }
    return true;
  };

}).call(this);

(function() {
  var Person, lastP, statSchema,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  lastP = null;

  window.he = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'she';
    } else {
      return 'he';
    }
  };

  window.He = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'She';
    } else {
      return 'He';
    }
  };

  window.him = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'her';
    } else {
      return 'him';
    }
  };

  window.his = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'her';
    } else {
      return 'his';
    }
  };

  window.His = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'Her';
    } else {
      return 'His';
    }
  };

  window.boy = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'girl';
    } else {
      return 'boy';
    }
  };

  window.man = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'woman';
    } else {
      return 'man';
    }
  };

  window.men = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return 'women';
    } else {
      return 'men';
    }
  };

  window.sir = function(p) {
    if (p == null) {
      p = lastP;
    }
    lastP = p;
    if (p.gender === 'f') {
      return "ma'am";
    } else {
      return 'sir';
    }
  };

  he.toString = he;

  He.toString = He;

  him.toString = him;

  his.toString = his;

  His.toString = His;

  boy.toString = boy;

  man.toString = man;

  men.toString = men;

  sir.toString = sir;

  statSchema = {
    type: 'number',
    gte: 0,
    lte: 100
  };

  window.Person = Person = (function(superClass) {
    extend(Person, superClass);

    Person.stats = {
      strength: "Strength<br>Good for beating people up and taking their (my) things.",
      magic: "Magic<br>Raw power aetheric. Very rare in humans.",
      intelligence: "Intelligence<br> On a scale of Liana -> Rock -> Tentacle -> Human -> Me",
      lust: "Lust<br> How much they need and want sex, as well as how good they are at it."
    };

    Person.schema = {
      type: Person,
      strict: true,
      properties: {
        name: {
          type: 'string'
        },
        gender: {
          type: 'string',
          pattern: /^[mf]$/
        },
        image: {
          type: ['string', 'function']
        },
        description: {
          type: ['string', 'function']
        },
        strength: statSchema,
        magic: statSchema,
        intelligence: statSchema,
        lust: statSchema,
        max: {
          type: 'object',
          properties: {
            strength: statSchema,
            magic: statSchema,
            intelligence: statSchema,
            lust: statSchema
          }
        }
      }
    };

    Person.prototype.strength = 0;

    Person.prototype.magic = 0;

    Person.prototype.intelligence = 0;

    Person.prototype.lust = 0;

    Person.prototype.description = 'If you see this in-game, it is a bug.';

    function Person(data, objects, path) {
      Person.__super__.constructor.call(this, data, objects, path);
    }

    Person.prototype.renderBlock = function(key, classes) {
      var fullStats, stat, stats;
      if (classes == null) {
        classes = '';
      }
      stats = (function() {
        var i, len, ref, results1;
        ref = ['strength', 'magic', 'intelligence', 'lust'];
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          stat = ref[i];
          results1.push("<span class='" + stat + (this[stat] === this.max[stat] ? ' strong' : '') + "'>" + this[stat] + "</span>");
        }
        return results1;
      }).call(this);
      fullStats = (function() {
        var i, len, ref, results1;
        ref = ['strength', 'magic', 'intelligence', 'lust'];
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          stat = ref[i];
          if (this[stat] != null) {
            results1.push("<tr class='" + stat + (this[stat] === this.max[stat] ? ' strong' : '') + "'><td>" + (stat.capitalize()) + "</td><td>" + this[stat] + "</td></tr>");
          }
        }
        return results1;
      }).call(this);
      return "<div data-key=\"" + key + "\" class=\"person-info " + classes + "\">\n  <div class=\"name\" style=\"color: " + this.text + ";\">" + this.name + "</div>\n  <div class=\"stats\">" + (stats.join('')) + "</div>\n  <div class=\"full\">\n    <div class=\"name\">" + this.name + "</div>\n    <table class=\"stats\">" + (fullStats.join('')) + "</table>\n    <img src=\"game/images/" + ((typeof this.image === "function" ? this.image() : void 0) || this.image) + ".jpg\">\n    <div class=\"description\">" + ((typeof this.description === "function" ? this.description() : void 0) || this.description) + "</div>\n  </div>\n</div>";
    };

    Person.prototype.toString = function() {
      lastP = this;
      return this.name;
    };

    Person.prototype.possessive = function() {
      lastP = this;
      return this.name + (this.name[this.name.length - 1] === 's' ? "'" : "'s");
    };

    Person.prototype.add = function(stat, amount) {
      this[stat] += amount;
      this[stat] = Math.floor(this[stat]) + (Math.random() < this[stat] % 1);
      return this[stat] = Math.max(0, Math.min(this[stat], this.max[stat]));
    };

    return Person;

  })(GameObject);

  Game.schema.properties.people = {
    type: Collection,
    items: {
      type: Person
    }
  };

  Game.prototype.people = new Collection;

  $(function() {
    var c;
    c = $('#content');
    if (!c.length) {
      return;
    }
    return c.on('mouseenter', '.person-info', function() {
      var parentWidth;
      parentWidth = $(this).parent().width();
      if ($(this).position().left < parentWidth / 2) {
        return $('.full', this).removeClass('right');
      } else {
        return $('.full', this).addClass('right');
      }
    });
  });

  Page.schema.properties.stat = {
    type: 'string',
    optional: true,
    match: Object.keys(Person.stats).join('|')
  };

  Page.schema.properties.difficulty = {
    type: 'integer',
    gte: 1,
    optional: true
  };

  Page.statCheckChances = function(stats, diff, context) {
    var chances, i, key, len, normalize, ref, stat, sum, value;
    diff += g.resistance || 0;
    sum = 1;
    ref = stats.split('|');
    for (i = 0, len = ref.length; i < len; i++) {
      stat = ref[i];
      if (context) {
        sum += Page.sumStat(stat, context, context);
      } else {
        sum += Page.sumStat(stat, g.people);
      }
    }
    chances = {
      veryBad: Math.pow(diff / (sum * 2), 2),
      bad: diff / sum,
      good: sum / diff,
      veryGood: Math.pow(sum / (diff * 2), 2)
    };
    normalize = Math.sumObject(chances);
    for (key in chances) {
      value = chances[key];
      chances[key] /= normalize;
    }
    return chances;
  };

  Page.statCheck = function() {
    var chances, items, r;
    items = this.constructor.next;
    chances = Page.statCheckChances(this.stat, (typeof this.difficulty === "function" ? this.difficulty() : void 0) || this.difficulty, this.context);
    r = Math.random();
    r -= chances.veryBad;
    if (items.veryBad && r <= 0) {
      return items.veryBad;
    }
    r -= chances.bad;
    if (r <= 0) {
      return items.bad;
    }
    r -= chances.good;
    if (r <= 0) {
      return items.good;
    }
    return items.veryGood || items.good;
  };

  Page.statCheckDescription = function(stats, difficulty, items, context) {
    var a, chances, percent, results, stat;
    chances = Page.statCheckChances(stats, (typeof difficulty === "function" ? difficulty() : void 0) || difficulty, context);
    percent = function(chance) {
      return Math.round(chance * 100) + '%';
    };
    results = [];
    if (items.veryGood) {
      results.push("Very Good: " + (percent(chances.veryGood)));
      results.push("Good: " + (percent(chances.good)));
    } else {
      results.push("Good: " + (percent(chances.good + chances.veryGood)));
    }
    if (items.veryBad) {
      results.push("Bad: " + (percent(chances.bad)));
      results.push("Very Bad: " + (percent(chances.veryBad)));
    } else {
      results.push("Bad: " + (percent(chances.bad + chances.veryBad)));
    }
    a = (function() {
      var i, len, ref, results1;
      ref = stats.split('|');
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        stat = ref[i];
        results1.push("<span class='" + stat + "'>" + (stat.capitalize()) + "</span>");
      }
      return results1;
    })();
    a.push('difficulty ' + difficulty);
    return (a.join(', ')) + ":\n<ul class='stat-check'>\n  <li>" + (results.join('</li><li>')) + "</li>\n</ul>";
  };

}).call(this);

(function() {
  var Job, ResearchJob, RoomJob, isPage, renderSlot,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isPage = function(funct) {
    return (funct != null ? funct.prototype : void 0) instanceof Page;
  };

  window.Job = Job = (function(superClass) {
    extend(Job, superClass);

    function Job() {
      return Job.__super__.constructor.apply(this, arguments);
    }

    Job.schema = {
      type: Job,
      properties: {
        label: {
          type: 'string'
        },
        type: {
          type: 'string',
          match: /plot|special|normal|boring/
        },
        conditions: Page.schema.properties.conditions,
        text: {
          type: 'function'
        },
        people: Page.schema.properties.conditions,
        apply: {
          type: 'function',
          optional: true
        },
        next: {
          type: [Page, 'function']
        },
        context: {
          optional: true,
          type: Collection
        }
      }
    };

    Job.universal = [];

    Job.prototype.type = 'normal';

    Job.prototype.renderBlock = function(mainKey, location) {
      var conditions, key, slots;
      slots = (function() {
        var ref, results;
        ref = this.people;
        results = [];
        for (key in ref) {
          conditions = ref[key];
          if (!(typeof conditions.hide === "function" ? conditions.hide() : void 0)) {
            results.push(renderSlot.call(this, key, conditions));
          }
        }
        return results;
      }).call(this);
      return "<div class=\"" + this.type + " job clearfix\" data-key=\"" + mainKey + "\" data-location=\"" + location + "\">\n  <div class=\"col-xs-6\">\n    <div class=\"job-description\">" + (this.text().replace(/\n/g, "<br>")) + "</div>\n  </div>\n  <ul class=\"job-people col-xs-6\">" + (slots.join('')) + "</ul>\n</div>";
    };

    Job.prototype.updateFromDiv = function(div) {
      var context, key, person, ref, slot, slotDiv;
      this.contextFill();
      context = this.context;
      ref = this.people;
      for (key in ref) {
        slot = ref[key];
        slotDiv = $('li[data-slot="' + key + '"]', div);
        person = $('.person-info', slotDiv).attr('data-key');
        if (person) {
          context[key] = g.people[person];
        }
      }
      return context;
    };

    Job.prototype.contextReady = function() {
      var key, ref, value;
      ref = this.people;
      for (key in ref) {
        value = ref[key];
        if (!(this.context[key] || value.optional)) {
          return false;
        }
      }
      return this.contextMatch();
    };

    Job.prototype.show = function() {
      var div;
      if (this.type === 'boring') {
        return false;
      }
      div = $.render("|| class=\"jobStart\" auto=\"1800\"\n<h4>" + this.label + "</h4>");
      div.appendTo('#content').addTooltips();
      div.not(div[0]).css('display', 'none');
      div.data('page', this);
      return div;
    };

    return Job;

  })(Page);

  window.RoomJob = RoomJob = (function(superClass) {
    extend(RoomJob, superClass);

    function RoomJob() {
      return RoomJob.__super__.constructor.apply(this, arguments);
    }

    RoomJob.schema = {
      type: RoomJob,
      properties: {
        label: {
          type: 'string'
        },
        conditions: Job.schema.properties.conditions,
        text: {
          type: 'function'
        },
        apply: {
          type: 'function',
          optional: true
        },
        next: {
          type: [Page, 'function']
        },
        context: {
          optional: true,
          type: Collection
        },
        effects: Page.schema.properties.effects,
        room: {
          type: [Job, 'boolean'],
          optional: true
        }
      }
    };

    RoomJob.prototype.renderBlock = function(key) {
      var disabled;
      disabled = this.meetCost() ? '' : 'dis';
      return "<div class=\"normal job column-block " + disabled + "\" data-key=\"" + key + "\" title=\"" + (this.costString()) + "\">\n  <div class=\"block-label\">" + this.label + "</div>\n  <div class=\"job-description\">" + (this.text().replace(/\n/g, "<br>")) + "</div>\n</div>";
    };

    RoomJob.prototype.contextReady = function() {
      return this.contextMatch();
    };

    RoomJob.prototype.meetCost = function() {
      var i, len, ref, ref1, res;
      ref = ['depravity', 'men', 'women', 'virgins'];
      for (i = 0, len = ref.length; i < len; i++) {
        res = ref[i];
        if ((ref1 = this.effects) != null ? ref1[res] : void 0) {
          if (g[res] < -this.effects[res]) {
            return false;
          }
        }
      }
      return true;
    };

    RoomJob.prototype.costString = function() {
      var res;
      if (this.progress) {
        return "Needs " + this.progress + " points";
      } else {
        return ((function() {
          var i, len, ref, results;
          ref = ['depravity', 'men', 'women', 'virgins', 'cum', 'milk'];
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            res = ref[i];
            if (this.effects[res]) {
              results.push("<span class='" + res + " costPart'>" + (-this.effects[res]) + "</span>");
            }
          }
          return results;
        }).call(this)).join('');
      }
    };

    RoomJob.prototype.apply = function() {
      var key, location;
      key = g.last.context.key;
      location = g.map[g.last.context.location];
      RoomJob.__super__.apply.call(this);
      if (Job[this.constructor.name]) {
        return location.jobs[key] = new Job[this.constructor.name];
      }
    };

    return RoomJob;

  })(Job);

  window.ResearchJob = ResearchJob = (function(superClass) {
    extend(ResearchJob, superClass);

    function ResearchJob() {
      return ResearchJob.__super__.constructor.apply(this, arguments);
    }

    ResearchJob.schema = {
      type: ResearchJob,
      properties: {
        label: {
          type: 'string'
        },
        conditions: Job.schema.properties.conditions,
        text: {
          type: 'function'
        },
        context: {
          optional: true,
          type: Collection
        }
      }
    };

    return ResearchJob;

  })(RoomJob);

  renderSlot = function(key, conditions) {
    var name;
    name = (function() {
      switch (false) {
        case !conditions.label:
          return conditions.label.call(this);
        case key[0] !== key[0].toUpperCase():
          return key;
        default:
          return '';
      }
    }).call(this);
    return "<li data-slot=\"" + key + "\"><div class=\"worker-requirements\">\n  " + (name ? '<div class="name">' + name + '</div>' : '') + "\n</div></li>";
  };

}).call(this);

(function() {
  var Place,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Place = Place = (function(superClass) {
    extend(Place, superClass);

    function Place() {
      return Place.__super__.constructor.apply(this, arguments);
    }

    Place.schema = {
      type: Place,
      strict: true,
      properties: {
        name: {
          type: 'string'
        },
        image: {
          type: 'string'
        },
        description: {
          type: ['string', 'function'],
          maxLength: 300
        },
        jobs: {
          type: Collection,
          items: {
            type: [Job, 'function']
          }
        },
        location: {
          type: 'array',
          items: [
            {
              type: 'integer',
              gte: 0,
              lte: 4000
            }, {
              type: 'integer',
              gte: 0,
              lte: 3000
            }
          ]
        },
        arrive: {
          type: 'array',
          optional: true,
          items: {
            type: 'integer'
          }
        },
        destinations: {
          type: Collection,
          items: {
            type: 'integer',
            gte: 0
          }
        },
        firstVisit: {
          type: Page,
          optional: true
        },
        majorPort: {
          eq: true,
          optional: true
        }
      }
    };

    Place.prototype.jobs = new Collection;

    Place.prototype.toString = function() {
      return this.name;
    };

    return Place;

  })(GameObject);

  Game.prototype.map = new Collection;

  Game.schema.properties.map = {
    type: Collection,
    items: {
      type: Place
    }
  };

  Game.schema.properties.location = {
    type: Place
  };

}).call(this);

(function() {
  var considerGoto, errorPage, getNextDiv, getNextPage, gotoPage, isPage, keyPress, ref, ref1, ref2, ref3, ref4, setNav, validateAllObjects;

  gotoPage = Game.gotoPage = function(change) {
    var currentElement, next, speed, targetDiv;
    if (change == null) {
      change = 1;
    }
    currentElement = $('page.active');
    targetDiv = change < 0 ? currentElement.prev() : !currentElement.length ? $('#content page').first() : getNextDiv();
    next = targetDiv.data('page');
    currentElement.trigger('leave-page');
    if (change > 0) {
      currentElement.find('*').unbind();
      currentElement.find('input, button').attr('disabled', 'disabled');
      $('.tooltip').remove();
    }
    speed = 500;
    if (change > 0) {
      if (targetDiv.attr('speed') === 'slow') {
        speed = 1500;
      } else if (targetDiv.attr('speed') === 'verySlow') {
        speed = 4000;
      }
    }
    $('#content page').removeClass('active').stop().css({
      display: 'none'
    });
    currentElement.css({
      display: 'block',
      opacity: 1
    });
    targetDiv.addClass('active').css({
      display: 'block',
      opacity: 0
    }).trigger('enter-page');
    $('*', currentElement).blur();
    targetDiv.animate({
      opacity: 1
    }, speed, function() {
      if (targetDiv.hasClass('active')) {
        return $('#content page').not('.active').css({
          display: 'none'
        });
      }
    });
    return setNav();
  };

  isPage = function(funct) {
    return (funct != null ? funct.prototype : void 0) instanceof Page;
  };

  getNextDiv = function() {
    var currentPage, e;
    $('#content .tooltip').remove();
    currentPage = $('page.active').data('page');
    while (!$('page.active + page').length) {
      currentPage = getNextPage(currentPage) || g.queue.shift() || new Page.Port;
      try {
        currentPage.apply();
      } catch (_error) {
        e = _error;
        $('#content').append(errorPage(currentPage, e));
      }
      while ($('#content page').length > 40) {
        $('#content page').first().remove();
      }
    }
    return $('page.active + page');
  };

  getNextPage = function(page) {
    var next;
    if (!page) {
      return false;
    }
    if (page.next instanceof Page) {
      return new page.constructor.prototype.next;
    } else if (isPage(page.next)) {
      return new page.next;
    } else if (typeof page.next === 'function') {
      next = page.next();
      if (isPage(next)) {
        return new next;
      } else if (page) {
        return next;
      }
    }
  };

  setNav = function() {
    var element;
    element = $('page.active');
    return element.toggleClass('no-prev', !element.prev().length);
  };

  if ((ref = $.fn) != null) {
    ref.tooltip.Constructor.DEFAULTS.container = 'page.active';
  }

  if ((ref1 = $.fn) != null) {
    ref1.tooltip.Constructor.DEFAULTS.html = true;
  }

  if ((ref2 = $.fn) != null) {
    ref2.tooltip.Constructor.DEFAULTS.trigger = 'hover click';
  }

  if ((ref3 = $.fn) != null) {
    ref3.addTooltips = function() {
      var description, ref4, stat;
      ref4 = Person.stats;
      for (stat in ref4) {
        description = ref4[stat];
        $('.' + stat, this).tooltip({
          delay: {
            show: 300,
            hide: 100
          },
          placement: 'auto left',
          title: description
        });
      }
      $('[title]', this).not('button').tooltip({
        delay: {
          show: 300,
          hide: 100
        },
        placement: 'bottom'
      });
      $('button[title]', this).tooltip({
        delay: {
          show: 300,
          hide: 100
        },
        placement: 'top'
      });
      $('.person-info, .location', this).dblclick(function() {
        return $(this).toggleClass('show-full');
      });
      $('div.full', this).tooltip({
        title: 'Double click to stick or hide',
        placement: 'right',
        container: 'page.active'
      });
      $('text', this).not('.full').tooltip({
        title: "'h' to hide",
        placement: 'right',
        container: 'body'
      });
      return this;
    };
  }

  errorPage = function(page, error) {
    var element;
    element = $.render("||\n-- Problem in " + (page != null ? page.constructor.name : void 0) + "\n" + (error.toString()) + "\n<blockquote><pre></pre></blockquote>");
    $('pre', element).text(error.stack);
    return element;
  };

  $(function() {
    var c, last;
    if (!featureDetect()) {
      return;
    }
    c = $('#content');
    $('.navbar-brand, #game-info').dblclick(function() {
      return $('.navbar-brand').toggleClass('show-info');
    });
    $('#game-info').tooltip({
      title: 'Double click to stick or hide',
      placement: 'bottom'
    });
    $(window).resize(function() {
      c.css('height', window.innerHeight - $('.navbar').outerHeight());
      return $('body').css('height', window.innerHeight);
    });
    setTimeout(function() {
      return $(window).resize();
    });
    c.on('click', function(e) {
      if ($('page.active text.min').length) {
        return $('page.active text').removeClass('min');
      } else if (e.clientX >= c.offset().left + c.width() - 28 && e.clientY <= c.offset().top + 34) {
        return considerGoto(-1);
      } else if ($('page.active text').length && e.clientX >= c.offset().left + c.width() - 22 && e.clientY >= c.offset().top + c.height() - 29) {
        return $('page.active text').addClass('min');
      } else {
        return considerGoto(1);
      }
    });
    $(window).keydown(keyPress);
    c.on('enter-page', 'page[auto]', function() {
      return setTimeout((function(_this) {
        return function() {
          $(_this).removeAttr('auto');
          if ($(_this).hasClass('active')) {
            return Game.gotoPage(1);
          }
        };
      })(this), parseInt($(this).attr('auto'), 10));
    });
    c.on('click', 'button.dropdown-toggle', function() {
      var menu, position;
      position = $(this).toggleClass('active').position();
      menu = $(this).next();
      menu.css('left', position.left);
      menu.css('top', position.top + $(this).height() + 3);
      return menu.css('min-width', $(this).outerWidth() + 5);
    });
    c.on('change', '.dropdown-menu input', function() {
      var button;
      button = $(this).parent().parent().prev();
      button.html($(this).next().html());
      return button.toggleClass('active');
    });
    validateAllObjects();
    $('#new-game').click(function() {
      c.empty();
      window.g = new Game;
      (new Page.Intro).apply();
      return gotoPage();
    });
    $('#save-game').click(function() {
      if (!g) {
        return;
      }
      localStorage.setItem(Date.now(), jsyaml.safeDump(g["export"]()));
      return $('#save-game .glyphicon-ok').animate({
        opacity: 1
      }, 500).animate({
        opacity: 0
      }, 2000);
    });
    $('#load-game').click(function() {
      c.empty();
      (new Page.Load).show();
      return gotoPage();
    });
    last = Object.keys(localStorage).map(function(key) {
      return parseFloat(key) || 0;
    }).sort().pop();
    if (last) {
      window.g = new Game(jsyaml.safeLoad(localStorage[last]));
      g.last.show();
      g.setGameInfo();
    } else {
      window.g = new Game;
      (new Page.Intro).apply();
    }
    return gotoPage();
  });

  considerGoto = function(upDown) {
    var a, ref4;
    a = $('page.active');
    if (upDown > 0 && a.next().length === 0 && ((ref4 = a.data('page')) != null ? ref4.next : void 0) === false) {
      return;
    }
    if (upDown < 0 && a.prev().length === 0) {
      return;
    }
    return gotoPage(upDown);
  };

  if ((ref4 = $.fn) != null) {
    ref4.help = function(opts) {
      if (typeof opts.target === 'string') {
        opts.target = $(opts.target, this).first();
      }
      this.queue('help', (function(_this) {
        return function() {
          opts.target.tooltip($.extend({
            container: 'page.active',
            template: '<div class="tooltip help" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: 'manual'
          }, opts)).tooltip('show');
          return setTimeout(function() {
            return $(window).one('click', function() {
              opts.target.tooltip('destroy');
              return _this.dequeue('help');
            });
          }, 0);
        };
      })(this));
      if (this.hasClass('active')) {
        if (!$('.tooltip.help', this).length) {
          this.dequeue('help');
        }
      } else {
        this.one('enter-page', (function(_this) {
          return function() {
            if (!$('.tooltip.help', _this).length) {
              return _this.dequeue('help');
            }
          };
        })(this));
      }
      return this;
    };
  }

  validateAllObjects = function() {
    var _class, item, name;
    if (!window.location.hash.match(/validate/)) {
      return;
    }
    for (name in window) {
      _class = window[name];
      if ((_class != null ? _class.schema : void 0) && name !== 'Game') {
        for (name in _class) {
          item = _class[name];
          if (!item.schema) {
            continue;
          }
          item = new item;
          item.valid();
        }
      }
    }
    return (new window.Game).valid();
  };

  keyPress = function(e) {
    var ref5, ref6;
    if ((ref5 = e.keyCode) === 39 || ref5 === 40) {
      return considerGoto(1);
    } else if ((ref6 = e.keyCode) === 37 || ref6 === 38) {
      return considerGoto(-1);
    } else if (e.keyCode === 72) {
      return $('page.active text').toggleClass('min');
    }
  };

}).call(this);

(function() {
  var Load, months,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  Page.Load = Load = (function(superClass) {
    extend(Load, superClass);

    function Load() {
      return Load.__super__.constructor.apply(this, arguments);
    }

    Load.prototype.text = function() {
      var blob, date, e, element, game, key, name, row, rows, table;
      rows = (function() {
        var i, len, ref, results;
        ref = Object.keys(localStorage).sort().reverse();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          key = ref[i];
          date = new Date(parseInt(key, 10));
          if (!date.getTime()) {
            continue;
          }
          try {
            game = new Game(jsyaml.safeLoad(localStorage[key]));
          } catch (_error) {
            e = _error;
            continue;
          }
          blob = new Blob([localStorage[key]], {
            type: 'text/plain'
          });
          blob = URL.createObjectURL(blob);
          name = localStorage.auto === key ? "Day " + game.day + " - Autosave" : "Day " + game.day + " - " + game.depravity + "D - " + (game.people.objectLength - 1) + " slaves";
          row = [name, months[date.getMonth()] + " " + (date.getDate()) + ", " + (date.getHours()) + ":" + (date.getMinutes()), "<button class=\"btn btn-xs btn-primary\">Load</button>\n<a class=\"btn btn-xs btn-link\" download=\"" + name + ".yaml\" href=\"" + blob + "\">Export</a>\n<button class=\"btn btn-xs btn-link\">Delete</button>"].join('</td><td>');
          results.push(("<tr game='" + key + "'><td>") + row + '</td></tr>');
        }
        return results;
      })();
      table = ("<table class=\"table table-striped table-hover\">\n  <tr><td colspan=\"3\"><input type=\"file\"></td></tr>\n  " + (rows.join("\n")) + "\n</table>").replace(/\n/g, '');
      element = $.render("|| class=\"screen load\"\n<div class=\"col-lg-6 col-lg-offset-3 col-sm-8 col-sm-offset-2 col-xs-12\">" + table + "</div>");
      $('input', element).change(function() {
        var file, reader;
        if (!(file = this.files[0])) {
          return;
        }
        reader = new FileReader();
        reader.onload = (function(_this) {
          return function() {
            var error;
            $('.import-error', element).remove();
            try {
              window.g = new Game(jsyaml.safeLoad(reader.result));
              $('#content').empty();
              g.last.show();
              g.setGameInfo();
              Game.gotoPage();
            } catch (_error) {
              e = _error;
              error = $('<tr class="import-error danger"><td colspan="3">That doesn\'t seem to be a valid save file.</td></tr>');
              $(_this).parent().parent().after(error);
              error.css('opacity', 0).animate({
                opacity: 1
              }, 1000);
              error.animate({
                opacity: 0
              }, 2500);
            }
          };
        })(this);
        return reader.readAsText(file);
      });
      $('button', element).click(function() {
        var link;
        row = $(this).closest('tr');
        key = row.attr('game');
        if ($(this).html() === 'Delete') {
          delete localStorage[key];
          row.remove();
          return;
        }
        if ($(this).html() === 'Export') {
          name = $(this).parent().prev().prev().html();
          link = $("<a class='btn btn-xs btn-link'>Export</a>");
          link.replaceAll(this);
          link.attr('href', blob);
          link.attr('download', name);
          link.click();
          return;
        }
        window.g = new Game(jsyaml.safeLoad(localStorage[key]));
        $('#content').empty();
        g.last.show();
        g.setGameInfo();
        return Game.gotoPage();
      });
      return element;
    };

    Load.prototype.next = false;

    return Load;

  })(Page);

}).call(this);

(function() {
  var NextDay,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Page.NextDay = NextDay = (function(superClass) {
    extend(NextDay, superClass);

    function NextDay() {
      return NextDay.__super__.constructor.apply(this, arguments);
    }

    NextDay.prototype.text = function() {
      return "|| speed=\"slow\" auto=\"2000\" class=\"nextDay\"\n<h2>" + g.date + "</h2>\n<h3>" + g.location.name + "</h3>";
    };

    NextDay.prototype.apply = function() {
      var event, i, len, ref;
      g.day++;
      ref = Game.passDay;
      for (i = 0, len = ref.length; i < len; i++) {
        event = ref[i];
        event();
      }
      NextDay.__super__.apply.call(this);
      if (localStorage.auto) {
        delete localStorage[localStorage.auto];
      }
      localStorage.auto = Date.now();
      return localStorage.setItem(localStorage.auto, jsyaml.safeDump(g["export"]()));
    };

    return NextDay;

  })(Page);

}).call(this);

(function() {
  var Port, applyPort, assignPersonToJob, doWorkClick, getDblclickWorker, getJobDivs, jobDoubleClick, movePeopleToJobs, ordering, setTall, updateJob,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  updateJob = function(jobDiv) {
    var divs, index, job, newText, workers;
    if (!jobDiv.length) {
      return;
    }
    job = jobDiv.data('job');
    workers = {};
    index = jobDiv.parent().children().index(jobDiv);
    divs = jobDiv.add($('.job-tabs li', jobDiv.closest('page')).eq(index));
    divs.removeClass('ready half-ready');
    $('.person-info', jobDiv).each(function() {
      var key, person;
      key = $(this).attr('data-key');
      person = g.people[key];
      return workers[key] = person;
    });
    job.updateFromDiv(jobDiv);
    if (job.contextReady()) {
      divs.addClass('ready');
    } else if ($('.person-info', jobDiv).length) {
      divs.addClass('half-ready');
    }
    newText = $(job.renderBlock(jobDiv.attr('data-key'), jobDiv.attr('data-location'))).find('.job-description');
    $('.job-description', jobDiv).replaceWith(newText).addTooltips();
    jobDiv.closest('page').removeClass('confirm');
    jobDiv.closest('page').find('options').tooltip('hide');
    return $('input', jobDiv).change(function() {
      return setTimeout(function() {
        return updateJob(jobDiv);
      }, 0);
    });
  };

  ordering = {
    plot: 0,
    special: 1,
    normal: 2,
    boring: 3
  };

  Job.jobSort = function(j1, j2) {
    if (!j1.jt) {
      j1.jt = $(j1).data('job').type;
    }
    if (!j2.jt) {
      j2.jt = $(j2).data('job').type;
    }
    return ordering[j1.jt] - ordering[j2.jt];
  };

  Page.Port = Port = (function(superClass) {
    extend(Port, superClass);

    function Port() {
      return Port.__super__.constructor.apply(this, arguments);
    }

    Port.prototype.text = function() {
      var base, buttons, form, i, j, jl, jobLabels, jobs, key, l, len, locs, page, people, person, ref;
      jobs = $('');
      jobLabels = $('');
      locs = Object.keys(g.map.HolidayInn.destinations);
      for (i = 0, len = locs.length; i < len; i++) {
        l = locs[i];
        ref = getJobDivs(g.map[l].jobs, l), j = ref[0], jl = ref[1];
        if (g.map[l] !== g.location) {
          jl.addClass('hidden');
        }
        jobs = jobs.add(j);
        jobLabels = jobLabels.add(jl);
      }
      jobs = Array.prototype.sort.call(jobs, Job.jobSort);
      jobLabels = Array.prototype.sort.call(jobLabels, Job.jobSort);
      jobLabels.not('.hidden').first().addClass('first-visible');
      jobLabels.not('.hidden').last().addClass('last-visible');
      people = ((function() {
        var ref1, results;
        ref1 = g.people;
        results = [];
        for (key in ref1) {
          person = ref1[key];
          results.push(person.renderBlock(key, (person.active ? 'active' : '')));
        }
        return results;
      })()).sort(function(a, b) {
        a = g.people[a.match(/data-key="(.*?)"/)[1]];
        b = g.people[b.match(/data-key="(.*?)"/)[1]];
        return (b.strength + b.magic + b.intelligence + b.lust) - (a.strength + a.magic + a.intelligence + a.lust);
      });
      buttons = (function() {
        var results;
        results = [];
        for (key in g.map.HolidayInn.destinations) {
          if (key !== g.location.constructor.name) {
            results.push(g.map[key].name);
          }
        }
        return results;
      })();
      buttons.unshift('Done');
      form = ("<form class=\"clearfix\">\n  <div class=\"col-md-2\">\n    <ul class=\"job-tabs list-group\"></ul>\n  </div>\n  <div class=\"col-lg-4 col-md-5\">\n    <div class=\"jobs column-block\"></div>\n  </div>\n  <div class=\"col-lg-4 col-md-5\">\n    <div class=\"people clearfix column-block\">" + (people.join('')) + "</div>\n  </div>\n</form>").replace(/\n/g, '');
      page = $.render("|| class=\"screen port\"\n" + form + "\n--\n  " + ((typeof (base = g.location).description === "function" ? base.description() : void 0) || g.location.description) + "\n  " + (options(buttons)));
      $('.jobs', page).append(jobs);
      $('.job-tabs', page).append(jobLabels);
      movePeopleToJobs(jobs, page);
      $('.job', page).each(function() {
        return updateJob($(this));
      });
      applyPort.call(this, page);
      return page;
    };

    Port.prototype.next = false;

    return Port;

  })(Page);

  movePeopleToJobs = function(jobs, page) {
    var conditions, div, i, job, key, len, location, person, ref, ref1, slot;
    for (i = 0, len = jobs.length; i < len; i++) {
      div = jobs[i];
      location = $(div).attr('data-location');
      job = g.map[location].jobs[$(div).attr('data-key')];
      ref = job.people;
      for (key in ref) {
        conditions = ref[key];
        if (!((ref1 = job.context[key]) != null ? ref1.matches(conditions, job) : void 0)) {
          continue;
        }
        slot = $('.job-people li[data-slot="' + key + '"]', div);
        person = job.context[key];
        person = $('.person-info[data-key="' + (person.key != null ? person.key : person.name) + '"]', page);
        person.prependTo(slot);
        if (conditions.stuck) {
          person.addClass('stuck');
        }
      }
    }
  };

  getJobDivs = function(jobs, location) {
    var i, job, jobDivs, jobLabels, key, len, maybeAddJob, ref;
    jobDivs = $('');
    jobLabels = $('');
    maybeAddJob = function(key, job) {
      var w;
      if (!job.contextMatch()) {
        for (w in job.people) {
          delete job.context[w];
        }
        return;
      }
      jobDivs = jobDivs.add(job.renderBlock(key, location));
      jobDivs.last().data('job', job);
      jobLabels = jobLabels.add("<li class=\"" + (job.type || 'normal') + " list-group-item " + (job.isNew() ? 'new' : '') + "\">" + job.label + "</li>");
      return jobLabels.last().data('job', job);
    };
    for (key in jobs) {
      job = jobs[key];
      if (!(job instanceof Job || job.prototype instanceof Job)) {
        continue;
      }
      if (typeof job === 'function') {
        job = jobs[key] = new job;
      }
      maybeAddJob(key, job);
    }
    ref = Job.universal;
    for (key = i = 0, len = ref.length; i < len; key = ++i) {
      job = ref[key];
      maybeAddJob(key, new job);
    }
    return [jobDivs, jobLabels];
  };

  applyPort = function(element) {
    var active, job, people;
    active = $('.job-tabs li', element).not('.hidden').first().addClass('active');
    job = active.data('job');
    $('.job', element).each(function() {
      if ($(this).data('job') === job) {
        $(this).addClass('active');
        return false;
      }
    });
    $('.job-tabs li', element).click(function() {
      var idx;
      $('.job, .job-tabs li', element).removeClass('active');
      $(this).addClass('active');
      idx = $('.job-tabs li', element).index(this);
      $('.job', element).eq(idx).addClass('active');
      return setTall.call(element);
    });
    setTimeout(setTall.bind(element), 0);
    $('options', element).tooltip({
      title: "Some jobs haven't met their requirements. Click again to continue anyway.",
      placement: 'top',
      trigger: 'manual'
    });
    people = $('.person-info', element);
    people.click(function() {
      $(this).toggleClass('active');
      return g.people[$(this).attr('data-key')].active = $(this).hasClass('active');
    });
    $('.job', element).click(function(e) {
      var jobDiv;
      if ($(e.target).closest('.person-info').length) {
        return;
      }
      if ($(e.target).filter('button, input, label').length) {
        return;
      }
      jobDiv = $(this);
      job = jobDiv.data('job');
      $('.person-info.active', element).each(function() {
        var personDiv;
        personDiv = $(this);
        if (personDiv.closest(jobDiv).length) {
          return;
        }
        return assignPersonToJob(personDiv, job, jobDiv);
      });
      return updateJob(jobDiv);
    });
    $('.job', element).dblclick(jobDoubleClick);
    $('.people', element).click(function(e) {
      if ($(e.target).closest('.person-info').length) {
        return;
      }
      if ($('.person-info.active', element).length) {
        people = $('.person-info.active:not(.stuck)', element).appendTo(this).removeClass('active').each(function() {
          return delete g.people[$(this).attr('data-key')].active;
        });
      }
      return $('.job', element).each(function() {
        var jobDiv;
        jobDiv = $(this);
        return updateJob(jobDiv);
      });
    });
    $('options button', element).click(function(e) {
      var target, targetName;
      e.preventDefault();
      if ($(this).html() === 'Done') {
        return doWorkClick(element);
      }
      targetName = $(this).html();
      target = Object.keys(g.map).find(function(key) {
        return g.map[key].name === targetName;
      });
      g.location = g.map[target];
      g.queue.push(new Page.Port);
      Game.gotoPage();
      return false;
    });
    return element;
  };

  setTall = function() {
    if ($('.job.active', this).height() < $('.job-tabs', this).height()) {
      return this.addClass('tall-tabs');
    } else {
      return this.removeClass('tall-tabs');
    }
  };

  assignPersonToJob = function(personDiv, job, jobDiv) {
    var key, person, prevJobDiv, slot;
    if (personDiv.hasClass('stuck')) {
      return;
    }
    key = personDiv.attr('data-key');
    person = g.people[key];
    if (personDiv.hasClass('injured') && !job.acceptInjured) {
      return;
    }
    slot = person instanceof Person && Collection.prototype.findIndex.call(job.people, function(conditions, key) {
      var slotDiv;
      slotDiv = $('li[data-slot="' + key + '"]', jobDiv);
      return $('.person-info', slotDiv).length === 0 && person.matches(conditions, job);
    });
    if (slot) {
      prevJobDiv = personDiv.closest('.job');
      $('li[data-slot="' + slot + '"]', jobDiv).prepend(personDiv);
      personDiv.removeClass('active');
      delete g.people[personDiv.attr('data-key')].active;
      return updateJob(prevJobDiv);
    }
  };

  doWorkClick = function(element) {
    var key, person, ref;
    $('.jobs > div', element).each(function() {
      var job, jobDiv;
      jobDiv = $(this);
      job = jobDiv.data('job');
      job.updateFromDiv(jobDiv);
      if (job.contextReady()) {
        return g.queue.unshift(job);
      }
    });
    ref = g.people;
    for (key in ref) {
      person = ref[key];
      delete person.active;
    }
    g.queue.push(new Page.NextDay);
    g.queue.push(new (g.location.constructor.port || Page.Port));
    setTimeout(Game.gotoPage, 0);
    return false;
  };

  jobDoubleClick = function(e) {
    var page, person, slot, worker;
    if ($(e.target).closest('.person-info').length) {
      return;
    }
    page = $(this).closest('page');
    if (slot = $(e.target).closest('li').attr('data-slot')) {
      slot = $(this).data('job').people[slot];
      if (worker = getDblclickWorker(slot)) {
        person = $('.person-info[data-key="' + (worker.key || worker.name) + '"]', page);
        person.addClass('active');
      }
    }
    $('.people .person-info').addClass('active');
    $(this).click();
    $('.people .person-info').removeClass('active').each(function() {
      return delete g.people[$(this).attr('data-key')].active;
    });
    return updateJob($(this));
  };

  getDblclickWorker = function(slot) {
    if (typeof slot === 'string') {
      return g.getItem(slot);
    } else if (typeof slot.is === 'function') {
      return g.people.find(function(p) {
        return p instanceof slot.is;
      });
    } else {
      return false;
    }
  };

}).call(this);

(function() {
  var EmptyRoom, Rooms, roomClick,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Page.EmptyRoom = EmptyRoom = (function(superClass) {
    extend(EmptyRoom, superClass);

    function EmptyRoom() {
      return EmptyRoom.__super__.constructor.apply(this, arguments);
    }

    EmptyRoom.prototype.text = function() {
      var i, job, jobs, key, len, page, ref;
      jobs = $('');
      ref = this.asArray();
      for (key = i = 0, len = ref.length; i < len; key = ++i) {
        job = ref[key];
        jobs = jobs.add(job.renderBlock(key));
        jobs.last().data('job', job);
      }
      Array.prototype.sort.call(jobs, Job.jobSort);
      page = $.render("|| speed=\"slow\" class=\"screen sail\" bg=\"misc/emptyRoom\"\n<div class=\"col-xs-8 col-xs-offset-2\"></div>");
      $('.col-xs-8', page).append(jobs);
      jobs.wrap('<div class="col-xs-6"></div>');
      return roomClick(page);
    };

    EmptyRoom.prototype.apply = function() {
      var job, key, locKey, location, ref, ref1, ref2;
      ref = g.map.Rooms.jobs;
      for (key in ref) {
        job = ref[key];
        if (!(job instanceof Job || job.prototype instanceof Job)) {
          continue;
        }
        if (typeof job === 'function') {
          job = g.map.Rooms.jobs[key] = new job;
        }
        job.contextFill();
        if (!(job.size === g.last.size && job.contextMatch())) {
          continue;
        }
        this.context.push(job);
      }
      ref1 = g.map;
      for (locKey in ref1) {
        location = ref1[locKey];
        ref2 = location.jobs;
        for (key in ref2) {
          job = ref2[key];
          if (!(job === g.last)) {
            continue;
          }
          this.context.key = key;
          this.context.location = locKey;
        }
      }
      return EmptyRoom.__super__.apply.call(this);
    };

    EmptyRoom.prototype.next = false;

    return EmptyRoom;

  })(Page);

  roomClick = function(element) {
    $('.job', element).click(function(e) {
      if ($(this).hasClass('dis')) {
        return;
      }
      e.preventDefault();
      g.queue.unshift($(this).data('job'));
      Game.gotoPage();
      return false;
    });
    return element;
  };

  Place.Rooms = Game.prototype.map.Rooms = Rooms = (function(superClass) {
    extend(Rooms, superClass);

    function Rooms() {
      return Rooms.__super__.constructor.apply(this, arguments);
    }

    Rooms.prototype.name = 'Empty Rooms';

    Rooms.prototype.description = function() {
      return false;
    };

    Rooms.prototype.image = 'misc/emptyRoom';

    Rooms.prototype.destinations = new Collection;

    Rooms.prototype.jobs = new Collection;

    Rooms.prototype.location = [0, 0];

    return Rooms;

  })(Place);

}).call(this);

(function() {
  var Research, ResearchChoice, ResearchContinues, research,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Game.schema.properties.goal = {
    type: Job,
    optional: true
  };

  Page.ResearchChoice = ResearchChoice = (function(superClass) {
    extend(ResearchChoice, superClass);

    function ResearchChoice() {
      return ResearchChoice.__super__.constructor.apply(this, arguments);
    }

    ResearchChoice.prototype.text = function() {
      var i, job, jobs, key, len, page, progress, ref;
      if (g.goal) {
        research(g.goal, this.progress);
        return false;
      }
      if (!this.asArray().length) {
        return false;
      }
      jobs = $('');
      ref = this.asArray();
      for (key = i = 0, len = ref.length; i < len; key = ++i) {
        job = ref[key];
        jobs = jobs.add(job.renderBlock(key));
        jobs.last().data('job', job);
      }
      Array.prototype.sort.call(jobs, Job.jobSort);
      page = $.render("|| speed=\"slow\" class=\"screen sail\" bg=\"Laboratory/1\"\n<div class=\"col-xs-8 col-xs-offset-2 clearfix no-float\"></div>");
      $('.col-xs-8', page).append(jobs);
      jobs.wrap('<div class="col-xs-6"></div>');
      progress = this.progress;
      $('.job', page).click(function(e) {
        e.preventDefault();
        job = $(this).data('job');
        research(job, progress);
        Game.gotoPage();
        return false;
      });
      return page;
    };

    ResearchChoice.prototype.apply = function() {
      var job, key, ref;
      this.context.progress = -Page.Laboratory.researchProgress(g.last.context.researcher);
      ref = g.map.Research.jobs;
      for (key in ref) {
        job = ref[key];
        if (!(job instanceof Job || job.prototype instanceof Job)) {
          continue;
        }
        if (typeof job === 'function') {
          job = g.map.Research.jobs[key] = new job;
        }
        job.contextFill();
        if (!(job.progress && job.contextMatch())) {
          continue;
        }
        this.context.push(job);
        job.key = key;
      }
      return ResearchChoice.__super__.apply.call(this);
    };

    ResearchChoice.prototype.next = false;

    ResearchChoice.prototype.effects = {
      depravity: 'progress'
    };

    return ResearchChoice;

  })(Page);

  research = function(job, progress) {
    g.goal = job;
    job.progress += Math.min(g.depravity, progress) * 2;
    if (job.progress > 0) {
      return g.queue.unshift(new Page.ResearchContinues);
    } else {
      g.queue.unshift(job);
      g.goal.progress = 0;
      delete g.goal;
      return g.map.Research.jobs[job.key] = false;
    }
  };

  Place.Research = Game.prototype.map.Research = Research = (function(superClass) {
    extend(Research, superClass);

    function Research() {
      return Research.__super__.constructor.apply(this, arguments);
    }

    Research.prototype.name = 'Research Options';

    Research.prototype.description = function() {
      return false;
    };

    Research.prototype.image = 'misc/emptyRoom';

    Research.prototype.destinations = new Collection;

    Research.prototype.jobs = new Collection;

    Research.prototype.location = [0, 0];

    return Research;

  })(Place);

  Page.ResearchContinues = ResearchContinues = (function(superClass) {
    extend(ResearchContinues, superClass);

    function ResearchContinues() {
      return ResearchContinues.__super__.constructor.apply(this, arguments);
    }

    ResearchContinues.prototype.text = function() {
      return "|| bg=\"Laboratory/" + (Math.choice(['1', '2'])) + "\"\n-- Research continues on " + g.goal.label + ". " + g.goal.progress + " points remaining.";
    };

    return ResearchContinues;

  })(Page);

}).call(this);

(function() {
  Game.update.push({
    pre: function() {
      return delete this.map.Rooms.jobs.ExtraPens;
    },
    post: function() {
      var job, label, location, ref, ref1;
      ref = this.map;
      for (label in ref) {
        location = ref[label];
        ref1 = location.jobs;
        for (label in ref1) {
          job = ref1[label];
          if (job instanceof Job.Milking) {
            job.workers = Math.min(12, job.workers);
          }
        }
      }
    }
  });

  Game.update.push({
    post: function() {
      var name, person, ref;
      ref = this.people;
      for (name in ref) {
        person = ref[name];
        person.max = new Collection(person.max);
      }
    }
  });

  Game.update.push({
    post: function() {
      if (this.events.Nudity) {
        this.map.NorthEnd.jobs[7] = new Job.LargeRoom;
      }
    }
  });

}).call(this);

(function() {
  var DarkLady, Liana, Alice
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Object.defineProperty(window, 'D', {
    get: (function() {
      return g.people.DarkLady;
    })
  });

  Game.prototype.people.DarkLady = add(DarkLady = (function(superClass) {
    extend(DarkLady, superClass);

    function DarkLady() {
      return DarkLady.__super__.constructor.apply(this, arguments);
    }

    DarkLady.prototype.key = 'DarkLady';

    DarkLady.prototype.name = 'Dark Lady';

    DarkLady.prototype.gender = 'f';

    DarkLady.prototype.strength = 1;

    DarkLady.prototype.magic = 15;

    DarkLady.prototype.intelligence = 55;

    DarkLady.prototype.lust = 50;

    DarkLady.prototype.image = 'misc/DarkLady';

    DarkLady.prototype.description = function() {
      return "It's me. I'm going to take over the world.";
    };

    DarkLady.prototype.max = new Collection({
      strength: 100,
      magic: 30,
      intelligence: 100,
      lust: 100
    });

    return DarkLady;

  })(Person));

  Object.defineProperty(window, 'L', {
    get: (function() {
      return g.people.Liana;
    })
  });

  Game.prototype.people.Liana = add(Liana = (function(superClass) {
    extend(Liana, superClass);

    function Liana() {
      return Liana.__super__.constructor.apply(this, arguments);
    }

    Liana.prototype.name = 'Liana';

    Liana.prototype.gender = 'f';

    Liana.prototype.strength = 15;

    Liana.prototype.magic = 30;

    Liana.prototype.intelligence = 50;

    Liana.prototype.lust = 25;

    Liana.prototype.image = 'Liana/Happy';

    Liana.prototype.description = function() {
      return "Fucktoy #1. Quite a powerful mage, and my first lieutenant. She was kicked out of university for cheating on a test, and decided to \"show them all\" by summoning me. Also my favorite human, though don't tell her I said so.";
    };

    Liana.prototype.max = new Collection({
      strength: 40,
      magic: 50,
      intelligence: 100,
      lust: 100
    });

    return Liana;


  })(Person));

  Object.defineProperty(window, 'A', {
    get: (function() {
      return g.people.Alice;
    })
  });

  Game.prototype.people.Alice = add(Alice= (function(superClass) {
    extend(Alice, superClass);

    function Alice() {
      return Alice.__super__.constructor.apply(this, arguments);
    }

    Alice.prototype.name = 'Alice';

    Alice.prototype.gender = 'f';

    Alice.prototype.strength = 100;

    Alice.prototype.magic = 100;

    Alice.prototype.intelligence = 100;

    Alice.prototype.lust = 200;

    Alice.prototype.image = 'Alice/Alice';

    Alice.prototype.description = function() {
      return "A Fully functioning Love Doll, gifted by C.E.L.L. Corp as welcome gift for me. She once human, but thanks to unknown method, she finally abandoned that long time ago (which i asked, and she reply with \"classified\"). I hope i could find its creator, we might get along...";
    };

    Alice.prototype.max = new Collection({
      strength: 100,
      magic: 100,
      intelligence: 100,
      lust: 200
    });

    return Alice;

  })(Person));


}).call(this);






(function() {
  var Domme, Maid, ManWhore, Sadist, SexSlave, sticky,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  sticky = Person.sticky = function() {
    this.imageKey || (this.imageKey = Math.floor(Math.random() * this.constructor.images.length));
    return this.constructor.images[this.imageKey];
  };

  add(Domme = (function(superClass) {
    extend(Domme, superClass);

    function Domme() {
      return Domme.__super__.constructor.apply(this, arguments);
    }

    Domme.prototype.name = 'Domme';

    Domme.prototype.gender = 'f';

    Domme.prototype.strength = 15;

    Domme.prototype.magic = 0;

    Domme.prototype.intelligence = 25;

    Domme.prototype.lust = 20;

    Domme.prototype.max = new Collection({
      strength: 20,
      magic: 5,
      intelligence: 50,
      lust: 25
    });

    Domme.prototype.description = function() {
      return "Cruel and lovely, equally at home wielding a whip or a gentle kiss... a woman after my own heart.";
    };

    Domme.prototype.image = sticky;

    Domme.images = ['TrainingChamber/F1', 'TrainingChamber/F2', 'TrainingChamber/F3', 'TrainingChamber/F4'];

    return Domme;

  })(Person));

  add(Sadist = (function(superClass) {
    extend(Sadist, superClass);

    function Sadist() {
      return Sadist.__super__.constructor.apply(this, arguments);
    }

    Sadist.prototype.name = 'Sadist';

    Sadist.prototype.gender = 'm';

    Sadist.prototype.strength = 25;

    Sadist.prototype.magic = 0;

    Sadist.prototype.intelligence = 15;

    Sadist.prototype.lust = 20;

    Sadist.prototype.max = new Collection({
      strength: 40,
      magic: 0,
      intelligence: 30,
      lust: 25
    });

    Sadist.prototype.description = function() {
      return "A malicious grin and a firm conviction that women should be groveling while he fucks them... a man after my own heart.";
    };

    Sadist.prototype.image = sticky;

    Sadist.images = ['TrainingChamber/M1', 'TrainingChamber/M2', 'TrainingChamber/M3'];

    return Sadist;

  })(Person));

  add(Maid = (function(superClass) {
    extend(Maid, superClass);

    function Maid() {
      return Maid.__super__.constructor.apply(this, arguments);
    }

    Maid.prototype.name = 'Maid';

    Maid.prototype.gender = 'f';

    Maid.prototype.strength = 5;

    Maid.prototype.magic = 0;

    Maid.prototype.intelligence = 10;

    Maid.prototype.lust = 10;

    Maid.prototype.max = new Collection({
      strength: 70,
      magic: 1,
      intelligence: 15,
      lust: 20
    });

    Maid.prototype.description = function() {
      return "Uniforms vary from puffy to short, lipstick varies from nonexistent to bright red, and masters vary from kind to harsh. The one thing that doesn't vary is that she'll be 'cleaning' a bit more than windows...";
    };

    Maid.prototype.image = sticky;

    Maid.images = ['TrainingChamber/Maid4', 'TrainingChamber/Maid5', 'TrainingChamber/Maid6'];

    return Maid;

  })(Person));

  add(SexSlave = (function(superClass) {
    extend(SexSlave, superClass);

    function SexSlave() {
      return SexSlave.__super__.constructor.apply(this, arguments);
    }

    SexSlave.prototype.name = 'Sex Slave';

    SexSlave.prototype.gender = 'f';

    SexSlave.prototype.strength = 5;

    SexSlave.prototype.magic = 0;

    SexSlave.prototype.intelligence = 5;

    SexSlave.prototype.lust = 35;

    SexSlave.prototype.max = new Collection({
      strength: 20,
      magic: 3,
      intelligence: 15,
      lust: 65
    });

    SexSlave.prototype.description = function() {
      return "She has one purpose in life, and she's learned to both accept her role and love it.";
    };

    SexSlave.prototype.image = sticky;

    SexSlave.images = ['TrainingChamber/SS3', 'TrainingChamber/SS4', 'TrainingChamber/SS5'];

    return SexSlave;

  })(Person));

  add(ManWhore = (function(superClass) {
    extend(ManWhore, superClass);

    function ManWhore() {
      return ManWhore.__super__.constructor.apply(this, arguments);
    }

    ManWhore.prototype.name = 'Man Whore';

    ManWhore.prototype.gender = 'm';

    ManWhore.prototype.strength = 5;

    ManWhore.prototype.magic = 0;

    ManWhore.prototype.intelligence = 5;

    ManWhore.prototype.lust = 35;

    ManWhore.prototype.max = new Collection({
      strength: 20,
      magic: 0,
      intelligence: 15,
      lust: 65
    });

    ManWhore.prototype.description = function() {
      return "He's got a cock, an asshole and a mouth, and he's not afraid to have any of them used. He'd rather enjoy it, in fact.";
    };

    ManWhore.prototype.image = sticky;

    ManWhore.images = ['TrainingChamber/MH1', 'TrainingChamber/MH2', 'TrainingChamber/MH3'];

    return ManWhore;

  })(Person));

}).call(this);

(function() {
  var Meattoilet, TFMeattoilet, Catboy, Catgirl, Succubus,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(Meattoilet = (function(superClass) {
    extend(Meattoilet, superClass);

    function Meattoilet() {
      return Meattoilet.__super__.constructor.apply(this, arguments);
    }

    Meattoilet.prototype.name = 'Meattoilet';

    Meattoilet.prototype.gender = 'f';

    Meattoilet.prototype.strength = 0;

    Meattoilet.prototype.magic = 0;

    Meattoilet.prototype.intelligence = 0;

    Meattoilet.prototype.lust = 200;

    Meattoilet.prototype.max = new Collection({
      strength: 0,
      magic: 0,
      intelligence: 0,
      lust: 200
    });

    Meattoilet.prototype.description = function() {
      return "This is what happen when a Holy girl trampleded as men plaything after being gangbanged and edged for... idk. Oh, and those seifuku seems cute.";
    };

    Meattoilet.prototype.image = Person.sticky;

    Meattoilet.images = ['Alice/Meat1', 'Alice/Meat2', 'Alice/Meat3'];

    return Meattoilet;

  })(Person));

  add(TFMeattoilet = (function(superClass) {
    extend(TFMeattoilet, superClass);

    function TFMeattoilet() {
      return TFMeattoilet.__super__.constructor.apply(this, arguments);
    }

    TFMeattoilet.prototype.name = 'TFMeattoilet';

    TFMeattoilet.prototype.gender = 'f';

    TFMeattoilet.prototype.strength = 0;

    TFMeattoilet.prototype.magic = 0;

    TFMeattoilet.prototype.intelligence = 0;

    TFMeattoilet.prototype.lust = 200;

    TFMeattoilet.prototype.max = new Collection({
      strength: 0,
      magic: 0,
      intelligence: 0,
      lust: 200
    });

    TFMeattoilet.prototype.description = function() {
      return "Oh, no no no. A former patriarch who think women is a lower class should now better right, for you are one of them now. You are not allowed to go, neither you able to satisfy yourself. From now on, anything happen to you, is happen because master permission. This is why these restrains chain is part of you now.";
    };

    TFMeattoilet.prototype.image = Person.sticky;

    TFMeattoilet.images = ['Alice/TFMeat1', 'Alice/TFMeat2', 'Alice/TFMeat3'];

    return TFMeattoilet;

  })(Person));




  add(Catgirl = (function(superClass) {
    extend(Catgirl, superClass);

    function Catgirl() {
      return Catgirl.__super__.constructor.apply(this, arguments);
    }

    Catgirl.prototype.name = 'Catgirl';

    Catgirl.prototype.gender = 'f';

    Catgirl.prototype.strength = 5;

    Catgirl.prototype.magic = 1;

    Catgirl.prototype.intelligence = 0;

    Catgirl.prototype.lust = 20;

    Catgirl.prototype.max = new Collection({
      strength: 15,
      magic: 7,
      intelligence: 10,
      lust: 80
    });

    Catgirl.prototype.description = function() {
      return "No, they don't come off. Distractable, sexy as hell, likes to drink milk from saucers, forgets to wear clothes unless ordered. Investments in training pay very well at auction.";
    };

    Catgirl.prototype.image = Person.sticky;

    Catgirl.images = ['MagicCircle/Catgirl1', 'MagicCircle/Catgirl2', 'MagicCircle/Catgirl3', 'MagicCircle/Catgirl4', 'MagicCircle/Catgirl5'];

    return Catgirl;

  })(Person));

  add(Catboy = (function(superClass) {
    extend(Catboy, superClass);

    function Catboy() {
      return Catboy.__super__.constructor.apply(this, arguments);
    }

    Catboy.prototype.name = 'Catboy';

    Catboy.prototype.gender = 'm';

    Catboy.prototype.strength = 15;

    Catboy.prototype.magic = 1;

    Catboy.prototype.intelligence = 5;

    Catboy.prototype.lust = 10;

    Catboy.prototype.max = new Collection({
      strength: 30,
      magic: 1,
      intelligence: 25,
      lust: 55
    });

    Catboy.prototype.description = function() {
      return "No, they don't come off. Distractable, sexy, likes to drink milk from saucers, much less likely to forget his own name than a catgirl.";
    };

    Catboy.prototype.image = Person.sticky;

    Catboy.images = ['MagicCircle/Catboy1', 'MagicCircle/Catboy2'];

    return Catboy;

  })(Person));

  add(Succubus = (function(superClass) {
    extend(Succubus, superClass);

    function Succubus() {
      return Succubus.__super__.constructor.apply(this, arguments);
    }

    Succubus.prototype.name = 'Succubus';

    Succubus.prototype.gender = 'f';

    Succubus.prototype.strength = 20;

    Succubus.prototype.magic = 5;

    Succubus.prototype.intelligence = 10;

    Succubus.prototype.lust = 40;

    Succubus.prototype.max = new Collection({
      strength: 50,
      magic: 30,
      intelligence: 25,
      lust: 80
    });

    Succubus.prototype.description = function() {
      return "Cute? Yes. Sexy? Yes. Innocent? No. She will suck your soul out through your cock - and that's not just a metaphor. She keeps a jar of disembodied souls under her pillow to help her sleep at night.";
    };

    Succubus.prototype.image = Person.sticky;

    Succubus.images = ['MagicCircle/Succubus1', 'MagicCircle/Succubus2', 'MagicCircle/Succubus3', 'MagicCircle/Succubus4'];

    return Succubus;

  })(Person));

}).call(this);

(function() {
  var LargeRoom, LeaveEmpty, LeaveEmptyLarge, LeaveEmptyMed, MediumRoom, SmallRoom,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(LeaveEmpty = (function(superClass) {
    extend(LeaveEmpty, superClass);

    function LeaveEmpty() {
      return LeaveEmpty.__super__.constructor.apply(this, arguments);
    }

    LeaveEmpty.prototype.text = function() {
      return false;
    };

    return LeaveEmpty;

  })(Page));

  add(SmallRoom = (function(superClass) {
    extend(SmallRoom, superClass);

    function SmallRoom() {
      return SmallRoom.__super__.constructor.apply(this, arguments);
    }

    SmallRoom.prototype.people = {
      'Dark Lady': '|people|DarkLady'
    };

    SmallRoom.prototype.type = 'special';

    SmallRoom.prototype.label = "Empty Room";

    SmallRoom.prototype.text = function() {
      return "A bedroom at Holiday Inn. I can turn it into something more useful.";
    };

    SmallRoom.prototype.size = 'small';

    SmallRoom.prototype.next = Page.EmptyRoom;

    return SmallRoom;

  })(Job));

  add(LeaveEmpty = (function(superClass) {
    extend(LeaveEmpty, superClass);

    function LeaveEmpty() {
      return LeaveEmpty.__super__.constructor.apply(this, arguments);
    }

    LeaveEmpty.prototype.label = "Leave Empty";

    LeaveEmpty.prototype.text = function() {
      return "Peeling paint. I like peeling paint. Pick some of it off the wall, flick it on the floor, leave everything alone.";
    };

    LeaveEmpty.prototype.room = false;

    LeaveEmpty.prototype.size = 'small';

    LeaveEmpty.prototype.effects = {};

    LeaveEmpty.prototype.next = Page.LeaveEmpty;

    return LeaveEmpty;

  })(RoomJob));

  add(MediumRoom = (function(superClass) {
    extend(MediumRoom, superClass);

    function MediumRoom() {
      return MediumRoom.__super__.constructor.apply(this, arguments);
    }

    MediumRoom.prototype.people = {
      'Dark Lady': '|people|DarkLady'
    };

    MediumRoom.prototype.type = 'special';

    MediumRoom.prototype.label = "Empty Space";

    MediumRoom.prototype.text = function() {
      return "An empty suite, garage or office space. I can turn it into something more useful.";
    };

    MediumRoom.prototype.size = 'medium';

    MediumRoom.prototype.next = Page.EmptyRoom;

    return MediumRoom;

  })(Job));

  add(LeaveEmptyMed = (function(superClass) {
    extend(LeaveEmptyMed, superClass);

    function LeaveEmptyMed() {
      return LeaveEmptyMed.__super__.constructor.apply(this, arguments);
    }

    LeaveEmptyMed.prototype.text = function() {
      return "Uninspiring. I'm not feeling the urge to do anything at all with this space right now.";
    };

    LeaveEmptyMed.prototype.size = 'medium';

    return LeaveEmptyMed;

  })(RoomJob.LeaveEmpty));

  add(LargeRoom = (function(superClass) {
    extend(LargeRoom, superClass);

    function LargeRoom() {
      return LargeRoom.__super__.constructor.apply(this, arguments);
    }

    LargeRoom.prototype.people = {
      'Dark Lady': '|people|DarkLady'
    };

    LargeRoom.prototype.type = 'special';

    LargeRoom.prototype.label = "Empty Lot";

    LargeRoom.prototype.text = function() {
      return "An empty square of land. Let's build something here..";
    };

    LargeRoom.prototype.size = 'large';

    LargeRoom.prototype.next = Page.EmptyRoom;

    return LargeRoom;

  })(Job));

  add(LeaveEmptyLarge = (function(superClass) {
    extend(LeaveEmptyLarge, superClass);

    function LeaveEmptyLarge() {
      return LeaveEmptyLarge.__super__.constructor.apply(this, arguments);
    }

    LeaveEmptyLarge.prototype.text = function() {
      return "Too much work, and I like the pile of broken glass and newspaper in one corner. Leave it.";
    };

    LeaveEmptyLarge.prototype.size = 'large';

    return LeaveEmptyLarge;

  })(RoomJob.LeaveEmpty));

}).call(this);

(function() {
  var Dungeon, DungeonCum, DungeonDaily, DungeonPregnancy, dungeonCum,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(Dungeon = (function(superClass) {
    extend(Dungeon, superClass);

    function Dungeon() {
      return Dungeon.__super__.constructor.apply(this, arguments);
    }

    Dungeon.prototype.label = "Dungeon";

    Dungeon.prototype.effects = {
      depravity: -25,
      men: -2
    };

    Dungeon.prototype.size = 'small';

    Dungeon.prototype.text = function() {
      return "Slaves need a place to stay too, until I find a task for them. I can't have more than six unused slaves per dungeon. Takes two male slave-guards to keep them fed and clean and pacified.";
    };

    return Dungeon;

  })(RoomJob));

  add(Dungeon = (function(superClass) {
    extend(Dungeon, superClass);

    function Dungeon() {
      return Dungeon.__super__.constructor.apply(this, arguments);
    }

    Dungeon.prototype.text = function() {
      return "|| bg=\"Dungeon/Empty\"\n-- Normally I'd have a team of architects to handle this sort of mundane work, but with things as they are, well...\n--> One thing this pathetic kingdom of \"America\" does do well is buildings. It's hardly even cold at all, much more pleasant for the inmates. I'm more of a torture-you-with-pleasure sort of Dark Lady than a torture-you-with-misery one, so that's nice.\n--> All I need is some additional soundproofing and a couple of places to set the chains in the floor, and my new dungeon is complete.";
    };

    return Dungeon;

  })(Page));

  dungeonCum = function() {
    return Math.min(g.men, Math.ceil(g.men / g.space) * 6);
  };

  add(Dungeon = (function(superClass) {
    extend(Dungeon, superClass);

    function Dungeon() {
      return Dungeon.__super__.constructor.apply(this, arguments);
    }

    Dungeon.prototype.label = "Dungeon";

    Dungeon.prototype.text = function() {
      return "It's a dungeon. It holds six slaves until I find a use for them. " + (g.events.DungeonCum ? "\n\n<em><span class=\"cum\">+" + dungeonCum() + "</span></em>" : "No fun to be had here, just a soundproofed holding pen.");
    };

    Dungeon.prototype.type = 'boring';

    Dungeon.prototype.people = {
      Gaoler: {
        hide: function() {
          return g.events.DungeonCum == null;
        },
        optional: true
      }
    };

    return Dungeon;

  })(Job));

  Job.Dungeon.prototype.next = add(DungeonDaily = (function(superClass) {
    extend(DungeonDaily, superClass);

    function DungeonDaily() {
      return DungeonDaily.__super__.constructor.apply(this, arguments);
    }

    DungeonDaily.prototype.conditions = {
      Gaoler: {},
      cum: {
        fill: function() {
          if (g.events.DungeonCum && this.Gaoler) {
            return dungeonCum();
          } else {
            return 0;
          }
        }
      }
    };

    DungeonDaily.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.75 || ((ref = g.events.DungeonDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"Dungeon/Empty\"\n-- It's not my favorite place to keep people, but sometimes they just need to wait their turn for a while.", "|| bg=\"Dungeon/1\"\n-- She looks so excited, doesn't she? But she'll just have to wait a few days while I decide whether she's going to be the one fucking or the getting fucked.", "|| bg=\"Dungeon/2\"\n-- The screaming got to be a bit much. I decorated her with a bit of extra chain while I was at it.", "|| bg=\"Dungeon/3\"\n-- I love that rebellious expression. She'll make the cutest little dominatrix, won't she?"];
      if (g.events.DungeonCum && this.Gaoler) {
        c = ["|| bg=\"Dungeon/Cum1\"\n-- We gave the men waiting for assignment one of our female prisoners, and told them to do... whatever. I guess they were pretty bored.", "|| bg=\"Dungeon/Cum2\"\n-- You know, the gaoler probably shouldn't be putting herself in such a vulnerable position. But they are pretty hot, so I guess I can't blame her too much.", "|| bg=\"Dungeon/Cum3\"\n-- Not all the male prisoners <em>want</em> to be tied up and milked for their cum. Tough.", "|| bg=\"Dungeon/Cum4\"\n-- Using one prisoner to satisfy another. Classy."];
      }
      if (g.women && g.events.DungeonPregnancy) {
        c.push("|| bg=\"Dungeon/Preg1\"\n-- They aren't <em>willing</em>, just fertile and at my mercy. I'll make their births easy and pleasurable though - that only takes a touch of magic, and I do want them healthy afterwards.");
        c.push("|| bg=\"Dungeon/Preg2\"\n-- Tied up for daily inspection. The jailer is very... thorough, especially with those near birth.");
        c.push("|| bg=\"Dungeon/Preg3\"\n-- Being pregnant is no reason for the fathers to stop fucking them. The fathers and their friends, that is. Or the fathers and their friends and some random strangers, and the male prisoners, and...");
        c.push("|| bg=\"Dungeon/Preg4\"\n-- I like to set aside a few hours each day to torment my prisoners, especially the pregnant ones. The orgasms are good for their babies, and stronger abdominal muscles will aid with the birth.");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n<h4>Dungeon</h4>\n" + Math.choice(c);
    };

    DungeonDaily.prototype.effects = {
      cum: 'cum'
    };

    return DungeonDaily;

  })(Page));

  add(DungeonCum = (function(superClass) {
    extend(DungeonCum, superClass);

    function DungeonCum() {
      return DungeonCum.__super__.constructor.apply(this, arguments);
    }

    DungeonCum.prototype.conditions = {
      '|events|MoreResources': {}
    };

    DungeonCum.prototype.label = "Dungeon Collection";

    DungeonCum.prototype.progress = 150;

    DungeonCum.prototype.text = function() {
      return "Up to <span class=\"cum\">+6</span> when working a dungeon (if the cells are full of <span class=\"men\"></span>).\n<br>There's no reason those waiting assignments in the dungeon shouldn't contribute to their new society.";
    };

    return DungeonCum;

  })(ResearchJob));

  add(DungeonCum = (function(superClass) {
    extend(DungeonCum, superClass);

    function DungeonCum() {
      return DungeonCum.__super__.constructor.apply(this, arguments);
    }

    DungeonCum.prototype.text = function() {
      return "|| bg=\"Dungeon/Cum4\"\n-- A certain young fellow from Ransome\n  Had a dame seven times in a hansom.\n  When she shouted for more,\n  he said from the floor,\n  The name, miss, is Simpson not Samson.";
    };

    return DungeonCum;

  })(Page));

  add(DungeonPregnancy = (function(superClass) {
    extend(DungeonPregnancy, superClass);

    function DungeonPregnancy() {
      return DungeonPregnancy.__super__.constructor.apply(this, arguments);
    }

    DungeonPregnancy.prototype.conditions = {
      '|events|Resistance': {}
    };

    DungeonPregnancy.prototype.label = "Public Use";

    DungeonPregnancy.prototype.progress = 300;

    DungeonPregnancy.prototype.text = function() {
      return "Rent-a-womb - by selling my sluts' as wombs to the locals, I can bring in rich visitors... who will need to help protect my secrecy long-term if they want their new slave-wife to come to term.\n\n<span class=\"resistance\">-0.25</span> daily as long as there are <span class=\"women\"></span> prisoners";
    };

    return DungeonPregnancy;

  })(ResearchJob));

  add(DungeonPregnancy = (function(superClass) {
    extend(DungeonPregnancy, superClass);

    function DungeonPregnancy() {
      return DungeonPregnancy.__super__.constructor.apply(this, arguments);
    }

    DungeonPregnancy.prototype.text = function() {
      return "|| bg=\"Dungeon/Preg2\"\n-- Q. What is the most common pregnancy craving?\n   A. For men to be the ones who get pregnant.\n\n   Q. What’s the difference between a pregnant woman and a lightbulb?\n   A. You can unscrew a lightbulb.";
    };

    return DungeonPregnancy;

  })(Page));

}).call(this);

(function() {
  var Slutroom, SlutroomCum, SlutroomDaily, SlutroomFisting, SlutroomOral, SlutroomStrapon, SlutroomSybian, slutroomDepravity,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  slutroomDepravity = function() {
    var e;
    e = 4;
    if (g.events.SlutroomOral) {
      e += 1;
    }
    if (g.events.SlutroomFisting) {
      e += 1;
    }
    if (g.events.SlutroomStrapon) {
      e += 1;
    }
    if (g.events.SlutroomSybian) {
      e += 1;
    }
    return e;
  };

  add(Slutroom = (function(superClass) {
    extend(Slutroom, superClass);

    function Slutroom() {
      return Slutroom.__super__.constructor.apply(this, arguments);
    }

    Slutroom.prototype.label = "Slutroom";

    Slutroom.prototype.effects = {
      depravity: -20,
      women: -2
    };

    Slutroom.prototype.size = 'small';

    Slutroom.prototype.text = function() {
      return "Mind wiping a pair of girls and installing them with permanent orders to pleasure each other. <span class=\"depravity\">+" + (slutroomDepravity()) + "</span> daily.";
    };

    return Slutroom;

  })(RoomJob));

  add(Slutroom = (function(superClass) {
    extend(Slutroom, superClass);

    function Slutroom() {
      return Slutroom.__super__.constructor.apply(this, arguments);
    }

    Slutroom.prototype.text = function() {
      return "||\n  -- A slutroom is really quite simple. It needs three things.\n|| bg=\"Slutroom/Bed\"\n  --> A bed.\n|| bg=\"Slutroom/Food\"\n  --> An enchanted plate of self-renewing food.\n|| bg=\"Slutroom/1\"\n  --> And a pair of mindless women with orders to fuck for all eternity.";
    };

    return Slutroom;

  })(Page));

  add(Slutroom = (function(superClass) {
    extend(Slutroom, superClass);

    function Slutroom() {
      return Slutroom.__super__.constructor.apply(this, arguments);
    }

    Slutroom.prototype.label = "Slutroom";

    Slutroom.prototype.text = function() {
      return "Simply letting the two mindless fuckslaves go at it 18 hours a day is the purpose of a slutroom. <span class=\"depravity\">+" + (slutroomDepravity()) + "</span> daily";
    };

    Slutroom.prototype.people = {};

    Slutroom.prototype.type = 'boring';

    return Slutroom;

  })(Job));

  Job.Slutroom.prototype.next = add(SlutroomDaily = (function(superClass) {
    extend(SlutroomDaily, superClass);

    function SlutroomDaily() {
      return SlutroomDaily.__super__.constructor.apply(this, arguments);
    }

    SlutroomDaily.prototype.conditions = {
      depravity: {
        fill: slutroomDepravity
      },
      cum: {
        fill: function() {
          if (g.events.SlutroomCum) {
            return 0.5;
          } else {
            return 0;
          }
        }
      }
    };

    SlutroomDaily.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.75 || ((ref = g.events.SlutroomDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"Slutroom/1\"\n-- I poke my head in for a moment, but all is as it should be, horny and wet and mindless.", "|| bg=\"Slutroom/2\"\n-- The chains are purely decorative. They don't have any thoughts other than fucking each other silly. Just the way it should be.", "|| bg=\"Slutroom/3\"\n-- Looks like someone has snuck in and taken advantage of her. Excellent.", "|| bg=\"Slutroom/4\"\n-- Something is very wrong here. They have clothes - how the hell did they get those? I strip them bare immediately, of course.", "|| bg=\"Slutroom/MF\"\n-- One of my males deserved a special reward. My sluts were more than happy to oblige."];
      if (g.events.SlutroomOral) {
        c.push("|| bg=\"Slutroom/Oral1\"\n-- ` Mmgmph, mmm, hmmmmm, mmmumghmph...`\n`D Carry on, don't let me interrupt. I'll just stand here and watch a while.`");
        c.push("|| bg=\"Slutroom/Oral2\"\n-- She's found the spot. That wonderful, sensitive little spot. And now she's tongue-fucking it.");
        c.push("|| bg=\"Slutroom/Oral3\"\n-- If you're going to cum first, it's only fair to finish the other woman off in return.");
      }
      if (g.events.SlutroomFisting) {
        c.push("|| bg=\"Slutroom/Fisting1\"\n-- That wine is going to be hell to get out of the table cloth. But totally worth it.");
        c.push("|| bg=\"Slutroom/Fisting2\"\n-- Oh. Geeze. I didn't think she'd be able to fit both hands in there. Ouch.");
        c.push("|| bg=\"Slutroom/Fisting3\"\n-- I bet that relieved \"it fit\" smile will change in a moment when the fingers start wiggling.");
      }
      if (g.events.SlutroomStrapon) {
        c.push("|| bg=\"Slutroom/Strapon1\"\n-- It's not that she wanted a cock, it's that she wanted to fuck people. The distinction isn't all that subtle, guys.");
        c.push("|| bg=\"Slutroom/Strapon2\"\n-- Look at them both, just dripping. I sneak up behind and put a finger in both asses at the same time, and as expected, the squeals are delightful.");
      }
      if (g.events.SlutroomSybian) {
        c.push("|| bg=\"Slutroom/Sybian1\"\n-- Girl, you're going to have to lick that floor clean later. No-no, you can't stop. Just wanted to let you know.");
        c.push("|| bg=\"Slutroom/Sybian2\"\n-- Truley the finest invention of the age.");
      }
      if (g.events.SlutroomCum) {
        c.push("|| bg=\"Slutroom/Cum1\"\n-- I like this \"internet.\" My kind of place. Liana, get one for everyone.");
        c.push("|| bg=\"Slutroom/Cum2\"\n-- Sssh, don't disturb them. This is my favorite part.");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Slutroom</h4>\n\n" + (Math.choice(c)) + "\n<em class=\"depravity\">+" + (slutroomDepravity()) + "</em>" + (this.cum ? ', <span class="cum">+0.5</span>' : '');
    };

    SlutroomDaily.prototype.effects = {
      depravity: 'depravity',
      cum: 'cum'
    };

    return SlutroomDaily;

  })(Page));

  add(SlutroomOral = (function(superClass) {
    extend(SlutroomOral, superClass);

    function SlutroomOral() {
      return SlutroomOral.__super__.constructor.apply(this, arguments);
    }

    SlutroomOral.prototype.label = "Slutroom Cunnilingus";

    SlutroomOral.prototype.progress = 100;

    SlutroomOral.prototype.text = function() {
      return "<span class=\"depravity\">+1</span> per day for each slutroom.\n<br>With a new spell added to the occupants, they can subsist entirely off of eating each other out, no more food needed.";
    };

    return SlutroomOral;

  })(ResearchJob));

  add(SlutroomOral = (function(superClass) {
    extend(SlutroomOral, superClass);

    function SlutroomOral() {
      return SlutroomOral.__super__.constructor.apply(this, arguments);
    }

    SlutroomOral.prototype.text = function() {
      return "|| bg=\"Slutroom/Oral3\"\n-- There was a young sapphic named Anna\nWho stuffed her friend's cunt with banana,\nWhich she sucked bit by bit\nFrom her partner's warm slit,\nIn the most approved lesbian manner.";
    };

    return SlutroomOral;

  })(Page));

  add(SlutroomFisting = (function(superClass) {
    extend(SlutroomFisting, superClass);

    function SlutroomFisting() {
      return SlutroomFisting.__super__.constructor.apply(this, arguments);
    }

    SlutroomFisting.prototype.conditions = {
      '|events|SlutroomOral': {}
    };

    SlutroomFisting.prototype.label = "Slutroom Fisting";

    SlutroomFisting.prototype.progress = 200;

    SlutroomFisting.prototype.text = function() {
      return "<span class=\"depravity\">+1</span> per day for each slutroom.\n<br>Repeat after me: I want to be stretched, I want to be taken, with your fist in my cunt my mind becomes vacant.";
    };

    return SlutroomFisting;

  })(ResearchJob));

  add(SlutroomFisting = (function(superClass) {
    extend(SlutroomFisting, superClass);

    function SlutroomFisting() {
      return SlutroomFisting.__super__.constructor.apply(this, arguments);
    }

    SlutroomFisting.prototype.text = function() {
      return "|| bg=\"Slutroom/Fisting1\"\n-- Bridget the Midget, the dwarf who loves sucking;\nBridget the Midget, she comes when she's fucking.\nShe loves a good fisting, both active and passive;\nBelieve me good sir, her holes are quite massive.";
    };

    return SlutroomFisting;

  })(Page));

  add(SlutroomStrapon = (function(superClass) {
    extend(SlutroomStrapon, superClass);

    function SlutroomStrapon() {
      return SlutroomStrapon.__super__.constructor.apply(this, arguments);
    }

    SlutroomStrapon.prototype.conditions = {
      '|events|SlutroomFisting': {}
    };

    SlutroomStrapon.prototype.label = "Slutroom Strapon";

    SlutroomStrapon.prototype.progress = 400;

    SlutroomStrapon.prototype.text = function() {
      return "<span class=\"depravity\">+1</span> per day for each slutroom.\n<br>While my sex magic certainly gains the most from women, it also reacts well to penetration. I can give them toys, and then get the best of both worlds!";
    };

    return SlutroomStrapon;

  })(ResearchJob));

  add(SlutroomStrapon = (function(superClass) {
    extend(SlutroomStrapon, superClass);

    function SlutroomStrapon() {
      return SlutroomStrapon.__super__.constructor.apply(this, arguments);
    }

    SlutroomStrapon.prototype.text = function() {
      return "|| bg=\"Slutroom/Strapon1\"\n-- A pansy who lived in Cancun\n  Took a lesbian up to his room,\n  And they argued all night\n  Over who had the right\n  To do what, and with which, and to whom.";
    };

    return SlutroomStrapon;

  })(Page));

  add(SlutroomSybian = (function(superClass) {
    extend(SlutroomSybian, superClass);

    function SlutroomSybian() {
      return SlutroomSybian.__super__.constructor.apply(this, arguments);
    }

    SlutroomSybian.prototype.conditions = {
      '|events|SlutroomStrapon': {}
    };

    SlutroomSybian.prototype.label = "Slutroom Sybian";

    SlutroomSybian.prototype.progress = 800;

    SlutroomSybian.prototype.text = function() {
      return "<span class=\"depravity\">+1</span> per day for each slutroom.\n<br>Oh. My. God. This machine that Liana showed me is the best thing ever. I need to get one for all my sluts.";
    };

    return SlutroomSybian;

  })(ResearchJob));

  add(SlutroomSybian = (function(superClass) {
    extend(SlutroomSybian, superClass);

    function SlutroomSybian() {
      return SlutroomSybian.__super__.constructor.apply(this, arguments);
    }

    SlutroomSybian.prototype.text = function() {
      return "|| bg=\"Slutroom/Sybian1\"\n-- The limerick’s an art form complex\n  Whose contents run chiefly to sex;\n    It’s famous for virgins\n    And masculine urgin’s\n  And vulgar erotic effects.";
    };

    return SlutroomSybian;

  })(Page));

  add(SlutroomCum = (function(superClass) {
    extend(SlutroomCum, superClass);

    function SlutroomCum() {
      return SlutroomCum.__super__.constructor.apply(this, arguments);
    }

    SlutroomCum.prototype.conditions = {
      '|events|SlutroomStrapon': {},
      '|events|MoreResources': {}
    };

    SlutroomCum.prototype.label = "Slutroom cum collection";

    SlutroomCum.prototype.progress = 200;

    SlutroomCum.prototype.text = function() {
      return "<span class=\"cum\">+0.5</span> per day for each slutroom.\n<br>Why does everyone always assume I mean men when I talk about cum? Female cum is just as magically powerful and pleasant.";
    };

    return SlutroomCum;

  })(ResearchJob));

  add(SlutroomCum = (function(superClass) {
    extend(SlutroomCum, superClass);

    function SlutroomCum() {
      return SlutroomCum.__super__.constructor.apply(this, arguments);
    }

    SlutroomCum.prototype.text = function() {
      return "|| bg=\"Slutroom/Cum2\"\n-- Two lesbians north of the town,\n  Made sixty-nine love on the ground.\n  Their unbridled lust\n  Leaked out in the dust\n  And made so much mud that they drowned!";
    };

    return SlutroomCum;

  })(Page));

}).call(this);

(function() {
  var Maid, ManWhore, SexSlave, TrainingChamber, TrainingChamberDaily, choices, name, trainingCost, trainingDetails,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  trainingCost = 7;

  trainingDetails = {
    Sadist: {
      duration: 300,
      base: 'men'
    },
    Domme: {
      duration: 300,
      base: 'women'
    },
    Maid: {
      duration: 300,
      base: 'virgins',
      research: 'Maid'
    },
    'Sex Slave': {
      duration: 150,
      base: 'women',
      research: 'SexSlave'
    },
    'Man Whore': {
      duration: 200,
      base: 'men',
      research: 'ManWhore'
    }
  };

  choices = function() {
    var c, info, name;
    c = {};
    for (name in trainingDetails) {
      info = trainingDetails[name];
      if (!g[info.base]) {
        continue;
      }
      if (info.research && !g.events[info.research]) {
        continue;
      }
      c[name] = name;
    }
    if (Object.keys(c).length === 0) {
      c[''] = '';
    }
    return c;
  };

  add(TrainingChamber = (function(superClass) {
    extend(TrainingChamber, superClass);

    function TrainingChamber() {
      return TrainingChamber.__super__.constructor.apply(this, arguments);
    }

    TrainingChamber.prototype.label = "Training Chamber";

    TrainingChamber.prototype.effects = {
      depravity: -50,
      men: -1,
      women: -1
    };

    TrainingChamber.prototype.size = 'small';

    TrainingChamber.prototype.text = function() {
      return "Lets me train ♂ Slaves into Sadists, and ♀ Slaves into Dommes. Willing human assistants are nice, sometimes. Requires one male and female slave each, permanently installed as teaching aids. I'll also be able to research other servant types later.";
    };

    return TrainingChamber;

  })(RoomJob));

  add(TrainingChamber = (function(superClass) {
    extend(TrainingChamber, superClass);

    function TrainingChamber() {
      return TrainingChamber.__super__.constructor.apply(this, arguments);
    }

    TrainingChamber.prototype.text = function() {
      return "|| bg=\"TrainingChamber/WoodenHorse\"\n-- The point isn't just to hurt people - that's the biggest thing I need to teach my human servants. It's to hurt people so they <em>like it</em>.\n--> Taking a fine, upstanding young woman and reducing her to a fierce mess of lust and base desires is a fine art, and this room is filled with toys... not for doing this, but for teaching others how to do it.";
    };

    return TrainingChamber;

  })(Page));

  add(TrainingChamber = (function(superClass) {
    extend(TrainingChamber, superClass);

    function TrainingChamber() {
      return TrainingChamber.__super__.constructor.apply(this, arguments);
    }

    TrainingChamber.prototype.choice = 'Sadist';

    TrainingChamber.prototype.label = "Training Chamber";

    TrainingChamber.prototype.type = 'boring';

    TrainingChamber.prototype.text = function() {
      var ref;
      return "Here I can train slaves into a wide variety of useful roles. <em class=\"depravity\">-" + trainingCost + "</em>\n\n" + (dropdown(choices(), this.choice)) + ": <strong>" + (this[this.choice] || 0) + " / " + (((ref = trainingDetails[this.choice]) != null ? ref.duration : void 0) || 0) + "</strong>\n<br>Daily progress: <span class=\"intelligence\">Int</span> + <span class=\"lust\">1/2 Lust</span>";
    };

    TrainingChamber.prototype.renderBlock = function(mainKey, location) {
      var element;
      if (choices()[this.choice] == null) {
        this.choice = Object.keys(choices())[0];
      }
      element = $(TrainingChamber.__super__.renderBlock.call(this, mainKey, location));
      element.on('change', 'input', (function(_this) {
        return function() {
          return _this.choice = $('input:checked', element).val();
        };
      })(this));
      return element;
    };

    TrainingChamber.prototype.people = {
      trainer: {
        matches: function(person, job) {
          if (g.depravity < trainingCost) {
            false;
          }
          if (!(g.women || g.men || (g.virgins && g.events.Maid))) {
            false;
          }
          return true;
        },
        label: function() {
          if (g.depravity < trainingCost) {
            'Need <span class="depravity">' + trainingCost + '</span>';
          }
          if (!(g.women || g.men || (g.virgins && g.events.Maid))) {
            return 'Need slave to train';
          } else {
            return '';
          }
        }
      }
    };

    return TrainingChamber;

  })(Job));

  for (name in trainingDetails) {
    Job.TrainingChamber.prototype[name] = 0;
  }

  Job.TrainingChamber.prototype.next = add(TrainingChamberDaily = (function(superClass) {
    extend(TrainingChamberDaily, superClass);

    function TrainingChamberDaily() {
      return TrainingChamberDaily.__super__.constructor.apply(this, arguments);
    }

    TrainingChamberDaily.prototype.conditions = {
      trainer: {},
      '|last': {
        matches: function(job) {
          return job.choice;
        }
      },
      job: '|last',
      progress: {
        fill: function() {
          return this.trainer.intelligence + Math.floor(0.5 * this.trainer.lust);
        }
      },
      remaining: {
        fill: function() {
          var ref;
          return Math.max(0, ((ref = trainingDetails[this.job.choice]) != null ? ref.duration : void 0) - this.job[this.job.choice] - this.progress) || 0;
        }
      }
    };

    TrainingChamberDaily.prototype.text = function() {
      var c;
      if ($('page').length && Math.random() < 0.75 && this.remaining) {
        return false;
      }
      c = this.job.choice === 'Domme' ? ["|| bg=\"TrainingChamber/WoodenHorse\"\n-- I always figure that people should be able to take as well as dish out. They don't have to enjoy it, but they should know what it feels like at least!", "|| bg=\"TrainingChamber/F1\"\n-- You'd think the training slave would have gotten used to it by now, but no, a heel jammed in the cunt always hurts.", "|| bg=\"TrainingChamber/F2\"\n-- That glorious smirk, simultaneously so superior to her victim and yet asking permission from me...", "|| bg=\"TrainingChamber/F3\"\n-- `D Honk-honk,` I squeeze her titties. She blushes and stammers something about \"disrupting her concentration. Dominant with everyone else, putty in my hands - perfect.", "|| bg=\"TrainingChamber/F4\"\n--", "|| bg=\"TrainingChamber/F5\"\n-- We threw our newest dominatrix a graduation party with some of the male slaves. Poor things. I don't think they knew what they were getting into."] : this.job.choice === 'Sadist' ? ["|| bg=\"TrainingChamber/M1\"\n-- A Sadist's training includes not only physical skills, but also mental ones. They need to be able to <em>look</em> scary.", "|| bg=\"TrainingChamber/M2\"\n-- While some men are natural brutes and enjoy watching people suffer, others learn to take a bit of pride in their artistry.", "|| bg=\"TrainingChamber/M3\"\n-- My very favorite sadists are those that look so innocent you can hardly believe their manic grin when they finally get to have their way with a tender little body."] : this.job.choice === 'Maid' ? ["|| bg=\"TrainingChamber/Maid1\"\n-- Polite! Unfailingly polite. I demand perfection in few things, but this is one of them.", "|| bg=\"TrainingChamber/Maid2\"\n-- A well trained maid should be ready to bare herself to her master at any time. She must still blush, though - she's a domestic servant, not some common slut.", "|| bg=\"TrainingChamber/Maid3\"\n-- She's a natural. Just look at that smile.", "|| bg=\"TrainingChamber/Maid4\"\n-- Still embarrassed by how short your skirt is? Don't worry dear, you'll get over it soon. What? No, of course you can't have your underwear back."] : this.job.choice === 'Sex Slave' ? ["|| bg=\"TrainingChamber/Exercise\"\n-- Of course not everyone is fit enough to serve me when they first arrive. A bit of magic to make their exercise go faster is more effective than forcing the whole thing magically.", "|| bg=\"TrainingChamber/SS11\"\n|| bg=\"TrainingChamber/SS12\"\n|| bg=\"TrainingChamber/SS13\"\n|| bg=\"TrainingChamber/SS14\"\n|| bg=\"TrainingChamber/SS15\"\n|| bg=\"TrainingChamber/SS16\"\n|| bg=\"TrainingChamber/SS16\"\n  -- ", "|| bg=\"TrainingChamber/SS21\"\n|| bg=\"TrainingChamber/SS22\"\n|| bg=\"TrainingChamber/SS23\"\n|| bg=\"TrainingChamber/SS24\"\n|| bg=\"TrainingChamber/SS25\"\n|| bg=\"TrainingChamber/SS26\"\n|| bg=\"TrainingChamber/SS26\"\n  -- ", "|| bg=\"TrainingChamber/SS3\"\n-- Getting used to nudity is one of the primary goals in her training.", "|| bg=\"TrainingChamber/SS6\"\n-- While normally I wouldn't interfere in a slave's training, this is a special case. The girl <em>sold bras</em> for a living. How perverted. I'd better hit her brain with a few carefully chosen spells to make sure she doesn't lapse back into bad habits."] : this.job.choice === 'Man Whore' ? ["|| bg=\"TrainingChamber/Maid1\"\n-- Polite! Unfailingly polite. I demand perfection in few things, but this is one of them.", "|| bg=\"TrainingChamber/Maid2\"\n-- A well trained maid should be ready to bare herself to her master at any time. She must still blush, though - she's a domestic servant, not some common slut.", "|| bg=\"TrainingChamber/Maid3\"\n-- She's a natural. Just look at that smile.", "|| bg=\"TrainingChamber/Maid4\"\n-- Still embarrassed by how short your skirt is? Don't worry dear, you'll get over it soon. What? No, of course you can't have your underwear back."] : void 0;
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Training Chamber</h4>\n\n" + (Math.choice(c)) + "\n  <em>" + this.progress + " progress (" + this.remaining + " more needed)<br><span class=\"depravity\">-" + trainingCost + "</span></em>";
    };

    TrainingChamberDaily.prototype.apply = function() {
      var choice, e, person;
      TrainingChamberDaily.__super__.apply.call(this);
      choice = this.context.job.choice;
      this.context.job[choice] += this.context.progress;
      if (!this.context.remaining) {
        e = {};
        e[trainingDetails[choice].base] = -1;
        g.applyEffects(e);
        this.context.job[choice] = 0;
        g.people.push(person = new Person[choice.replace(/ /g, '')]);
        return person.key = (g.people.length - 1).toString();
      }
    };

    TrainingChamberDaily.prototype.effects = {
      depravity: -trainingCost
    };

    return TrainingChamberDaily;

  })(Page));

  add(Maid = (function(superClass) {
    extend(Maid, superClass);

    function Maid() {
      return Maid.__super__.constructor.apply(this, arguments);
    }

    Maid.prototype.label = "Train Maids";

    Maid.prototype.progress = 250;

    Maid.prototype.text = function() {
      return "Allows me to train <span class=\"virgins\"></span> slaves into Maids in my Training Chamber.";
    };

    return Maid;

  })(ResearchJob));

  add(Maid = (function(superClass) {
    extend(Maid, superClass);

    function Maid() {
      return Maid.__super__.constructor.apply(this, arguments);
    }

    Maid.prototype.text = function() {
      return "|| bg=\"Library/Sexy1\"\n-- There was a young sailor from Brighton,\nWho remarked to his girl \"You're a tight one.\"\nShe replied \"'Pon my soul,\nYou're in the wrong hole;\nThere's plenty of room in the right one.\"";
    };

    return Maid;

  })(Page));

  add(SexSlave = (function(superClass) {
    extend(SexSlave, superClass);

    function SexSlave() {
      return SexSlave.__super__.constructor.apply(this, arguments);
    }

    SexSlave.prototype.conditions = {
      '|events|Maid': {},
      '|events|Outreach': {}
    };

    SexSlave.prototype.label = "Train <span class='women'></span> Sex Slaves";

    SexSlave.prototype.progress = 500;

    SexSlave.prototype.text = function() {
      return "Allows me to train <span class=\"women\"></span> slaves into Sex Slaves in my Training Chamber.";
    };

    return SexSlave;

  })(ResearchJob));

  add(SexSlave = (function(superClass) {
    extend(SexSlave, superClass);

    function SexSlave() {
      return SexSlave.__super__.constructor.apply(this, arguments);
    }

    SexSlave.prototype.text = function() {
      return "|| bg=\"Library/Sexy1\"\n-- I wooed a stewed nude in Bermuda,\nI was lewd but my god she was lewder.\nShe said it was crude\nTo be wooed in the nude -\nI pursued her, subdued her and screwed her.\"";
    };

    return SexSlave;

  })(Page));

  add(ManWhore = (function(superClass) {
    extend(ManWhore, superClass);

    function ManWhore() {
      return ManWhore.__super__.constructor.apply(this, arguments);
    }

    ManWhore.prototype.conditions = {
      '|events|Maid': {},
      '|events|Outreach': {}
    };

    ManWhore.prototype.label = "Train <span class='men'></span> Sex Slaves";

    ManWhore.prototype.progress = 500;

    ManWhore.prototype.text = function() {
      return "Allows me to train <span class=\"men\"></span> slaves into Man Whores in my Training Chamber.";
    };

    return ManWhore;

  })(ResearchJob));

  add(ManWhore = (function(superClass) {
    extend(ManWhore, superClass);

    function ManWhore() {
      return ManWhore.__super__.constructor.apply(this, arguments);
    }

    ManWhore.prototype.text = function() {
      return "|| bg=\"Library/Sexy1\"\n-- The president's loud protestation,\nOn his fall to the intern's temptation:\n\"This affair is still moral,\nAs long as it's oral.\nStraight screwing I save for the nation.\"";
    };

    return ManWhore;

  })(Page));

}).call(this);

(function() {
  var BuildMagicCircle, cumdump, Cats, MagicCircle, MagicCircleMagic, MagicCircleTrain, Succubi, choices, name, trainingDetails,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  trainingDetails = {
    Magic: {
      cost: {
        cum: 10
      }
    },
    Meattoilet: {
      duration: 2000,
      base: 'virgins',
      research: 'cumdump',
      cost: {
        cum: 10,
        depravity: 20
      }
    },
    TFMeattoilet: {
      duration: 2000,
      base: 'men',
      research: 'cumdump',
      cost: {
        cum: 10,
        depravity: 15,
        milk: 5
      }
    },

    Catgirl: {
      duration: 200,
      base: 'women',
      research: 'Cats',
      cost: {
        cum: 10,
        milk: 6
      }
    },
    Catboy: {
      duration: 200,
      base: 'men',
      research: 'Cats',
      cost: {
        cum: 10,
        milk: 6
      }
    },
    Succubus: {
      duration: 400,
      base: 'women',
      research: 'Succubi',
      cost: {
        cum: 10,
        depravity: 15,
        milk: 3
      }
    }
  };

  add(BuildMagicCircle = (function(superClass) {
    extend(BuildMagicCircle, superClass);

    function BuildMagicCircle() {
      return BuildMagicCircle.__super__.constructor.apply(this, arguments);
    }

    BuildMagicCircle.prototype.conditions = {
      '|events|MoreResources': {}
    };

    BuildMagicCircle.prototype.label = "Magic Circle";

    BuildMagicCircle.prototype.progress = 250;

    BuildMagicCircle.prototype.text = function() {
      return "Allows me to build Magic Circles, wherein women can increase their <span class=\"magic\">magic</span>\n<br>Magic. It's the only real form of power. Liana has it. I have more of it. She bows to me, and everyone else bows to us - it's the way the world works.";
    };

    return BuildMagicCircle;

  })(ResearchJob));

  add(BuildMagicCircle = (function(superClass) {
    extend(BuildMagicCircle, superClass);

    function BuildMagicCircle() {
      return BuildMagicCircle.__super__.constructor.apply(this, arguments);
    }

    BuildMagicCircle.prototype.text = function() {
      return "|| bg=\"Inn/Pentagram\"\n-- Nearly all men can stand adversity, but if you want to test a man's character, give him power.\"\n--> <em>Magic Circles are small rooms (same size as Dungeons and Slutrooms)</em>";
    };

    return BuildMagicCircle;

  })(Page));

  add(MagicCircle = (function(superClass) {
    extend(MagicCircle, superClass);

    function MagicCircle() {
      return MagicCircle.__super__.constructor.apply(this, arguments);
    }

    MagicCircle.prototype.conditions = {
      '|events|BuildMagicCircle': {}
    };

    MagicCircle.prototype.label = "Magic Circle";

    MagicCircle.prototype.effects = {
      depravity: -350,
      cum: -20,
      virgins: -3
    };

    MagicCircle.prototype.size = 'small';

    MagicCircle.prototype.text = function() {
      return "People can train their <span class=\"magic\">magic</span> here. Three virginal attendants, a purifed space, a magic circle painted in cum... even pathetic mortals ought to be able to make use of surroundings like these.";
    };

    return MagicCircle;

  })(RoomJob));

  add(MagicCircle = (function(superClass) {
    extend(MagicCircle, superClass);

    function MagicCircle() {
      return MagicCircle.__super__.constructor.apply(this, arguments);
    }

    MagicCircle.prototype.text = function() {
      return "|| bg=\"Inn/Pentagram\"\n  -- `D Then you drink it, and... what's wrong?`\n|| bg=\"Liana/Hiding\"\n  --> Oh dear. Oh. Dear. I've made Liana <em>blush</em>. How wonderful, I didn't think she did that any more. I pause to savor the moment. I poke her. She hides her face behind the curtain too.\n  --> `L You want me to drink <em>what</em>?`\n  --> `D Cum. A bucket full at least.`\n\n  -- `L A...and it actually works? You're not just messing with me?`\n  --> I laugh. `D I am always messing with you. But yes, unless you feel like devouring mortal souls, it is the only way to increase your magical power.`\n  --> `L I... um... I won't...`\n  --> `D Silly girl, of course you will. Now come out here and take off your clothes.`";
    };

    return MagicCircle;

  })(Page));

  choices = function() {
    var amount, c, cost, info, name;
    c = {
      Magic: 'Magic'
    };
    for (name in trainingDetails) {
      info = trainingDetails[name];
      if (!g[info.base]) {
        continue;
      }
      if (info.research && !g.events[info.research]) {
        continue;
      }
      if (((function() {
        var ref, results;
        ref = info.cost;
        results = [];
        for (cost in ref) {
          amount = ref[cost];
          if (g[cost] < amount) {
            results.push(cost);
          }
        }
        return results;
      })()).length) {
        continue;
      }
      c[name] = name;
    }
    return c;
  };

  add(MagicCircle = (function(superClass) {
    extend(MagicCircle, superClass);

    function MagicCircle() {
      return MagicCircle.__super__.constructor.apply(this, arguments);
    }

    MagicCircle.prototype.label = 'Magic Circle';

    MagicCircle.prototype.choice = 'Magic';

    MagicCircle.prototype.text = function() {
      var amount, c, cost, ref, ref1, result;
      cost = (function() {
        var ref, results;
        ref = trainingDetails[this.choice].cost;
        results = [];
        for (c in ref) {
          amount = ref[c];
          results.push("<span class='" + c + "'>-" + amount + "</span>");
        }
        return results;
      }).call(this);
      if (this.choice === 'Magic') {
        result = '';
        cost.unshift('<em class="magic">+2 Magic</em>');
      } else {
        result = (this[this.choice] || 0) + " / " + (((ref = trainingDetails[this.choice]) != null ? ref.duration : void 0) || 0) + "\n<br> +" + ((((ref1 = this.context.worker) != null ? ref1.magic : void 0) + 20) || 0) + " daily";
      }
      return "Raising witches and sorceresses is hard work. Or I could warp humans into... other things with <span class=\"magic\">magic</span>. Decisions, decisions.\n\nTrain " + (dropdown(choices(), this.choice)) + " <strong>" + result + "</strong>\n<em>" + (cost.join(', ')) + "</em>";
    };

    MagicCircle.prototype.type = 'boring';

    MagicCircle.prototype.people = {
      worker: {
        matches: function(worker, job) {
          var amount, c, ref;
          if (job.choice === 'Magic' && worker.magic === worker.max.magic) {
            return false;
          }
          ref = trainingDetails[job.choice].cost;
          for (c in ref) {
            amount = ref[c];
            if (g[c] < amount) {
              return false;
            }
          }
          return true;
        },
        label: function() {
          var amount, c, ref;
          ref = trainingDetails[this.choice].cost;
          for (c in ref) {
            amount = ref[c];
            if (g[c] < amount) {
              return 'Need <span class="' + c + '">' + amount + '</span>';
            }
          }
          return '';
        }
      }
    };

    MagicCircle.prototype.renderBlock = function(mainKey, location) {
      var element;
      if (choices()[this.choice] == null) {
        this.choice = Object.keys(choices())[0];
      }
      element = $(MagicCircle.__super__.renderBlock.call(this, mainKey, location));
      element.on('change', 'input', (function(_this) {
        return function() {
          return _this.choice = $('input:checked', element).val();
        };
      })(this));
      return element;
    };

    MagicCircle.prototype.next = function() {
      if (this.choice === 'Magic') {
        return new Page.MagicCircleMagic;
      } else {
        return new Page.MagicCircleTrain;
      }
    };

    return MagicCircle;

  })(Job));

  for (name in trainingDetails) {
    Job.MagicCircle.prototype[name] = 0;
  }

  add(MagicCircleMagic = (function(superClass) {
    extend(MagicCircleMagic, superClass);

    function MagicCircleMagic() {
      return MagicCircleMagic.__super__.constructor.apply(this, arguments);
    }

    MagicCircleMagic.prototype.conditions = {
      worker: {},
      '|last|choice': {
        is: 'Magic'
      }
    };

    MagicCircleMagic.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.5 || ((ref = g.events.MagicCircleMagic) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"MagicCircle/1\"\n-- A few women get really into it. Ok, well, not really \"a few.\" More like \"almost all.\" ", "|| bg=\"MagicCircle/2\"\n-- Good for your complexion. Nothing beats a cum bath for relaxing after a long day.", "|| bg=\"MagicCircle/3\"\n-- Such a cute expression. It's still cum though, and drinking more than a liter of it still makes you slut, no matter how elegant you look doing so."];
      if (this.worker === D) {
        c = ["|| bg=\"Inn/Pentagram\"\n-- Humans and the other mortal races get to drink cum or bathe in it, surrounded by chanting virgins and burning incense.\nI'm not human. Though stealing power in dribbles like this is slow, it does attract somewhat less attention than rising up on a throne of flame and consuming the souls of everyone who comes within a hundred miles. I learned my lesson last time."];
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Magic Circle</h4>\n" + (Math.choice(c)) + "\n  <em class=\"magic\">+2 Magic</em>\n  <em class=\"cum\">-" + trainingDetails.Magic.cost.cum + "</em>";
    };

    MagicCircleMagic.prototype.apply = function() {
      MagicCircleMagic.__super__.apply.call(this);
      return this.context.worker.add('magic', 2);
    };

    MagicCircleMagic.prototype.effects = {
      cum: -trainingDetails.Magic.cost.cum
    };

    return MagicCircleMagic;

  })(Page));

  add(MagicCircleTrain = (function(superClass) {
    extend(MagicCircleTrain, superClass);

    function MagicCircleTrain() {
      return MagicCircleTrain.__super__.constructor.apply(this, arguments);
    }

    MagicCircleTrain.prototype.conditions = {
      worker: {},
      job: '|last',
      progress: {
        fill: function() {
          return this.worker.magic + 20;
        }
      },
      remaining: {
        fill: function() {
          return Math.max(0, trainingDetails[this.job.choice].duration - this.job[this.job.choice] - this.progress);
        }
      }
    };

    MagicCircleTrain.prototype.text = function() {
      var amount, c, co, cost;
      if ($('page').length && Math.random() < 0.75 && this.remaining) {
        return false;
      }
      c = this.job.choice === 'Catgirl' ? ["|| bg=\"MagicCircle/Catgirl1\"\n-- Mrrow.", "|| bg=\"MagicCircle/Catgirl2\"\n-- Good kitty, presenting for your mistress, holes ready for use and mischievous grin.", "|| bg=\"MagicCircle/Catgirl3\"\n-- Rrrrrow.", "|| bg=\"MagicCircle/Catgirl5\"\n-- I think her brains are leaking out of her ears. But that's ok, she doesn't need brains when she's got ears like that."] : this.job.choice === 'Meattoilet' ? ["|| bg=\"Alice/M1\"\n-- What a fallen Maiden. blonde is such a natural slut.", "|| bg=\"Alice/M2\"\n-- What a fallen Maiden. blonde is such a natural slut.", "|| bg=\"Alice/M3\"\n-- What a fallen Maiden. blonde is such a natural slut."] :  this.job.choice === 'TFMeattoilet' ? ["|| bg=\"Alice/TF1\"\n-- Transformation complete. he become she blonde. And, look at her, trying her new role. Those chain will reminded her about her new role", "|| bg=\"Alice/TF2\"\n-- Transformation complete. he become she blonde. And, look at her, trying her new role. Those chain will reminded her about her new role.", "|| bg=\"Alice/TF3\"\n-- Transformation complete. he become she blonde. And, look at her, trying her new role. Those chain will reminded her about her new role."] :this.job.choice === 'Catboy' ? ["|| bg=\"MagicCircle/Catboy1\"\n-- Unlike the catgirl transformation, catboys manage to retain most of their education and intelligence. Also their sense of modesty. Come on, I can't check the health of your tail unless you take those pants off.", "|| bg=\"MagicCircle/Catboy2\"\n-- Don't look so sad, kitty. You'll enjoy your new life more than you ever did your old. Here, have some yarn to play with."] : this.job.choice === 'Succubus' ? ["|| bg=\"MagicCircle/Immersion1\"\n-- Creating a succubus is far more magically intense than a catgirl. Immersing the subject entirely in magically conductive liquid is the only way to get a survival rate above 60%.", "|| bg=\"MagicCircle/Immersion2\"\n-- Yes luv, it <em>is</em> completely necessary. You have to be restrained or you'd hurt yourself, and the liquid is necessary to keep you magically insulated from your surroundings. The vibrators in your pussy and ass? Oh, right, I guess those aren't, strictly speaking, necessary. I just like watching you squirm.", "|| bg=\"MagicCircle/Immersion3\"\n-- The pain gets rather intense during the final phase of the procedure. But your beautiful new body will be ready soon, so bear with it."] : void 0;
      cost = ((function() {
        var ref, results;
        ref = trainingDetails[this.job.choice].cost;
        results = [];
        for (co in ref) {
          amount = ref[co];
          results.push("<span class='" + co + "'>-" + amount + "</span>");
        }
        return results;
      }).call(this)).join(', ');
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Magic Circle</h4>\n\n" + (Math.choice(c)) + "\n  <em>" + this.progress + " progress (" + this.remaining + " more needed)<br>" + cost + "</em>";
    };

    MagicCircleTrain.prototype.apply = function() {
      var amount, c, choice, e, person, ref;
      MagicCircleTrain.__super__.apply.call(this);
      choice = this.context.job.choice;
      this.context.job[choice] += this.context.progress;
      if (!this.context.remaining) {
        e = {};
        e[trainingDetails[choice].base] = -1;
        g.applyEffects(e);
        this.context.job[choice] = 0;
        g.people.push(person = new Person[choice.replace(/ /g, '')]);
        person.key = (g.people.length - 1).toString();
      }
      e = {};
      ref = trainingDetails[this.context.job.choice].cost;
      for (c in ref) {
        amount = ref[c];
        e[c] = -amount;
      }
      return g.applyEffects(e);
    };

    return MagicCircleTrain;

  })(Page));

  add(cumdump = (function(superClass) {
    extend(cumdump, superClass);

    function cumdump() {
      return cumdump.__super__.constructor.apply(this, arguments);
    }

    cumdump.prototype.conditions = {
      '|events|MagicCircle': {}
    };

    cumdump.prototype.label = "Magically Inspect Alice about how to make a Love Doll";

    cumdump.prototype.progress = 15000;

    cumdump.prototype.text = function() {
      return "FINALLY!!! A secret of C.E.L.L. Love Doll Training... Principle is, let someone who chastise their superiority (strong men/ pure virgin) be encourage by hypno, buuut... BREAK THEM AFTERWARDS! A fully masculine and patriarch men who magically genderbent into weak woman or fully teasing holy virgin who fall into corruption will finally think they are no more than a cumdump. Its common for losing intelligence and boosting lust into max potential. But, it seems i miss something. Ah... if only i know what. Anyway, Although not perfect, i could train <span class=\"virgins\"></span> or transform <span class=\"men\"></span> slaves into cumdump at the Magic Circle.";
    };

    return cumdump;

  })(ResearchJob));



  add(Cats = (function(superClass) {
    extend(Cats, superClass);

    function Cats() {
      return Cats.__super__.constructor.apply(this, arguments);
    }

    Cats.prototype.conditions = {
      '|events|MagicCircle': {}
    };

    Cats.prototype.label = "Train Catgirls and Catboys";

    Cats.prototype.progress = 150;

    Cats.prototype.text = function() {
      return "Allows me to warp <span class=\"men\"></span> and <span class=\"women\"></span> slaves into Catboys and Catgirls at the Magic Circle.";
    };

    return Cats;

  })(ResearchJob));

  add(Cats = (function(superClass) {
    extend(Cats, superClass);

    function Cats() {
      return Cats.__super__.constructor.apply(this, arguments);
    }

    Cats.prototype.text = function() {
      return "|| bg=\"MagicCircle/Catgirl1\"\n-- Said the girl who was known as TX\n  \"My life's gotten way too complex.\n  There's girls and there's boys,\n  And all of my toys,\n  It's tough this addiction to sex.\"";
    };

    return Cats;

  })(Page));

  add(Succubi = (function(superClass) {
    extend(Succubi, superClass);

    function Succubi() {
      return Succubi.__super__.constructor.apply(this, arguments);
    }

    Succubi.prototype.conditions = {
      '|events|Cats': {}
    };

    Succubi.prototype.label = "Train Succubi";

    Succubi.prototype.progress = 300;

    Succubi.prototype.text = function() {
      return "Allows me to warp <span class=\"women\"></span> slaves into Succubi at the Magic Circle.";
    };

    return Succubi;

  })(ResearchJob));

  add(Succubi = (function(superClass) {
    extend(Succubi, superClass);

    function Succubi() {
      return Succubi.__super__.constructor.apply(this, arguments);
    }

    Succubi.prototype.text = function() {
      return "|| bg=\"MagicCircle/Immersion1\"\n-- The sea captain's tender young bride\n  Fell into the bay at low tide.\n  He could tell by her squeals\n  That some of the eels\n  Had discovered a good place to hide.";
    };

    return Succubi;

  })(Page));

}).call(this);

(function() {
  var Cocoon, CocoonDaily, cocoonCum, cocoonMilk,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  cocoonMilk = function() {
    return 0.2;
  };

  cocoonCum = function() {
    return 2;
  };

  add(Cocoon = (function(superClass) {
    extend(Cocoon, superClass);

    function Cocoon() {
      return Cocoon.__super__.constructor.apply(this, arguments);
    }

    Cocoon.prototype.label = "Tentacle Cocoon";

    Cocoon.prototype.effects = {
      milk: -30,
      women: -2
    };

    Cocoon.prototype.conditions = {
      '|tentaclesReady': {
        is: true
      },
      '|events|SpawningPit': {}
    };

    Cocoon.prototype.size = 'small';

    Cocoon.prototype.text = function() {
      return "A couple of women permanently encased in living tentacle-shells. <span class=\"milk\">+" + (cocoonMilk()) + "</span>, <span class=\"cum\">+" + (cocoonCum()) + "</span> daily";
    };

    return Cocoon;

  })(RoomJob));

  add(Cocoon = (function(superClass) {
    extend(Cocoon, superClass);

    function Cocoon() {
      return Cocoon.__super__.constructor.apply(this, arguments);
    }

    Cocoon.prototype.text = function() {
      return "|| bg=\"Cocoon/Build1\"\n|| bg=\"Cocoon/Build2\"\n|| bg=\"Cocoon/Build3\"\n|| bg=\"Cocoon/Build4\"\n||\n  -- And she never saw daylight again.";
    };

    Cocoon.prototype.apply = function() {
      Cocoon.__super__.apply.call(this);
      return g.tentaclesReady = false;
    };

    return Cocoon;

  })(Page));

  add(Cocoon = (function(superClass) {
    extend(Cocoon, superClass);

    function Cocoon() {
      return Cocoon.__super__.constructor.apply(this, arguments);
    }

    Cocoon.prototype.label = "Cocoon";

    Cocoon.prototype.text = function() {
      return "Trapped in eternal pleasure, seeing nothing but the inside of their living cocoon and smelling nothing but their own arousal. <span class=\"milk\">+" + (cocoonMilk()) + "</span>, <span class=\"cum\">+" + (cocoonCum()) + "</span> daily";
    };

    Cocoon.prototype.people = {};

    Cocoon.prototype.type = 'boring';

    return Cocoon;

  })(Job));

  Job.Cocoon.prototype.next = add(CocoonDaily = (function(superClass) {
    extend(CocoonDaily, superClass);

    function CocoonDaily() {
      return CocoonDaily.__super__.constructor.apply(this, arguments);
    }

    CocoonDaily.prototype.conditions = {
      milk: {
        fill: cocoonMilk
      },
      cum: {
        fill: cocoonCum
      }
    };

    CocoonDaily.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.75 || ((ref = g.events.CocoonDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"Cocoon/1\"\n-- Are they lucky to have a bit of bodily and sensory freedom or not? I like it at least, since with heads free they can still get embarrassed by people watching.", "|| bg=\"Cocoon/2\"\n-- Underwater? Not a problem - tentacle monsters are very creative at keeping their victims alive and thrashing.", "|| bg=\"Cocoon/3\"\n-- You can tell by the fact that her clothes haven't finished dissolving yet that the third woman is a new addition.", "|| bg=\"Cocoon/4\"\n-- There's not always light inside, but it does turn on occasionally to let them see themselves naked, shivering with ecstasy and drenched in cum."];
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Tentacle Cocoon</h4>\n\n" + (Math.choice(c)) + "\n<span class=\"milk\">+" + (cocoonMilk()) + "</span>, <span class=\"cum\">+" + (cocoonCum()) + "</span>";
    };

    CocoonDaily.prototype.effects = {
      milk: 'milk',
      cum: 'cum'
    };

    return CocoonDaily;

  })(Page));

}).call(this);

(function() {
  var AuctionBad, AuctionGood, AuctionHouse, basePrice, sellPrice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(AuctionHouse = (function(superClass) {
    extend(AuctionHouse, superClass);

    function AuctionHouse() {
      return AuctionHouse.__super__.constructor.apply(this, arguments);
    }

    AuctionHouse.prototype.label = "Auction House";

    AuctionHouse.prototype.size = 'medium';

    AuctionHouse.prototype.effects = {
      depravity: -200,
      women: -2,
      men: -1
    };

    AuctionHouse.prototype.text = function() {
      return "Selling slaves is an ancient tradition of mine. In addition to being fucking sexy, a slave auction is a great way to raise fast capital for further expansion. Liana tells me slavery is illegal in the Oosay (why does she wince every time I say her country's name?), so I'll have to modify the basic formula a bit, but still.";
    };

    return AuctionHouse;

  })(RoomJob));

  add(AuctionHouse = (function(superClass) {
    extend(AuctionHouse, superClass);

    function AuctionHouse() {
      return AuctionHouse.__super__.constructor.apply(this, arguments);
    }

    AuctionHouse.prototype.text = function() {
      return "|| bg=\"AuctionHouse/1\"\n-- To avoid attracting the notice of anyone who might be inclined to object, I've warded the auction house with powerful spells. As soon as you leave, the memory fades to nothing more than a sexy dream - unless you've bought a slave, in which case you're in too deep to back out.";
    };

    return AuctionHouse;

  })(Page));

  basePrice = {
    Sadist: 0.75,
    Domme: 1,
    Maid: 1.5,
    'Sex Slave': 1.25,
    'Man Whore': 1,
    Catgirl: 2.5,
    Catboy: 1.5,
    Meattoilet: 0.1,
    TFMeattoilet: 0.1,
    Succubus: 0.75
  };

  sellPrice = function(p) {
    if (!p) {
      return 0;
    }
    return Math.floor(basePrice[p] * (40 + p.strength + p.intelligence + p.lust + p.magic * 5));
  };

  add(AuctionHouse = (function(superClass) {
    extend(AuctionHouse, superClass);

    function AuctionHouse() {
      return AuctionHouse.__super__.constructor.apply(this, arguments);
    }

    AuctionHouse.prototype.label = "Auction House";

    AuctionHouse.prototype.people = {
      Dealer: {
        is: [Person.DarkLady, Person.Liana, Person.Sadist, Person.Domme, Person.Succubus]
      },
      Merchandise: {
        isnt: [Person.DarkLady, Person.Liana]
      }
    };

    AuctionHouse.prototype.text = function() {
      return "This isn't the sort of auction where low-grade human chattel is dealt with - exclusive merchandise, exclusive clientele. All the of the merchandise's stats contribute to the price.\n\n<em><span class=\"depravity\">+" + (sellPrice(this.context.Merchandise)) + "</span>, <span class=\"resistance\">+5</span></em>.\n\n  " + (Page.statCheckDescription('intelligence|lust', 65, Job.AuctionHouse.next, this.context));
    };

    AuctionHouse.prototype.stat = 'intelligence|lust';

    AuctionHouse.prototype.difficulty = 65;

    AuctionHouse.prototype.next = Page.statCheck;

    AuctionHouse.next = {};

    AuctionHouse.prototype.type = 'special';

    return AuctionHouse;

  })(Job));

  Job.AuctionHouse.next['good'] = add(AuctionGood = (function(superClass) {
    extend(AuctionGood, superClass);

    function AuctionGood() {
      return AuctionGood.__super__.constructor.apply(this, arguments);
    }

    AuctionGood.prototype.conditions = {
      job: '|last',
      Merchandise: {},
      price: {
        fill: function() {
          return sellPrice(this.Merchandise);
        }
      }
    };

    AuctionGood.prototype.text = function() {
      var c;
      c = ["|| bg=\"AuctionHouse/1\"\n-- On her hands and knees she showed off her charms for the customers, and they snapped her right up.", "|| bg=\"AuctionHouse/2\"\n-- All the slaves sold here are highly trained - the chains and gags are hardly necessary, but they do add a certain ambiance to the proceedings that I'd be loath to do without.", "|| bg=\"AuctionHouse/3\"\n-- She displays her obedience for her new (potential) owner.", "|| bg=\"AuctionHouse/4\"\n-- \"And next up we have this wonderful slut and her sister. Own both in the bargain of the century. Shall we start the bidding at $25,000... $25,000 from the gentlemen up front. $30,000... yes, I have $30,000...\" ", "|| bg=\"AuctionHouse/5\"\n-- \"Yes she is, the cutest little slut you ever did see. Ladies and gentlemen, just look at how wet she is at the prospect of being owned by one of you. Shall I ask her to do anything else before we begin? Yes? Good idea sir, someone bring me a butt plug. Now, let's start the bidding at $20,000. Come on, don't be shy...\" "];
      if (this.Merchandise instanceof Person.Catgirl) {
        c = ["|| bg=\"AuctionHouse/Catgirl1\"\n-- What a sadistic new master she's been sold to. Making her wear clothes!", "|| bg=\"AuctionHouse/Catgirl2\"\n-- How horrible. I hope her new master lets her catch the toy eventually."];
      }
      return Math.choice(c) + ("\n<em><span class='depravity'>+" + this.price + "</span>, <span class='resistance'>+5</span></em>");
    };

    AuctionGood.prototype.apply = function() {
      AuctionGood.__super__.apply.call(this);
      delete this.context.job.context.Merchandise;
      return g.people.remove(this.context.Merchandise);
    };

    AuctionGood.prototype.effects = {
      depravity: 'price',
      resistance: 5
    };

    return AuctionGood;

  })(Page));

  Job.AuctionHouse.next['bad'] = add(AuctionBad = (function(superClass) {
    extend(AuctionBad, superClass);

    function AuctionBad() {
      return AuctionBad.__super__.constructor.apply(this, arguments);
    }

    AuctionBad.prototype.conditions = {
      Merchandise: {}
    };

    AuctionBad.prototype.text = function() {
      return "|| bg=\"AuctionHouse/6\"\n-- The " + (this.Merchandise.name.toLowerCase()) + " didn't sell today - quite a shame, but no one was willing to shell out a fair price for " + him + ". Oh well, there's always tomorrow.";
    };

    return AuctionBad;

  })(Page));

}).call(this);

(function() {
  var Gym, GymDaily, GymDarkLady, SexyGym, effect,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  effect = function() {
    var e;
    e = 2;
    if (g.events.SexyGym) {
      e += 1;
    }
    return e;
  };

  add(Gym = (function(superClass) {
    extend(Gym, superClass);

    function Gym() {
      return Gym.__super__.constructor.apply(this, arguments);
    }

    Gym.prototype.label = "Gym";

    Gym.prototype.size = 'medium';

    Gym.prototype.effects = {
      depravity: -150,
      men: -2,
      women: -1
    };

    Gym.prototype.text = function() {
      return "People can train their <span class=\"strength\">strength</span> here. So far I've relied on my magic to get my way, but it's somewhat boring having to hunt every new slave myself.";
    };

    return Gym;

  })(RoomJob));

  add(Gym = (function(superClass) {
    extend(Gym, superClass);

    function Gym() {
      return Gym.__super__.constructor.apply(this, arguments);
    }

    Gym.prototype.text = function() {
      return "|| bg=\"Gym/Treadmills\"\n-- While I myself am of course eternally perfect, I can hardly expect the same of my merely mortal servants.\n--> The postal system in this kingdom is amazing. I have only to tell my servants to spend their money, and like magic the appropriate items show up on my doorstop.";
    };

    return Gym;

  })(Page));

  add(Gym = (function(superClass) {
    extend(Gym, superClass);

    function Gym() {
      return Gym.__super__.constructor.apply(this, arguments);
    }

    Gym.prototype.label = "Gym";

    Gym.prototype.text = function() {
      return "Running around, working out and generally getting sweaty and exhausted has some benefits for humans.\n\n<em class=\"strength\">+" + (effect()) + " Strength</em>";
    };

    Gym.prototype.people = {
      worker: {
        matches: function(w) {
          return w.strength < w.max.strength;
        }
      }
    };

    Gym.prototype.next = Page.firstMatch;

    Gym.next = [];

    Gym.prototype.type = 'boring';

    return Gym;

  })(Job));

  Job.Gym.next.push(add(GymDarkLady = (function(superClass) {
    extend(GymDarkLady, superClass);

    function GymDarkLady() {
      return GymDarkLady.__super__.constructor.apply(this, arguments);
    }

    GymDarkLady.prototype.conditions = {
      '|last|worker': {
        is: Person.DarkLady
      }
    };

    GymDarkLady.prototype.text = function() {
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Gym</h4>\n||\n  -- I'm not going to do anything so undignified as sweat. Fuck that.\n  -- I sit on the ground, cross my legs, and sink into myself. Most people wouldn't expect to find the Dark Lady of lust and domination to meditate, but... most people don't really know me very well.\n|| bg=\"Gym/Meditate\"\n  --> I am not human. I am not mortal. Being dead for how many thousands of years has weakened me, but not in the ways that matter. From the eternal font of power that is my soul, I draw forth magic and restore some of my body's might.\n  --> <em class=\"strength\">+" + (effect()) + " Strength</em>";
    };

    GymDarkLady.prototype.apply = function() {
      GymDarkLady.__super__.apply.call(this);
      return D.add('strength', effect());
    };

    return GymDarkLady;

  })(Page)));

  Job.Gym.next.push(add(GymDaily = (function(superClass) {
    extend(GymDaily, superClass);

    function GymDaily() {
      return GymDaily.__super__.constructor.apply(this, arguments);
    }

    GymDaily.prototype.conditions = {
      worker: {}
    };

    GymDaily.prototype.text = function() {
      var l, ref;
      if ($('page').length && (Math.random() < 0.75 || ((ref = g.events.GymDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      l = ["|| bg=\"Gym/Treadmills\"\n--", "|| bg=\"Gym/Bike1\"\n--", "|| bg=\"Gym/Bike2\"\n--"];
      if (g.events.SexyGym) {
        l.push("|| bg=\"Gym/Nude1\"\n-- These girls are faster than they look. Catching them is a hard prize to earn!");
        l.push("|| bg=\"Gym/Nude2\"\n--");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Gym</h4>\n" + (Math.choice(l)) + "\n  <em class=\"strength\">+" + (effect()) + " Strength</em>";
    };

    GymDaily.prototype.apply = function() {
      GymDaily.__super__.apply.call(this);
      return this.context.worker.add('strength', effect());
    };

    return GymDaily;

  })(Page)));

  add(SexyGym = (function(superClass) {
    extend(SexyGym, superClass);

    function SexyGym() {
      return SexyGym.__super__.constructor.apply(this, arguments);
    }

    SexyGym.prototype.label = "Nude Gym";

    SexyGym.prototype.progress = 500;

    SexyGym.prototype.text = function() {
      return "<span class=\"strength\">+1 Strength</span> when training in the gym.\n<br>Really, clothes just get in the way when you're exercising.";
    };

    return SexyGym;

  })(ResearchJob));

  add(SexyGym = (function(superClass) {
    extend(SexyGym, superClass);

    function SexyGym() {
      return SexyGym.__super__.constructor.apply(this, arguments);
    }

    SexyGym.prototype.text = function() {
      return "|| bg=\"Gym/Nude1\"\n-- I've added all sorts of fun games to the gym. Catch her you get to fuck her. He catches you he fucks you. Lift ten more pounds than last week and get a blow job.\n --> Ok, not really \"all sorts.\"\n --> Look, I'm the Dark Lady. I like to stick with what I know.";
    };

    return SexyGym;

  })(Page));

}).call(this);

(function() {
  var Laboratory, progress, stillResearch,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(Laboratory = (function(superClass) {
    extend(Laboratory, superClass);

    function Laboratory() {
      return Laboratory.__super__.constructor.apply(this, arguments);
    }

    Laboratory.prototype.label = "Laboratory";

    Laboratory.prototype.effects = {
      depravity: -100,
      virgins: -2
    };

    Laboratory.prototype.size = 'medium';

    Laboratory.prototype.text = function() {
      return "I can research upgrades to my various rooms here. It's embarrassing to consider how poorly run my current operation is.";
    };

    return Laboratory;

  })(RoomJob));

  add(Laboratory = (function(superClass) {
    extend(Laboratory, superClass);

    function Laboratory() {
      return Laboratory.__super__.constructor.apply(this, arguments);
    }

    Laboratory.prototype.text = function() {
      return "|| bg=\"Laboratory/1\"\n-- A pair of sweet young research assistants. They're bright little things, perfectly aware of what this research entails, and not at all brainwashed. Who wouldn't want to spend their days dreaming up new perversions?";
    };

    return Laboratory;

  })(Page));

  stillResearch = function() {
    var k, ref, v;
    ref = g.map.Research.jobs;
    for (k in ref) {
      v = ref[k];
      if (v) {
        return true;
      }
    }
    return g.goal != null;
  };

  add(Laboratory = (function(superClass) {
    extend(Laboratory, superClass);

    function Laboratory() {
      return Laboratory.__super__.constructor.apply(this, arguments);
    }

    Laboratory.prototype.label = "Laboratory";

    Laboratory.prototype.text = function() {
      var ref, ref1, ref2, ref3;
      return "It's not just a matter of sticking things in new orifices - I need to make sure my slaves are happy and healthy with each new perversion I bless them with. A researcher here can help me figure out how, with their <span class=\"intelligence\">Intelligence</span> and <span class=\"magic\">Magic</span>.\n<br><span class=\"depravity\">-" + (progress(this.context.researcher)) + "</span>, +" + (progress(this.context.researcher) * 2) + " progress</em>\n<em>" + (((ref = g.goal) != null ? ref.label : void 0) || '') + "</em>\n" + ((((ref1 = g.goal) != null ? ref1.constructor.prototype.progress : void 0) - ((ref2 = g.goal) != null ? ref2.progress : void 0)) || 0) + "/" + (((ref3 = g.goal) != null ? ref3.constructor.prototype.progress : void 0) || 0);
    };

    Laboratory.prototype.people = {
      researcher: {
        matches: stillResearch,
        label: function() {
          if (stillResearch()) {
            return '';
          } else {
            return 'No more topics';
          }
        }
      }
    };

    Laboratory.prototype.next = Page.ResearchChoice;

    return Laboratory;

  })(Job));

  progress = Page.Laboratory.researchProgress = function(researcher) {
    if (!researcher) {
      return 0;
    }
    return Math.min(g.depravity, Math.floor(researcher.intelligence * 0.5 + researcher.magic * 0.25));
  };

}).call(this);

(function() {
  var Library, LibraryDaily, NudeLibrarian, SexyLibrarian, effect, trainingCost,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  trainingCost = 2;

  effect = function() {
    var e;
    e = 2;
    if (g.events.SexyLibrarian) {
      e += 0.5;
    }
    if (g.events.NudeLibrarian) {
      e += 0.5;
    }
    return e;
  };

  add(Library = (function(superClass) {
    extend(Library, superClass);

    function Library() {
      return Library.__super__.constructor.apply(this, arguments);
    }

    Library.prototype.label = "Library";

    Library.prototype.size = 'medium';

    Library.prototype.effects = {
      depravity: -200,
      women: -3
    };

    Library.prototype.conditions = {
      '|events|Laboratory': {}
    };

    Library.prototype.text = function() {
      return "People can train their <span class=\"intelligence\">intelligence</span> here. Honestly, I'm not completely sure what smarts are good for, but I guess I might need smart people for something someday? It certainly makes Liana wet, so I guess intelligence isn't completely useless.";
    };

    return Library;

  })(RoomJob));

  add(Library = (function(superClass) {
    extend(Library, superClass);

    function Library() {
      return Library.__super__.constructor.apply(this, arguments);
    }

    Library.prototype.text = function() {
      return "|| bg=\"Library/Empty\"\n  -- Books. Fucking books everywhere. \"California\" seems to produce them by the truckload. Their scribes must be amazing.\n|| bg=\"Liana/Happy\"\n  --> `L We don't use scribes, we have these things called...`\n|| bg=\"Liana/Tentacles\"\n  --> `L Ahh! Mistress...?`\n  --> `D Hush dear. Don't correct me when I'm ranting.`";
    };

    return Library;

  })(Page));

  add(Library = (function(superClass) {
    extend(Library, superClass);

    function Library() {
      return Library.__super__.constructor.apply(this, arguments);
    }

    Library.prototype.label = "Library";

    Library.prototype.type = 'boring';

    Library.prototype.text = function() {
      return "I really do not see the point of a library. If people are me, they're already devastatingly intelligent. If they're not, all they need to know is obedience and fucking. Sigh. Liana's giving me that <em>look</em> again. Guess I'll buy more books.\n\n<em class=\"intelligence\">+" + (effect()) + " Intelligence</em>";
    };

    Library.prototype.people = {
      worker: {
        matches: function(w) {
          return g.depravity >= trainingCost && w.intelligence < w.max.intelligence;
        },
        label: function() {
          if (g.depravity >= trainingCost) {
            return '';
          } else {
            return 'Need <span class="depravity">' + trainingCost + '</span>';
          }
        }
      }
    };

    Library.prototype.next = Page.firstMatch;

    return Library;

  })(Job));

  Job.Library.prototype.next = add(LibraryDaily = (function(superClass) {
    extend(LibraryDaily, superClass);

    function LibraryDaily() {
      return LibraryDaily.__super__.constructor.apply(this, arguments);
    }

    LibraryDaily.prototype.conditions = {
      worker: {}
    };

    LibraryDaily.prototype.text = function() {
      var l, ref;
      if ($('page').length && (Math.random() < 0.75 || ((ref = g.events.LibraryDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      l = ["|| bg=\"Library/Belly\"\n-- \"Can I help you find anything, " + (sir(this.worker)) + "? M-my shirt? Yes, I-I suppose, if you wish...\" ", "|| bg=\"Library/Empty\"\n-- Books, books, books. Heart and soul of the amazing power of \"California\", Liana insists, but I'm not really a fan."];
      if (g.events.SexyLibrarian) {
        l.push("|| bg=\"Library/Sexy1\"\n-- This librarian seems to be taking her authority to punish late books rather seriously.");
        l.push("|| bg=\"Library/Sexy2\"\n-- It's exhausting, keeping the shelves straight when most visitors would rather fuck you than complete their assigned research.");
        l.push("|| bg=\"Library/Sexy3\"\n-- \"Stop leaving all the books out! I'm a librarian, not your mother!\" ");
      }
      if (g.events.NudeLibrarian) {
        l.push("|| bg=\"Library/Nude1\"\n-- It's exhausting, keeping the shelves straight when most visitors would rather fuck you than complete their assigned research.");
        l.push("|| bg=\"Library/Nude2\"\n-- \"Look, I can see you're distracted. Shall I help you relax before a bit before you get started?\" ");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Library</h4>\n" + (Math.choice(l)) + "\n  <em class=\"intelligence\">+" + (effect()) + " Intelligence</em>";
    };

    LibraryDaily.prototype.apply = function() {
      LibraryDaily.__super__.apply.call(this);
      return this.context.worker.add('intelligence', effect());
    };

    return LibraryDaily;

  })(Page));

  add(SexyLibrarian = (function(superClass) {
    extend(SexyLibrarian, superClass);

    function SexyLibrarian() {
      return SexyLibrarian.__super__.constructor.apply(this, arguments);
    }

    SexyLibrarian.prototype.conditions = {
      '|events|Library': {}
    };

    SexyLibrarian.prototype.label = "Sexy Librarians";

    SexyLibrarian.prototype.progress = 350;

    SexyLibrarian.prototype.text = function() {
      return "<span class=\"intelligence\">+0.5 Intelligence</span> when training in a library.\n<br>I'd rather check out a book from a sexy librarian than I would from an unsexy one. So obvious, duh.";
    };

    return SexyLibrarian;

  })(ResearchJob));

  add(SexyLibrarian = (function(superClass) {
    extend(SexyLibrarian, superClass);

    function SexyLibrarian() {
      return SexyLibrarian.__super__.constructor.apply(this, arguments);
    }

    SexyLibrarian.prototype.text = function() {
      return "|| bg=\"Library/Sexy1\"\n-- The limerick's callous and crude,\nIts morals distressingly lewd;\nIt's not worth the reading\nBy persons of breeding -\nIt's designed to be callous and rude.";
    };

    return SexyLibrarian;

  })(Page));

  add(NudeLibrarian = (function(superClass) {
    extend(NudeLibrarian, superClass);

    function NudeLibrarian() {
      return NudeLibrarian.__super__.constructor.apply(this, arguments);
    }

    NudeLibrarian.prototype.label = "Nude Librarians";

    NudeLibrarian.prototype.progress = 700;

    NudeLibrarian.prototype.conditions = {
      '|events|SexyLibrarian': {}
    };

    NudeLibrarian.prototype.text = function() {
      return "<span class=\"intelligence\">+0.5 Intelligence</span> when training in a library.\n<br>Honestly, I don't know why I let anyone wear clothes at all.";
    };

    return NudeLibrarian;

  })(ResearchJob));

  add(NudeLibrarian = (function(superClass) {
    extend(NudeLibrarian, superClass);

    function NudeLibrarian() {
      return NudeLibrarian.__super__.constructor.apply(this, arguments);
    }

    NudeLibrarian.prototype.text = function() {
      return "|| bg=\"Library/Nude2\"\n-- Hm. I do remember why I let people wear clothes now - if they're not wearing any, then they quickly lose their embarrassment when they have to take them off. Oh well. Guess I'll only make them take off their clothes randomly.";
    };

    return NudeLibrarian;

  })(Page));

}).call(this);

(function() {
  var Outreach, OutreachBad, OutreachGood, OutreachMan, OutreachMen, OutreachMixed, OutreachVeryGood, OutreachVirgin, OutreachWoman, OutreachWomen,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(Outreach = (function(superClass) {
    extend(Outreach, superClass);

    function Outreach() {
      return Outreach.__super__.constructor.apply(this, arguments);
    }

    Outreach.prototype.label = "Community Outreach Center";

    Outreach.prototype.size = 'medium';

    Outreach.prototype.effects = {
      depravity: -150,
      men: -2,
      women: -2
    };

    Outreach.prototype.text = function() {
      return "I can't just take over this village with a horde of orcs, like I would have in the old days. The authorities are too well organized. I'll need a community outreach center to start <span class=\"strike\">brainwashing</span> educating the populace into joining me willingly.";
    };

    return Outreach;

  })(RoomJob));

  add(Outreach = (function(superClass) {
    extend(Outreach, superClass);

    function Outreach() {
      return Outreach.__super__.constructor.apply(this, arguments);
    }

    Outreach.prototype.text = function() {
      return "|| bg=\"Outreach/1\"\n-- Humans like being slaves, and they like owning slaves, and they like sex. With some... volunteers... I can help remind them of these facts, which in turn makes them much less likely to call upon the kingdom to defend them from my efforts.\n--> More importantly, though, I can get volunteers!\n--> I love volunteers.";
    };

    return Outreach;

  })(Page));

  add(Outreach = (function(superClass) {
    extend(Outreach, superClass);

    function Outreach() {
      return Outreach.__super__.constructor.apply(this, arguments);
    }

    Outreach.prototype.label = "Outreach Center";

    Outreach.prototype.text = function() {
      return "Snatching women of the street is effective, but I can't do it too often or people will stop going out alone. A nice \"Hiring\" sign and some cute bimbos, though? Attracts young people like flies to honey.\n<br><em>Recruit slaves safely. <span class=\"resistance\">+1 to +4</span></em>\n\n" + (Page.statCheckDescription('lust', 30, Job.Outreach.next, this.context));
    };

    Outreach.prototype.people = {
      worker: {},
      worker2: {
        optional: true
      },
      worker3: {
        optional: true
      }
    };

    Outreach.prototype.stat = 'lust';

    Outreach.prototype.difficulty = 40;

    Outreach.prototype.next = Page.statCheck;

    Outreach.next = {};

    Outreach.prototype.type = 'boring';

    return Outreach;

  })(Job));

  add(OutreachMan = (function(superClass) {
    extend(OutreachMan, superClass);

    function OutreachMan() {
      return OutreachMan.__super__.constructor.apply(this, arguments);
    }

    OutreachMan.prototype.text = function() {
      var ref;
      if ($('page').length && (Math.random() < 0.5 || ((ref = g.events.Outreach) != null ? ref[1] : void 0) === g.day)) {
        return false;
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Outreach Center</h4>\n|| bg=\"Outreach/3\"\n  -- Bikini babes handing out fliers for a free welcome barbecue? Sign one new (soon to be) slave up. He hardly even objected when the girls told him it was a lifetime commitment (the breasts almost popping out of her top probably had something to do with that).\n  <em><span class=\"men\">+1</span>, <span class=\"resistance\">+1</span></em>";
    };

    OutreachMan.prototype.effects = {
      men: 1,
      resistance: 1
    };

    return OutreachMan;

  })(Page));

  add(OutreachWoman = (function(superClass) {
    extend(OutreachWoman, superClass);

    function OutreachWoman() {
      return OutreachWoman.__super__.constructor.apply(this, arguments);
    }

    OutreachWoman.prototype.text = function() {
      var ref;
      if (((ref = g.events.Outreach) != null ? ref[1] : void 0) === g.day) {
        return false;
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Outreach Center</h4>\n|| bg=\"Outreach/2\"\n  -- \"Will I really be able to look like that?\"\n    \"Of course!\" She grins and shakes her ass. \"One of the perks of such an active lifestyle. And the guys produce a special cream which is wonderful for the complexion...\"\n  <em><span class=\"women\">+1</span>, <span class=\"resistance\">+1</span></em>";
    };

    OutreachWoman.prototype.effects = {
      women: 1,
      resistance: 1
    };

    return OutreachWoman;

  })(Page));

  add(OutreachVirgin = (function(superClass) {
    extend(OutreachVirgin, superClass);

    function OutreachVirgin() {
      return OutreachVirgin.__super__.constructor.apply(this, arguments);
    }

    OutreachVirgin.prototype.text = function() {
      var ref;
      if (((ref = g.events.Outreach) != null ? ref[1] : void 0) === g.day) {
        return false;
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Outreach Center</h4>\n|| bg=\"Outreach/1\"\n  -- \"Oh, aren't you the cutest little thing. Just out of high-school, are you, and looking for a job? Excellent, well, I have an opportunity I think would fit great inside yo... oops, I mean would be a great fit <em>for</em> you...\"\n  <em><span class=\"virgins\">+1</span>, <span class=\"resistance\">+2</span></em>";
    };

    OutreachVirgin.prototype.effects = {
      virgins: 1,
      resistance: 2
    };

    return OutreachVirgin;

  })(Page));

  add(OutreachMen = (function(superClass) {
    extend(OutreachMen, superClass);

    function OutreachMen() {
      return OutreachMen.__super__.constructor.apply(this, arguments);
    }

    OutreachMen.prototype.text = function() {
      var ref;
      if (((ref = g.events.Outreach) != null ? ref[1] : void 0) === g.day) {
        return false;
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Outreach Center</h4>\n|| bg=\"Outreach/Men\"\n  -- \"I'll let you fuck me,\" she slips one breast out of her blouse, playing with the nipple.\n  Silence.\n  \"And a six pack of beer.\"\n  They grin and sign.\n  <em><span class=\"men\">+3</span>, <span class=\"resistance\">+2</span></em>";
    };

    OutreachMen.prototype.effects = {
      men: 3,
      resistance: 2
    };

    return OutreachMen;

  })(Page));

  add(OutreachWomen = (function(superClass) {
    extend(OutreachWomen, superClass);

    function OutreachWomen() {
      return OutreachWomen.__super__.constructor.apply(this, arguments);
    }

    OutreachWomen.prototype.text = function() {
      var ref;
      if (((ref = g.events.Outreach) != null ? ref[1] : void 0) === g.day) {
        return false;
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Outreach Center</h4>\n|| bg=\"Outreach/Women\"\n  -- <em><span class=\"women\">+3</span>, <span class=\"resistance\">+3</span></em>";
    };

    OutreachWomen.prototype.effects = {
      women: 3,
      resistance: 3
    };

    return OutreachWomen;

  })(Page));

  add(OutreachMixed = (function(superClass) {
    extend(OutreachMixed, superClass);

    function OutreachMixed() {
      return OutreachMixed.__super__.constructor.apply(this, arguments);
    }

    OutreachMixed.prototype.text = function() {
      var ref;
      if (((ref = g.events.Outreach) != null ? ref[1] : void 0) === g.day) {
        return false;
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Outreach Center</h4>\n|| bg=\"Outreach/Women2\"\n  -- \"Come on, it looks fun.\"\n  \"I dunno, m-maybe we should think more about the 'sex slave' part...\"\n  \"Stop being a pussy. The money's good, and I know you're a pervert. And you always end up giving in, so let's just skip the whining and have a good time.\"\n  \"B-but...\"\n  <em><span class=\"women\">+2</span>, <span class=\"virgins\">+1</span>, <span class=\"resistance\">+4</span></em>";
    };

    OutreachMixed.prototype.effects = {
      women: 2,
      virgins: 1,
      resistance: 4
    };

    return OutreachMixed;

  })(Page));

  Job.Outreach.next['bad'] = add(OutreachBad = (function(superClass) {
    extend(OutreachBad, superClass);

    function OutreachBad() {
      return OutreachBad.__super__.constructor.apply(this, arguments);
    }

    OutreachBad.prototype.text = function() {
      var ref;
      if (((ref = g.events.Outreach) != null ? ref[0] : void 0) === g.day) {
        return false;
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Outreach Center</h4>\n|| bg=\"Outreach/Resting\"\n  -- The girls ran around looking for someone to recruit, but didn't manage to attract any attention.";
    };

    return OutreachBad;

  })(Page));

  Job.Outreach.next['good'] = add(OutreachGood = (function(superClass) {
    extend(OutreachGood, superClass);

    function OutreachGood() {
      return OutreachGood.__super__.constructor.apply(this, arguments);
    }

    OutreachGood.prototype.text = function() {
      return false;
    };

    OutreachGood.prototype.next = Page.trueRandom;

    OutreachGood.next = [Page.OutreachMan, Page.OutreachMan, Page.OutreachWoman, Page.OutreachWoman, Page.OutreachVirgin];

    return OutreachGood;

  })(Page));

  Job.Outreach.next['veryGood'] = add(OutreachVeryGood = (function(superClass) {
    extend(OutreachVeryGood, superClass);

    function OutreachVeryGood() {
      return OutreachVeryGood.__super__.constructor.apply(this, arguments);
    }

    OutreachVeryGood.prototype.text = function() {
      return false;
    };

    OutreachVeryGood.prototype.next = Page.trueRandom;

    OutreachVeryGood.next = [Page.OutreachMen, Page.OutreachWomen, Page.OutreachMixed];

    return OutreachVeryGood;

  })(Page));

}).call(this);

(function() {
  var PornBad, PornGood, PornStudio, VideoCameras,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(VideoCameras = (function(superClass) {
    extend(VideoCameras, superClass);

    function VideoCameras() {
      return VideoCameras.__super__.constructor.apply(this, arguments);
    }

    VideoCameras.prototype.label = "Video Cameras";

    VideoCameras.prototype.progress = 400;

    VideoCameras.prototype.conditions = {
      '|events|SexSlave': {}
    };

    VideoCameras.prototype.text = function() {
      return "I shall put my finest minds on it. We shall work day and night until we've mastered this fearsome foes, resting not for wind nor fire nor storm nor orgy breaks. We will master the art of <em>setting the VCR clock</em> or die trying. Then and only then will the blinky numbers stop annoying me enough to allow them in my domain.";
    };

    return VideoCameras;

  })(ResearchJob));

  add(VideoCameras = (function(superClass) {
    extend(VideoCameras, superClass);

    function VideoCameras() {
      return VideoCameras.__super__.constructor.apply(this, arguments);
    }

    VideoCameras.prototype.text = function() {
      return "|| bg=\"PornStudio/Catgirl2\"\n-- There was a young whore from Kilkenny,\nWho charged two fucks for a penny,\nFor half of that sum,\nYou could bugger her bum,\nAn economy practised by many";
    };

    return VideoCameras;

  })(Page));

  add(PornStudio = (function(superClass) {
    extend(PornStudio, superClass);

    function PornStudio() {
      return PornStudio.__super__.constructor.apply(this, arguments);
    }

    PornStudio.prototype.label = "Porn Studio";

    PornStudio.prototype.size = 'medium';

    PornStudio.prototype.conditions = {
      '|events|VideoCameras': {}
    };

    PornStudio.prototype.effects = {
      depravity: -200,
      men: -1
    };

    PornStudio.prototype.text = function() {
      return "Apparently there are devices which can watch people having sex, and make money? I'm not clear on the details, but it seems I can let people all over the world watch slaves fucking with these 'cameras.'";
    };

    return PornStudio;

  })(RoomJob));

  add(PornStudio = (function(superClass) {
    extend(PornStudio, superClass);

    function PornStudio() {
      return PornStudio.__super__.constructor.apply(this, arguments);
    }

    PornStudio.prototype.text = function() {
      return "|| bg=\"PornStudio/2\"\n  -- A bed, a bunch of techno gadgets, the internet (what's an externet, I wonder?), a 50lb bucket of lube.\n|| bg=\"PornStudio/2\"\n  --> We're ready to roll.";
    };

    return PornStudio;

  })(Page));

  add(PornStudio = (function(superClass) {
    extend(PornStudio, superClass);

    function PornStudio() {
      return PornStudio.__super__.constructor.apply(this, arguments);
    }

    PornStudio.prototype.label = "Porn Studio";

    PornStudio.prototype.text = function() {
      return "Transmitting depravity around the globe... I like this 'internet' thing. The market is apparently rather crowded though, so I'll need a stand-out product if I want to whore my wares properly.\n\n<span class=\"resistance\">Up to -2</span>\n" + (Page.statCheckDescription('lust', 130, Job.PornStudio.next, this.context));
    };

    PornStudio.prototype.people = {
      SexSlave: {
        label: function() {
          return 'Sex Slave';
        },
        is: [Person.SexSlave, Person.Liana]
      },
      ManWhore: {
        label: function() {
          return 'Man Whore';
        },
        is: Person.ManWhore,
        optional: true
      },
      Domme: {
        optional: true,
        is: [Person.Domme, Person.DarkLady]
      },
      Sadist: {
        optional: true,
        is: Person.Sadist
      },
      Maid: {
        optional: true,
        is: Person.Maid
      },
      Catgirl: {
        optional: true,
        is: Person.Catgirl
      },
      Catboy: {
        optional: true,
        is: Person.Catboy
      }
    };

    PornStudio.prototype.stat = 'lust';

    PornStudio.prototype.difficulty = 120;

    PornStudio.prototype.next = Page.statCheck;

    PornStudio.next = {};

    PornStudio.prototype.type = 'boring';

    return PornStudio;

  })(Job));

  Job.PornStudio.next['bad'] = add(PornBad = (function(superClass) {
    extend(PornBad, superClass);

    function PornBad() {
      return PornBad.__super__.constructor.apply(this, arguments);
    }

    PornBad.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.5 || ((ref = g.events.PornStudio) != null ? ref[1] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"PornStudio/1\"\n-- Put boobs on the internet, people will watch it. Today's production wasn't a smash hit though - somehow the chemistry just wasn't there. More variety might help.", "|| bg=\"PornStudio/2\"\n-- Put boobs on the internet, people will watch it. Today's production wasn't a smash hit though - even though the quality was there, it just got buried. More variety might help."];
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Porn Studio</h4>\n" + (Math.choice(c)) + "\n<em class='depravity'>+2</em>";
    };

    PornBad.prototype.effects = {
      depravity: 2
    };

    return PornBad;

  })(Page));

  Job.PornStudio.next['good'] = add(PornGood = (function(superClass) {
    extend(PornGood, superClass);

    function PornGood() {
      return PornGood.__super__.constructor.apply(this, arguments);
    }

    PornGood.prototype.conditions = {
      SexSlave: {},
      ManWhore: {},
      Domme: {},
      Sadist: {},
      Maid: {},
      Catgirl: {},
      Catboy: {}
    };

    PornGood.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.5 || ((ref = g.events.PornStudio) != null ? ref[1] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"PornStudio/SexSlave1\"\n-- Her breasts kept popping out, and the director made her redo the shot. He gave her an artsy excuse, but really he's just going to release a compilation of her tits springing free a dozen times and the faces she made.", "|| bg=\"PornStudio/SexSlave2\"\n-- ` Whores on film~ Whores on film~` The opening to our series has a new theme song. I like it.", "|| bg=\"PornStudio/SexSlave3\"\n-- I'm really enjoying this new form of entertainment. I'm not going to appear on camera myself, obviously, but telling one blushing girl what to do to her friend for an eventual audience of thousands? That I can very much get behind."];
      if (this.ManWhore) {
        c.push("|| bg=\"PornStudio/ManWhore1\"\n-- Bouncy bouncy go the titties.");
      }
      if (this.Domme) {
        c.push("|| bg=\"PornStudio/Domme1\"\n-- It looked so fun that the director decided to dress up join in personally.");
      }
      if (this.Sadist) {
        c.push("|| bg=\"PornStudio/Sadist11\"\n  -- Men go \"grunt\"\n     Tit goes \"boing\"\n     Clit goes \"buzz\"\n     And the whip goes \"crack\"\n|| bg=\"PornStudio/Sadist12\"\n  -- But there's one sound\n     That no one knows\n     What does the slut say?\n|| bg=\"PornStudio/Sadist13\"\n  --> ` Ow ow ow ow ow ow owwww`");
      }
      if (this.Maid) {
        c.push("|| bg=\"PornStudio/Maid1\"\n-- Oh she blushes prettily now, but just you wait until the double penetration gang-bang scene where she's the fluffer.");
      }
      if (this.Catgirl) {
        c.push("|| bg=\"PornStudio/Catgirl1\"\n-- It bears repeating: the process that turns women into catgirls also drains about 50 IQ points. As one of the other slaves said... \"She don' give a fuck 'bout nothin' but a fuck no more.\"");
      }
      if (this.Catboy) {
        c.push("|| bg=\"PornStudio/Catboy1\"\n-- Mrrow~");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Porn Studio</h4>\n" + (Math.choice(c)) + "\n<em><span class='depravity'>+7</span>, <span class=\"resistance\">-1</span></em>";
    };

    PornGood.prototype.effects = {
      depravity: 7,
      resistance: -1
    };

    return PornGood;

  })(Page));

  Job.PornStudio.next['veryGood'] = add(PornGood = (function(superClass) {
    extend(PornGood, superClass);

    function PornGood() {
      return PornGood.__super__.constructor.apply(this, arguments);
    }

    PornGood.prototype.conditions = {
      SexSlave: {},
      ManWhore: {},
      Domme: {},
      Sadist: {},
      Maid: {},
      Catgirl: {},
      Catboy: {}
    };

    PornGood.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.5 || ((ref = g.events.PornStudio) != null ? ref[1] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"PornStudio/SexSlave4\"\n-- The director showed her a lineup, then put on the blindfold. Incorrectly guessing whose cock she's sucking results in beatings. Correctly guessing results in fuckings. She enjoys both, so really it's a win-win situation.", "|| bg=\"PornStudio/SexSlave5\"\n-- Did you know that sometimes, if you take a random girl on the street and start handing her hundred dollar bills, she'll eventually agree to be in a shoot? Watch the money disappear into her purse and... voila! A new starlet is born."];
      if (this.ManWhore) {
        c.push("|| bg=\"PornStudio/ManWhore2\"\n-- How to make a fuckslut.\nIngredients: Pretty young girl, half a dozen rock-hard cocks, camera.\nLet everyone simmer for 10 minutes before removing their coverings.\nSet oven to \"sexy times\" and leave it there for one hour.\nEnjoy your creamy new fuckslut.");
      }
      if (this.Domme) {
        c.push("|| bg=\"PornStudio/Domme2\"\n-- If she thought a female director was going to be kinder, she was sadly mistaken.");
      }
      if (this.Sadist) {
        c.push("|| bg=\"PornStudio/Sadist2\"\n-- Liana puts it well: `L None of that pesky morals stuff. If I wanna chain a girl up naked for 12 hours with a vibrator up her snatch and ignore her screams, being the Dark Lady's lieutenant means needing neither permission nor forgiveness.`");
      }
      if (this.Maid) {
        c.push("|| bg=\"PornStudio/Maid2\"\n-- Battle Maid Strip Wrestling VIII: Cat Ear Cuntdown.");
      }
      if (this.Catgirl) {
        c.push("|| bg=\"PornStudio/Catgirl2\"\n-- What a marvelous suggesion someone made - just because the film <em>starts</em> indoors doesn't mean it has to stay there.");
      }
      if (this.Catboy) {
        c.push("|| bg=\"PornStudio/Catboy21\"\n|| bg=\"PornStudio/Catboy22\"\n|| bg=\"PornStudio/Catboy23\"\n|| bg=\"PornStudio/Catboy24\"\n|| bg=\"PornStudio/Catboy24\"\n  -- Geeze, leave your camera alone with the cat for just one minute...");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Porn Studio</h4>\n" + (Math.choice(c)) + "\n<em><span class='depravity'>+20</span>, <span class=\"resistance\">-2</span></em>";
    };

    PornGood.prototype.effects = {
      depravity: 20,
      resistance: -2
    };

    return PornGood;

  })(Page));

}).call(this);

(function() {
  var ExtraPens, Milking, MilkingAdd, MilkingDaily, MilkingPregnancy, effect, effectDep, milkingMax,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(Milking = (function(superClass) {
    extend(Milking, superClass);

    function Milking() {
      return Milking.__super__.constructor.apply(this, arguments);
    }

    Milking.prototype.label = "Milking Barn";

    Milking.prototype.size = 'large';

    Milking.prototype.conditions = {
      '|events|MoreResources': {}
    };

    Milking.prototype.effects = {
      depravity: -100,
      men: -4,
      women: -2,
      virgins: -2
    };

    Milking.prototype.text = function() {
      return "While human women don't produce that much milk, I find the humiliation delightful, and the rows of distended breasts and chained cunts ready for use is its own reward. Oh, and they do produce <em>some</em> milk, which is quite useful magically.";
    };

    return Milking;

  })(RoomJob));

  add(Milking = (function(superClass) {
    extend(Milking, superClass);

    function Milking() {
      return Milking.__super__.constructor.apply(this, arguments);
    }

    Milking.prototype.text = function() {
      return "|| bg=\"Milking/2\"\n-- Cowgirls. Milking machines. Sweet. Slutrooms are great for sex magic, but they don't produce much milk. A room stuffed to the brim with constantly stimulated and milked women is just the ticket.";
    };

    return Milking;

  })(Page));

  milkingMax = function() {
    var max;
    max = 6;
    if (g.events.ExtraPens) {
      max += 6;
    }
    return max;
  };

  effect = function(workers) {
    var fraction;
    fraction = g.events.MilkingPregnancy ? 2 : 3;
    return Math.round(workers / fraction);
  };

  effectDep = function(workers) {
    return workers;
  };

  add(Milking = (function(superClass) {
    extend(Milking, superClass);

    function Milking() {
      return Milking.__super__.constructor.apply(this, arguments);
    }

    Milking.prototype.label = "Milking Barn";

    Milking.prototype.text = function() {
      return "A whole bunch of mooing slaves, all getting milked and occasionally fucked. I love this place.\n\n" + this.workers + " out of " + (milkingMax()) + " stalls are filled.\n\n<em><span class=\"depravity\">+" + (effectDep(this.workers)) + "</span>, <span class=\"milk\">+" + (effect(this.workers)) + "</span> daily.</em>";
    };

    Milking.prototype.people = {
      worker: {
        optional: true,
        matches: function(worker, job) {
          return g.women && job.workers < milkingMax();
        },
        label: function() {
          if (this.workers === milkingMax()) {
            return 'Already full';
          } else if (!g.women) {
            return 'Need <span class="women"></span>';
          } else {
            return 'Add <span class="women"></span>';
          }
        }
      }
    };

    Milking.prototype.next = Page.firstMatch;

    Milking.next = [];

    Milking.prototype.type = 'boring';

    Milking.prototype.workers = 2;

    return Milking;

  })(Job));

  Job.Milking.next.push(add(MilkingAdd = (function(superClass) {
    extend(MilkingAdd, superClass);

    function MilkingAdd() {
      return MilkingAdd.__super__.constructor.apply(this, arguments);
    }

    MilkingAdd.prototype.conditions = {
      worker: {},
      job: '|last'
    };

    MilkingAdd.prototype.text = function() {
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Milking Barn</h4>\n|| bg=\"Milking/Add\"\n  -- Fresh meat for a new milking stall. Don't worry, her breasts will fill out soon enough.\n  <em><span class=\"women\">-1</span>, <span class=\"depravity\">+1</span> daily</em>";
    };

    MilkingAdd.prototype.apply = function() {
      MilkingAdd.__super__.apply.call(this);
      return this.context.job.workers += 1;
    };

    MilkingAdd.prototype.effects = {
      women: -1
    };

    return MilkingAdd;

  })(Page)));

  Job.Milking.next.push(add(MilkingDaily = (function(superClass) {
    extend(MilkingDaily, superClass);

    function MilkingDaily() {
      return MilkingDaily.__super__.constructor.apply(this, arguments);
    }

    MilkingDaily.prototype.conditions = {
      job: '|last',
      depravity: {
        fill: function() {
          return effect(this.job.workers);
        }
      },
      milk: {
        fill: function() {
          return effectDep(this.job.workers);
        }
      }
    };

    MilkingDaily.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.75 || ((ref = g.events.MilkingDaily) != null ? ref[1] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"Milking/1\"\n-- The cows need to be stimulated at least once an hour for optimum production. It's a demanding job, but a combination of male and female staff keep them working at their full potential 12 hours a day.", "|| bg=\"Milking/2\"\n-- Happy cows are productive cows! After their mandatory two hour exercise break, look at how excited they are to be strapped back in!", "|| bg=\"Milking/3\"\n-- It's visitors' day! The milk store has a <em>very</em> popular customer loyalty program.", "|| bg=\"Milking/4\"\n-- Aww, looks like she hasn't accepted her now place yet. Don't worry, honey, you may have been kidnapped, brutalized and turned into human livestock, but you'll forget all about your old life in a month or two."];
      if (g.events.MilkingPregnancy) {
        c.push("|| bg=\"Milking/Preg1\"\n-- Pregnant cows are put in different positions throughout the work day to help ensure their health and the health of their children.");
        c.push("|| bg=\"Milking/Preg2\"\n-- Some cows volunteer for permanent installation, and are rewarded with 24-hour clitoral attachments. Stimulated constantly, milked twice a day, and pregnant for the rest of their lives - they'll never use their arms and legs again.");
        c.push("|| bg=\"Milking/Preg3\"\n-- Taking some of the cows out for a walk. They're blindfolded so all the overstimulation of the outside world doesn't distract too much.");
        c.push("|| bg=\"Milking/Preg4\"\n-- Budget cuts and labor shortages can hit even magical sex-economies. Automation is the answer.");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n<h4>Milking Barn</h4>\n" + Math.choice(c);
    };

    MilkingDaily.prototype.effects = {
      depravity: 'depravity',
      milk: 'milk'
    };

    return MilkingDaily;

  })(Page)));

  add(ExtraPens = (function(superClass) {
    extend(ExtraPens, superClass);

    function ExtraPens() {
      return ExtraPens.__super__.constructor.apply(this, arguments);
    }

    ExtraPens.prototype.conditions = {
      '|events|Milking': {}
    };

    ExtraPens.prototype.label = "Additional Pens";

    ExtraPens.prototype.progress = 500;

    ExtraPens.prototype.text = function() {
      return "+6 space in each Milking Barn\n<br>The architect was an idiot. Of course we want the cows crammed in tightly. These are sexy cows, and if they want to caress each other, we should let them!";
    };

    return ExtraPens;

  })(ResearchJob));

  add(ExtraPens = (function(superClass) {
    extend(ExtraPens, superClass);

    function ExtraPens() {
      return ExtraPens.__super__.constructor.apply(this, arguments);
    }

    ExtraPens.prototype.text = function() {
      return "|| bg=\"Milking/2\"\n-- There once was a farmer named Jill,\n  Who used a milking machine for a thrill.\n  She let out a great shout\n  When she couldn't pull them out\n  For it was set for a 16 quart fill.";
    };

    return ExtraPens;

  })(Page));

  add(MilkingPregnancy = (function(superClass) {
    extend(MilkingPregnancy, superClass);

    function MilkingPregnancy() {
      return MilkingPregnancy.__super__.constructor.apply(this, arguments);
    }

    MilkingPregnancy.prototype.conditions = {
      '|events|Milking': {}
    };

    MilkingPregnancy.prototype.label = "Pregnant Cows";

    MilkingPregnancy.prototype.progress = 600;

    MilkingPregnancy.prototype.text = function() {
      return "+50% Milk and D production in each Milking Barn\n<br>Who in the world thought that giving the milk cows contraceptives was a good idea? I mean, sure we have to redesign a bit to accommodate the different body shape, but...";
    };

    return MilkingPregnancy;

  })(ResearchJob));

  add(MilkingPregnancy = (function(superClass) {
    extend(MilkingPregnancy, superClass);

    function MilkingPregnancy() {
      return MilkingPregnancy.__super__.constructor.apply(this, arguments);
    }

    MilkingPregnancy.prototype.text = function() {
      return "|| bg=\"Milking/Preg1\"\n-- Q. Should I have a baby after 35?\n   A. No, 35 children is enough.\n\n   Q. What is the most reliable method to determine a baby’s sex?\n   A. Childbirth.\n\n-- Q. How does one sanitize nipples?\n   A. Bathe daily and wear a clean bra. It beats boiling them in a saucepan.\n\n   Q. Our baby was born last week. When will my wife act normal again?\n   A. When your child is in college.";
    };

    return MilkingPregnancy;

  })(Page));

}).call(this);

(function() {
  var GaleriaPublicUse, Galleria, GalleriaDaily, GalleriaVisitors, InWall, cumEffect, effect, trainingCost,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  effect = function() {
    var e;
    e = 2;
    if (g.events.InWall) {
      e += 1;
    }
    return e;
  };

  cumEffect = function(w) {
    if (g.events.GaleriaPublicUse) {
      return Math.round(w.lust / 10);
    } else {
      return 0;
    }
  };

  trainingCost = function(w) {
    return w.lust * (g.events.GalleriaVisitors ? 0.5 : 1);
  };

  add(Galleria = (function(superClass) {
    extend(Galleria, superClass);

    function Galleria() {
      return Galleria.__super__.constructor.apply(this, arguments);
    }

    Galleria.prototype.label = "Galleria";

    Galleria.prototype.size = 'large';

    Galleria.prototype.effects = {
      depravity: -220,
      women: -7,
      men: -2
    };

    Galleria.prototype.text = function() {
      return "Women get used as sex objects, men get to have their way with sex objects. Either way, they can increase their <span class=\"lust\">lust</span> here.";
    };

    return Galleria;

  })(RoomJob));

  add(Galleria = (function(superClass) {
    extend(Galleria, superClass);

    function Galleria() {
      return Galleria.__super__.constructor.apply(this, arguments);
    }

    Galleria.prototype.text = function() {
      return "|| bg=\"Galleria/3\"\n  -- `D Sluts, atteeeeen-tion!`\n  --> `D Saaaaaal-ute!`\n|| bg=\"Galleria/1\"\n  --> `D Very good, girls. As you were.`";
    };

    return Galleria;

  })(Page));

  add(Galleria = (function(superClass) {
    extend(Galleria, superClass);

    function Galleria() {
      return Galleria.__super__.constructor.apply(this, arguments);
    }

    Galleria.prototype.label = "Galleria";

    Galleria.prototype.text = function() {
      return "18 hours :ahem: using the facilities should help remind them why we do what we do.\n\n<span class=\"lust\">+" + (effect()) + " Lust</span>, <span class=\"depravity\">" + (g.events.GalleriaVisitors ? '-0.5' : '-1') + "</span> per current <span class=\"lust\">lust</span>.";
    };

    Galleria.prototype.people = {
      worker: {
        matches: function(w) {
          return g.depravity >= trainingCost(w) && w.lust < w.max.lust;
        }
      }
    };

    Galleria.prototype.type = 'boring';

    return Galleria;

  })(Job));

  Job.Galleria.prototype.next = add(GalleriaDaily = (function(superClass) {
    extend(GalleriaDaily, superClass);

    function GalleriaDaily() {
      return GalleriaDaily.__super__.constructor.apply(this, arguments);
    }

    GalleriaDaily.prototype.conditions = {
      worker: {}
    };

    GalleriaDaily.prototype.text = function() {
      var c, ref;
      if ($('page').length && (Math.random() < 0.75 || ((ref = g.events.GalleriaDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"Galleria/1\"\n-- Just because it's mostly women, doesn't mean I haven't scattered a few men in here to satisfy other tastes.", "|| bg=\"Galleria/2\"\n-- There's a wide selection to suit a variety of tastes. Brown, black, redhead... hm. I guess they are all skinny young bitches. Oh well, I work with what I'm given.", "|| bg=\"Galleria/3\"\n-- Resting after a hard day's work. They may be slaves, but they're treated well."];
      if (g.events.GalleriaVisitors) {
        c.push("|| bg=\"Galleria/Visitors1\"\n-- Today's special - half off if you can make her cum and scream at the same time!");
        c.push("|| bg=\"Galleria/Visitors2\"\n-- Visitors tend to be a bit rougher on the girls than my own servants. I'm not really sure why that is. Oh well, they'll survive.");
      }
      if (g.events.InWall) {
        c.push("|| bg=\"Galleria/Wall11\"\n  -- \"Nice day out today, isn't it?\"\n  --> \"Um... a bit lewd to talk about the weather while you're wiping the spunk off my asshole, isn't it?\"\n|| bg=\"Galleria/Wall12\"\n  --> \"Oh, I suppose so. Just trying to be friendly. Sorry, I'll come around this side first next time.\"");
        c.push("|| bg=\"Galleria/Wall2\"\n-- It is a less than dignified position, and even the fact that they only have to work half-days when they're in the wall doesn't make up for it for many of them.");
        c.push("|| bg=\"Galleria/Wall3\"\n-- Cunts on display, cunts for use. They belong to women, but who cares?");
        c.push("|| bg=\"Galleria/Wall4\"\n-- Sometimes it's nice to leave the legs free - they can squirm and react more effectively that way.");
      }
      if (g.events.GaleriaPublicUse) {
        c.push("|| bg=\"Galleria/Use1\"\n-- I publish daily rankings based on the size of the pool of cum at each of their feet. Competition is fierce.");
        c.push("|| bg=\"Galleria/Use2\"\n-- Such a sad face. It's ok little lady, they still enjoyed it even if you didn't get to swallow.");
        c.push("|| bg=\"Galleria/Use3\"\n-- Some women enjoy being used like a fuckdoll more than might be strictly called \"healthy\".");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Galleria</h4>\n\n" + (Math.choice(c)) + "\n  <em><span class=\"lust\">+" + (effect()) + " Lust</span>, <span class=\"depravity\">-" + (trainingCost(this.worker)) + "</span></em>";
    };

    GalleriaDaily.prototype.apply = function() {
      GalleriaDaily.__super__.apply.call(this);
      this.context.worker.add('lust', effect());
      return g.applyEffects({
        depravity: -trainingCost(this.context.worker),
        cum: cumEffect(this.context.worker)
      });
    };

    return GalleriaDaily;

  })(Page));

  add(GalleriaVisitors = (function(superClass) {
    extend(GalleriaVisitors, superClass);

    function GalleriaVisitors() {
      return GalleriaVisitors.__super__.constructor.apply(this, arguments);
    }

    GalleriaVisitors.prototype.conditions = {
      '|events|Galleria': {}
    };

    GalleriaVisitors.prototype.label = "Galleria Visitors";

    GalleriaVisitors.prototype.progress = 600;

    GalleriaVisitors.prototype.text = function() {
      return "<span class=\"depravity\">-50% </span> cost when visiting the galleria.\n<br>Hmm. It seems like the girls could use more work. Let's invite people from the town to pay them a visit.";
    };

    return GalleriaVisitors;

  })(ResearchJob));

  add(GalleriaVisitors = (function(superClass) {
    extend(GalleriaVisitors, superClass);

    function GalleriaVisitors() {
      return GalleriaVisitors.__super__.constructor.apply(this, arguments);
    }

    GalleriaVisitors.prototype.text = function() {
      return "|| bg=\"Galleria/Visitors2\"\n-- Amber (who called herself Skye)\n  Spread her thighs, as she said with a sigh:\n  \"I've shaved myself bare\n  to get more flow of air,\n  else my panties just never stay dry.\"";
    };

    return GalleriaVisitors;

  })(Page));

  add(InWall = (function(superClass) {
    extend(InWall, superClass);

    function InWall() {
      return InWall.__super__.constructor.apply(this, arguments);
    }

    InWall.prototype.conditions = {
      '|events|GalleriaVisitors': {}
    };

    InWall.prototype.label = "Through the wall";

    InWall.prototype.progress = 500;

    InWall.prototype.text = function() {
      return "<span class=\"lust\">+1 Lust</span> when visiting the galleria.\n<br>If you lock them in, they can't squirm around and avoid your attention. Fun.";
    };

    return InWall;

  })(ResearchJob));

  add(InWall = (function(superClass) {
    extend(InWall, superClass);

    function InWall() {
      return InWall.__super__.constructor.apply(this, arguments);
    }

    InWall.prototype.text = function() {
      return "|| bg=\"Galleria/Wall4\"\n-- On the breast of the whore named Gail.\n  Was tattooed the price of her tail.\n  And on her behind,\n  For the sake of the blind,\n  Was the same information in Braille.";
    };

    return InWall;

  })(Page));

  add(GaleriaPublicUse = (function(superClass) {
    extend(GaleriaPublicUse, superClass);

    function GaleriaPublicUse() {
      return GaleriaPublicUse.__super__.constructor.apply(this, arguments);
    }

    GaleriaPublicUse.prototype.conditions = {
      '|events|MoreResources': {},
      '|events|GalleriaVisitors': {}
    };

    GaleriaPublicUse.prototype.label = "Public Use";

    GaleriaPublicUse.prototype.progress = 250;

    GaleriaPublicUse.prototype.text = function() {
      return "Visits to the Galeria generate <span class=\"lust\">Lust / 10</span> <span class=\"cum\"></span>.\n<br>Tie 'em up, fuck 'em, get out of the way, let's keep the line moving.";
    };

    return GaleriaPublicUse;

  })(ResearchJob));

  add(GaleriaPublicUse = (function(superClass) {
    extend(GaleriaPublicUse, superClass);

    function GaleriaPublicUse() {
      return GaleriaPublicUse.__super__.constructor.apply(this, arguments);
    }

    GaleriaPublicUse.prototype.text = function() {
      return "|| bg=\"Galleria/Use3\"\n-- A luscious psychotic named Jane\n  Sucked every man on a train.\n  She said, \"Please don't panic,\n  I'm just nymphomanic,\n  This wouldn't be fun were I sane.\"";
    };

    return GaleriaPublicUse;

  })(Page));

}).call(this);

(function() {
  var SpawningPit, SpawningPitDaily, cumCost, matches, progress, progressNeeded,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  cumCost = function(c) {
    return Object.keys(c).length * 2;
  };

  progress = function(c) {
    return Object.keys(c).length;
  };

  progressNeeded = 50;

  add(SpawningPit = (function(superClass) {
    extend(SpawningPit, superClass);

    function SpawningPit() {
      return SpawningPit.__super__.constructor.apply(this, arguments);
    }

    SpawningPit.prototype.label = "Spawning Pit";

    SpawningPit.prototype.size = 'large';

    SpawningPit.prototype.conditions = {
      '|tentaclesReady': {
        is: true
      }
    };

    SpawningPit.prototype.effects = {
      depravity: -300,
      milk: -50,
      women: -6,
      virgins: -3
    };

    SpawningPit.prototype.text = function() {
      return "Summoning tentacles from the netherworld temporarily is fun, but real live monsters take a great deal of effort. Now that I've done it once, I can grow more.";
    };

    return SpawningPit;

  })(RoomJob));

  add(SpawningPit = (function(superClass) {
    extend(SpawningPit, superClass);

    function SpawningPit() {
      return SpawningPit.__super__.constructor.apply(this, arguments);
    }

    SpawningPit.prototype.text = function() {
      return "|| bg=\"SpawningPit/4\"\n-- The pregnancy of tentacle monsters is surprisingly quick - they'll be ready to give birth and be impregnated again in only a few days.`";
    };

    SpawningPit.prototype.apply = function() {
      SpawningPit.__super__.apply.call(this);
      return g.tentaclesReady = false;
    };

    return SpawningPit;

  })(Page));

  Game.prototype.tentacleProgress = 0;

  Game.prototype.tentaclesReady = false;

  matches = {
    isnt: [Person.DarkLady],
    optional: true
  };

  add(SpawningPit = (function(superClass) {
    extend(SpawningPit, superClass);

    function SpawningPit() {
      return SpawningPit.__super__.constructor.apply(this, arguments);
    }

    SpawningPit.prototype.label = "Spawning Pit";

    SpawningPit.prototype.text = function() {
      var p;
      p = g.tentaclesReady ? "I already have enough eggs to construct a new hive. I should do that." : g.tentacleProgress + " out of " + progressNeeded + " eggs, +" + (progress(this.context));
      return "Here I can spawn additional tentacle monsters for use in other locations. Not only that, everyone who left here even for just a night will be drawn from their human rights and start living for Lust... even me. So, no, thanks. But maybe, Liana deserve it?\n\n" + p + "\n<span class=\"cum\">-" + (cumCost(this.context)) + "</span>\n<span class=\"lust\">+5 max</span>, <span class=\"intelligence\">-5 max</span>,  </span>\n<span class=\"magic\">-5 max</span>, <span class=\"strength\">-5 max</span>";
    };

    SpawningPit.prototype.people = {
      worker1: matches,
      worker2: matches,
      worker3: matches,
      worker4: matches,
      worker5: matches,
      worker6: matches,
      worker7: matches,
      worker8: matches,
      worker9: matches,
      worker0: matches
    };

    SpawningPit.prototype.type = 'boring';

    return SpawningPit;

  })(Job));

  Job.SpawningPit.prototype.next = add(SpawningPitDaily = (function(superClass) {
    extend(SpawningPitDaily, superClass);

    function SpawningPitDaily() {
      return SpawningPitDaily.__super__.constructor.apply(this, arguments);
    }

    SpawningPitDaily.prototype.conditions = {
      worker1: {},
      worker2: {},
      worker3: {},
      worker4: {},
      worker5: {},
      worker6: {},
      worker7: {},
      worker8: {},
      worker9: {},
      worker0: {}
    };

    SpawningPitDaily.prototype.text = function() {
      var c, p, ref;
      if ($('page').length && (Math.random() < 0.5 || ((ref = g.events.SpawningPitDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"SpawningPit/1\"\n-- Monsters take good care of their pregnant mothers. She's not going anywhere, and she'll get to keep orgasming all the way up until the birth.", "|| bg=\"SpawningPit/2\"\n-- Don't be sad, girl. You may be nothing more than a soon-to-be mindless womb, good for nothing except your quivering cunt, but at least there's one part of you that isn't trash!", "|| bg=\"SpawningPit/3\"\n-- Ecstasy, imprisonment, pregnancy. The joys of motherhood.", "|| bg=\"SpawningPit/4\"\n-- Baby tentacles grow stong and virile based on their mother's orgasms, both count and intensity - and cutting off any stimulation besides the pleasure of their fuckholes increases both factors considerably.", "|| bg=\"SpawningPit/5\"\n-- For best results, keep womb freshly doused in cum every 4-6 hours. If orgasms persist longer than 10 minutes, consult with your Dark Lady, as she would like to watch.", "|| bg=\"SpawningPit/6\"\n-- ` Yeah, just hanging out, unwinding a bit after a tough day. What're you up to? ... Nah, maybe another day, I feel like keeping it in... I mean staying in tonight.`"];
      p = g.tentaclesReady ? 'Ready to construct new building' : (g.tentacleProgress + progress(this)) + " out of " + progressNeeded + " eggs";
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Spawning Pit</h4>\n\n" + (Math.choice(c)) + "\n  <em><span class=\"lust\">+5 max</span>,<span class=\"magic\">-5 max</span>, <span class=\"intelligence\">-5 max</span>, <span class=\"strength\">-5 max</span>\n  <span class=\"cum\">-" + (cumCost(this)) + "</span>, " + p + "</em>";
    };

    SpawningPitDaily.prototype.apply = function() {
      var l, ref, worker;
      SpawningPitDaily.__super__.apply.call(this);
      ref = this.context;
      for (l in ref) {
        worker = ref[l];
        worker.max.strength = Math.max(0, worker.max.strength - 5);
        worker.max.magic = Math.max(0, worker.max.magic - 5);
        worker.max.intelligence = Math.max(0, worker.max.intelligence - 5);
        worker.max.lust = Math.min(100, worker.max.lust + 5);
        worker.add('strength', 0);
        worker.add('magic', 0);
        worker.add('intelligence', 0);
        worker.add('lust', 5);
      }
      g.applyEffects({
        cum: cumCost(this.context)
      });
      g.tentacleProgress += progress(this.context);
      if (g.tentacleProgress >= progressNeeded) {
        g.tentacleProgress = 0;
        return g.tentaclesReady = true;
      }
    };

    return SpawningPitDaily;

  })(Page));

}).call(this);

(function() {
  var BreedingPit, BreedingPitDaily,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(BreedingPit = (function(superClass) {
    extend(BreedingPit, superClass);

    function BreedingPit() {
      return BreedingPit.__super__.constructor.apply(this, arguments);
    }

    BreedingPit.prototype.label = "Breeding Pit";

    BreedingPit.prototype.size = 'large';

    BreedingPit.prototype.conditions = {
      '|tentaclesReady': {
        is: true
      },
      '|events|SpawningPit': {}
    };

    BreedingPit.prototype.effects = {
      depravity: -300,
      virgins: -3,
      milk: -50,
      cum: -40
    };

    BreedingPit.prototype.text = function() {
      return "Inelegant and messy, I should nonetheless be able to relieve the weight of of my existance from Liana's shoulders by using a breeding pit as a power source. Increases both of our maximum <span class=\"magic\">Magic</span>.";
    };

    return BreedingPit;

  })(RoomJob));

  add(BreedingPit = (function(superClass) {
    extend(BreedingPit, superClass);

    function BreedingPit() {
      return BreedingPit.__super__.constructor.apply(this, arguments);
    }

    BreedingPit.prototype.text = function() {
      return "|| bg=\"BreedingPit/Feed\"\n-- It used to be the inside of a warehouse, and technically it still. But it's a much more interesting place now, a cross between the modern mortal conceptions of heaven and hell, far more to my liking than either.";
    };

    BreedingPit.prototype.apply = function() {
      BreedingPit.__super__.apply.call(this);
      return g.tentaclesReady = false;
    };

    return BreedingPit;

  })(Page));

  add(BreedingPit = (function(superClass) {
    extend(BreedingPit, superClass);

    function BreedingPit() {
      return BreedingPit.__super__.constructor.apply(this, arguments);
    }

    BreedingPit.prototype.label = "Breeding Pit";

    BreedingPit.prototype.text = function() {
      return "I can feed the mass of tentacles a trained slave. They'll be pleasured and tormented permanently, and the magic will help sustain me.\n\nFed " + (this.fed.toWord()) + " time" + (this.fed === 1 ? '' : 's') + "\nDark Lady: <span class=\"magic\">" + D.max.magic + " max</span>\nLiana: <span class=\"magic\">" + L.max.magic + " max</span>";
    };

    BreedingPit.prototype.people = {
      worker: {
        isnt: [Person.DarkLady, Person.Liana]
      }
    };

    BreedingPit.prototype.fed = 0;

    return BreedingPit;

  })(Job));

  Job.BreedingPit.prototype.next = add(BreedingPitDaily = (function(superClass) {
    extend(BreedingPitDaily, superClass);

    function BreedingPitDaily() {
      return BreedingPitDaily.__super__.constructor.apply(this, arguments);
    }

    BreedingPitDaily.prototype.conditions = {
      worker: {},
      job: '|last'
    };

    BreedingPitDaily.prototype.text = function() {
      var c;
      c = ["|| bg=\"BreedingPit/1\"\n-- The chamber likes to restrain their arms so they can't pleasure themselves. It wants complete control over when - or if - they orgasm.", "|| bg=\"BreedingPit/2\"\n-- Some women it likes to torment with the possibility of escape, but others it prefers not to hold back. Her womb and stomach are both flooded with cum, her orgasms continuous.", "|| bg=\"BreedingPit/31\"\n  -- I pause in my inspection tour. `D She's too clean. Fix that, will you?`\n|| bg=\"BreedingPit/32\"\n  --> Ah, there we go. I smile and continue on my way.", "|| bg=\"BreedingPit/4\"\n-- The creature is surprisingly shy - it doesn't like to show its more specialized (and fragile) appendages to just anyone, but I'm special like that.", "|| bg=\"BreedingPit/51\"\n|| bg=\"BreedingPit/52\"\n|| bg=\"BreedingPit/51\"\n|| bg=\"BreedingPit/52\"\n  -- ", "|| bg=\"BreedingPit/6\"\n-- ", "|| bg=\"BreedingPit/7\"\n-- New slaves are restrained for their own safety. The thrashing of the first few hundred orgasms can be quite hard on their bodies if not held in place.", "|| bg=\"BreedingPit/81\"\n|| bg=\"BreedingPit/82\"\n||\n  -- By the time the tentacles have wound their way all the way through her body and out her mouth, she's a permanent fixture of the breeding pits, impossible to remove even if I wanted to. I don't, of course.", "|| bg=\"BreedingPit/9\"\n-- Crowded conditions aren't an issue with breeding pits - the sounds and smell of other women being perpetually fucked is a bonus for them, once they've accepted their new lives."];
      return Math.choice(c) + "\n<em class='magic'>+1 max Magic</em>";
    };

    BreedingPitDaily.prototype.apply = function() {
      BreedingPitDaily.__super__.apply.call(this);
      this.context.job.fed += 1;
      delete this.context.job.context.worker;
      g.people.remove(this.context.worker);
      D.max.magic = Math.min(100, D.max.magic + 1);
      return L.max.magic = Math.min(100, L.max.magic + 1);
    };

    return BreedingPitDaily;

  })(Page));

}).call(this);

(function() {
  var TrainingFacility, TrainingFacilityDaily, TrainingFacilityGraduate, TrainingFacilityNew, names, trainer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(TrainingFacility = (function(superClass) {
    extend(TrainingFacility, superClass);

    function TrainingFacility() {
      return TrainingFacility.__super__.constructor.apply(this, arguments);
    }

    TrainingFacility.prototype.label = "Training Facility";

    TrainingFacility.prototype.size = 'large';

    TrainingFacility.prototype.conditions = {
      '|events|Nudity': {}
    };

    TrainingFacility.prototype.effects = {
      depravity: -400,
      men: -4,
      women: -2
    };

    TrainingFacility.prototype.text = function() {
      return "There are lots of young girls around here who need to be trained for their masters and mistresses. I enjoy breaking people. Let's do this!";
    };

    return TrainingFacility;

  })(RoomJob));

  add(TrainingFacility = (function(superClass) {
    extend(TrainingFacility, superClass);

    function TrainingFacility() {
      return TrainingFacility.__super__.constructor.apply(this, arguments);
    }

    TrainingFacility.prototype.text = function() {
      return "|| bg=\"TrainingFacility/Rec2\"\n  -- Dark Lady Inc. Turning this...\n|| bg=\"TrainingFacility/76\"\n  -- ...into this.\n  --> One week, two week and four month training courses available. Inquire within, and don't delay!";
    };

    return TrainingFacility;

  })(Page));

  Game.prototype.trainingProgress = new Collection;

  trainer = [Person.DarkLady, Person.Liana, Person.Domme, Person.Sadist, Person.Maid, Person.Succubus];

  add(TrainingFacility = (function(superClass) {
    extend(TrainingFacility, superClass);

    function TrainingFacility() {
      return TrainingFacility.__super__.constructor.apply(this, arguments);
    }

    TrainingFacility.prototype.label = "Training Facility";

    TrainingFacility.prototype.text = function() {
      var chances, key, p, trainings, value;
      trainings = Math.round((Page.sumStat('lust', this.context, this.context)) / 10);
      chances = Page.statCheckChances('intelligence', this.difficulty(), this.context);
      p = (function() {
        var ref, results;
        ref = g.trainingProgress;
        results = [];
        for (key in ref) {
          value = ref[key];
          results.push("<li>" + key + "<br> Day " + (g.day - value[1]) + " of " + value[2] + "<br> Trained " + value[3] + " times</li>");
        }
        return results;
      })();
      return "New student: " + (Math.round((chances.good + chances.veryGood) * 100)) + "%\n\n<ul>" + (p.join('') || '<li>No students</li>') + "</ul>\n" + trainings + " training sessions daily\n(<span class=\"lust\">1/10 Lust</span>)";
    };

    TrainingFacility.prototype.people = {
      trainer1: {
        label: function() {
          return 'Trainer';
        },
        is: trainer
      },
      trainer2: {
        label: function() {
          return 'Trainer';
        },
        is: trainer,
        optional: true
      },
      trainer3: {
        label: function() {
          return 'Trainer';
        },
        is: trainer,
        optional: true
      },
      trainer4: {
        label: function() {
          return 'Trainer';
        },
        is: trainer,
        optional: true
      },
      trainer5: {
        label: function() {
          return 'Trainer';
        },
        is: trainer,
        optional: true
      }
    };

    TrainingFacility.prototype.stat = 'intelligence';

    TrainingFacility.prototype.difficulty = function() {
      return 50 + 25 * g.trainingProgress.objectLength;
    };

    TrainingFacility.prototype.next = Page.statCheck;

    TrainingFacility.next = {};

    TrainingFacility.prototype.type = 'boring';

    return TrainingFacility;

  })(Job));

  names = ['Christina', 'Melissa', 'Lucia', 'Yvette', 'Elisa', 'Cora', 'Diana', 'Pearl', 'Kelli', 'Kerry', 'Eileen', 'Deborah', 'Latoya', 'Lillian', 'Naomi', 'Gwen', 'Lela', 'Kristen', 'Rachel', 'Terry', 'Yvonne', 'Melanie', 'Felicia', 'Tina', 'Billie', 'Becky', 'Bessie', 'Jody', 'Roxanne', 'Holly', 'Kayla', 'Genevieve', 'Julia', 'Tamara', 'Lydia', 'Myra', 'Faith', 'Miranda', 'Stacey', 'Hattie', 'Andrea', 'Barbara', 'Judith', 'Jenna', 'Laura', 'Tammy', 'Renee', 'Adrienne', 'Lindsay', 'Alice', 'Irene', 'Sonya', 'Rose', 'Blue'];

  Job.TrainingFacility.next['good'] = add(TrainingFacilityNew = (function(superClass) {
    extend(TrainingFacilityNew, superClass);

    function TrainingFacilityNew() {
      return TrainingFacilityNew.__super__.constructor.apply(this, arguments);
    }

    TrainingFacilityNew.prototype.conditions = {
      duration: {
        fill: function() {
          return Math.choice([7, 14, 30]);
        }
      },
      name: {
        fill: function() {
          var name;
          name = Math.choice(names);
          while (g.trainingProgress[name]) {
            name = Math.choice(names);
          }
          return name;
        }
      },
      trainer1: {},
      trainer2: {},
      trainer3: {},
      trainer4: {},
      trainer5: {}
    };

    TrainingFacilityNew.prototype.text = function() {
      var c;
      c = ["|| bg=\"TrainingFacility/Rec1\"\n-- " + this.name + " was grinning and joking around with her boyfriend a few minutes ago when she signed the papers. Too late to back out now!", "|| bg=\"TrainingFacility/Rec2\"\n-- Don't worry, sweety. We won't train the rebellion out of you - that fiery spirit is what your mistress likes best!", "|| bg=\"TrainingFacility/Rec3\"\n-- " + this.name + "'s excited to be here, and only got wetter as I explained what she's in for over the next " + (Math.round(this.duration / 7)) + " weeks. What a perv.", "|| bg=\"TrainingFacility/Rec4\"\n-- Hm. Looks like " + this.name + " can't sign the consent form. Guess we'll just have to take Sir's word that this is what she wants."];
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Training Facility - New student</h4>\n\n" + (Math.choice(c)) + "\n  <em>" + this.name + " will stay here for " + this.duration + " days</em>";
    };

    TrainingFacilityNew.prototype.apply = function() {
      TrainingFacilityNew.__super__.apply.call(this);
      return g.trainingProgress[this.context.name] = [this.context.name, g.day, this.context.duration, 0];
    };

    return TrainingFacilityNew;

  })(Page));

  Page.TrainingFacilityNew.prototype.next = Job.TrainingFacility.next['bad'] = add(TrainingFacilityDaily = (function(superClass) {
    extend(TrainingFacilityDaily, superClass);

    function TrainingFacilityDaily() {
      return TrainingFacilityDaily.__super__.constructor.apply(this, arguments);
    }

    TrainingFacilityDaily.prototype.conditions = {
      trainings: {
        fill: function() {
          return Math.round((Page.sumStat('lust', g.last.context, g.last.context)) / 10);
        }
      }
    };

    TrainingFacilityDaily.prototype.text = function() {
      var c, ref;
      if (!g.trainingProgress.objectLength) {
        return;
      }
      if ($('page').length && (Math.random() < 0.5 || ((ref = g.events.TrainingFacilityDaily) != null ? ref[0] : void 0) === g.day)) {
        return false;
      }
      c = ["|| bg=\"TrainingFacility/11\"\n|| bg=\"TrainingFacility/12\"\n|| bg=\"TrainingFacility/13\"\n|| bg=\"TrainingFacility/13\"\n  -- Look at the way that angry flush turns into a blush turns into an orgasm. The clittoral vibrator turns higher the more people look at her.", "|| bg=\"TrainingFacility/2\"\n-- Bowing her head submissively at the feet of whoever fills her with cum. " + (Math.keyChoice(g.trainingProgress)) + "'s almost done with her training now!", "|| bg=\"TrainingFacility/3\"\n-- It's equally important for sluts in training to learn how to <em>not</em> be the center of attention. Being fucked in a line like this is an excellent reminder that sometimes, Sir doesn't care about them and just wants a piece of meat for his friends to share. It'll also be good practice for any of them who graduate from school into a brothel, rather than into the exclusive service of someone special.", "|| bg=\"TrainingFacility/4\"\n-- Field trip day! All the girls get to wear clothes (a rare treat) and go into the outer world for a bit. It's all part of their training, of course - " + (Math.keyChoice(g.trainingProgress)) + " isn't allowed to wipe the cum off their faces, and must offer to suck off anyone who asks about it.", "|| bg=\"TrainingFacility/5\"\n-- " + (Math.keyChoice(g.trainingProgress)) + " complained about the size of her butt plug this morning. The bruise will remind her for a few days that Mistress does <em>not</em> tolerate complaining.", "|| bg=\"TrainingFacility/6\"\n-- Hestitate and blush all you like, honey, you're going to follow the leash eventually. She'll only make your walk outside longer the more you delay.", "|| bg=\"TrainingFacility/71\"\n|| bg=\"TrainingFacility/72\"\n|| bg=\"TrainingFacility/73\"\n|| bg=\"TrainingFacility/74\"\n|| bg=\"TrainingFacility/75\"\n|| bg=\"TrainingFacility/76\"\n|| bg=\"TrainingFacility/76\"\n  --"];
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Training Facility</h4>\n\n" + (Math.choice(c)) + "\n  <em>Divided " + this.trainings + " training sessions among " + g.trainingProgress.objectLength + " students</em>";
    };

    TrainingFacilityDaily.prototype.apply = function() {
      var results, student, thisTraining, total;
      TrainingFacilityDaily.__super__.apply.call(this);
      if (!g.trainingProgress.objectLength) {
        return;
      }
      total = this.context.trainings;
      results = [];
      while (total > 0) {
        thisTraining = Math.ceil(total / 3);
        total -= thisTraining;
        student = Math.keyChoice(g.trainingProgress);
        results.push(g.trainingProgress[student][3] += thisTraining);
      }
      return results;
    };

    return TrainingFacilityDaily;

  })(Page));

  Page.TrainingFacilityDaily.prototype.next = add(TrainingFacilityGraduate = (function(superClass) {
    extend(TrainingFacilityGraduate, superClass);

    function TrainingFacilityGraduate() {
      return TrainingFacilityGraduate.__super__.constructor.apply(this, arguments);
    }

    TrainingFacilityGraduate.prototype.conditions = {
      student: {
        fill: function() {
          var name, ref, student;
          ref = g.trainingProgress;
          for (name in ref) {
            student = ref[name];
            if (g.day >= student[1] + student[2]) {
              return student;
            }
          }
          return [];
        }
      },
      depravity: {
        fill: function() {
          return Math.round(Math.log(this.student[3]) * 20) || 0;
        }
      }
    };

    TrainingFacilityGraduate.prototype.text = function() {
      var c;
      if (!this.student[0]) {
        return;
      }
      c = ["|| bg=\"TrainingFacility/Grad1\"\n-- Today, " + this.student[0] + " has left our school. We wish her well in the wider world, and have given her a little gift to remember us by.", "|| bg=\"TrainingFacility/Grad2\"\n-- " + this.student[0] + " has her final test today. Her Mistress will be by in a few hours to evaluate her progress - I hope she's pleased. " + this.student[0] + " certainly has no complaints about her new life.", "|| bg=\"TrainingFacility/Grad3\"\n-- Like all the other students here, " + this.student[0] + " was enrolled by her partner. In this case, however, he hasn't been able to come up with the remainder of the fee, so " + this.student[0] + " will be auctioned off to cover it."];
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Training Facility - Graduation</h4>\n\n" + (Math.choice(c)) + "\n  <em>" + this.student[0] + " was here for " + (g.day - this.student[1]) + " days. She was trained " + this.student[2] + " times, and brings in <span class=\"depravity\">" + this.depravity + "</span></em>";
    };

    TrainingFacilityGraduate.prototype.effects = {
      depravity: 'depravity'
    };

    TrainingFacilityGraduate.prototype.apply = function() {
      TrainingFacilityGraduate.__super__.apply.call(this);
      return delete g.trainingProgress[this.context.student[0]];
    };

    return TrainingFacilityGraduate;

  })(Page));

}).call(this);

(function() {
  var Fire, HolidayInn, LianaConcrete, LianaConcrete1, LianaConcrete2, LianaConcrete3, LianaConcrete4, Raid, Raid1, Raid2, Raid3, Raid4, Raid5, Rest, Rest1, Rest2, Rest3, Rest4, Rest5, TheEnd, VisitGym, burnChoices, toilet, toilet1, toilet2,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(HolidayInn = (function(superClass) {
    extend(HolidayInn, superClass);

    function HolidayInn() {
      return HolidayInn.__super__.constructor.apply(this, arguments);
    }

    HolidayInn.prototype.name = 'Holiday Inn';

    HolidayInn.prototype.description = "This place seems to be some sort of inn. It's not really the proper location for a ritual to resurrect me, but Liana succeeded, so I suppose it doesn't matter that much.";

    HolidayInn.prototype.image = 'misc/emptyRoom';

    HolidayInn.prototype.jobs = new Collection;

    HolidayInn.prototype.location = [655, 294];

    HolidayInn.prototype.destinations = new Collection({
      HolidayInn: -1
    });

    return HolidayInn;

  })(Place));

  add(Rest = (function(superClass) {
    extend(Rest, superClass);

    function Rest() {
      return Rest.__super__.constructor.apply(this, arguments);
    }

    Rest.prototype.place = 'HolidayInn';

    Rest.prototype.conditions = {
      '|events|IntroFuckLiana': {}
    };

    Rest.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      'Liana': '|people|Liana'
    };

    Rest.prototype.label = 'Mess with Liana';

    Rest.prototype.text = function() {
      return "While entertaining, it's not, strictly speaking, the most productive thing I can do with a day.\n\n<em>Liana: <span class=\"lust\">+1 Lust</span>\n<span class=\"depravity\">+25</span></em>";
    };

    Rest.prototype.next = Page.randomMatch;

    Rest.next = [];

    Rest.prototype.apply = function() {
      Rest.__super__.apply.call(this);
      return g.people.Liana.add('lust', 1);
    };

    Rest.prototype.effects = {
      depravity: 25
    };

    return Rest;

  })(Job));

  Job.Rest.next.push(add(Rest1 = (function(superClass) {
    extend(Rest1, superClass);

    function Rest1() {
      return Rest1.__super__.constructor.apply(this, arguments);
    }

    Rest1.prototype.text = function() {
      return "|| bg=\"Liana/Rip\"\n-- Is it just me, or have her breasts grown a bit? It might be all the recent exposure to lust magic - that has been known to happen.\n--> I spend a few minutes mauling her breasts before moving on to her clit. I give that a good flick, then order her to keep going on her own. She tends to slack off over time, so I have to keep an eye on her and occasionally remind her how hard I want her twisting her own nipples.\n--> <em>Liana: <span class=\"lust\">+1 Lust</span>, <span class=\"depravity\">+25</span></em>";
    };

    return Rest1;

  })(Page)));

  Job.Rest.next.push(add(Rest2 = (function(superClass) {
    extend(Rest2, superClass);

    function Rest2() {
      return Rest2.__super__.constructor.apply(this, arguments);
    }

    Rest2.prototype.text = function() {
      return "|| bg=\"Liana/Grope\"\n-- What a slut. She starts moaning as soon as I grope her.\n--> Well, to be fair that probably has more to do with the dildo I've had her wearing underneath her panties all day. But still...\n--> `D Slut.`\n--> <em>Liana: <span class=\"lust\">+1 Lust</span>, <span class=\"depravity\">+25</span></em>";
    };

    return Rest2;

  })(Page)));

  Job.Rest.next.push(add(Rest3 = (function(superClass) {
    extend(Rest3, superClass);

    function Rest3() {
      return Rest3.__super__.constructor.apply(this, arguments);
    }

    Rest3.prototype.text = function() {
      return "|| bg=\"Liana/Nude\"\n-- `D That's what I said. Water's off until you run two laps.`\n--> `L O...outside?!?`\n--> `D You can't very well run laps around the building from the inside, can you? Go.`\n--> <em>Liana: <span class=\"lust\">+1 Lust</span>, <span class=\"depravity\">+25</span></em>";
    };

    return Rest3;

  })(Page)));

  Job.Rest.next.push(add(Rest4 = (function(superClass) {
    extend(Rest4, superClass);

    function Rest4() {
      return Rest4.__super__.constructor.apply(this, arguments);
    }

    Rest4.prototype.text = function() {
      return "|| bg=\"Liana/Bathroom\"\n-- `D You're a very pretty human.`\n--> `L Um, yes mistress, thank you.`\n--> `D I really like the way your breasts sit there, just the perfect size for touching and squeezing.`\n--> `L I, uh...`\n\n-- Heh. Cute blush. She's way more embarrassed by this than by just being fucked. Compliments as a weak point - who would have though it? `D Stop squirming and sit. Such a cute jawline, it looks so nice wrapped around a cock, especially the way your lips twitch...`\n--> <em>Liana: <span class=\"lust\">+1 Lust</span>, <span class=\"depravity\">+25</span></em>";
    };

    return Rest4;

  })(Page)));

  Job.Rest.next.push(add(Rest5 = (function(superClass) {
    extend(Rest5, superClass);

    function Rest5() {
      return Rest5.__super__.constructor.apply(this, arguments);
    }

    Rest5.prototype.text = function() {
      return "|| bg=\"Liana/Coat\"\n-- `L Thank you, mistress! I had a wonderful day.`\n--> I grumble to myself about her chipper attitude, and debate giving her a good grope. It'd feel nice, and she'd be embarrassed to have it done in public. But no, I decide, not everything needs sex in it.\n--> `L Let's stop and get ice cream on the way home. What's your favorite flavor?`\n--> <em>Liana: <span class=\"lust\">+1 Lust</span>, <span class=\"depravity\">+25</span></em>";
    };

    return Rest5;

  })(Page)));


  add(toilet = (function(superClass) {
    extend(toilet, superClass);

    function toilet() {
      return toilet.__super__.constructor.apply(this, arguments);
    }

    toilet.prototype.place = 'HolidayInn';

    toilet.prototype.conditions = {
      '|events|IntroFuckLiana': {}
    };

    toilet.prototype.people = {
      'Alice': '|people|Alice'
    };

    toilet.prototype.label = 'Set Alice As Public Meat Toilet';

    toilet.prototype.text = function() {
      return "C.E.L.L. is really something. How could a pretty girl like her willingly abandon her human right and accept her role that lower than a sex slave?\n Nvm. Just let her cosplaying JK whoring herself in certain toilet, and bring some cum with her (which mostly she drank)\n<span class=\"cum\">+10</span>\n<span class=\"depravity\">+100</span></em>";
    };

    toilet.prototype.next = Page.randomMatch;

    toilet.next = [];

    toilet.prototype.apply = function() {
      toilet.__super__.apply.call(this);
    };

    toilet.prototype.effects = {
      depravity: 100
    };

    return toilet;

  })(Job));

  Job.toilet.next.push(add(toilet1 = (function(superClass) {
    extend(toilet1, superClass);

    function toilet1() {
      return toilet1.__super__.constructor.apply(this, arguments);
    }

    toilet1.prototype.text = function() {
      return "|| bg=\"Alice/toilet1\"\n-- Hehe... look at her. She is really something. \n<span class=\"depravity\">+100\n<span class=\"cum\">+10</span></em>";
    };

    return toilet1;

  })(Page)));

  Job.toilet.next.push(add(toilet2 = (function(superClass) {
    extend(toilet2, superClass);

    function toilet2() {
      return toilet2.__super__.constructor.apply(this, arguments);
    }

    toilet2.prototype.text = function() {
      return "|| bg=\"Alice/toilet2\"\n-- Hehe... look at her. She is really something. \n<span class=\"depravity\">+100\n<span class=\"cum\">+10</span></em>";
    };

    return toilet2;

  })(Page)));



  add(Raid = (function(superClass) {
    extend(Raid, superClass);

    function Raid() {
      return Raid.__super__.constructor.apply(this, arguments);
    }

    Raid.prototype.place = 'HolidayInn';

    Raid.prototype.type = 'special';

    Raid.prototype.conditions = {
      '|freeSpace': {
        gt: 2
      },
      '|events|Slutroom': {},
      '|events|Raid|length': {
        optional: true,
        lt: 5
      }
    };

    Raid.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      'Liana': '|people|Liana'
    };

    Raid.prototype.label = 'Slave raid';

    Raid.prototype.text = function() {
      return "This inn is a fertile hunting ground. I'm astonished that the keepers haven't bothered us yet, but until they do, I'm perfectly happy to enslave easy victims and take their rooms for my domain.";
    };

    Raid.prototype.next = Page.firstNew;

    Raid.next = [];

    return Raid;

  })(Job));

  Job.Raid.next.push(add(Raid1 = (function(superClass) {
    extend(Raid1, superClass);

    function Raid1() {
      return Raid1.__super__.constructor.apply(this, arguments);
    }

    Raid1.prototype.text = function() {
      return "||\n  -- `D Ok. Here's what we're going to do. You get them to open the door, lure them into their back room. I'll follow you in fifteen minutes, and take care of them while they're distracted.`\n  --> `L How am I supposed to do that, mistress?`\n|| bg=\"Liana/noPants\"\n  --> I push her out the door, then gesture at her pants. They disappear. She's not wearing any underwear, of course - she never gets those anymore. `D Use your imagination, dear.`\n|| bg=\"Liana/2guys\"\n  -- When I finally arrive to rescue her, Liana has them well... distracted. She's a good girl.\n    --> <em class=\"men\">+3</em>";
    };

    Raid1.prototype.effects = {
      add: {
        '|map|HolidayInn|jobs|109': Job.SmallRoom
      },
      men: 3
    };

    return Raid1;

  })(Page)));

  Job.Raid.next.push(add(Raid2 = (function(superClass) {
    extend(Raid2, superClass);

    function Raid2() {
      return Raid2.__super__.constructor.apply(this, arguments);
    }

    Raid2.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n  -- `L I just saw someone check in to room 110. She's really cute, mistress, and we used to be friends. Can we take her? I want to play.`\n  --> `L Oh, and... um... she's all alone. I don't think we need to do anything special?`\n  --> It's true, none of the embarrassing \"distractions\" I've asked her to do so far have been actually <em>necessary,</em> though they have been entertaining for me, and that's a pretty good definition of \"necessity.\" Regardless, I pat Liana on the head. `D She's all yours.`\n\n|| bg=\"Inn/Hogtie\"\n  -- I crack the door open a few minutes later to see how Liana's doing with my new slave. She's doing fine.\n  --> `L Going home to your family for the weekend, Jamie? No, I don't think so. I think you're going to be a sex slave now. Make fun of my hair, will you...` Liana shoves her onto her back with one foot, and delivers a vicious slap across the breast.\n  --> I close the door quietly with a smile. Best give them some more time to get reacquainted.\n  --> <em class=\"women\">+1</em>";
    };

    Raid2.prototype.effects = {
      women: 1,
      add: {
        '|map|HolidayInn|jobs|110': Job.SmallRoom
      }
    };

    return Raid2;

  })(Page)));

  Job.Raid.next.push(add(Raid3 = (function(superClass) {
    extend(Raid3, superClass);

    function Raid3() {
      return Raid3.__super__.constructor.apply(this, arguments);
    }

    Raid3.prototype.text = function() {
      return "||\n  -- Sometimes, the simplest methods are best.\n  --> Find a weak mind, just brimming with desire to experiment for the first time.\n  --> Pump in lust magic.\n|| bg=\"Inn/Fisting\"\n  --> Collect her and her stronger willed friend while they're distracted, but before the one on top can lose her virginity.\n  -- <em class=\"virgins\">+1</em>\n  <em class=\"women\">+1</em>";
    };

    Raid3.prototype.effects = {
      women: 1,
      virgins: 1,
      add: {
        '|map|HolidayInn|jobs|111': Job.SmallRoom
      }
    };

    return Raid3;

  })(Page)));

  Job.Raid.next.push(add(Raid4 = (function(superClass) {
    extend(Raid4, superClass);

    function Raid4() {
      return Raid4.__super__.constructor.apply(this, arguments);
    }

    Raid4.prototype.text = function() {
      return "||\n  -- For once, I'm in the mood to do the dirty work myself. Liana follows on my heels as I head down the hall, looking for an occupied room we haven't taken possession of yet. One door in particular calls out to me, I unlock the door with a touch (these locks are pathetic, nothing like the solid latches or bars I remember from the last time I wandered the world).\n\n|| bg=\"Inn/Computer\"\n  -- Sometimes it's too simple. She's half naked at her desk, chain trailing from her neck, touching herself and moaning.\n  --> While I drain her mind, Liana examines the shining box on the table. `L She was talking with her mistress online.`\n  --> Slut. She'll be much happier with a real mistress to serve than a crazy magical lightning box.\n  --> <em class=\"women\">+1</em>";
    };

    Raid4.prototype.effects = {
      women: 1,
      add: {
        '|map|HolidayInn|jobs|112': Job.SmallRoom
      }
    };

    return Raid4;

  })(Page)));

  Job.Raid.next.push(add(Raid5 = (function(superClass) {
    extend(Raid5, superClass);

    function Raid5() {
      return Raid5.__super__.constructor.apply(this, arguments);
    }

    Raid5.prototype.text = function() {
      return "|| bg=\"Inn/Cuckold\"\n  -- The door opens.\n  --> Liana blinks in surprise.\n  --> The man blinks in surprise.\n|| bg=\"Slutroom/Oral3\"\n  --> His former girlfriend, busy slurping on the pussy I assigned her a few days ago, doesn't notice anyone else in the room.\n  -- Before he can say anything, I hit him over the back of the head with a metal canister. It would have been awkward if he'd screamed, and the girl's busy slurping and shouldn't be distracted, and now I have a bonus slave. Everyone wins.\n  --> <em class=\"men\">+1</em>";
    };

    Raid5.prototype.effects = {
      men: 1
    };

    return Raid5;

  })(Page)));

  burnChoices = function(loc) {
    var c, job, key, ref;
    c = {};
    ref = loc.jobs;
    for (key in ref) {
      job = ref[key];
      if (RoomJob[job.constructor.name]) {
        c[key] = job.label;
      }
    }
    delete c.BreedingPit;
    return c;
  };

  add(Fire = (function(superClass) {
    extend(Fire, superClass);

    function Fire() {
      return Fire.__super__.constructor.apply(this, arguments);
    }

    Fire.prototype.place = 'HolidayInn';

    Fire.prototype.conditions = {
      '|events|IntroTakeOver': {},
      '|depravity': {
        gte: 50
      },
      '|location': {
        matches: function(l) {
          return Object.keys(burnChoices(l)).length;
        }
      }
    };

    Fire.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      Liana: '|people|Liana'
    };

    Fire.prototype.label = 'Fire';

    Fire.prototype.type = 'special';

    Fire.prototype.text = function() {
      return "You know what? It's time for some redecorating. Let's release the slaves, set it on fire and build something else.\n\nI bet Liana will want to watch.\n\n<em><span class=\"depravity\">-50</span>\n\n" + (dropdown(this.choices, this.choice, 'bottom'));
    };

    Fire.prototype.renderBlock = function(mainKey, location) {
      var element;
      this.choices = burnChoices(g.map[location]);
      this.location = location;
      if (this.choices[this.choice] == null) {
        this.choice = Object.keys(this.choices)[0];
      }
      element = $(Fire.__super__.renderBlock.call(this, mainKey, location));
      element.on('change', 'input', (function(_this) {
        return function() {
          return _this.choice = $('input:checked', element).val();
        };
      })(this));
      return element;
    };

    return Fire;

  })(Job));

  add(Fire = (function(superClass) {
    extend(Fire, superClass);

    function Fire() {
      return Fire.__super__.constructor.apply(this, arguments);
    }

    Fire.prototype.conditions = {
      location: '|last|location',
      choice: '|last|choice'
    };

    Fire.prototype.text = function() {
      return "||\n  -- `L Wait, is... is that a box of matches?`\n  --> `D I'm redecorating the " + g.map[this.location].jobs[this.choice].label + ". Already let the slaves out.`\n  --> `L Can I smash everything first?`\n||  bg=\"Liana/Happy\"\n  --> How can I say no to a request like that? I hand her a baseball bat and the box of matches for when she's done.\n|| bg=\"Liana/Fire\"\n  -->";
    };

    Fire.prototype.apply = function() {
      var room, size, type;
      Fire.__super__.apply.call(this);
      type = g.map[this.context.location].jobs[this.context.choice].constructor.name;
      size = RoomJob[type].prototype.size;
      room = Job[size.capitalize() + 'Room'];
      return g.map[this.context.location].jobs[this.context.choice] = new room;
    };

    return Fire;

  })(Page));

  add(VisitGym = (function(superClass) {
    extend(VisitGym, superClass);

    function VisitGym() {
      return VisitGym.__super__.constructor.apply(this, arguments);
    }

    VisitGym.prototype.place = 'HolidayInn';

    VisitGym.prototype.conditions = {
      '|events|SexyGym': {},
      '|map|HolidayInn|jobs|gym': {
        matches: function(j) {
          return j instanceof Job.Gym;
        }
      }
    };

    VisitGym.prototype.people = {
      'Dark Lady': {
        is: Person.DarkLady
      },
      Sadist: {
        is: Person.Sadist
      },
      'Sadist ': {
        is: Person.Sadist
      },
      'Sadist  ': {
        is: Person.Sadist
      }
    };

    VisitGym.prototype.type = 'plot';

    VisitGym.prototype.label = "A visitor";

    VisitGym.prototype.text = function() {
      return "I smell... I smell a bra. In the gym. Someone's getting punished for this, and for once I don't think it's Liana.";
    };

    return VisitGym;

  })(Job));

  add(VisitGym = (function(superClass) {
    extend(VisitGym, superClass);

    function VisitGym() {
      return VisitGym.__super__.constructor.apply(this, arguments);
    }

    VisitGym.prototype.text = function() {
      return "|| bg=\"Gym/Treadmills\"\n  -- Ever since I started exercising my girls there, the gym has been quite popular with the locals. Usually the men, of course, who aren't at all adverse to the fact that some of the sluts like to take their shirts off when it gets too hot.\n\n  For some reason it's quite hard to heat the place up with magic - an 'air conditioner' spell keeps sucking all the heat out. I'll figure it out someday.\n\n  -- Today, though, something is amiss.\n  --> `D Her.` I point, and security moves to surround her.\n  --> ` Um... I, uh, I'm looking for one of my friends? I think she's here? Can... can you help... eep!` She struggles a little bit as \"security\" drags her into the back room. Now, how shall I punish her for wearing a bra in my...\n\n|| bg=\"Gym/VisitCasual\"\n  -- ` Excuse me, Ms., do you know what just happened?` My my, what a delightful piece of work she is. And not even one of mine!\n  --> `D She was not feeling well. I'm just having the doctor take a look at her for a moment,`\n  --> ` Oh. She's my friend, I think she was looking for me.`\n  --> `D Ah. Well, you're welcome to come back and speak with her if you like. She may be tied up for while.`\n\n|| bg=\"Gym/VisitFingering1\"\n  -- We step into one of the gym's back offices, and the friend immediately blushes bright crimson. ` Kateyln?!`\n|| bg=\"Gym/VisitFingering2\"\n  --> ` A-Amanda? What're you doing here!` Kateyln tries to stand, but a strong hand (and another busy one) from the \"doctor\" keeps her in place.\n  --> They stare at eachother flabbergasted. This is delightful. Amanda just can't seem to move. Kateyln can't help but moan. I grin and watch their increasingly mortified expressions.\n\n|| bg=\"Gym/VisitGangbang1\"\n  -- Also, it gives security time to get behind Amanda. One of them throws her onto a bed and rips open her shirt.\n  --> `D Amanda. As you well know, there're no bras allowed in the gym. And I can see,` I grope Kateyln's chest, `D You didn't tell your friend. Now you both need to be punished for violating the rules.`\n  --> ` Violating the rules? What sort of fucking rule is... Yahhh!`\n\n|| bg=\"Gym/VisitMortified\"\n  -- Cocks. Not just fun, also great for shutting up bitches. `D So as I was saying. Amanda, you get superfucked. Kateyln, you knew the rule and let her bring one in anyway. You get fucked.`\n\n|| bg=\"Gym/VisitGangbang1\"\n  --> ` Wait, I didn't sign up, I just came to find my friend! What's wrong with you people...`\n\n|| bg=\"Gym/VisitGangbang2\"\n  --> Her complaints don't really help her, nor does closing her eyes. She can still hear her friend getting fucked right next to her. Kateyln, on the other hand, can't seem to stop staring in horrified fascination as her friend is violated by three strangers in front of her. I grin and leave them to it.";
    };

    VisitGym.prototype.effects = {
      remove: {
        '|map|HolidayInn|jobs|VisitGym': Job.VisitGym
      }
    };

    return VisitGym;

  })(Page));

  add(LianaConcrete = (function(superClass) {
    extend(LianaConcrete, superClass);

    function LianaConcrete() {
      return LianaConcrete.__super__.constructor.apply(this, arguments);
    }

    LianaConcrete.prototype.place = 'HolidayInn';

    LianaConcrete.prototype.conditions = {
      '|events|Galleria': {}
    };

    LianaConcrete.prototype.people = {
      Liana: {
        is: Person.Liana,
        stuck: true
      },
      'Dark Lady': {
        is: Person.DarkLady
      }
    };

    LianaConcrete.prototype.type = 'plot';

    LianaConcrete.prototype.label = "Long-term storage";

    LianaConcrete.prototype.text = function() {
      return "I've been far, far too nice to Liana recently. Let's remind her of her place, shall we?";
    };

    LianaConcrete.prototype.next = Page.firstNew;

    LianaConcrete.next = [];

    return LianaConcrete;

  })(Job));

  Job.LianaConcrete.next.push(add(LianaConcrete1 = (function(superClass) {
    extend(LianaConcrete1, superClass);

    function LianaConcrete1() {
      return LianaConcrete1.__super__.constructor.apply(this, arguments);
    }

    LianaConcrete1.prototype.text = function() {
      return "|| bg=\"Liana/Bathroom\"\n  -- `L Mistress, hello! I was just getting dressed. What can I do for you?`\n  --> `D I've been too nice to you recently. Also, your personal record is only six men in an hour - unacceptable.`\n|| bg=\"Liana/Nude`\n  --> `L Um...` She pulls a towel up around to cover her nudity. I laugh and grab her by the hair.\n  --> `D You won't need that where you're going. Come.`\n\n|| bg=\"Galleria/Wall4\"\n  -- I lead her to the Galleria, tugging on her hair occasionally to remind her that she's mine, and never letting her fully catch up with my quick pace. We stop at the front desk, and I take away her towel.\n  --> `Now, relax and don't resist. If you resist, I'll have to squeeze harder, and that'll make your final position less comfortable.`\n  --> She is understandably nervous, but does her best to relax. I give her a smile, though it probably comes across as more predatory than reassuring.\n\n  -- I set my spell in motion. The air grows thick with magic, shimmering in a sphere around her. It tugs on Liana, changing her position, and heeding my words she doesn't resist.\n|| bg=\"Liana/Exposing`\n  --> The magic grows thicker, and she floats up into the air, drifting backwards. She doesn't notice when her elbows reach the concrete wall behind her, but just continues drifting backwards, passing straight through it. Finally, with a loud pop, her body snaps back into solidity.\n|| bg=\"Liana/Concrete`\n  `L I... what!?`\n  -->I grin and flick her clit harshly. `D You can come out when you've been used 600 times. Get to it.`";
    };

    return LianaConcrete1;

  })(Page)));

  Job.LianaConcrete.next.push(add(LianaConcrete2 = (function(superClass) {
    extend(LianaConcrete2, superClass);

    function LianaConcrete2() {
      return LianaConcrete2.__super__.constructor.apply(this, arguments);
    }

    LianaConcrete2.prototype.text = function() {
      return "|| bg=\"Liana/Concrete\"\n-- `L Oww, oww, oww,` Liana's howls attract considerable laughter from the rest of the line waiting to use her as a woman tugs on her nipple savagely. The woman's other hand is buried in Liana's cunt, twisting and thrusting its way until she can feel fingers brushing her cervix. `L Oh god, that's... I can't take... any more,` Her panting is, of course, ignored. She's here for their amusement, not her own.";
    };

    return LianaConcrete2;

  })(Page)));

  Job.LianaConcrete.next.push(add(LianaConcrete3 = (function(superClass) {
    extend(LianaConcrete3, superClass);

    function LianaConcrete3() {
      return LianaConcrete3.__super__.constructor.apply(this, arguments);
    }

    LianaConcrete3.prototype.text = function() {
      return "|| bg=\"Liana/ConcreteDone\"\n-- `L Oh, fuck, come on, rub my clit, please? I haven't cum in four hours, please, I'm begging you... Ah!`\n--> The man cums inside her. Stuck in the wall, Liana can do no more than beg for release. A rare few grant her wish, but most either ignore her pleas or use her mouth in order to shut her up.";
    };

    return LianaConcrete3;

  })(Page)));

  Job.LianaConcrete.next.push(add(LianaConcrete4 = (function(superClass) {
    extend(LianaConcrete4, superClass);

    function LianaConcrete4() {
      return LianaConcrete4.__super__.constructor.apply(this, arguments);
    }

    LianaConcrete4.prototype.text = function() {
      return "|| bg=\"Liana/ConcreteDone\"\n-- `D So, how are you feeling, Liana? That was the 600th.`\n--> It takes her a moment to focus on me. She's been fucked, abused, cummed in, cummed on, called names nearly continually for 4 days now. She's had men in her cunt, men in her ass, men in her mouth. She's had her breasts caressed, slapped, pinched and drawn on. No one has cleaned the cum from her - it oozes from every hole, covers her skin, pools in a puddle on the floor beneath her. I don't blame her for being a little slow.\n--> `L Mistress. Hullo. I only... I only thought that was 562.`\n-- `D Some of them used you while you were passed out.`\n--> `L Oh. Well. Maybe those shouldn'st count?`\n--> `D You really are a slut, aren't you.` I chuckle, and kiss her on the lips. A rare honor. I can taste the thick mix of cum coating her. `D Very well. A few more hours.`";
    };

    LianaConcrete4.prototype.effects = {
      remove: {
        '|map|HolidayInn|jobs|LianaConcrete': Job.LianaConcrete
      }
    };

    return LianaConcrete4;

  })(Page)));

  add(TheEnd = (function(superClass) {
    extend(TheEnd, superClass);

    function TheEnd() {
      return TheEnd.__super__.constructor.apply(this, arguments);
    }

    TheEnd.prototype.place = 'HolidayInn';

    TheEnd.prototype.conditions = {
      '|events|LianaConcrete': {},
      '|events|VisitGym': {},
      '|events|DormDaily': {},
      '|events|BlackmailOfficer2': {},
      '|events|Nudity': {},
      '|events|ProfessorsOrdeal11': {},
      '|events|LianaTeleport': {},
      '|events|TrainingFacilityGraduate': {},
      '|events|TheEnd': false
    };

    TheEnd.prototype.people = {
      Liana: {
        is: Person.Liana
      },
      'Dark Lady': {
        is: Person.DarkLady
      }
    };

    TheEnd.prototype.type = 'plot';

    TheEnd.prototype.label = "The end (???)";

    TheEnd.prototype.text = function() {
      return "Having explored what this new world has to offer, it's time to consider my next moves. Liana, get in here.";
    };

    return TheEnd;

  })(Job));

  add(TheEnd = (function(superClass) {
    extend(TheEnd, superClass);

    function TheEnd() {
      return TheEnd.__super__.constructor.apply(this, arguments);
    }

    TheEnd.prototype.text = function() {
      var j, research, researchUndone, rooms, roomsUnbuilt;
      j = g.map.Research.jobs;
      research = Object.keys(j).length;
      researchUndone = Object.keys(j).filter(function(k) {
        return j[k];
      }).map(function(k) {
        return j[k].label;
      });
      rooms = Object.keys(Place.Rooms.prototype.jobs).filter(function(k) {
        return !k.match('LeaveEmpty');
      });
      roomsUnbuilt = rooms.filter(function(k) {
        return !g.events[k];
      }).map(function(k) {
        return Place.Rooms.prototype.jobs[k].prototype.label;
      });
      return "|| bg=\"Inn/Pentagram\"\n  -- Magic. It flows through me. I'm not what I once was, but neither am I any more the troubled, pitiful version of myself that Liana summoned so many months ago. I'm strong enough now that tearing a door in reality is no trouble. I step through one fold, and grab a startled Liana's hand. Another step, and we're both elsewhere.\n|| bg=\"Liana/Rooftop\"\n  --> The big city. It stretches away from us, resplendant in the setting sun.`D Ssh,` I hold a finger to her lips as she starts to say something, perhaps to ask why I've brought us here.\n  --> She waits silently while I consider what to say.\n\n  -- `D I once promised you revenge on the Dean's office.`\n  --> `L Huh, you remember that?`\n  --> `D Of course. It's the only term of our pact unfulfilled.`\n  --> `L I... it's not as important to me as it once was.` She shakes her head. `L Um... if I release you from the terms, what will you do?`\n|| bg=\"Liana/Magic\"\n  -- I smirk. `D Release me? Silly girl.` Her hand jerks up, lays itself across her cheek. She's not controlling it - I am.\n  --> `D You are mine.` I stand, and force her body to relax completely.\n  --> `D My body, my mind.` She stares at me with mingled horror and desire as I move towards her. I can feel her heart pounding in her chest. Her magic stirs, but it's of no consequence. My hooks are set deep.\n  --> `D My soul.`\n\n  -- I step forward and plant a kiss on her forehead.\n|| bg=\"Liana/Rooftop\"\n  --> `D Somehow, I too find things not as important to me as they once were.`\n  --> I sit down next to her, staring at the city, and relax my control. She doesn't move for a moment, then shifts a little closer to my side. Our shoulders touch.\n  --> It's been a long time since I've let someone get so close.\n\n  -- <em>You've reached the end of Hive's story (such as it is). Congrats! Feel free to continue exploring and enjoying things as long as you like - there's likely at least a few variations of daily events you haven't encountered yet.</em>\n  <em>" + (roomsUnbuilt.length ? "You haven't built the " + roomsUnbuilt.wordJoin() + '.' : "You've constructed all building types.") + "</em>\n  <em>" + (researchUndone.length ? "You haven't researched " + researchUndone.wordJoin() + '.' : "You've researched everything.") + "</em>";
    };

    TheEnd.prototype.effects = {
      depravity: -800,
      add: {
        '|map|NorthEnd|jobs|7': Job.LargeRoom
      },
      remove: {
        '|map|Council|jobs|Nudity': Job.Nudity
      }
    };

    return TheEnd;

  })(Page));

}).call(this);

(function() {
  var Catch, CatchBad, CatchGood, CatchMan, CatchMiss, CatchNothing, CatchPolice, CatchPoliceCapture, CatchVeryBad, CatchVeryGood, CatchVirgin, CatchWoman, Release, RentWarehouse, RentWarehouse1, RentWarehouse2, RentWarehouse3, RentWarehouse4, Resistance, Sycamore, Tunnel, Tunnel2, Tunnel3, Tunnel4, Whore, choices, releaseValue, whoreDepravity,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(Sycamore = (function(superClass) {
    extend(Sycamore, superClass);

    function Sycamore() {
      return Sycamore.__super__.constructor.apply(this, arguments);
    }

    Sycamore.prototype.name = 'Sycamore Street';

    Sycamore.prototype.description = "Empty businesses, boarded up windows, hookers, broken bottles... it's not much, but it's a place to start.";

    Sycamore.prototype.image = 'Sycamore/Street';

    Sycamore.prototype.jobs = new Collection({
      Fire: Job.Fire
    });

    Sycamore.prototype.location = [633, 354];

    Sycamore.prototype.destinations = new Collection;

    return Sycamore;

  })(Place));

  add(Resistance = (function(superClass) {
    extend(Resistance, superClass);

    function Resistance() {
      return Resistance.__super__.constructor.apply(this, arguments);
    }

    Resistance.prototype.place = 'Sycamore';

    Resistance.prototype.type = 'plot';

    Resistance.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      Liana: '|people|Liana'
    };

    Resistance.prototype.label = 'Walk with Liana';

    Resistance.prototype.text = function() {
      return "Liana has something she wants to talk to me about, something-something police we're doomed. Perhaps I'd better listen.";
    };

    return Resistance;

  })(Job));

  Job.Resistance.prototype.next = add(Resistance = (function(superClass) {
    extend(Resistance, superClass);

    function Resistance() {
      return Resistance.__super__.constructor.apply(this, arguments);
    }

    Resistance.prototype.text = function() {
      return "|| bg=\"Sycamore/Street\"\n  -- Liana leads me out into the daylight. It's not my favorite place to be - rather exposed to the accursed daystar, nothing fun happening near... wait, nope, I hear people fucking in one of the buildings nearby. Nothing fun happening nearby <i>that I get to watch.</i> My lieutenant seems rather happy, which I suppose is a good thing.\n|| bg=\"Liana/Coat\"\n  -- `L You know, when I summoned you I just wanted to abduct my professors, torture them a bit, maybe make them run around naked. I wasn't expecting you to be quite so... vigorous. Taking over everything's fun, mind you, just not what I was expecting to do.`\n  --> I smirk, wait for her to go on.\n  --> `L Anyway, I wanted to warn you about how things work here in the modern world. You can maybe get away with a couple of disappearances here or there, but too much more of what we did back at the motel and you'll start attracting attention. I'm amazed no one's reported your slaves missing yet.`\n\n  -- `D Of course not. I've woven a Forgetting over our activities. People forget their suspicions unusually quickly in its presence.`\n  --> `L Really? That's useful. I haven't felt anything.`\n  --> `D Of course not. It would be a poor spell if it could be noticed casually. You're immune, of course, being a mage. Search for it sometime, you'll feel it blanketing the town.`\n  --> Liana blinks a few times, looking puzzled. Right. She's not a mage yet, just a dabbling amateur. I explain how she can see magical energy. An amateur, but a gifted one - she picks up the principle instantly.\n\n  -- `L Anyway, that's what I wanted to tell you, but it sounds like you already know.` She smiles and twirls, long hair flowing in the wind.\n  --> `D Your skirt.`\n  --> `L What?`\n  --> `D If we're done talking, give me your skirt.`\n\n|| bg=\"Liana/noPants\"\n  -- <em>Resistance (R) is a number ranging from 0-100, representing how suspicious and alert the town is. It adds to the difficulty of all stat checks, making you less likely to succeed. It decays slowly on its own (due to the Dark Lady's spell), though eventually you'll find other ways to decrease it later.</em>\n\n  <em><span class=\"resistance\">+5</span></em>";
    };

    Resistance.prototype.apply = function() {
      Resistance.__super__.apply.call(this);
      return g.resistance = 5;
    };

    Resistance.prototype.effects = {
      remove: {
        '|map|Sycamore|jobs|Resistance': Job.Resistance
      }
    };

    return Resistance;

  })(Page));

  add(Catch = (function(superClass) {
    extend(Catch, superClass);

    function Catch() {
      return Catch.__super__.constructor.apply(this, arguments);
    }

    Catch.prototype.place = 'Sycamore';

    Catch.prototype.conditions = {
      '|freeSpace': {
        gte: 1
      },
      '|events|Resistance': {}
    };

    Catch.prototype.people = {
      worker: {}
    };

    Catch.prototype.label = 'Catch Slaves';

    Catch.prototype.text = function() {
      return "Snatching people off the street is the simplest - but also most dangerous - way to get new slaves.\n\n<span class=\"resistance\">+1 to +5</span>\n" + (Page.statCheckDescription('strength', 30, Job.Catch.next, this.context));
    };

    Catch.prototype.stat = 'strength';

    Catch.prototype.difficulty = 20;

    Catch.prototype.next = Page.statCheck;

    Catch.next = {};

    return Catch;

  })(Job));

  add(CatchPolice = (function(superClass) {
    extend(CatchPolice, superClass);

    function CatchPolice() {
      return CatchPolice.__super__.constructor.apply(this, arguments);
    }

    CatchPolice.prototype.conditions = {
      worker: {}
    };

    CatchPolice.prototype.text = function() {
      return "|| bg=\"Sycamore/Police\"\n-- It went poorly. " + (this.worker === g.people.DarkLady ? 'I' : 'My ' + this.worker) + " was shot by the police, though " + (this.worker === g.people.DarkLady ? 'I' : he()) + " did manage to escape. At least the officer was hot.\n<em><span class=\"strength\">-6 strength</span>, <span class=\"resistance\">+5</span></em>";
    };

    CatchPolice.prototype.apply = function() {
      CatchPolice.__super__.apply.call(this);
      this.context.worker.add('strength', -6);
      return g.resistance += 5;
    };

    return CatchPolice;

  })(Page));

  add(CatchPoliceCapture = (function(superClass) {
    extend(CatchPoliceCapture, superClass);

    function CatchPoliceCapture() {
      return CatchPoliceCapture.__super__.constructor.apply(this, arguments);
    }

    CatchPoliceCapture.prototype.conditions = {
      worker: {
        isnt: [Person.DarkLady, Person.Liana]
      }
    };

    CatchPoliceCapture.prototype.text = function() {
      return "|| bg=\"Sycamore/Police\"\n-- My " + this.worker + " has been captured by the police! Damn it. I'll have to trigger the remote memory erasure spell I implanted - " + he + " won't be of any more use to me, but at least they won't be able to get any information out of " + him + ".\n<em>" + this.worker + " is captured. <span class=\"resistance\">+5</span></em>";
    };

    CatchPoliceCapture.prototype.apply = function() {
      CatchPoliceCapture.__super__.apply.call(this);
      g.people.remove(this.context.worker);
      delete g.map.Sycamore.jobs.Catch.context.worker;
      return g.resistance += 5;
    };

    return CatchPoliceCapture;

  })(Page));

  add(CatchNothing = (function(superClass) {
    extend(CatchNothing, superClass);

    function CatchNothing() {
      return CatchNothing.__super__.constructor.apply(this, arguments);
    }

    CatchNothing.prototype.conditions = {
      worker: {}
    };

    CatchNothing.prototype.text = function() {
      return "|| bg=\"Sycamore/Street\"\n-- " + this.worker + " is bored. " + He + " wandered the streets looking for someone to catch, but found nothing. Perhaps rumors of how dangerous the area has become have spread, or perhaps there was a college football game drawing everyone away.\n<em><span class=\"lust\">-1 Lust</span>, <span class=\"resistance\">+1</span></em>";
    };

    CatchNothing.prototype.apply = function() {
      CatchNothing.__super__.apply.call(this);
      this.context.worker.add('lust', -1);
      return g.resistance += 1;
    };

    return CatchNothing;

  })(Page));

  add(CatchMiss = (function(superClass) {
    extend(CatchMiss, superClass);

    function CatchMiss() {
      return CatchMiss.__super__.constructor.apply(this, arguments);
    }

    CatchMiss.prototype.conditions = {
      worker: {}
    };

    CatchMiss.prototype.text = function() {
      return "|| bg=\"Sycamore/Street\"\n-- " + this.worker + " cornered a young " + (Math.choice(['man', 'woman'])) + ", but they kicked " + his + " shins, knocked " + him + " into a wall and escaped. It hurt not only " + his + " pride, but also " + his + " head.\n<em><span class=\"lust\">-1 Lust</span>, <span class=\"intelligence\">-1 Intelligence</span>, <span class=\"resistance\">+3</span></em>";
    };

    CatchMiss.prototype.apply = function() {
      CatchMiss.__super__.apply.call(this);
      this.context.worker.add('lust', -1);
      this.context.worker.add('intelligence', -1);
      return g.resistance += 2;
    };

    return CatchMiss;

  })(Page));

  add(CatchMan = (function(superClass) {
    extend(CatchMan, superClass);

    function CatchMan() {
      return CatchMan.__super__.constructor.apply(this, arguments);
    }

    CatchMan.prototype.text = function() {
      var c;
      c = ["|| bg=\"Sycamore/CaptureM1\"\n--", "|| bg=\"Sycamore/CaptureM2\"\n-- ` Oh, don't worry. You'll be seeing <em>plenty</em> more of me soon enough. Now let's see, where did I leave the chloroform..."];
      return (Math.choice(c)) + "\n--> <em><span class=\"men\">+1</span>, <span class=\"resistance\">+3</span></em>";
    };

    CatchMan.prototype.effects = {
      men: 1,
      resistance: 3
    };

    return CatchMan;

  })(Page));

  add(CatchWoman = (function(superClass) {
    extend(CatchWoman, superClass);

    function CatchWoman() {
      return CatchWoman.__super__.constructor.apply(this, arguments);
    }

    CatchWoman.prototype.text = function() {
      var c;
      c = ["|| bg=\"Sycamore/CaptureF1\"\n-- Swimming alone late at night may not have been the best choice. Or at least she doesn't think it's the best choice right now - I bet in six months she'll be glad she's my slut.", "|| bg=\"Sycamore/CaptureF2\"\n-- ` You're not a virgin, are you? No? Good, that means I get to have some fun before I turn you over to my mistress.", "|| bg=\"Sycamore/CaptureF4\"\n-- Schoolgirl - innocent enough to trust her new boyfriend when he wanted to take her for a special date, not innocent enough to be a virgin. That's ok, he'll still get paid a good sum for his trouble."];
      return (Math.choice(c)) + "\n--> <em><span class=\"women\">+1</span>, <span class=\"resistance\">+4</span></em>";
    };

    CatchWoman.prototype.effects = {
      women: 1,
      resistance: 4
    };

    return CatchWoman;

  })(Page));

  add(CatchVirgin = (function(superClass) {
    extend(CatchVirgin, superClass);

    function CatchVirgin() {
      return CatchVirgin.__super__.constructor.apply(this, arguments);
    }

    CatchVirgin.prototype.text = function() {
      return "|| bg=\"Sycamore/CaptureF3\"\n-- <em><span class=\"virgins\">+1</span>, <span class=\"resistance\">+5</span></em>";
    };

    CatchVirgin.prototype.effects = {
      virgins: 1,
      resistance: 5
    };

    return CatchVirgin;

  })(Page));

  Job.Catch.next['veryGood'] = add(CatchVeryGood = (function(superClass) {
    extend(CatchVeryGood, superClass);

    function CatchVeryGood() {
      return CatchVeryGood.__super__.constructor.apply(this, arguments);
    }

    CatchVeryGood.prototype.conditions = {
      worker: {}
    };

    CatchVeryGood.prototype.text = function() {
      return false;
    };

    CatchVeryGood.prototype.next = Page.trueRandom;

    CatchVeryGood.next = [Page.CatchMan, Page.CatchWoman, Page.CatchWoman, Page.CatchWoman, Page.CatchVirgin, Page.CatchVirgin];

    return CatchVeryGood;

  })(Page));

  Job.Catch.next['good'] = add(CatchGood = (function(superClass) {
    extend(CatchGood, superClass);

    function CatchGood() {
      return CatchGood.__super__.constructor.apply(this, arguments);
    }

    CatchGood.prototype.conditions = {
      worker: {}
    };

    CatchGood.prototype.text = function() {
      return false;
    };

    CatchGood.prototype.next = Page.trueRandom;

    CatchGood.next = [Page.CatchMan, Page.CatchWoman];

    return CatchGood;

  })(Page));

  Job.Catch.next['bad'] = add(CatchBad = (function(superClass) {
    extend(CatchBad, superClass);

    function CatchBad() {
      return CatchBad.__super__.constructor.apply(this, arguments);
    }

    CatchBad.prototype.conditions = {
      worker: {}
    };

    CatchBad.prototype.text = function() {
      return false;
    };

    CatchBad.prototype.next = Page.trueRandom;

    CatchBad.next = [Page.CatchPolice, Page.CatchNothing, Page.CatchMiss];

    return CatchBad;

  })(Page));

  Job.Catch.next['veryBad'] = add(CatchVeryBad = (function(superClass) {
    extend(CatchVeryBad, superClass);

    function CatchVeryBad() {
      return CatchVeryBad.__super__.constructor.apply(this, arguments);
    }

    CatchVeryBad.prototype.conditions = {
      worker: {}
    };

    CatchVeryBad.prototype.text = function() {
      return false;
    };

    CatchVeryBad.prototype.next = Page.trueRandom;

    CatchVeryBad.next = [Page.CatchPolice, Page.CatchPoliceCapture, Page.CatchPoliceCapture];

    return CatchVeryBad;

  })(Page));

  choices = function() {
    var c;
    c = {};
    if (g.men) {
      c.men = 'men';
    }
    if (g.women) {
      c.women = 'women';
    }
    if (g.virgins) {
      c.virgins = 'virgins';
    }
    if (Object.keys(c).length === 0) {
      c[''] = '';
    }
    return c;
  };

  releaseValue = {
    men: 5,
    women: 10,
    virgins: 25
  };

  add(Release = (function(superClass) {
    extend(Release, superClass);

    function Release() {
      return Release.__super__.constructor.apply(this, arguments);
    }

    Release.prototype.place = 'Sycamore';

    Release.prototype.choice = 'men';

    Release.prototype.label = 'Release Slave';

    Release.prototype.type = 'boring';

    Release.prototype.conditions = {
      '|events|Laboratory': {}
    };

    Release.prototype.text = function() {
      return "I've got a lot of " + (dropdown(choices(), this.choice)) + " in my dungeons. I can have some fun and clean up space at the same time!\n\n<span class=\"" + this.choice + "\">-1</span>, <span class=\"depravity\">+" + (releaseValue[this.choice] || 0) + "</span>, <span class=\"resistance\">-1</span>";
    };

    Release.prototype.renderBlock = function(mainKey, location) {
      var element;
      if (choices()[this.choice] == null) {
        this.choice = Object.keys(choices())[0];
      }
      element = $(Release.__super__.renderBlock.call(this, mainKey, location));
      element.on('change', 'input', (function(_this) {
        return function() {
          return _this.choice = $('input:checked', element).val();
        };
      })(this));
      return element;
    };

    Release.prototype.people = {
      worker: {
        matches: function(person, job) {
          if (!job.choice) {
            return false;
          } else {
            return true;
          }
        },
        label: function() {
          if (this.choice) {
            return '';
          } else {
            return 'Need slave';
          }
        }
      }
    };

    return Release;

  })(Job));

  add(Release = (function(superClass) {
    extend(Release, superClass);

    function Release() {
      return Release.__super__.constructor.apply(this, arguments);
    }

    Release.prototype.conditions = {
      choice: '|last|choice'
    };

    Release.prototype.text = function() {
      var c;
      if (Math.random() < 0.75) {
        return false;
      }
      c = this.choice === 'men' ? ["|| bg=\"Sycamore/Street\"\n-- My trusted servant released one of the men at the end of Sycamore Street. He won't remember a thing."] : ["|| bg=\"Sycamore/Release1\"\n-- Some markers, some rope, a public restroom... I wiped her memory of her time with me and left her there. I'm sure someone will let her out eventually, but for now... public use. Just giving back to the community which has given me so much.", "|| bg=\"Sycamore/Release2\"\n-- A bit of magical soundproofing on the box so no one gets suspicious, a letter detailing her circumstances (half-trained slave needs new home), and a random address halfway across the country. Someone's day just got brighter.", "|| bg=\"Sycamore/Release3\"\n-- Special delivery for the college football team's locker room.", "|| bg=\"Sycamore/Release4\"\n-- I made a Liana take her to the tallest building in town and leave her locked in a closet overnight. I wonder if the janitor will have some fun before he lets her go?", "|| bg=\"Sycamore/Release5\"\n-- The wonderful thing about magic is that no one else in this age seems to have it. That thing will vibrate randomly throughout the day, and it will *not* come out for at least a month.", "|| bg=\"Sycamore/Release6\"\n-- One of my servants left her in the kitchen of a random house, one leg chained in place. She'll have to wait for them to get home from work."];
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Release Slave</h4>\n\n" + (Math.choice(c)) + "\n  <span class='" + this.choice + "'>-1</span>, <span class='depravity'>+" + releaseValue[this.choice] + "</span>, <span class=\"resistance\">-1</span>";
    };

    Release.prototype.apply = function() {
      var effects;
      Release.__super__.apply.call(this);
      effects = {
        depravity: releaseValue[this.context.choice],
        resistance: -1
      };
      effects[this.context.choice] = -1;
      return g.applyEffects(effects);
    };

    return Release;

  })(Page));

  add(RentWarehouse = (function(superClass) {
    extend(RentWarehouse, superClass);

    function RentWarehouse() {
      return RentWarehouse.__super__.constructor.apply(this, arguments);
    }

    RentWarehouse.prototype.place = 'Sycamore';

    RentWarehouse.prototype.people = {
      Liana: '|people|Liana'
    };

    RentWarehouse.prototype.conditions = {
      '|depravity': {
        gte: 150
      },
      '|events|RentWarehouse|length': {
        lt: 4,
        optional: true
      }
    };

    RentWarehouse.prototype.label = 'Rent Warehouse';

    RentWarehouse.prototype.text = function() {
      return "Liana says she can acquire more room for expansion. She's a good girl, really, and extra space to build in is worth letting her put on clothes for (only temporarily, of course).\n\n<span class=\"depravity\">-150</span>";
    };

    RentWarehouse.prototype.next = Page.firstNew;

    RentWarehouse.next = [];

    return RentWarehouse;

  })(Job));

  add(Tunnel = (function(superClass) {
    extend(Tunnel, superClass);

    function Tunnel() {
      return Tunnel.__super__.constructor.apply(this, arguments);
    }

    Tunnel.prototype.progress = 0;

    Tunnel.prototype.needed = 100;

    Tunnel.prototype.people = {
      worker: {
        matches: function() {
          if (g.depravity < 5) {
            return false;
          } else {
            return true;
          }
        },
        label: function() {
          if (g.depravity < 5) {
            return 'Need depravity';
          } else {
            return '';
          }
        }
      },
      worker2: {
        matches: function() {
          if (g.depravity < 5) {
            return false;
          } else {
            return true;
          }
        },
        label: function() {
          if (g.depravity < 5) {
            return 'Need depravity';
          } else {
            return '';
          }
        },
        optional: true
      }
    };

    Tunnel.prototype.label = 'Dig Tunnel';

    Tunnel.prototype.text = function() {
      return "While the Holiday Inn is a single building, I can't move naked - or unwilling and chained up - slaves freely along city streets. I need a tunnel. <em class=\"depravity\">-5</em>\n\n<strong>" + this.progress + " / " + this.needed + "</strong>\nDaily progress: <span class=\"strength\">Strength</span>";
    };

    Tunnel.prototype.effects = {
      depravity: -5
    };

    Tunnel.prototype.apply = function() {
      var ref;
      Tunnel.__super__.apply.call(this);
      this.progress += this.context.worker.strength;
      return this.progress += ((ref = this.context.worker2) != null ? ref.strength : void 0) || 0;
    };

    return Tunnel;

  })(Job));

  Job.RentWarehouse.next.push(add(RentWarehouse1 = (function(superClass) {
    extend(RentWarehouse1, superClass);

    function RentWarehouse1() {
      return RentWarehouse1.__super__.constructor.apply(this, arguments);
    }

    RentWarehouse1.prototype.text = function() {
      return "|| bg=\"Sycamore/Street\"\n  -- After a bit of negotiating with one of the property owners on Sycamore Street, Liana has acquired a new location for me to expand into.\n|| bg=\"Liana/Gangbang\"\n  --> As a reward for all her hard work, I let a bunch of slaves gangbang her.\n  <em>+1 Medium room, <span class=\"depravity\">-150</span></em>";
    };

    RentWarehouse1.prototype.effects = {
      depravity: -150,
      add: {
        '|map|Sycamore|jobs|1': Job.Tunnel
      }
    };

    return RentWarehouse1;

  })(Page)));

  add(Tunnel = (function(superClass) {
    extend(Tunnel, superClass);

    function Tunnel() {
      return Tunnel.__super__.constructor.apply(this, arguments);
    }

    Tunnel.prototype.jobKey = 1;

    Tunnel.prototype.conditions = {
      progress: '|last|progress',
      needed: '|last|needed'
    };

    Tunnel.prototype.text = function() {
      return "|| bg=\"Sycamore/Tunnel1\"\n-- <strong>" + this.progress + " / " + this.needed + "</strong>\n<em class=\"depravity\">-5</em>";
    };

    Tunnel.prototype.apply = function() {
      Tunnel.__super__.apply.call(this);
      if (this.context.progress >= this.context.needed) {
        return g.map.Sycamore.jobs[this.jobKey] = new Job.MediumRoom;
      }
    };

    return Tunnel;

  })(Page));

  add(Tunnel2 = (function(superClass) {
    extend(Tunnel2, superClass);

    function Tunnel2() {
      return Tunnel2.__super__.constructor.apply(this, arguments);
    }

    Tunnel2.prototype.needed = 200;

    return Tunnel2;

  })(Job.Tunnel));

  Job.RentWarehouse.next.push(add(RentWarehouse2 = (function(superClass) {
    extend(RentWarehouse2, superClass);

    function RentWarehouse2() {
      return RentWarehouse2.__super__.constructor.apply(this, arguments);
    }

    RentWarehouse2.prototype.text = function() {
      return "|| bg=\"Sycamore/Street\"\n  -- After a bit of negotiating with one of the property owners on Sycamore Street, Liana has acquired a new location for me to expand into. It was a bit more expensive than anticipated, but she managed in the end.\n|| bg=\"Liana/Gangbang\"\n  --> As a punishment for wasting my money, I let a bunch of slaves gangbang her.\n  <em>+1 Medium room, <span class=\"depravity\">-175</span></em>";
    };

    RentWarehouse2.prototype.effects = {
      depravity: -175,
      add: {
        '|map|Sycamore|jobs|2': Job.Tunnel2
      }
    };

    return RentWarehouse2;

  })(Page)));

  add(Tunnel2 = (function(superClass) {
    extend(Tunnel2, superClass);

    function Tunnel2() {
      return Tunnel2.__super__.constructor.apply(this, arguments);
    }

    Tunnel2.prototype.jobKey = 2;

    Tunnel2.prototype.text = function() {
      return "|| bg=\"Sycamore/Tunnel2\"\n-- <strong>" + this.progress + " / " + this.needed + "</strong>\n<em class=\"depravity\">-5</em>";
    };

    return Tunnel2;

  })(Page.Tunnel));

  add(Tunnel3 = (function(superClass) {
    extend(Tunnel3, superClass);

    function Tunnel3() {
      return Tunnel3.__super__.constructor.apply(this, arguments);
    }

    Tunnel3.prototype.needed = 400;

    return Tunnel3;

  })(Job.Tunnel));

  Job.RentWarehouse.next.push(add(RentWarehouse3 = (function(superClass) {
    extend(RentWarehouse3, superClass);

    function RentWarehouse3() {
      return RentWarehouse3.__super__.constructor.apply(this, arguments);
    }

    RentWarehouse3.prototype.text = function() {
      return "|| bg=\"Sycamore/Street\"\n  -- Liana did good. I have a new building all my own, with a couple of smaller rooms I can fill up with fun toys for my slaves.\n|| bg=\"Liana/Gangbang\"\n  --> I gave her a break from all the hard work she does on my behalf with a nice relaxing gangbang.";
    };

    RentWarehouse3.prototype.effects = {
      depravity: -150,
      add: {
        '|map|Sycamore|jobs|3': Job.Tunnel3
      }
    };

    return RentWarehouse3;

  })(Page)));

  add(Tunnel3 = (function(superClass) {
    extend(Tunnel3, superClass);

    function Tunnel3() {
      return Tunnel3.__super__.constructor.apply(this, arguments);
    }

    Tunnel3.prototype.conditions = {
      progress: '|last|progress',
      needed: '|last|needed'
    };

    Tunnel3.prototype.text = function() {
      return "|| bg=\"Sycamore/Tunnel3\"\n-- <strong>" + this.progress + " / " + this.needed + "</strong>\n<em class=\"depravity\">-5</em>";
    };

    Tunnel3.prototype.apply = function() {
      Tunnel3.__super__.apply.call(this);
      if (this.context.progress >= this.context.needed) {
        g.map.Sycamore.jobs[3] = new Job.SmallRoom;
        return g.map.Sycamore.jobs[4] = new Job.SmallRoom;
      }
    };

    return Tunnel3;

  })(Page));

  add(Tunnel4 = (function(superClass) {
    extend(Tunnel4, superClass);

    function Tunnel4() {
      return Tunnel4.__super__.constructor.apply(this, arguments);
    }

    Tunnel4.prototype.needed = 800;

    return Tunnel4;

  })(Job.Tunnel));

  Job.RentWarehouse.next.push(add(RentWarehouse4 = (function(superClass) {
    extend(RentWarehouse4, superClass);

    function RentWarehouse4() {
      return RentWarehouse4.__super__.constructor.apply(this, arguments);
    }

    RentWarehouse4.prototype.text = function() {
      return "|| bg=\"Sycamore/Street\"\n  -- Empty warehouse space? Sure, I love empty warehouse space!\n|| bg=\"Liana/Gangbang\"\n  --> Shame it took so long. Maybe a nice brutal gangbang will convince Liana to work faster next time.";
    };

    RentWarehouse4.prototype.effects = {
      depravity: -175,
      add: {
        '|map|Sycamore|jobs|5': Job.Tunnel4
      }
    };

    return RentWarehouse4;

  })(Page)));

  add(Tunnel4 = (function(superClass) {
    extend(Tunnel4, superClass);

    function Tunnel4() {
      return Tunnel4.__super__.constructor.apply(this, arguments);
    }

    Tunnel4.prototype.jobKey = 5;

    Tunnel4.prototype.text = function() {
      return "|| bg=\"Sycamore/Tunnel4\"\n-- <strong>" + this.progress + " / " + this.needed + "</strong>\n<em class=\"depravity\">-5</em>";
    };

    return Tunnel4;

  })(Page.Tunnel));

  whoreDepravity = function(context) {
    var lust, ref, ref1, ref2, ref3, ref4;
    lust = (((ref = context.w1) != null ? ref.lust : void 0) || 0) + (((ref1 = context.w2) != null ? ref1.lust : void 0) || 0) + (((ref2 = context.w3) != null ? ref2.lust : void 0) || 0) + (((ref3 = context.w4) != null ? ref3.lust : void 0) || 0) + (((ref4 = context.w5) != null ? ref4.lust : void 0) || 0);
    return Math.floor(lust / 6);
  };

  add(Whore = (function(superClass) {
    extend(Whore, superClass);

    function Whore() {
      return Whore.__super__.constructor.apply(this, arguments);
    }

    Whore.prototype.place = 'Sycamore';

    Whore.prototype.conditions = {
      '|events|SexSlave': {}
    };

    Whore.prototype.type = 'boring';

    Whore.prototype.label = 'Prostitution';

    Whore.prototype.text = function() {
      return "Sycamore Street isn't the nicest part of town, so one of my sluts selling her body won't be that unusual of a sight.\n Of Course, i dont want to. And we cant use Cumdumpsters either, since they have no rent value. So either Liana, Sex Slave, my imps, or my pets.\n\n<em><span class=\"depravity\">+" + (whoreDepravity(this.context)) + "</span>, <span class=\"resistance\">+1</span></em>";
    };

    Whore.prototype.people = {
      pimp: {
        label: function() {
          if (g.events.Succubi) {
            return 'Domme, Sadist or Succubus';
          } else {
            return 'Domme or Sadist';
          }
        },
        is: [Person.Domme, Person.Sadist, Person.Succubus]
      },
      w1: {
        label: function() {
          return 'Slut';
        },
        is: [Person.SexSlave, Person.Liana, Person.ManWhore, Person.Catgirl, Person.Catboy, Person.Succubus]
      },
      w2: {
        label: function() {
          return 'Slut';
        },
        is: [Person.SexSlave, Person.Liana, Person.ManWhore, Person.Catgirl, Person.Catboy, Person.Succubus],
        optional: true
      },
      w3: {
        label: function() {
          return 'Slut';
        },
        is: [Person.SexSlave, Person.Liana, Person.ManWhore, Person.Catgirl, Person.Catboy, Person.Succubus],
        optional: true
      },
      w4: {
        label: function() {
          return 'Slut';
        },
        is: [Person.SexSlave, Person.Liana, Person.ManWhore, Person.Catgirl, Person.Catboy, Person.Succubus],
        optional: true
      },
      w5: {
        label: function() {
          return 'Slut';
        },
        is: [Person.SexSlave, Person.Liana, Person.ManWhore, Person.Catgirl, Person.Catboy, Person.Succubus],
        optional: true
      }
    };

    return Whore;

  })(Job));

  add(Whore = (function(superClass) {
    extend(Whore, superClass);

    function Whore() {
      return Whore.__super__.constructor.apply(this, arguments);
    }

    Whore.prototype.conditions = {
      depravity: {
        fill: function() {
          return whoreDepravity(g.last.context);
        }
      },
      w1: {},
      pimp: {}
    };

    Whore.prototype.text = function() {
      var c, inof;
      if ($('page').length && Math.random() < 0.75) {
        return false;
      }
      c = [];
      inof = (function(_this) {
        return function(cl) {
          return _this.w1 instanceof cl || _this.w2 instanceof cl || _this.w3 instanceof cl;
        };
      })(this);
      if (inof(Person.SexSlave)) {
        c.push.apply(c, ["|| bg=\"Sycamore/Whore1\"\n-- Condoms are sexy! He lasts longer, she doesn't waste my magic needing to be cured of diseases.", "|| bg=\"Sycamore/Whore2\"\n-- He was a little rough, but she took her pounding like a champ. As high earner for the month, she deserves a reward - if I remember tomorrow, I'll make Liana serve her for a few hours.", "|| bg=\"Sycamore/Whore3\"\n-- \"That's a good little slut. You like it and you hate the way it lets me see what you really want. Go on, tell me to stop if that's what you're actually thinking...\"\n--> He's a bit corny, but, well, as long as he's paying she's hardly in a position to complain.", "|| bg=\"Sycamore/Whore4\"\n-- Some girls go in for a more cute and innocent look. Works pretty well, especially when their clients learn they're not wearing underwear.", "|| bg=\"Sycamore/Whore5\"\n-- Whore. She won't even open her mouth until he's ready to shove a cock in it.", "|| bg=\"Sycamore/Whore6\"\n-- " + this.pimp + " gets a call from a guy we've seen before. He wants our girl to 'bring extra condoms this time.' Looks like she's in for a long night."]);
      }
      if (inof(Person.Liana)) {
        c.push.apply(c, ["|| bg=\"Liana/Whore1\"\n  -- While it's true that I've corrupted Liana to some extent, she somehow retains a core of purity and joy that perhaps I <em>could</em> touch, but really have no desire to. She's a powerful mage, a feisty temptress, smart and loyal and... I must be coming down with something.\n||\n  --> Snapping the scrying window closed, I order someone to bring me a cup of pineapple juice, a butt plug and a hole to put it in. I'm supposed to be taking over the world, not feeling jealous of some mere human about to fuck her senseless.\n  -->", "|| bg=\"Liana/Whore21\"\n|| bg=\"Liana/Whore22\"\n|| bg=\"Liana/Whore23\"\n|| bg=\"Liana/Whore23\"\n  -- \"Wow that went in easy. You have lots of experience?\"\n  `L That's a myth. It went in easy because I'm turned on.`\n  \"Oh. Well, you're a slut either way.\"\n  -->"]);
      }
      if (inof(Person.ManWhore)) {
        c.push.apply(c, ["|| bg=\"Sycamore/WhoreMale1\"\n-- Tempting as it is to grab her for my own collection, any woman who's going to pay a man off the street for sex is a woman too valuable to just throw in a cell and brainwash.", "|| bg=\"Sycamore/WhoreMale2\"\n-- ", "|| bg=\"Sycamore/WhoreMale3\"\n-- Seriously, what sort of guy just carries a leash and collar in his pocket, in case he happens to stumble across some casual sex?\n--> The awesome kind, clearly.", "|| bg=\"Sycamore/WhoreMale4\"\n-- Busy day at the office, but still want to fuck? Call Dark Lady's Escorts now. We deliver."]);
      }
      if (inof(Person.Catgirl)) {
        c.push.apply(c, ["|| bg=\"Sycamore/WhoreCatgirl1\"\n-- ` Heh. Do I want to do what to the bunny? For $100? I'd do that for free. Heheh. She'll never know what hit her.`", "|| bg=\"Sycamore/WhoreCatgirl2\"\n-- ` Mrrrow! So shiny. Want.`", "|| bg=\"Sycamore/WhoreCatgirl3\"\n-- Come on boy, can't you see she's distracted. You'll have to grab her head and facefuck it if you want that cock in her mouth."]);
      }
      if (inof(Person.Catboy)) {
        c.push.apply(c, ["|| bg=\"Sycamore/WhoreCatboy1\"\n-- Good kitty, just keep purring."]);
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>Prostitution</h4>\n" + (Math.choice(c)) + "\n  <em><span class=\"depravity\">+" + this.depravity + "</span>, <span class=\"resistance\">+1</span></em>";
    };

    Whore.prototype.effects = {
      depravity: 'depravity',
      resistance: 1
    };

    return Whore;

  })(Page));

}).call(this);

(function() {
  var BlackmailOfficer, BlackmailOfficer2, ConstructDorm, Council, Dorm, DormApproval, DormDaily, DormDiscount, DormHourly, Nudity, Zoning, dormDepravity,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(Council = (function(superClass) {
    extend(Council, superClass);

    function Council() {
      return Council.__super__.constructor.apply(this, arguments);
    }

    Council.prototype.name = 'City Council';

    Council.prototype.description = "Now that I've started to regain some serious magical power, it's time to extend my influence beyond the lowest strata of society.";

    Council.prototype.image = 'Council/Building';

    Council.prototype.jobs = new Collection({
      Fire: Job.Fire
    });

    Council.prototype.location = [264, 419];

    Council.prototype.destinations = new Collection;

    return Council;

  })(Place));

  add(Zoning = (function(superClass) {
    extend(Zoning, superClass);

    function Zoning() {
      return Zoning.__super__.constructor.apply(this, arguments);
    }

    Zoning.prototype.place = 'Council';

    Zoning.prototype.type = 'plot';

    Zoning.prototype.conditions = {
      '|events|Zoning': false
    };

    Zoning.prototype.people = {
      'Dark Lady': {
        is: Person.DarkLady,
        matches: function() {
          return g.depravity >= 400;
        },
        label: function() {
          if (g.depravity >= 400) {
            return 'Dark Lady';
          } else {
            return 'Need <span class="depravity">400</span>';
          }
        }
      },
      Liana: {
        is: Person.Liana,
        matches: function() {
          return g.depravity >= 400;
        }
      }
    };

    Zoning.prototype.label = 'Zoning Laws';

    Zoning.prototype.text = function() {
      return "Liana says that if I take over land on the outskirts I'll get in trouble, even if I enslave the owners first.\n\nWhat kind of meddling government do these people have?\n\n<em class=\"depravity\">-400</em>";
    };

    return Zoning;

  })(Job));

  add(Zoning = (function(superClass) {
    extend(Zoning, superClass);

    function Zoning() {
      return Zoning.__super__.constructor.apply(this, arguments);
    }

    Zoning.prototype.text = function() {
      return "|| bg=\"Council/Building\"\n  -- My poor brain. I've never seen a room filled with such boredom, seeping out of the walls and oozing into me like some boring-slime.\n\n|| bg=\"Council/Vibrator\"\n  --> It's a good thing I brought a bunch of slaves to keep me entertained, trying not to squirm in the audience as their vibrators wiggle and thrust in and out. Combining a touch of magic with the Ooo-Essay's sex toys is a promising field of study.\n\n  -- Liana draws on some of my power and slaps the old men with a bit of temporary suggestibility. `L Now, gentlemen, I know it's not on the agenda, but the north end of town is getting rather run down, isn't it? I'm sure you'll all be pleased to vote yes on my new ordinance for the promotion of industry. My mistress here will develop the area in accordance with...`\n\n  --> Blah blah blah. I entertain myself for a few minutes while she takes care of business. Girl is smart. Old men have no resistance to magic. I have a new part of the city to expand into.\n\n  -- <em>New location: <b>North End</b></em>";
    };

    Zoning.prototype.effects = {
      depravity: -400
    };

    Zoning.prototype.apply = function() {
      Zoning.__super__.apply.call(this);
      return g.map.HolidayInn.destinations.NorthEnd = -1;
    };

    return Zoning;

  })(Page));

  add(Nudity = (function(superClass) {
    extend(Nudity, superClass);

    function Nudity() {
      return Nudity.__super__.constructor.apply(this, arguments);
    }

    Nudity.prototype.place = 'Council';

    Nudity.prototype.type = 'plot';

    Nudity.prototype.people = {
      'Dark Lady': {
        is: Person.DarkLady,
        matches: function() {
          return g.depravity >= 800;
        },
        label: function() {
          if (g.depravity >= 800) {
            return 'Dark Lady';
          } else {
            return 'Need <span class="depravity">800</span>';
          }
        }
      },
      Liana: {
        is: Person.Liana,
        matches: function() {
          return g.depravity >= 800;
        }
      }
    };

    Nudity.prototype.label = 'Public Nudity';

    Nudity.prototype.text = function() {
      return "Fuck skulking about and cloaking my servants in clothes or concealing magic. People should be free to show their bodies. Also, if public nudity is allowed, I can be more brazen in my activities.\n\n<em class=\"depravity\">-800</em>, <span class=\"resistance\">-1</span> daily";
    };

    return Nudity;

  })(Job));

  add(Nudity = (function(superClass) {
    extend(Nudity, superClass);

    function Nudity() {
      return Nudity.__super__.constructor.apply(this, arguments);
    }

    Nudity.prototype.text = function() {
      return "|| bg=\"Council/Building\"\n  -- My poor brain. I've never seen a room filled with such boredom, seeping out of the walls and oozing into me like some boring-oozing-slime-brain-hurty-thingie. I'm getting dumber just thinking about it.\n  --> I'm being patient, though, hardly fidgeting at all while Liana deals with the formalities. `L Now, gentlemen, I'm here to speak in support of ordinance 12487...`\n  --> Blah blah blah. They vote yes, of course - how could they not, when none of them are mages and the room's simply humming with her power, twisting everyone who isn't me around her cute little pinky. It is a very nice pinky. I spend several minutes admiring her. She starts squirming and glancing at me, until finally I decide that distracting her right now isn't the best option.\n\n  -- ...I am going to die of boredom. This is it, this is how I end.\n\n  -- `D Is it done?`\n  --> `L Yes mistress.`\n  -->  `D Very well. Naked, now, all of you.`\n|| bg=\"Council/Nudity\"\n  -- I give the still slightly dazed old men of the city council a nice little reward as the audience - composed almost entirely of attractive slaves of mine - shed their clothes and reveal what's been going on underneath. They did just do me a favor, after all, and it might encourage them to continue to see things my way in the future.\n\n  <em><span class=\"resistance\">-1</span> daily. Can build Training Facilities in North End.</em>";
    };

    Nudity.prototype.effects = {
      depravity: -800,
      add: {
        '|map|NorthEnd|jobs|7': Job.LargeRoom
      },
      remove: {
        '|map|Council|jobs|Nudity': Job.Nudity
      }
    };

    return Nudity;

  })(Page));

  Game.passDay.push(function() {
    if (g.events.Nudity) {
      return g.applyEffects({
        resistance: -1
      });
    }
  });

  add(BlackmailOfficer = (function(superClass) {
    extend(BlackmailOfficer, superClass);

    function BlackmailOfficer() {
      return BlackmailOfficer.__super__.constructor.apply(this, arguments);
    }

    BlackmailOfficer.prototype.place = 'Council';

    BlackmailOfficer.prototype.type = 'plot';

    BlackmailOfficer.prototype.conditions = {
      '|events|Zoning': {},
      '|events|Tentacles': {}
    };

    BlackmailOfficer.prototype.people = {
      Liana: {
        is: Person.Liana
      }
    };

    BlackmailOfficer.prototype.label = 'Meddling Police';

    BlackmailOfficer.prototype.text = function() {
      return "It seems someone has been poking around my operations. Since she's been itching to get out more, I'll send Liana to investigate.";
    };

    return BlackmailOfficer;

  })(Job));

  add(BlackmailOfficer2 = (function(superClass) {
    extend(BlackmailOfficer2, superClass);

    function BlackmailOfficer2() {
      return BlackmailOfficer2.__super__.constructor.apply(this, arguments);
    }

    BlackmailOfficer2.prototype.place = 'Council';

    BlackmailOfficer2.prototype.type = 'plot';

    BlackmailOfficer2.prototype.people = {
      'Dark Lady': {
        is: Person.DarkLady
      },
      Liana: {
        is: Person.Liana
      }
    };

    BlackmailOfficer2.prototype.label = 'Meddling Police';

    BlackmailOfficer2.prototype.text = function() {
      return "It seems someone has been poking around my operations. Since she's been itching to get out more, I'll send Liana to investigate.";
    };

    return BlackmailOfficer2;

  })(Job));

  add(BlackmailOfficer = (function(superClass) {
    extend(BlackmailOfficer, superClass);

    function BlackmailOfficer() {
      return BlackmailOfficer.__super__.constructor.apply(this, arguments);
    }

    BlackmailOfficer.prototype.text = function() {
      return "|| bg=\"Council/Building\"\n  -- After several different slaves have reported being questioned by an attractive brunette police officer about magic and demons and similar areas, it's time to investigate. Liana is on the case. It's surprisingly simple - all she has to do is go down to the station and start poking around.\n|| bg=\"Council/Police\"\n  -- ` You have information for me.`\n  --> `L Not information, exactly.` The air begins to hum. Liana has grown more powerful at an almost frightening rate. She looks most alive when she's bending reality to her will. Also when her eyes are rolling back just before an orgasm. They're both pretty great expressions.\n  --> This time, however, nothing much happens. The officer looks puzzled, touches a necklace she's wearing. It's just slightly warm, and Liana can tell her spell didn't take.\n\n  -- `L Oh, um, I was just nervous about it. Sycamore Street has seemed less safe for a while now, and I have to walk along it every night on my way home, and I heard you talking about demons...`\n  --> The officer gives her an odd look. The lie was not believed. ` I have to recommend you avoid the area for now. We're still searching for the perpetrators. But don't worry, we'll catch them soon.`\n  --> Liana nods and thanks her for the advice. If the woman is resistant to our charms, we'll have to find another way to deal with her. It may take some time.\n  --><em><span class=\"resistance\">+2</span> daily until she's dealt with</em>";
    };

    BlackmailOfficer.prototype.effects = {
      remove: {
        '|map|Council|jobs|BlackmailOfficer': Job.BlackmailOfficer
      },
      add: {
        '|map|Council|jobs|BlackmailOfficer2': Job.BlackmailOfficer2
      }
    };

    return BlackmailOfficer;

  })(Page));

  Game.passDay.push(function() {
    if (g.events.BlackmailOfficer && !g.events.BlackmailOfficer2) {
      return g.applyEffects({
        resistance: 2
      });
    }
  });

  add(BlackmailOfficer2 = (function(superClass) {
    extend(BlackmailOfficer2, superClass);

    function BlackmailOfficer2() {
      return BlackmailOfficer2.__super__.constructor.apply(this, arguments);
    }

    BlackmailOfficer2.prototype.text = function() {
      return "|| bg=\"Council/Police\"\n  -- ` You again. How can I help? There's still no word on Sycamore Street, if that's what you're after.` The officer is even more suspicious than last time.\n  --> `L Oh, that's ok. I actually came back to ask you to drop the investigation.`\n  --> ` Why would we do that? Also, I would like to ask you a few questions. Please step into the back with me.`\n  --> `D That won't be necessary. It's a nice locket you have there - very old, very powerful. I can see you didn't make it yourself.` I step around the corner.\n\n  -- ` And who are you?` The officer is instantly on guard - we caught her just before going home in the evening. There are a few others sitting at their desks nearby, but they won't bother us, sitting completely frozen and vacant-eyed under my sway. She self-consciously touches her necklace - she doesn't really know what's going on. A dabbler who got lucky and found an item of real power, then.\n\n  --> I snap my fingers, and a little scrying window appears. She jumps, reflexively putting a hand on her scabbard. I wouldn't normally worry too much, she can't have more than a dagger in there, but apparently the police in this day and age carry miniature crossbows or something? Liana made them sound pretty dangerous. That's still ok. She couldn't kill me.\n\n  -- Wait, no, not ok. Liana's here, and if she dies, I disappear again. I should have come alone. Also, I should teach her how to protect herself better. The policewoman doesn't draw her weapon though, and leans cautiously closer to look into my scrying pool.\n\n|| bg=\"Council/MaleTentacles\"\n  --> ` Donny... what is...`\n  --> `D Your husband, correct? He's enjoying himself. But he'd stop enjoying himself pretty quick without my powers. The magic in the slime is addictive.`\n  --> It only takes her a moment to process what she's seeing. A formidable woman. I hope she loves her husband as much as he loves her.\n\n|| bg=\"Council/Police\"\n  -- ` Addictive tentacle slime.` Her voice is flat, and scary in its own way, but not disbelieving. Good.\n  --> `D You'd have to physically restrain him up to stop him from visiting me. And if he doesn't show up once a week from now on, news just might leak that you're keeping your husband chained up in your basement.`\n  --> ` What do you want.`\n\n  -- `D Oh, just don't voice your concerns about the supernatural any more. I won't ask you not to do your job, that'd be silly, we want everyone kept safe as much as you. But no more questions about demons. Magic's real, and we're better at it than you.`\n  --> ` Fuck you. But as long as Donny's ok, I'll play ball.`\n|| bg=\"Liana/Happy\"\n  --> Liana grins happily. `L Oh, he's fine. It's pretty fun, honestly, you should give it a try. Your necklace would keep you safe, don't worry. First visit's always free.`\n  --> <em>End of <span class=\"resistance\">+2</span> daily from investigating officer</em>";
    };

    BlackmailOfficer2.prototype.effects = {
      remove: {
        '|map|Council|jobs|BlackmailOfficer2': Job.BlackmailOfficer2
      }
    };

    return BlackmailOfficer2;

  })(Page));

  Place.Council.prototype.jobs.Dorm = add(DormApproval = (function(superClass) {
    extend(DormApproval, superClass);

    function DormApproval() {
      return DormApproval.__super__.constructor.apply(this, arguments);
    }

    DormApproval.prototype.type = 'plot';

    DormApproval.prototype.people = {
      Liana: {
        is: Person.Liana,
        label: function() {
          if (g.depravity >= 400) {
            return 'Liana';
          } else {
            return 'Need <span class="depravity">400</span>';
          }
        },
        matches: function() {
          return g.depravity >= 400;
        }
      }
    };

    DormApproval.prototype.conditions = {
      '|events|BlackmailOfficer2|0': {
        matches: function(d) {
          return d < (g.day - 5);
        }
      }
    };

    DormApproval.prototype.label = 'College Dormitory';

    DormApproval.prototype.text = function() {
      return "<q class=\"L\">The city is accepting bids for a new dormitory. We're not state certified contractors, but one of your pets is.</q>\n<q class=\"D\">Huh?</q>\n<q class=\"L\">I can make people be naked even when they don't want to be.</q>\n<q class=\"D\">Ah. By all means.</q>\n\n<em class=\"depravity\">-400</em>";
    };

    return DormApproval;

  })(Job));

  add(ConstructDorm = (function(superClass) {
    extend(ConstructDorm, superClass);

    function ConstructDorm() {
      return ConstructDorm.__super__.constructor.apply(this, arguments);
    }

    ConstructDorm.prototype.type = 'plot';

    ConstructDorm.prototype.people = {
      DarkLady: {
        is: Person.DarkLady,
        label: function() {
          if (g.depravity >= 200 && g.men >= 4 && g.women >= 4) {
            return 'Dark Lady';
          } else {
            return 'Need <span class="depravity">200</span>, <span class="women">4</span> and <span class="men">4</span>';
          }
        },
        matches: function() {
          return g.depravity >= 200 && g.men >= 4 && g.women >= 4;
        }
      },
      Liana: {
        is: Person.Liana,
        matches: function() {
          return g.depravity >= 200 && g.men >= 4 && g.women >= 4;
        }
      }
    };

    ConstructDorm.prototype.label = 'Construct Dorm';

    ConstructDorm.prototype.text = function() {
      return "The biggest building I've yet constructed. I'm not really sure where Liana's going with this, but seems like she has some ideas, so...\n\n<em class=\"depravity\">-200</em>, <span class=\"women\">-4</span> and <span class=\"men\">-4</span>, <span class=\"resistance\">+1</span> daily";
    };

    return ConstructDorm;

  })(Job));

  add(DormApproval = (function(superClass) {
    extend(DormApproval, superClass);

    function DormApproval() {
      return DormApproval.__super__.constructor.apply(this, arguments);
    }

    DormApproval.prototype.text = function() {
      return "|| bg=\"Inn/FrontDeskPanties\"\n  -- ` As you can see in the proposal, I've managed the Holiday Inn here for five years, and during that time, patronage has grown immensely. With my experience in hospitality and guest management... aaah, um, I'm uniquely qualified to... ahh...`\n  --> ` Is everything alright, maam?`\n  -->  ` Yes, I'm sorry. As sorry. Um. As I was saying...`\n\n|| bg=\"Inn/FrontDeskSquirm\"\n  -- `D Liana. Stop playing with the vibrator and let the woman speak,` I whisper to her, and take the remote out of her hand. `D It'll be easier to focus if it doesn't keep changing settings on her.` I set it to maximum.\n  --> ` Ah, yes, very sorry. Mmm. So as you can see in the documents provided, aahh, due to contacts in the construction industry...`\n  --> The police woman we're blackmailing glares at us, but doesn't say anything. I'm sure she'll keep a close eye on our new project, but that's ok - she won't find anything untoward. Just lots of exposed flesh.";
    };

    DormApproval.prototype.effects = {
      remove: {
        '|map|Council|jobs|Dorm': Job.DormApproval
      },
      add: {
        '|map|Council|jobs|Dorm': Job.ConstructDorm
      }
    };

    return DormApproval;

  })(Page));

  dormDepravity = function() {
    var d;
    d = 15;
    if (g.events.DormHourly) {
      d += 10;
    }
    if (g.events.DormDiscount) {
      d += 10;
    }
    return d;
  };

  add(Dorm = (function(superClass) {
    extend(Dorm, superClass);

    function Dorm() {
      return Dorm.__super__.constructor.apply(this, arguments);
    }

    Dorm.prototype.label = "College Dorm";

    Dorm.prototype.text = function() {
      return "Men pay double rent. Women are free, but have to rent their clothing by the square foot by the hour. <span class=\"depravity\">+" + (dormDepravity()) + "</span> daily";
    };

    Dorm.prototype.people = {};

    Dorm.prototype.type = 'boring';

    return Dorm;

  })(Job));

  add(ConstructDorm = (function(superClass) {
    extend(ConstructDorm, superClass);

    function ConstructDorm() {
      return ConstructDorm.__super__.constructor.apply(this, arguments);
    }

    ConstructDorm.prototype.text = function() {
      return "|| bg=\"Dorm/Empty\"\n  -- `D Hm. Seems kind of boring so far. And people just live here?`\n  --> `L It's all in how you sell it. I'm setting the price at about double the other dorms for men, but women get to live here free. The kick is that they're not allowed to own clothes while they live here. Anything wearable has to be rented from the front desk by the hour.`\n  --> `D I like it.`\n\n  -- `L It's all upfront in the rental agreement, they know what they're in for. Well, mostly. I'll be slowly raising the price for more conservative clothes and reducing it for sluttier ones. Um... I have to make bras available to start, but I'll be raising the price very... Aah!`\n\n|| bg=\"Liana/Nude\"\n  --> `L My clothes! I'm sorry mistr... mghmph!`\n|| bg=\"Liana/Bound\"\n  --> `D No bras.`";
    };

    ConstructDorm.prototype.effects = {
      remove: {
        '|map|Council|jobs|Dorm': Job.ConstructDorm
      },
      add: {
        '|map|Council|jobs|Dorm': Job.Dorm
      }
    };

    return ConstructDorm;

  })(Page));

  Job.Dorm.prototype.next = add(DormDaily = (function(superClass) {
    extend(DormDaily, superClass);

    function DormDaily() {
      return DormDaily.__super__.constructor.apply(this, arguments);
    }

    DormDaily.prototype.conditions = {
      depravity: {
        fill: dormDepravity
      }
    };

    DormDaily.prototype.text = function() {
      var c;
      if ($('page').length && Math.random() < 0.75) {
        return false;
      }
      c = ["|| bg=\"Dorm/11\"\n  -- ` I keep thinking about that new dorm that opened. I hear from the women who live there what a good deal it is - I could quit my part time job and spend those hours studying.`\n|| bg=\"Dorm/12\"\n  --> ` But have you seen the way they dress? I'm really not sure if it's worth it - my parents would be so upset if they found out. And my boyfriend...`\n|| bg=\"Dorm/13\"\n  --> `Well, I'm pretty sure he'd like it at least.`", "|| bg=\"Dorm/21\"\n  -- The old chearleading uniforms were cute, but with so many of the women living in my dorms, they've had to cut back a bit.\n|| bg=\"Dorm/22\"\n  --> It's still a bit expensive - discussions in the locker room is usually about who they'll have to blow to get a few more inches taken off the top, and tank top.", "|| bg=\"Dorm/31\"\n  -- ` ...if I go to sleep naked, I'll have to walk to the front desk to get something to wear in the morning...`\n|| bg=\"Dorm/32\"\n  --> ` Oh hell, fine. I guess it's not any more embarrassing than the other things I've done since I moved in here.`", "|| bg=\"Dorm/41\"\n  -- ` You fucking pervs, staring at me all the time. I catch you looking my way one more time...`\n|| bg=\"Dorm/42\"\n|| bg=\"Dorm/43\"\n  -- ` I hate this goddamn wind. That's it, I'm moving back to a sane dormitory as soon as my contract's up.`", "|| bg=\"Dorm/5\"\n-- Dorm rules apply even on weekends and holidays - riding the train into the city is expensive or exhibitionary, pick one.", "|| bg=\"Dorm/6\"\n-- Two layers up top so her nipples didn't show, or panties. One has to make tough choices in this economy.", "|| bg=\"Dorm/7\"\n-- She thought she was safe wearing long pants. Whoops.", "|| bg=\"Dorm/8\"\n-- Borrowing clothes from a friend is a breach of contract. The monitors always know, somehow. Someone will come by and let her out in a few hours."];
      if (g.events.DormHourly) {
        c.push("|| bg=\"Dorm/Hourly1\"\n-- Hiding naked in the bathroom between classes.\n--> Aww, poor dear. The budget this month must be rough.");
        c.push("|| bg=\"Dorm/Hourly2\"\n-- If you're going to hide in the bathrooms naked between classes, make absolutely certain you lock the stall door.");
        c.push("|| bg=\"Dorm/Hourly3\"\n--` I, uh, I wasn't doing anything! Wait, no, you can't come in, you pervy janitor!`");
        c.push("|| bg=\"Dorm/Hourly41\"\n  -- Out for a weekend ride, she waits until she's out where no one's around...\n|| bg=\"Dorm/Hourly42\"\n  -- ...and the clothes come off. What she was wearing before was pretty cheap - maybe she was just looking for an excuse.");
      }
      if (g.events.DormDiscount) {
        c.push("|| bg=\"Dorm/Discount1\"\n-- She didn't think it would be this hard to focus on the lecture with the <em>non</em>-vibrating version. Unfortunately, I was feeling a bit vindictive this morning and enchanted all the dildos to squirm.");
        c.push("|| bg=\"Dorm/Discount2\"\n-- The vibrator will turn on at some point today, and won't turn off. If she wears it all day, her clothes are free - if she takes it out, they cost double. Better hope it waits until she's home for the evening...");
        c.push("|| bg=\"Dorm/Discount3\"\n-- Some of the discount tasks are more aggressive than others. They'll be getting free clothing for a week - combined with free rent, it makes college much more affordable.");
        c.push("|| bg=\"Dorm/Discount4\"\n-- Staying in her own locker all day in return for a week's free clothing - how unlucky that the buzzing attracted attention!");
        c.push("|| bg=\"Dorm/Discount5\"\n-- Was the chastity-belt, orgasm denying magic and vibrator combo really worth it, girl? I mean, yes, you're actually making money right now rather than spending it, but that stuff isn't coming off for a week.");
      }
      return "|| class=\"jobStart\" auto=\"1800\"\n  <h4>College Dorm</h4>\n\n" + (Math.choice(c)) + "\n<em><span class=\"depravity\">+" + (dormDepravity()) + "</span>, <span class=\"resistance\">+1</span></em>";
    };

    DormDaily.prototype.effects = {
      depravity: 'depravity',
      resistance: 1
    };

    return DormDaily;

  })(Page));

  add(DormHourly = (function(superClass) {
    extend(DormHourly, superClass);

    function DormHourly() {
      return DormHourly.__super__.constructor.apply(this, arguments);
    }

    DormHourly.prototype.label = "True Hourly Rates";

    DormHourly.prototype.progress = 300;

    DormHourly.prototype.conditions = {
      '|events|DormDaily': {}
    };

    DormHourly.prototype.text = function() {
      return "<span class=\"depravity\">+10</span> per day from the Dorm.\n<br>If we charge by the hour <i>worn</i> rather than by the hour <i>rented</i>, we can draw women into all sorts of compromising situations.";
    };

    return DormHourly;

  })(ResearchJob));

  add(DormHourly = (function(superClass) {
    extend(DormHourly, superClass);

    function DormHourly() {
      return DormHourly.__super__.constructor.apply(this, arguments);
    }

    DormHourly.prototype.text = function() {
      return "|| bg=\"Dorm/Hourly3\"\n-- \"Dead batteries,\" groaned frustrated Corrie,\n  As she urgently took inventory,\n  Of her vegetable crisper,\n  And moaned in a whisper,\n  \"I am so hot from reading that story.\"";
    };

    return DormHourly;

  })(Page));

  add(DormDiscount = (function(superClass) {
    extend(DormDiscount, superClass);

    function DormDiscount() {
      return DormDiscount.__super__.constructor.apply(this, arguments);
    }

    DormDiscount.prototype.label = "Dorm Discounts";

    DormDiscount.prototype.progress = 300;

    DormDiscount.prototype.conditions = {
      '|events|DormDaily': {},
      '|events|Nudity': {}
    };

    DormDiscount.prototype.text = function() {
      return "<span class=\"depravity\">+10</span> per day from the Dorm.\n<br>Idea. We can offer discounts on various clothing items if the girls perform various... tasks. It's not prostitution if <em>they're</em> paying <em>us!</em>";
    };

    return DormDiscount;

  })(ResearchJob));

  add(DormDiscount = (function(superClass) {
    extend(DormDiscount, superClass);

    function DormDiscount() {
      return DormDiscount.__super__.constructor.apply(this, arguments);
    }

    DormDiscount.prototype.text = function() {
      return "|| bg=\"Dorm/Discount1\"\n-- \"There was a young lass from Port Keel\n  Whose genitals were made of blue steel.\n  She got all her thrills,\n  From pneumatic drills,\n  And an off-centered emery wheel.\"";
    };

    return DormDiscount;

  })(Page));

}).call(this);

(function() {
  var LianaTeleport, NorthEnd, ProfessorsOrdeal, ProfessorsOrdeal1, ProfessorsOrdeal10, ProfessorsOrdeal11, ProfessorsOrdeal2, ProfessorsOrdeal3, ProfessorsOrdeal4, ProfessorsOrdeal5, ProfessorsOrdeal6, ProfessorsOrdeal7, ProfessorsOrdeal8, ProfessorsOrdeal9, TentacleRaid,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  add(NorthEnd = (function(superClass) {
    extend(NorthEnd, superClass);

    function NorthEnd() {
      return NorthEnd.__super__.constructor.apply(this, arguments);
    }

    NorthEnd.prototype.name = 'North End';

    NorthEnd.prototype.description = 'I have a "zoning permit" for this area. Time to do whatever the fuck I want.';

    NorthEnd.prototype.image = 'Council/NorthEnd';

    NorthEnd.prototype.jobs = new Collection({
      Fire: Job.Fire,
      1: Job.LargeRoom,
      2: Job.LargeRoom,
      3: Job.LargeRoom
    });

    NorthEnd.prototype.location = [483, 80];

    NorthEnd.prototype.destinations = new Collection;

    return NorthEnd;

  })(Place));

  add(ProfessorsOrdeal = (function(superClass) {
    extend(ProfessorsOrdeal, superClass);

    function ProfessorsOrdeal() {
      return ProfessorsOrdeal.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal.prototype.place = 'NorthEnd';

    ProfessorsOrdeal.prototype.conditions = {
      '|events': {
        matches: function(e) {
          return !e.ProfessorsOrdeal || e.ProfessorsOrdeal.length < 2 || e.ProfessorsOrdeal[0] < (g.day - 4);
        }
      }
    };

    ProfessorsOrdeal.prototype.people = {
      Liana: '|people|Liana'
    };

    ProfessorsOrdeal.prototype.type = 'plot';

    ProfessorsOrdeal.prototype.label = "Professor's Ordeal";

    ProfessorsOrdeal.prototype.text = function() {
      return "Hm, I made Liana a promise, didn't I? Time to keep one part of it.";
    };

    ProfessorsOrdeal.prototype.next = Page.firstNew;

    ProfessorsOrdeal.next = [];

    return ProfessorsOrdeal;

  })(Job));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal1 = (function(superClass) {
    extend(ProfessorsOrdeal1, superClass);

    function ProfessorsOrdeal1() {
      return ProfessorsOrdeal1.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal1.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n-- `L I found her.`\n--> `D Found who?`\n--> `L My economics professor. She flunked me. She's part of the reason I summoned you to get revenge. I saw her in the slave pens.`\n--> `D I thought you summoned me because you were my loyal servant.`\n\n-- `L Um... yes, that too mistress. But you promised me I could have everyone from the university to do with as I see fit.`\n--> `D ...`\n--> `L ...`\n--> `D ...`\n\n-- `L Oh, um... yeah, I guess I did say I just wanted the dean's office. But may I have her anyway, mistress?`\n--> I have no idea what a Dean is, but she asked so cutely I can't help but agree. Well, that may be the wrong term for the sadistic gleam in her eye... but \"cute\" is my story and I'm sticking to it.\n--> `D Very well.`";
    };

    return ProfessorsOrdeal1;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal2 = (function(superClass) {
    extend(ProfessorsOrdeal2, superClass);

    function ProfessorsOrdeal2() {
      return ProfessorsOrdeal2.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal2.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n-- Dear diary.\n--> Today I met someone I knew: a former student of mine. She took me out of that horrid place, gave me a room of my own and most of my things back. Except my clothes. I'm still naked, as I've been ever since I followed that guy back to his room more than a week ago. God, why didn't I listen to that little voice saying not to? Well, anyway, moot point now. One leg chained to a pipe, I'm otherwise free to move around. I think they did something to my head - I feel like I should be trying to escape, but really, it's not bothering me too much.\n\n--> Anyway, back to that student. I recognized her face, but when she asked if I knew her name, I came up blank. I'm pretty sure, in retrospect, that was a terrible mistake. I think she's important around here, and I think I made her angry. What can you do? I'll just have to see what she wants and try to make it up to her and convince her to let me go.";
    };

    return ProfessorsOrdeal2;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal3 = (function(superClass) {
    extend(ProfessorsOrdeal3, superClass);

    function ProfessorsOrdeal3() {
      return ProfessorsOrdeal3.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal3.prototype.text = function() {
      return "||\n  -- Dear diary.\n  --> Today has been the worst day of my life, though I'm sure tomorrow will be worse. That student of mine is apparently a mage. Who knew magic was real?\n|| bg=\"Council/Professor1\"\n  --> I'm no longer in my oh-so-comfortable room - as I write, I'm huddling under the bridge she chained me to. I've got nothing to my name except this diary, a pen, a sheet of prices, and a box to lock them in. The sheet of prices is the worst thing.\n\n  --| <table class=\"table table-striped\"><tr><td>$10</td><td>500ml cum (fresh!)</td></tr><tr><td>$50</td><td>Bottled water</td></tr><tr><td>$50</td><td>New pen and additional paper</td></tr><tr><td>$120</td><td>Loaf of bread</td></tr><tr><td>$800</td><td>Panties</td></tr><tr><td>$1000</td><td>One night inside</td></tr><tr><td>$15000</td><td>One letter of her name</td></tr></table>\n\n  Etc. I've skipped a bunch. It goes on.\n\n  --> Apparently I'm to be chained up here until I can tell her her name. Where the fuck am I supposed to get money, chained to the underside of a bridge?";
    };

    return ProfessorsOrdeal3;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal4 = (function(superClass) {
    extend(ProfessorsOrdeal4, superClass);

    function ProfessorsOrdeal4() {
      return ProfessorsOrdeal4.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal4.prototype.text = function() {
      return "|| bg=\"Council/Professor1\"\n-- Dear diary.\n--> Today I sucked a cock for $20. How humiliating. But... I'm really thirsty. $20 isn't much, but it's better than nothing. Would she really let me die, if I refused to humiliate myself like this? I don't know, and honestly, I'm kind of scared to find out. Who knew we had such students at our school? I guess it only goes to show that there's a bit of demon in all of us... Oh, wait, I have to go. It looks like that guy is back, and he brought friends. Horrible as it may be, I need the money.\n\n--> Wow, that was disgusting. I've now sucked more cocks today than I have in the rest of my life put together. My boyfriends always wanted me to, but I never really like the taste. At least I have enough money now to afford some scanty meals and a bottle of water when she comes to check up on me in a few hours.";
    };

    return ProfessorsOrdeal4;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal5 = (function(superClass) {
    extend(ProfessorsOrdeal5, superClass);

    function ProfessorsOrdeal5() {
      return ProfessorsOrdeal5.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal5.prototype.text = function() {
      return "|| bg=\"Council/Professor2\"\n-- Dear diary.\n--> Today has been a very, very bad day. I guess there's some sort of big event? Anyway, I saw hardly anyone at all, and they were all busy. I only managed to earn $40 today. Combined with the $30 I have left from yesterday... it's not enough for food. Shit. I'm hungry though, so... oh god, I can't belive I'm acutally going to order cum for food. I miss my old life. But you do what you have to.\n\n--> I've also given up hope of rescue. It seems like there's a spell around me - I don't know what's wrong with these people, but no one seems to care if I ask for help. I think I'm going to be stuck here until I can buy my way out. Fuck. $15000 per letter of her name? I don't even know how long it is! I'm going to be here for a while.";
    };

    return ProfessorsOrdeal5;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal6 = (function(superClass) {
    extend(ProfessorsOrdeal6, superClass);

    function ProfessorsOrdeal6() {
      return ProfessorsOrdeal6.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal6.prototype.text = function() {
      return "|| bg=\"Council/Professor2\"\n  -- Dear diary.\n  --> It was too disgusting the first time I tried, but after thinking on it a few days... I've given up on buying food. If I subsist on nothing but cum - I've found I need around two purchases per day, supplemented with a few nibbles from bread I saved here and there - I can save up money so much faster.\n\n|| bg=\"Council/Professor3\"\n  --> I had my first gangbang today. Four guys, $120 each... I'm such a slut. But they really did take good care of me - both breasts getting sucked on, while the one hung like a horse reamed my cunt? My god it felt good. And with that much money... I'm around 5% of the way to buying the first letter of her name. Fuck it's depressing to calculate out like that. Oh well.";
    };

    return ProfessorsOrdeal6;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal7 = (function(superClass) {
    extend(ProfessorsOrdeal7, superClass);

    function ProfessorsOrdeal7() {
      return ProfessorsOrdeal7.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal7.prototype.text = function() {
      return "|| bg=\"Council/Professor2\"\n-- Dear diary.\n--> I had to buy more paper today, since I was careless and left my sign out yesterday when it rained. So, first some good news. I'm completely used to being nude now! It doesn't bother me at all anymore, and in fact I sort of forget now and then that I used to wear clothes all the time. I was reminded because I got female customer - she had me eat her out, and her panties were so cute. When I first got here, all I thought about was buying some of those for myself, but now I see there's no point in wasting the money.";
    };

    return ProfessorsOrdeal7;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal8 = (function(superClass) {
    extend(ProfessorsOrdeal8, superClass);

    function ProfessorsOrdeal8() {
      return ProfessorsOrdeal8.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal8.prototype.text = function() {
      return "|| bg=\"Council/Professor3\"\n  -- Dear diary.\n  --> I had quite a line today! Seems that word has spread about the naked woman under the bridge who'll do anything you ask. I heard some people muttering about the prices - apparently there are more prostitutes in town than I'd thought - so I lowered my prices yesterday to make sure everyone keeps coming back. Today I ended up taking everyone double - front door and ass - just to keep up with demand.\n\n|| bg=\"Council/Professor2\"\n  --> I'm so sore, and really tired, but with $15000... tomorrow I'll be able to afford the first letter of her name. Maybe one letter will be enough to jog my memory?";
    };

    return ProfessorsOrdeal8;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal9 = (function(superClass) {
    extend(ProfessorsOrdeal9, superClass);

    function ProfessorsOrdeal9() {
      return ProfessorsOrdeal9.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal9.prototype.text = function() {
      return "|| bg=\"Council/Professor3\"\n  -- Dear diary.\n  --> Today was amazing. This one woman wanted to try fisting my ass, and I had to add a new line to my price sheet for her, but it felt great. I think I'll make it cheaper, see if I can't get more people to try that.\n\n|| bg=\"Council/Professor1\"\n  --> Anyway, I'm making enough money now that I could easily switch back to real food, but what's the point? Semen tastes really nice, and I love the looks people give me when they see me drinking it. I'll have enough to buy a second letter soon. \"L...\" still don't remember her name. Oh well.";
    };

    return ProfessorsOrdeal9;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal10 = (function(superClass) {
    extend(ProfessorsOrdeal10, superClass);

    function ProfessorsOrdeal10() {
      return ProfessorsOrdeal10.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal10.prototype.text = function() {
      return "|| bg=\"Council/Professor2\"\n-- Dear diary.\n--> I bought the third letter today. \"Lia...\" I racked my brains, but really, I'm just going to have to buy the whole thing. Anyway, I'm not sure why I was so desperate to get out originally? I mean, yeah, it'd be kind of nice to have some change of scenery - it'd probably be fun to fuck up by the side of the road, rather than under the bridge. I'd probably get more business too, if more people saw me.";
    };

    return ProfessorsOrdeal10;

  })(Page)));

  Job.ProfessorsOrdeal.next.push(add(ProfessorsOrdeal11 = (function(superClass) {
    extend(ProfessorsOrdeal11, superClass);

    function ProfessorsOrdeal11() {
      return ProfessorsOrdeal11.__super__.constructor.apply(this, arguments);
    }

    ProfessorsOrdeal11.prototype.text = function() {
      return "|| bg=\"Council/Professor2\"\n  -- Dear diary.\n  --> I bought the last letter in her name two days ago - Liana - but honestly, I'm not really sure why at this point. I guess I flunked her out of my class? I guess I did used to teach classes or something. She undid my chains, which is pretty nice, but I'm glad she agreed to keep coming by every day to take some money and bring me bottles of cum.\n\n|| bg=\"Council/Professor3\"\n  --> Anyway, this will be my last entry. I'm running out of paper, and don't see why I should bother to get more. It's been fun reading back through my earlier entries - god, I used to be such a prude! Time to go, though. I see one of my regulars coming, and promised him something extra special for his complimentary 100th visit.";
    };

    ProfessorsOrdeal11.prototype.effects = {
      remove: {
        '|map|NorthEnd|jobs|ProfessorsOrdeal': Job.ProfessorsOrdeal
      }
    };

    return ProfessorsOrdeal11;

  })(Page)));

  add(TentacleRaid = (function(superClass) {
    extend(TentacleRaid, superClass);

    function TentacleRaid() {
      return TentacleRaid.__super__.constructor.apply(this, arguments);
    }

    TentacleRaid.prototype.place = 'NorthEnd';

    TentacleRaid.prototype.conditions = {
      '|events|BreedingPitDaily': {},
      '|depravity': {
        gte: 100
      }
    };

    TentacleRaid.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      'Goon 1': {
        optional: true
      },
      'Goon 2': {
        optional: true
      }
    };

    TentacleRaid.prototype.label = "Hunting";

    TentacleRaid.prototype.text = function() {
      return "A dose of nighttime terrors would do this sleepy little town some good (by convincing them not to oppose me). Also, it would be good preparation for taking over completely, which is a thing I've put off for far too long now.\n\n<span class='depravity'>-50</span>, <span class=\"resistance\">-5</span>";
    };

    TentacleRaid.prototype.next = Page.TentacleRaid;

    return TentacleRaid;

  })(Job));

  add(TentacleRaid = (function(superClass) {
    extend(TentacleRaid, superClass);

    function TentacleRaid() {
      return TentacleRaid.__super__.constructor.apply(this, arguments);
    }

    TentacleRaid.prototype.text = function() {
      var c;
      c = ["|| bg=\"NorthEnd/Raid11\"\n|| bg=\"NorthEnd/Raid12\"\n|| bg=\"NorthEnd/Raid13\"\n|| bg=\"NorthEnd/Raid14\"\n|| bg=\"NorthEnd/Raid15\"\n|| bg=\"NorthEnd/Raid16\"\n|| bg=\"NorthEnd/Raid16\"\n-- It may look like she has it easier than most girls violated by tentacles, but I assure you, the \"spin + egg injection\" setting is no joke. She'll soon be the proud mother of the next generation of horrors.", "|| bg=\"NorthEnd/Raid2\"\n-- She can cling as much as she likes now, but this breed is patient. Eventually she'll relax and it can swallow her to act as the new incubation core.", "|| bg=\"NorthEnd/Raid31\"\n|| bg=\"NorthEnd/Raid32\"\n|| bg=\"NorthEnd/Raid32\"\n|| bg=\"NorthEnd/Raid32\"\n-- Pretty sure she genuinely enjoyed this. Some girls are just fucked in the head, I guess. Unlike most of the brood mothers, I'll let her go to carry out her term at home.", "|| bg=\"NorthEnd/Raid41\"\n|| bg=\"NorthEnd/Raid42\"\n|| bg=\"NorthEnd/Raid43\"\n|| bg=\"NorthEnd/Raid44\"\n|| bg=\"NorthEnd/Raid45\"\n|| bg=\"NorthEnd/Raid45\"\n-- Once she stops struggling I'll let her arms and legs loose. The living vat of goo will be her home for the next four months while it reproduces.", "|| bg=\"NorthEnd/Raid5\"\n-- The joys of motherhood. Doesn't she just glow with good health?"];
      return (Math.choice(c)) + "\n<span class='depravity'>-50</span>, <span class=\"resistance\">-5</span>";
    };

    TentacleRaid.prototype.effects = {
      depravity: -50,
      resistance: -5
    };

    return TentacleRaid;

  })(Page));

  add(LianaTeleport = (function(superClass) {
    extend(LianaTeleport, superClass);

    function LianaTeleport() {
      return LianaTeleport.__super__.constructor.apply(this, arguments);
    }

    LianaTeleport.prototype.place = 'NorthEnd';

    LianaTeleport.prototype.conditions = {
      '|events|TrainingFacilityNew': {},
      '|events|Tentacles': {},
      '|depravity': {
        gte: 300
      }
    };

    LianaTeleport.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      Liana: '|people|Liana'
    };

    LianaTeleport.prototype.type = 'plot';

    LianaTeleport.prototype.label = "Liana's Training";

    LianaTeleport.prototype.text = function() {
      return "Liana's been practically drooling since I unveiled the training facility. Let's see what she wants, hm?";
    };

    return LianaTeleport;

  })(Job));

  Job.LianaTeleport.prototype.next = add(LianaTeleport = (function(superClass) {
    extend(LianaTeleport, superClass);

    function LianaTeleport() {
      return LianaTeleport.__super__.constructor.apply(this, arguments);
    }

    LianaTeleport.prototype.text = function() {
      return "|| bg=\"Liana/Coat\"\n  -- `L Mistress! Good to see you!`\n  --> `D You're excited today.`\n  --> `L I guess I am.`\n  --> `D Why?` I know why, but it's fun to make her say it when she doesn't want to.\n\n  -- She squirms under my gaze.\n  --> I wait for her to answer.\n  --> She blushes.\n  --> I watch her steadily.\n\n  -- Normally people get punished for making me wait, but I like looking at her wiggle.\n  --> `L ...um. Yeah. I missed you. Getting tormented by other people just isn't the same.`\n|| bg=\"Liana/noPants\"\n  --> `L Hey!`\n  --> I snicker some more and let her counterspell my banishment only a moment after it's cast.\n\n|| bg=\"Liana/Coat\"\n  -- Liana blushes furiously, but I can see a grin creeping up on her. Yes, I'm sure of it now. Her magic is strong enough for what I have in mind.\n  --> `D I have a spell for you to try. Watch closely.` I pull my magic out and step through the motions slowly for her benefit. Form wings, compress it into a ball, give it solidity, hold on tightly, <em>shove...</em> Liana, following along with her own power, disappears with a pop. I laugh and follow her.\n\n|| bg=\"Liana/Magic\"\n  -- `L ...woah.`\n  --> We've moved. This isn't a small town any more - huge towers, endless rows of buildings, and it's sunset. A moment before we were been in broad daylight.\n  --> `D You can control your destination with the right kind of focus, but that will come with practice.`\n  --> `D You'll be feeling a reaction-headache any moment now. Don't worry, it's just...`\n\n  -- She fainted.\n  --> Right across my lap.\n  --> Human girl.\n  --> In my lap.\n\n  -- I debate making her naked, but decide against it. Another time. She needs to rest now - teleportation is the strongest spell she's used yet, and her body isn't used to the strain.\n  --> Human girl.\n  --> In my lap.\n  --> I mentally chastise my weakness for caring about such a thing, but let her remain close to me for now.";
    };

    LianaTeleport.prototype.effects = {
      remove: {
        '|map|NorthEnd|jobs|LianaTeleport': Job.LianaTeleport
      }
    };

    return LianaTeleport;

  })(Page));

}).call(this);

(function() {
  var Council, Intro, Intro2, IntroFirstSlaves, IntroFuckLiana, IntroTakeOver, MoreResources, Tentacles, Tentacles1, Tentacles2,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Page.Intro = Intro = (function(superClass) {
    extend(Intro, superClass);

    function Intro() {
      return Intro.__super__.constructor.apply(this, arguments);
    }

    Intro.prototype.text = function() {
      return "||\n  --| <center>Tired.</center>\n  --> <center>I'm tired.</center>\n  --> <center>There's also pain, but that's secondary compared to the all-consuming lethargy that holds my limbs down on the cold floor.</center>\n  --> <center>A floor. Why am I on the floor? I should be...</center>\n  --> <center>I'm not sure where I should be. But the floor isn't it. Something's wrong, missing...</center>\n  --> <center>My magic. I can barely feel it, a weak, pathetic little tendril of power when it should be an all-consuming serpent coiling about me.</center>\n  --> <center>I try to speak, but my voice is as weak as my magic, and all that comes out is a cough. It's pathetic.</center>\n  --> <center>But even as shriveled as my power is, it's still more than enough that I needn't appear so weak in front of the other person in the room, who I can now hear muttering to herself and fussing about.</center>\n|| speed=\"slow\" bg=\"misc/emptyRoom\"\n  -- Pouring power into my limbs, I manage sit up and open my eyes.\n  --> The room is... boring. That's the only way to describe it.\n  --> What was once white paint peeling off the walls. A messy bed, covered with some sort of folded paper boxes smudged with food.\n|| bg=\"Inn/Pentagram\"\n  --> I sit inside a ritual circle, surrounded by candles and chalk lines. It hurts to look at, and I literally cannot even think of reaching outside it.\n\n  -- If I were feeling better, I could shatter this crude binding with a thought, but I'm not. I'm tired and hungry and weak.\n|| bg=\"Liana/Happy\"\n  --> Instead I focus on the final item in the room. A woman. Disheveled, long black hair lank with sweat, her arms shaking with exhaustion as she rests on the floor.\"\n  --> Her face is alive though, the moment she opens her eyes, filled with triumph. She's staring at me. I'm naked, of course, which is only natural, but that's not why she's staring.\n  --> `D Speak.`";
    };

    Intro.prototype.apply = function() {
      g.location = g.map.HolidayInn;
      return Intro.__super__.apply.call(this);
    };

    return Intro;

  })(Page);

  Page.Intro.prototype.next = Page.Intro2 = Intro2 = (function(superClass) {
    extend(Intro2, superClass);

    function Intro2() {
      return Intro2.__super__.constructor.apply(this, arguments);
    }

    Intro2.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n  -- She starts at the sound of my voice, smacking her head against the bed behind her. It takes a moment of scrambling before she brushes hair out of her face, and another moment before she manages to obey my command.\n  --> `L Welcome to the mortal realm, ma'am. I... um, I wasn't sure that you actually existed.` She giggles, grinning at her own audacity, then clears her throat and goes on.\n  --> `L If it would please you, I would like to make a bargain.`\n\n  -- Liana. I know her name without being told.\n  --> Feeble as it is, my magic can still draw facts like that from her mind without thought. Her attitude is pleasant, a mixture of excitement and fear - the first pleasant thing to happen since I awoke bound to the floor by magic.\n\n  -- `D Call me mistress.`\n  --> `L You are not my mistress. Not yet, at least.`\n  --> She has some spine after all. Even better. If I were stronger... a useless thought. I banish it. After a moment of silence, I nod.\n  --> `D Very well. What bargain do you wish to strike with the Dark Lady?`\n\n  -- `L I've summoned you to the mortal world, but the spell will only hold as long as I give it power.`\n  --> `L I'll hold it until you can maintain it yourself, and I'll free you. In return, I want to be the first among your lieutenants. Hold no one above me.`\n  --> I quirk an eyebrow, waiting for her to continue. She doesn't disappoint.\n  --> `L And I want the Dean's office at the University as my absolute slaves, to dispose of as I see fit.`\n\n  -- She has a malicious gleam in her eye that I find absolutely delightful. I like this Liana better by the moment. I can feel her power too - though much of it is tied up anchoring me in reality, there's <em>still</em> enough left to be impressive for a human.\n  --> `D I accept.`\n\n|| bg=\"Inn/Pentagram\"\n  -- Without hesitation she reaches forward and smudges one of the lines of the pentagram.\n  --> I'm free.\n  --> The world shall tremble.\n  --> <em>My</em> world.";
    };

    Intro2.prototype.next = Page.Port;

    return Intro2;

  })(Page);

  Place.HolidayInn.prototype.jobs.introLiana = Job.IntroFuckLiana = IntroFuckLiana = (function(superClass) {
    extend(IntroFuckLiana, superClass);

    function IntroFuckLiana() {
      return IntroFuckLiana.__super__.constructor.apply(this, arguments);
    }

    IntroFuckLiana.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      Liana: '|people|Liana'
    };

    IntroFuckLiana.prototype.type = 'plot';

    IntroFuckLiana.prototype.label = 'Fuck Liana';

    IntroFuckLiana.prototype.text = function() {
      return "It's been too long since I had a good lay. Being dead for a few millennia really puts a fire in one's loins.";
    };

    return IntroFuckLiana;

  })(Job);

  Job.IntroFirstSlaves = IntroFirstSlaves = (function(superClass) {
    extend(IntroFirstSlaves, superClass);

    function IntroFirstSlaves() {
      return IntroFirstSlaves.__super__.constructor.apply(this, arguments);
    }

    IntroFirstSlaves.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      Liana: '|people|Liana'
    };

    IntroFirstSlaves.prototype.type = 'plot';

    IntroFirstSlaves.prototype.label = 'Explore the area';

    IntroFirstSlaves.prototype.text = function() {
      return "While it's fun messing with my first slave, it's really time to get moving.";
    };

    return IntroFirstSlaves;

  })(Job);

  Job.IntroFuckLiana.prototype.next = Page.IntroFuckLiana = IntroFuckLiana = (function(superClass) {
    extend(IntroFuckLiana, superClass);

    function IntroFuckLiana() {
      return IntroFuckLiana.__super__.constructor.apply(this, arguments);
    }

    IntroFuckLiana.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n  -- I've been... well, if not precisely <i>dead</i>, at least something pretty close for quite some time. And since she's just pledged herself to me...\n|| bg=\"Liana/Grope\"\n  --> I reach a hand up underneath her shirt, expecting to grope her breasts roughly, and encounter something covering them.\n  --> She grasps my wrist, and I ignore her surprised look, exploring the fabric she has on underneath.\n  --> It's springy. Her shirt stretches too, most unnaturally. I frown at her.\n\n  -- In my quest after her breasts, I'm briefly distracted by writing and an image on her shirt. \"Nightwish.\" Hm? Who's wishing for what at night?\n|| bg=\"Liana/Bra\"\n  --> Dismissing the markings as unimportant, I rip it off her body.\n  --> `L Hey! That was my favorite t-shirt. You can't just... mmmgph!`\n  --> I grab her by the throat and grin, shutting her up for now.\n\n  -- The undergarment still covers her breasts.\n  --> It's stretchy.\n  --> It stymied my efforts to grope her.\n  --> It'll have to go.\n\n  -- I poke it.\n  --> It's black, and I hate it.\n  --> Yes, it's a piece of cloth, but I'm a Dark Lady, and I can demand eternal suffering for a piece of cloth if I so desire.\n\n  -- `D I can do anything I want. You, however, may not. You are never again to wear another one of these disgusting things in my presence. What do you call it?`\n  --> `L A... a bra, mistress.`\n|| bg=\"Liana/Rip\"\n  --> I rip it off with the other hand and let her slide to the floor. It's a good thing she was too surprised to resist - as things are right now, she's probably stronger than I am.\n  --> Even if she's pledged to my service, it would just be embarrassing if a servant overpowered me. I sneer at the \"bra\" and conjure a burst of flame to consume it. I can still do that much at least.\n\n  -- `D A bra. You are never to wear a bra again. Now, get naked.`\n  --> <em class=\"depravity\">+25</em><br><em>Dark Lady: <span class=\"strength\">+2 Strength</span></em><br><em>Liana: <span class=\"lust\">+1 Lust</span></em>";
    };

    IntroFuckLiana.prototype.apply = function() {
      IntroFuckLiana.__super__.apply.call(this);
      L.add('lust', 1);
      return D.add('strength', 2);
    };

    IntroFuckLiana.prototype.effects = {
      depravity: 25,
      remove: {
        '|location|jobs|introLiana': Job.IntroFuckLiana
      },
      add: {
        '|location|jobs|introFirstSlaves': Job.IntroFirstSlaves
      }
    };

    return IntroFuckLiana;

  })(Page);

  Job.IntroFirstSlaves.prototype.next = Page.IntroFirstSlaves = IntroFirstSlaves = (function(superClass) {
    extend(IntroFirstSlaves, superClass);

    function IntroFirstSlaves() {
      return IntroFirstSlaves.__super__.constructor.apply(this, arguments);
    }

    IntroFirstSlaves.prototype.text = function() {
      return "||\n  -- As much fun as I've been having driving Liana into exhaustion (I wouldn't have believed she could fit that glass bottle up her ass, but, well... The girl is talented, what can I say?), it's time to stop playing around and get to work.\n  --> I cradle her face gently in my hands and wake her up with a kiss. I liked her before, but I like her even better now that she's properly nude and sitting at my feet, rather than standing eye to eye.\n|| bg=\"Liana/Insertion\"\n  --> `D Time to get to work, dear. No, not the toy, leave that there, that's a good girl.`\n\n  -- `D Tell me about this kingdom. They seem quite wealthy, if even a rude hovel like this can afford its own ice chest. I hope this isn't an a far northern land?`\n  --> She blinks several times, as though I've said something incredibly foolish. I don't see why - I hate the cold.\n  --> `L This isn't a kingdom, mistress. And everyone has a freezer. Um... look, maybe we can just leave that aside for now. What we really need to worry about is money. I've paid for another three days, but after that, my cards are maxed out, and I don't think you have a bank account.`\n  --> I laugh. She looks so earnest, worrying about such a thing. And cute, too, with her breasts bobbing and cunt still dripping occasionally. I must be getting soft.\n\n|| bg=\"Liana/Happy\"\n  -- We spend the next several hours going over a bit of local history and geography. \"California\" seems to be just one kingdom in a larger empire, the Yousa. But we're in a small, isolated town which might as well just be begging for conversion into my new stronghold. A couple of foreign wars, but nothing local. Perfect.\n  --> I don't like those things called \"cars,\" though, that she assures me everyone has. The local constables might be able to summon the king's army within a few days. Then they'd burn all my tentacle gardens and lock me up and make me wear a bra in prison. That would be terrible.\n\n|| bg=\"none\"\n  -- The first step, however, is clear enough. I need to establish a magical center, and to do that, I'll need some slaves. Liana's too valuable for that duty, and still needed to keep me from fading out of existence besides.\n  --> Liana is a mage. I am a Dark Lady. We're staying in an inn (quite a large one, in fact). The task is trivial. I make one of the walls translucent to sight, then once we locate our targets, I rotate it out of existence entirely.\n\n|| bg=\"Inn/Sleepover\"\n  -- She steps though, startling my new slaves. One of the women opens her mouth to scream, but Liana doesn't balk, as I half expected her to, and cuts the girl off with a spell. Both of my new slaves collapse into a deep slumber. They won't wake up until we have a use for them. She steps into another room, and I hear her repeat the same spell.\n  --> She borrows one of their voices, and speaks to a machine on the bedside table, then informs me that the room is now ours to for the rest of the week.\n\n|| bg=\"Liana/Happy\"\n  -- `D Mine, silly girl. Not ours.`\n  --> I do pat her on the head though. She can't decide if she should be happy or demeaned by the act. Both emotions are appropriate, I reassure her.\n  --><em class=\"virgins\">+1 Virgin</em><br><em class=\"women\">+2 Women</em>";
    };

    IntroFirstSlaves.prototype.apply = function() {
      IntroFirstSlaves.__super__.apply.call(this);
      g.virgins = 1;
      return g.women = 2;
    };

    IntroFirstSlaves.prototype.effects = {
      remove: {
        '|location|jobs|introFirstSlaves': Job.IntroFirstSlaves
      },
      add: {
        '|location|jobs|107': Job.SmallRoom,
        '|location|jobs|108': Job.SmallRoom
      }
    };

    return IntroFirstSlaves;

  })(Page);

  Place.HolidayInn.prototype.jobs.introTakeOver = Job.IntroTakeOver = IntroTakeOver = (function(superClass) {
    extend(IntroTakeOver, superClass);

    function IntroTakeOver() {
      return IntroTakeOver.__super__.constructor.apply(this, arguments);
    }

    IntroTakeOver.prototype.conditions = {
      '|people|0': {}
    };

    IntroTakeOver.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      Liana: '|people|Liana'
    };

    IntroTakeOver.prototype.type = 'plot';

    IntroTakeOver.prototype.label = 'Conquest';

    IntroTakeOver.prototype.text = function() {
      return "I'm rather tired of the fact that my slaves have to put on clothes to move between rooms. Honestly, it's embarrassing how long it's taking me to conquer just one building.";
    };

    return IntroTakeOver;

  })(Job);

  Job.IntroTakeOver.prototype.next = Page.IntroTakeOver = IntroTakeOver = (function(superClass) {
    extend(IntroTakeOver, superClass);

    function IntroTakeOver() {
      return IntroTakeOver.__super__.constructor.apply(this, arguments);
    }

    IntroTakeOver.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n  -- `D Come, Liana, it's time to cease hiding in the shadows. Take me to the innkeeper so we can stop your ridiculous fretting about money.`\n  --> `L Do you want to go to him, or shall I give him a call?`\n  --> I blink. She's a smarty, this one is. Less chance of any witnesses if he comes to us. But no, I'm tired of being cooped up in this room. I do grumble a bit as I pull on clothes. Though Liana has nothing that fits properly, at least one of her \"T shirts\" can stretch to cover my more ample bosom.\n\n|| bg=\"Inn/FrontDesk\"\n  -- \"Hello! Welcome to Holiday Inn. Liana, right? I'm glad you decided to stay with us a few extra days. Is there anything I can help with?\"\n  --> `D You can become my sex slave. I am taking over this establishment.`\n|| bg=\"Inn/FrontDeskBlush\"\n  --> \"Um...\"\n  --> I grin, and hit her with a wave of lust and obedience. Naturally, she blushes deeper and starts drooling over everyone in sight, lower lip trembling as she starts to strip.\n\n|| bg=\"Inn/FrontDeskBra\"\n  -- The air in the room freezes. I glare at her. Everyone holds their breath as my face twists into a sneer. She's. Wearing. A. A...\n  --> `D Liana, what is that thing called again?`\n  --> `L A bra, mistress.`\n\n  --> `D Right. A bra.`\n  -- `D You, slave, she's not to be without a cock inside her for twenty four hours.` I order one of my male slaves to attend to her. `D After that, you, bra-girl, return to the front desk. This place is closed for repairs until further notice. No more customers, but keep everything running like normal.`\n  --> `D You can keep your shirt, since you'll be dealing with the outside world, but while you're behind that counter, no pants or underwear, ever.` Since I haven't actually mind controlled her, just added a hint of obedience and a pound of not-telling-anyone, I back my commands up with a threat. `D Anyone catches you with pants on inside this room, I'll make you work topless too.`\n\n  -- Liana, perhaps sensing that I'm liable to keep ranting and raving and piling punishments on the hussy as long as that... thing... remains in my sight, banishes the bra with a spell.\n|| bg=\"Inn/FrontDeskSex\"\n  --> I nod to the slave to begin her fucking. The Holiday Inn is mine. I can set up some <em>proper</em> facilities inside it now, and send slaves into the outer world.\n  -- <em>New location: <b>Sycamore Street</b></em>";
    };

    IntroTakeOver.prototype.effects = {
      add: {
        '|location|jobs|gym': Job.Gym,
        '|location|jobs|113': Job.SmallRoom,
        '|location|jobs|115': Job.MediumRoom,
        '|location|jobs|116': Job.MediumRoom
      },
      remove: {
        '|location|jobs|introTakeOver': Job.IntroTakeOver
      }
    };

    IntroTakeOver.prototype.apply = function() {
      IntroTakeOver.__super__.apply.call(this);
      return g.map.HolidayInn.destinations.Sycamore = -1;
    };

    return IntroTakeOver;

  })(Page);

  add(Council = (function(superClass) {
    extend(Council, superClass);

    function Council() {
      return Council.__super__.constructor.apply(this, arguments);
    }

    Council.prototype.place = 'HolidayInn';

    Council.prototype.conditions = {
      '|events|Tunnel2': {},
      '|events|Council': false
    };

    Council.prototype.type = 'plot';

    Council.prototype.people = {
      'Dark Lady': '|people|DarkLady',
      'Liana': '|people|Liana'
    };

    Council.prototype.label = 'City Council';

    Council.prototype.text = function() {
      return "I am tired of evading the police and keeping a low profile. I have the power now to fix things.";
    };

    return Council;

  })(Job));

  add(Council = (function(superClass) {
    extend(Council, superClass);

    function Council() {
      return Council.__super__.constructor.apply(this, arguments);
    }

    Council.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n-- `L I am happy to serve, mistress. I was hesitant at first - you know how often demons like to talk about taking over the world, and how seldom they actually manage more than getting killed within the first few weeks...`\n--> `D I'm not a demon, as you well know by now.`\n\n--> `L Oh, of course not, mistress. Just explaining why I didn't want to go straight for the throat, as it were. Anyway, the city council meets once a week, and if you lend me some magic, it should be simple enough to wring special concessions out of them...`\n-- <em>New location: <b>City Council</b></em>";
    };

    Council.prototype.apply = function() {
      Council.__super__.apply.call(this);
      return g.map.HolidayInn.destinations.Council = -1;
    };

    return Council;

  })(Page));

  add(MoreResources = (function(superClass) {
    extend(MoreResources, superClass);

    function MoreResources() {
      return MoreResources.__super__.constructor.apply(this, arguments);
    }

    MoreResources.prototype.place = 'HolidayInn';

    MoreResources.prototype.conditions = {
      '|events|Galleria': {}
    };

    MoreResources.prototype.people = {
      'Dark Lady': {
        is: Person.DarkLady
      },
      Liana: {
        is: Person.Liana
      }
    };

    MoreResources.prototype.type = 'plot';

    MoreResources.prototype.label = "Expansion";

    MoreResources.prototype.text = function() {
      return "Now that my little \"operation\" is stable, it's time to start looking into real power. That means more magic.";
    };

    return MoreResources;

  })(Job));

  add(MoreResources = (function(superClass) {
    extend(MoreResources, superClass);

    function MoreResources() {
      return MoreResources.__super__.constructor.apply(this, arguments);
    }

    MoreResources.prototype.text = function() {
      return "|| bg=\"Inn/Pentagram\"\n-- I don't want to be chained to Liana forever. In addition to all the things that can go wrong with a frail human (not that she's particularly frail, mind you), as long as she's busy anchoring me to the world, I'm limited by her magic, and her magic is limited by me.\n\nShe needs another few years to grow into her power, but when the time comes... the ritual to stop aging is difficult. I think she'll be powerful enough, but not if I'm tying up three quarters of her magic.\n\n--> Anyway, distractions. It's time to start my minions collecting milk and cum, since the ley-lines in this part of the world are pathetically weak. Time for more research!";
    };

    MoreResources.prototype.apply = function() {
      MoreResources.__super__.apply.call(this);
      g.milk = 0;
      return g.cum = 0;
    };

    MoreResources.prototype.effects = {
      remove: {
        '|map|HolidayInn|jobs|MoreResources': Job.MoreResources
      }
    };

    return MoreResources;

  })(Page));

  add(Tentacles = (function(superClass) {
    extend(Tentacles, superClass);

    function Tentacles() {
      return Tentacles.__super__.constructor.apply(this, arguments);
    }

    Tentacles.prototype.place = 'HolidayInn';

    Tentacles.prototype.conditions = {
      '|events|MagicCircle': {}
    };

    Tentacles.prototype.people = {
      'Dark Lady': {
        is: Person.DarkLady,
        label: function() {
          if (D.magic >= 30) {
            return 'Dark Lady';
          } else {
            return 'Dark Lady (<span class="magic">30+</span>)';
          }
        },
        matches: function(p) {
          return p.magic >= 30;
        }
      },
      Liana: {
        is: Person.Liana
      }
    };

    Tentacles.prototype.type = 'plot';

    Tentacles.prototype.label = "A Serious Talk";

    Tentacles.prototype.text = function() {
      return "There is something I must discuss with Liana.";
    };

    Tentacles.prototype.next = Page.firstNew;

    Tentacles.next = [];

    return Tentacles;

  })(Job));

  Job.Tentacles.next.push(add(Tentacles1 = (function(superClass) {
    extend(Tentacles1, superClass);

    function Tentacles1() {
      return Tentacles1.__super__.constructor.apply(this, arguments);
    }

    Tentacles1.prototype.text = function() {
      return "|| bg=\"Liana/Happy\"\n  -- `D Liana dear. Sit.`\n  --> She sits, fidgeting nervously. `L Um... did I do something...`\n  --> `D No, you're been a very good girl. But...` I hate myself right now. I don't know how to do this. I put a hand to my forehead and rub it. Isn't that mortals do when they're at a loss? I'm making Liana nervous. She's never seen me pace before. Have I ever paced before? I don't think so.\n\n|| bg=\"Inn/Pentagram\"\n  -- `D There is something very wrong with the world. I recently regained enough power to teleport, and I've been...`\n  --> `L That's a thing you can do? Can I do that?`\n  --> `D Yes, you're easily powerful enough. I'll show you later. But the point is, I've been exploring. It appears that you and I are the most powerful magical beings in the world.`\n  --> She doesn't get it. She can hear how much that bothers me, but she doesn't know why. Liana puts a hand on my forearm. I'm pathetic, to be reassured by contact with a human. I brush her arm off.\n\n  -- `D I've been intensely cautious in my approach, because by all rights we ought to have holy crusaders knocking down our doors by now, and I wanted to seem nothing more than a succubus or some such minor nonsense. But where are the gods and demon lords and sorcerers and saints? I can't find them. I don't know why.`\n  --> `D Clearly magic still works. There's you, the amulet that can resist you, some of the slaves have minor talents. But the world used to be swimming in magic, and all that's left are fragments.`\n\n|| bg=\"Liana/Crying\"\n  -- She's crying. Damn it. Of course I hadn't told her any of what has been bothering me - she's just a slave, even if a pretty one. I rub my hand on my forehead again.\n  --> `D Look. I don't know where the gods are - I lost that war, but they're not here and I am. So I'm going to take over the world, and give you your revenge and any other little treats you like along the way. But it's only fair you know that I'm a bit confused.`\n  --> I had more to discuss, but I'll try again another day when she's not so pitiful. `D And I don't just mean the absurd complexity of your tell-a-visions. Explain again how it knows which picture to show.`";
    };

    return Tentacles1;

  })(Page)));

  Job.Tentacles.next.push(add(Tentacles2 = (function(superClass) {
    extend(Tentacles2, superClass);

    function Tentacles2() {
      return Tentacles2.__super__.constructor.apply(this, arguments);
    }

    Tentacles2.prototype.text = function() {
      return "||\n  -- `L Mistress? May I speak with you?`\n|| bg=\"Liana/Kneeling\"\n  --> I gesture her to my side, and she kneels obediently on the floor, hands folded in her lap waiting for me to acknowledge her presence. To anyone else it might look like I'm just staring off into thin air, but she can feel the forces moving around me. This is delicate work. I finish a mental component of the spell, leave it hanging there and turn my attention to her as I continue to feed it power.\n\n  -- `L I've been thinking about what you said, about where all the magic is, and... well, you're always saying what a powerful mage I am, but I wasn't, not until I met you. Summoning you was the first thing I was ever able to do, and I've just been getting stronger since then... well, anyway, I don't think there is magic in the world, I think it's just you and I was lucky to be nearby when you arrived.`\n  --> So that's what's been bothering her. She's been quiet ever since I spoke with her last time. `D Potential is inborn. Each person has very strict limits, defined from birth. You are... unusual, for a human. Let's just leave it at that. If you'd been useless like most of the toys around here, I'd have corrupted your mind and broken the contract long ago.`\n\n  -- `D Don't look so shocked. You're my second because I chose you, not because of some silly contract you tried to force on me.`\n  --> `L Uh. Um. I... I didn't... About the lack of magic...`\n  --> `D Forget about it. Not important. Here, catch.` I throw the almost-complete spell in her direction. She reaches out to catch the ball of tightly woven power with her bare hands.\n\n|| bg=\"Liana/Tentacles\"\n  -- Silly girl. Don't try to catch magic with your hands.\n  --> `D I've finally managed to summon one in its natural, long-lived form.`\n|| bg=\"Cocoon/Build2\"\n  --> `D We should install him in one of the warehouses in North End... Are you even listening? Pay attention Liana, this is important.`";
    };

    Tentacles2.prototype.apply = function() {
      Tentacles2.__super__.apply.call(this);
      return g.tentaclesReady = true;
    };

    Tentacles2.prototype.effects = {
      remove: {
        '|map|HolidayInn|jobs|Tentacles': Job.Tentacles
      },
      add: {
        '|map|NorthEnd|jobs|4': Job.LargeRoom,
        '|map|NorthEnd|jobs|5': Job.SmallRoom,
        '|map|NorthEnd|jobs|6': Job.SmallRoom
      }
    };

    return Tentacles2;

  })(Page)));

}).call(this);
