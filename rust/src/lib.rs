extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

/// Return a string to test vue-bindings
///
/// # Examples
/// ```
/// let a = rust::astring();
/// assert_eq!(a, "The foo".to_string());
/// ```
#[wasm_bindgen]
pub fn astring() -> String {
	"The foo".to_string()
}
