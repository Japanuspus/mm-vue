import MmBoard from '/js/components/MmBoard.js';

//import { astring, default as init } from '/rust/pkg/rust.js';
import { astring, default as init } from '/rust/pkg/rust.js';

async function run() {
	await init('/rust/pkg/rust_bg.wasm');

	// And afterwards we can use all the functionality defined in wasm.
	//const result = astring();
	//console.log(result);
	console.log('Starting Vue render');
	return  new Vue({
	  el: '#app',
	  components: {MmBoard},
	});
}

console.log('Calling run');
var vm = run();

