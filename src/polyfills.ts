// Ensure Node-like globals exist in the browser for libraries that expect them
// global
// @ts-expect-error assign global for browser
if (typeof global === 'undefined' && typeof window !== 'undefined') {
  // @ts-expect-error
  window.global = window
}

// process (minimal shim for process.env usage in some libs)
// @ts-expect-error
if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  // @ts-expect-error
  window.process = { env: {} }
}


