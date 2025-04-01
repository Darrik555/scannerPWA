import "clsx";
import { d as current_component, c as pop, p as push } from "../../chunks/index.js";
import "barcode-detector";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
function BarcodeDetector_1($$payload, $$props) {
  push();
  function stopScanner() {
  }
  onDestroy(stopScanner);
  $$payload.out += `<div><video muted autoplay playsinline class="svelte-ib6kvy"></video> <button>Start</button> <button>Stop</button></div>`;
  pop();
}
function _page($$payload) {
  $$payload.out += `<h1>Welcome to SvelteKit</h1> `;
  BarcodeDetector_1($$payload);
  $$payload.out += `<!---->`;
}
export {
  _page as default
};
