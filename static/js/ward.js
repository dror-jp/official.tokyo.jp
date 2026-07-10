/* Ward selector: the ONLY JavaScript on this site.
   Remembers the visitor's ward in localStorage and shows the matching
   counter block on procedure pages. Everything works without JS too —
   all ward blocks are rendered server-side and simply filtered here. */
(function () {
  var KEY = "otj.ward";
  var sel = document.getElementById("ward-select");
  if (!sel) return;

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  if (saved && sel.querySelector('option[value="' + saved + '"]:not([disabled])')) {
    sel.value = saved;
  }

  function apply() {
    var ward = sel.value;
    if (ward) {
      try { localStorage.setItem(KEY, ward); } catch (e) { /* ignore */ }
    }
    var blocks = document.querySelectorAll("[data-ward]");
    var matched = false;
    blocks.forEach(function (el) {
      var show = !ward || el.getAttribute("data-ward") === ward;
      el.hidden = !show;
      if (ward && show) matched = true;
    });
    var prompt = document.querySelector("[data-ward-prompt]");
    if (prompt) prompt.hidden = !!ward;
    var missing = document.querySelector("[data-ward-missing]");
    if (missing) missing.hidden = !ward || matched;
  }

  sel.addEventListener("change", apply);
  apply();
})();
