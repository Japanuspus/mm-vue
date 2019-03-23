extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use colorguess;

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

#[wasm_bindgen]
pub struct Board {
    bg: colorguess::Board
}

#[wasm_bindgen]
pub struct Score {
    /// Black/Colored: correct position and color
    pub b: u8,
    /// White: correct color, wrong position
    pub w: u8,
}

#[wasm_bindgen]
impl Board {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {bg: colorguess::Board::new()}
    }

    #[wasm_bindgen(js_name = addGuessAndScore)]
    pub fn add_guess_and_score(&mut self, _guess: Vec<u32>, _score: &Score) {
        // let pegs = Pegs::new([guess[0], guess[1]])
        // self.bg.add_guess(BoardRow {})
    }

    #[wasm_bindgen(js_name = getPossibleCount)]
    pub fn get_possible_count(&mut self) -> u32 {
        self.bg.possible.len() as u32
    }
}