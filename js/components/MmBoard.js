
import PegItem from './PegItem.js';
import PegRow from './PegRow.js';

// returns tuple: (number of exact matches, number of color matches)
var colorCompare=function(araw,braw) {
  var exact_matches=araw.map(function(v,i) {return v==braw[i];}).reduce((x,y)=> x+y);
  // compute total matches
  var ct=0; 
  var a=araw.slice(0).sort(); // sorted copy of input
  var b=braw.slice(0).sort();
  while (a.length>0 && b.length>0) {
    if (a[0]<b[0]) {
      a.shift();
    } else {
      if (b[0]<a[0]) {
        b.shift();  
      } else {
        a.shift();
        b.shift();
        ct+=1;
      }
    }
  }
  return {
    'exact': exact_matches, 
    'color': ct-exact_matches
  }
}

const newSecret=function(cfg) {
  return Array(cfg.n_peg).fill(0).map(x => 1+Math.floor(Math.random()*cfg.n_color));
}


export default {
  name: 'MmBoard',
  components: {
    PegItem,
    PegRow
  },
  template: '\
  <v-container >\
  <peg-row v-for="row in rows" :cfg="cfg" :pegs="row.pegs" :header="String(row.number)" :key="_.uniqueId()">\
    {{row.answer}}\
  </peg-row>\
  <peg-row :cfg="cfg" :pegs="gs" header=">" :allow_drop="true" v-on:drag_out="drag_out" v-on:drag_in="drag_in">\
        <v-btn v-on:click="addGuess">Go</v-btn>\
  </peg-row>\
  <peg-row :cfg="cfg" :pegs="[1,2,3,4]" header=""></peg-row>\
  <peg-row :cfg="cfg" :pegs="[5,6,7,8]" header=""></peg-row>\
  </v-container>\
  ',
  data: function() { 
    return {
      cfg: {
        colors: ["grey", "red", "purple", "blue", "green", "yellow", "orange", "brown", "blue-grey"],
        show_number: true,
        n_color: 8,
        n_peg: 4
      },
      rows: [],
      secret: newSecret({n_peg: 4, n_color: 8}),
      gs: Array(4).fill(0)
    };
  },
  methods: {
    addGuess: function() {
      var pegs = this.gs.slice(0); //copy
      console.log('Received new guess: '+pegs);
      this.rows.push({'pegs': pegs, 'answer': colorCompare(this.secret, pegs), 'number': this.rows.length+1});
    },
    revealSecret: function() {
      console.log('Revealing secret');
      this.addGuess(this.secret);
    },
    newGame: function() {
      this.rows=[];
      this.secret=newSecret(this.cfg);
    },
    clear_gs: function() {
      this.gs=[3,3,3,4];
    },
    drag_in: function(event) {
      console.log('drag in received: ', event);
      var old_target_color = this.gs[event.tgt_drop_id-1];
      this.gs[event.tgt_drop_id-1] = event.color;
      if(event.src_drop_id>0) {
        console.log('Assigning old color to source');
        this.gs[event.src_drop_id-1] = old_target_color;
      }
      this.$forceUpdate();
    },
    drag_out: function(drop_id) {
      console.log('drag out received from: ', drop_id);
      this.gs[drop_id-1]=0;
      this.$forceUpdate();
    }
  }
};