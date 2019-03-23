import MmBoard from '/js/components/MmBoard.js';
import { default as init } from '/rust/pkg/rust.js';

async function run() {
    // After init runs the backend functionality is available
    // Wrappers need to be imported in relevant modules.
	await init('/rust/pkg/rust_bg.wasm');

	console.log('Starting Vue render');
	return  new Vue({
	  el: '#app',
	  components: {MmBoard},
	});
}
var vm = run();

