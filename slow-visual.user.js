// ==UserScript==
// @name         Guess The Cup - Visual Slow Mode
// @namespace    Gillmanm.We
// @version      1.0.0
// @description  Slows browser-rendered CSS animations/transitions for visual inspection. Does not alter game logic, server timing, outcomes, or network requests.
// @match        https://www.wasafibet.co.tz/casino/guess_the_cup*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const DEFAULT_SPEED = 0.04; // 0.04x = 25x slower visually
  const STYLE_ID = 'we-visual-slow-mode';
  let speed = DEFAULT_SPEED;

  const css = document.createElement('style');
  css.id = STYLE_ID;
  css.textContent = `
    :root {
      --we-slow-speed: ${1 / speed}s;
    }
    *, *::before, *::after {
      animation-duration: var(--we-slow-speed) !important;
      transition-duration: var(--we-slow-speed) !important;
    }
  `;

  const apply = () => {
    if (!document.head) return;
    const old = document.getElementById(STYLE_ID);
    if (!old) document.head.appendChild(css);
  };

  if (document.head) apply();
  else new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('load', () => {
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;z-index:2147483647;top:10px;right:10px;background:rgba(10,15,25,.94);color:#fff;padding:10px 12px;border-radius:10px;font:12px system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.3);';
    panel.innerHTML = '<b>Visual Slow Mode</b><br><span id="we-speed">25× slower</span> ';
    const select = document.createElement('select');
    select.style.cssText = 'margin-left:6px;background:#172033;color:#fff;border:1px solid #44506a;border-radius:6px;padding:3px;';
    [['0.04','25× slower'],['0.1','10× slower'],['0.25','4× slower'],['0.5','2× slower'],['1','Normal']].forEach(([v,t]) => {
      const o = document.createElement('option');
      o.value = v; o.textContent = t;
      if (v === String(DEFAULT_SPEED)) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener('change', () => {
      speed = Number(select.value);
      css.textContent = `:root{--we-slow-speed:${1 / speed}s}*,*::before,*::after{animation-duration:var(--we-slow-speed)!important;transition-duration:var(--we-slow-speed)!important;}`;
      panel.querySelector('#we-speed').textContent = select.options[select.selectedIndex].textContent;
    });
    panel.appendChild(select);
    document.body.appendChild(panel);
  });
})();
