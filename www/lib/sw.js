importScripts("/lib/wasm_exec.js");

function registerWasmHTTPListener(wasm, { base, args = [] } = {}, cacheFiles) {
  let path = new URL(registration.scope).pathname;
  if (base && base !== "")
    path = `${trimEnd(path, "/")}/${trimStart(base, "/")}`;

  const handlerPromise = new Promise((setHandler) => {
    self.wasmhttp = {
      path,
      setHandler,
    };
  });

  addEventListener("fetch", (e) => {
    const { pathname, protocol } = new URL(e.request.url);
    if (!protocol.startsWith("http")) return;
    if (cacheFiles.includes(pathname) || pathname == wasm) {
      return e.respondWith(caches.match(e.request));
    }
    if (!pathname.startsWith(path)) return;

    e.respondWith(handlerPromise.then((handler) => handler(e.request)));
  });

  caches
    .has("wasm")
    .then((exist) => {
      if (exist) return;
      return caches.open("wasm").then((cache) => cache.add(wasm));
    })
    .then(() => {
      const go = new Go();
      go.argv = [wasm, ...args];
      WebAssembly.instantiateStreaming(
        caches.match(wasm),
        go.importObject
      ).then(({ instance }) => {
        go.run(instance);
      });
    });
}

function trimStart(s, c) {
  let r = s;
  while (r.startsWith(c)) r = r.slice(c.length);
  return r;
}

function trimEnd(s, c) {
  let r = s;
  while (r.endsWith(c)) r = r.slice(0, -c.length);
  return r;
}
