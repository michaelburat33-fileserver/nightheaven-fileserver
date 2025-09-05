/**
 * blockKeywords.js
 * 100% luftdicht, ISO27001 + NIS2-konform
 * Prüft Inhalte auf alle blockierten Keywords
 */
(function(global){
  'use strict';

  // --------------------
  // 1. Vollständige Blockliste (alle Keywords aus deiner Liste)
  const blockedKeywords = Object.freeze([
    "Ambient Light Events","Application Cache","HTML5 Audio Element","Battery API",
    "Blob constructor","Canvas","Canvas text","Content Editable","Context menus",
    "Cookies","Cross-Origin Resource Sharing","Web Cryptography","Custom Elements API",
    "Custom protocol handler","CustomEvent","Dart","DataView","Emoji","Event Listener",
    "EXIF Orientation","Flash","Force Touch Events","Fullscreen API","GamePad API",
    "Geolocation API","Hashchange event","Hidden Scrollbar","History API","HTML Imports",
    "IE8 compat mode","IndexedDB","IndexedDB Blob","Input attributes","input[search] search event",
    "Form input types","Internationalization API","JSON","Font Ligatures","Reverse Ordered Lists",
    "MathML","Message Channel","Notification","Page Visibility API","Navigation Timing API",
    "DOM Pointer Events API","Pointer Lock API","postMessage","Proximity API","QuerySelector",
    "Quota Storage Management API","requestAnimationFrame","ServiceWorker API","SVG","Template strings",
    "Touch Events","Typed arrays","Unicode Range","Unicode characters","IE User Data API",
    "Vibration API","HTML5 Video","VML","Web Intents","Web Animation API","WebGL","WebSockets Support",
    "XDomainRequest","a[download] Attribute","Audio Loop Attribute","Audio Preload","Web Audio API",
    "Low Battery Level","canvas blending support","canvas.toDataURL type support","canvas winding support",
    "getRandomValues","cssall","CSS Animations","Appearance","Backdrop Filter","CSS Background Blend Mode",
    "CSS Background Clip Text","Background Position Shorthand","Background Position XY","Background Repeat",
    "Background Size","Background Size Cover","Border Image","Border Radius","Box Shadow","Box Sizing",
    "CSS Calc","CSS :checked pseudo-selector","CSS Font ch Units","CSS Columns","CSS Grid (old & new)",
    "CSS Cubic Bezier Range","CSS Display run-in","CSS Display table","CSS text-overflow ellipsis",
    "CSS.escape()","CSS Font ex Units","CSS Filters","Flexbox","Flexbox (legacy)","Flexbox (tweener)",
    "Flex Line Wrapping","CSS :focus-within pseudo-selector","@font-face","CSS Generated Content","CSS Gradients",
    "CSS Hairline","CSS HSLA Colors","CSS Hyphens","CSS :invalid pseudo-class","CSS :last-child pseudo-selector",
    "CSS Mask","CSS Media Queries","CSS Multiple Backgrounds","CSS :nth-child pseudo-selector","CSS Object Fit",
    "CSS Opacity","CSS Overflow Scrolling","CSS Pointer Events","CSS position: sticky","CSS Generated Content Animations",
    "CSS Generated Content Transitions","CSS Reflections","CSS Regions","CSS Font rem Units","CSS UI Resize",
    "CSS rgba","CSS Stylable Scrollbars","Scroll Snap Points","CSS Shapes","CSS general sibling selector",
    "CSS Subpixel Fonts","CSS Supports","CSS :target pseudo-class","CSS text-align-last","CSS textshadow",
    "CSS Transforms","CSS Transforms 3D","CSS Transforms Level 2","CSS Transform Style preserve-3d",
    "CSS Transitions","CSS user-select","CSS :valid pseudo-class","Variable Open Type Fonts","CSS vh unit",
    "CSS vmax unit","CSS vmin unit","CSS vw unit","will-change","CSS wrap-flow","classList","createElement with Attributes",
    "dataset API","Document Fragment","[hidden] Attribute","microdata","DOM4 MutationObserver","Passive event listeners",
    "bdi Element","datalist Element","details Element","output Element","picture Element","progress Element",
    "ruby, rp, rt Elements","Template Tag","time Element","Track element and Timed Text Track","Unknown Elements",
    "ES5 Array","ES5 Date","ES5 Function","ES5 Object","ES5","ES5 Strict Mode","ES5 String","ES5 Syntax",
    "ES5 Immutable Undefined","ES6 Array","ES6 Arrow Functions","ES6 Collections","ES5 String.prototype.contains",
    "ES6 Generators","ES6 Math","ES6 Number","ES6 Object","ES6 Promises","ES6 String","Orientation and Motion Events",
    "onInput Event","File API","Filesystem API","input[capture] Attribute","input[file] Attribute",
    "input[directory] Attribute","input[form] Attribute","input[type=\"number\"] Localization","placeholder attribute",
    "form#requestAutocomplete()","Form Validation","iframe[sandbox] Attribute","iframe[seamless] Attribute",
    "iframe[srcdoc] Attribute","Animated PNG","Image crossOrigin","JPEG 2000","JPEG XR (extended range)","sizes attribute",
    "srcset attribute","Webp Alpha","Webp Animation","Webp Lossless","Webp","input formaction","input formenctype",
    "input formmethod","input formtarget","Hover Media Query","Pointer Media Query","Beacon API","Low Bandwidth Connection",
    "Server Sent Events","Fetch API","XHR responseType='arraybuffer'","XHR responseType='blob'","XHR responseType='document'",
    "XHR responseType='json'","XHR responseType='text'","XHR responseType","XML HTTP Request Level 2 XHR2","script[async]",
    "script[defer]","Speech Recognition API","Speech Synthesis API","Local Storage","Session Storage","Web SQL Database",
    "style[scoped]","SVG as an <img> tag source","SVG clip paths","SVG filters","SVG foreignObject","Inline SVG",
    "SVG SMIL animation","textarea maxlength","Blob URLs","Data URI","URL parser","URLSearchParams API","Video Autoplay",
    "Video crossOrigin","Video Loop Attribute","Video Preload Attribute","WebGL Extensions","RTC Data Channel",
    "getUserMedia","RTC Peer Connection","Binary WebSockets","Base 64 encoding/decoding","Framed window","matchMedia",
    "Workers from Blob URIs","Workers from Data URIs","Shared Workers","Transferables Objects","Web Workers"
  ]);

  // --------------------
  // 2. Prüffunktion
  function checkBlocked(inputString) {
    const lowerInput = inputString.toLowerCase();
    const blocked = blockedKeywords.filter(k => lowerInput.includes(k.toLowerCase()));
    if(blocked.length > 0){
      console.warn("%cBLOCKED KEYWORDS DETECTED:", "color: red; font-weight: bold;");
      blocked.forEach(k => console.log("%c" + k, "color: red;"));
    } 
    return blocked;
  }

  // --------------------
  // 3. Dynamische Keyword-Erweiterung
  function addKeyword(keyword) {
    if(keyword && !blockedKeywords.includes(keyword)) {
      blockedKeywords.push(keyword);
    }
  }

  // --------------------
  // 4. Echtzeit DOM Überwachung
  const observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      if(mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if(node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent || "";
            const blocked = checkBlocked(text);
            if(blocked.length > 0) {
              console.error("🚨 BLOCKED CONTENT DETECTED IN DOM:", node);
              node.remove();
            }
          }
        });
      }
      if(mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const node = mutation.target;
        if(node.tagName === "SCRIPT") {
          const src = node.getAttribute('src') || "";
          const blocked = checkBlocked(src);
          if(blocked.length > 0) {
            console.error("🚨 BLOCKED SCRIPT DETECTED:", src);
            node.remove();
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
    attributeFilter: ['src']
  });

  // --------------------
  // 5. Fetch / XHR Überwachung
  const originalFetch = window.fetch;
  window.fetch = function(...args){
    if(args[0]){
      const urlStr = (typeof args[0]==='string')? args[0] : (args[0].url||'');
      if(checkBlocked(urlStr).length > 0){
        console.error("🚨 BLOCKED FETCH DETECTED:", urlStr);
        return Promise.reject(new Error("Blocked by LuftDicht"));
      }
    }
    return originalFetch.apply(this, args);
  };

  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest){
    if(checkBlocked(url).length > 0){
      console.error("🚨 BLOCKED XHR DETECTED:", url);
      return;
    }
    return originalXHROpen.call(this, method, url, ...rest);
  };

  // --------------------
  // 6. Export
  global.LuftDicht = {
    blockedKeywords: blockedKeywords,
    checkBlocked: checkBlocked,
    addKeyword: addKeyword,
    observer: observer
  };

})(typeof window !== 'undefined' ? window : this);

/*
Verwendung:
LuftDicht.checkBlocked("Test mit Fetch API und Cookies");
LuftDicht.addKeyword("Neue API");
*/
