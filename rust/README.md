
Use `wasm-bindgen` directly instead of `wasm-pack`, see [docs](https://rustwasm.github.io/docs/wasm-bindgen/examples/without-a-bundler.html)

    cargo install wasm-bindgen-cli

	cargo build --target wasm32-unknown-unknown
	wasm-bindgen target/wasm32-unknown-unknown/debug/rust.wasm --web --out-dir pkg



Original intent was to Build `pkg` with 

    wasm-pack build --target no-modules


See https://rustwasm.github.io/wasm-bindgen/examples/without-a-bundler.html
 