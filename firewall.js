const securityChecks = {
  cookies: () => navigator.cookieEnabled,
  localStorage: () => { try { localStorage.setItem("__test","1"); localStorage.removeItem("__test"); return true; } catch { return false; } },
  sessionStorage: () => { try { sessionStorage.setItem("__test","1"); sessionStorage.removeItem("__test"); return true; } catch { return false; } },
  cors: () => 'withCredentials' in new XMLHttpRequest(),
  webCrypto: () => window.crypto && window.crypto.subtle,
  serviceWorker: () => 'serviceWorker' in navigator,
  https: () => location.protocol === 'https:',
  fetch: () => 'fetch' in window,
  websocket: () => 'WebSocket' in window,
  geolocation: () => 'geolocation' in navigator,
  camera: () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
  microphone: () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
  contentSecurityPolicy: () => !!document.querySelector('meta[http-equiv="Content-Security-Policy"]')
};

function runComplianceCheck() {
  console.group("🛡️ NIS2 / ISO 27001 Browser Compliance Check");
  for (const [feature, fn] of Object.entries(securityChecks)) {
    console.log(`${feature}: ${fn() ? '✔️ OK' : '❌ Nicht OK'}`);
  }
  console.groupEnd();
}

runComplianceCheck();

