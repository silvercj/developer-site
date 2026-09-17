// Vaping cost calculator. Runs in the browser; nothing is stored or sent.
(function () {
  "use strict";
  var DUTY_PER_ML = 2.20 / 10;   // Vaping Products Duty from 1 October 2026
  var VAT = 1.2;
  var gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
  function value(id, max) {
    var n = parseFloat(document.getElementById(id).value);
    if (!isFinite(n) || n < 0) return 0;
    return Math.min(n, max);
  }
  function set(id, amount) { document.getElementById(id).textContent = gbp.format(amount); }
  function update() {
    var spend = value("spend", 1000), ml = value("ml", 500);
    set("perWeek", spend); set("perMonth", spend * 52 / 12); set("perYear", spend * 52);
    var duty = ml * DUTY_PER_ML;
    set("dutyWeek", duty); set("dutyYear", duty * 52);
    set("passWeek", duty * VAT); set("passYear", duty * VAT * 52);
  }
  ["spend", "ml"].forEach(function (id) { document.getElementById(id).addEventListener("input", update); });
  update();
})();
