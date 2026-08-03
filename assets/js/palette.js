/*
 * Colour palette switcher.
 *
 * Deliberately standalone, plain ES5, and loaded with `defer` rather than being
 * folded into assets/js/_main.js: _main.js is bundled into main.min.js by
 * `npm run build:js` (uglify-js), so editing it would require regenerating a
 * committed build artefact. Nothing here needs jQuery.
 *
 * The palette is already applied by the inline snippet in
 * _includes/head/custom.html before first paint. This file only handles the
 * menu: reading the current value, writing a new one, and persisting it.
 *
 * The light/dark dimension is separate and stays owned by _main.js
 * (setTheme / toggleTheme, which set or remove html[data-theme="dark"]).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "site-palette";
  var root = document.documentElement;
  var button = document.getElementById("palette-button");
  var menu = document.getElementById("palette-menu");

  if (!button || !menu) {
    return;
  }

  var options = menu.querySelectorAll("[data-palette-id]");

  function paletteIdOf(el) {
    return el.getAttribute("data-palette-id");
  }

  function markCurrent() {
    var current = root.getAttribute("data-palette");
    Array.prototype.forEach.call(options, function (option) {
      option.setAttribute("aria-checked", paletteIdOf(option) === current ? "true" : "false");
    });
  }

  function setOpen(open) {
    menu.hidden = !open;
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  button.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(menu.hidden);
  });

  Array.prototype.forEach.call(options, function (option) {
    option.addEventListener("click", function () {
      var id = paletteIdOf(option);
      root.setAttribute("data-palette", id);
      try {
        window.localStorage.setItem(STORAGE_KEY, id);
      } catch (e) {
        /* Safari private mode: the palette still applies for this page view. */
      }
      markCurrent();
      setOpen(false);
      button.focus();
    });
  });

  /* Click-outside and Escape both close the menu. */
  document.addEventListener("click", function (event) {
    if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !menu.hidden) {
      setOpen(false);
      button.focus();
    }
  });

  markCurrent();
})();
