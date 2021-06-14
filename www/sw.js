importScripts("/lib/sw.js");

let wasmPath = "/server.wasm";
let cacheFiles = ["/", "/sw.js", "/lib/sw.js", "/lib/wasm_exec.js"];
let cacheVersion = "v1";

// Skip installed stage and jump to activating stage
addEventListener("install", (event) => {
  let installCacheFiles = caches
    .open(cacheVersion)
    .then((cache) => cache.addAll(cacheFiles));
  event.waitUntil(
    Promise.all([
      installCacheFiles,
      skipWaiting(), //
    ])
  );
});

// Start controlling clients as soon as the SW is activated
addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      const broadcast = new BroadcastChannel("server-ready");
      broadcast.postMessage({ type: "ready" });
    })
  );
});

registerWasmHTTPListener(wasmPath, {}, cacheFiles);
