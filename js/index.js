//A peg: color 0 means undefined
Vue.component('peg', {
  name: 'peg',
  template: '\
    <v-avatar :color="cfg.colors[color]" class="elevation-3" style="margin:6px" draggable="true"\
        v-on:dragstart="peg_drag($event)" v-on:dragover="peg_dragover" v-on:drop="peg_drop($event)">\
      <span v-if="color==0" class="headline">?</span>\
      <span v-else-if="cfg.show_number" class="cfg.colors[color]--text headline">{{ color }}</span>\
    </v-avatar>',
  props: {
    color: {type: Number, required: true},
    drop_id: {type: Number, default: 0},  //drop_id of 0 means do not emit
    cfg: {type: Object, required: true}
  },
  methods: {
    peg_drag: function(event) {
      var drag_data={'src_drop_id': this.drop_id, 'color': this.color};
      console.log(drag_data, event);
      event.dataTransfer.setData("text", JSON.stringify(drag_data));
      // allow owner to change value of this to 0.
      if(this.drop_id>0) {
        this.$emit('drag_out', this.drop_id);
      }
    },
    peg_dragover: function(event) {
      //default is to not accept drops: preventDefault if we have drop_id
      if(this.drop_id) {
        event.preventDefault();
      } 
    },
    peg_drop: function(event) {
      event.preventDefault();
      var drag_data = JSON.parse(event.dataTransfer.getData('text'));
      drag_data.tgt_drop_id = this.drop_id;
      console.log('got drop event: ', drag_data);
      this.$emit('drag_in', drag_data);
    }
  }
});

Vue.component('pegrow', {
  template: '\
        <v-layout align-center row my-3>\
          <v-flex sm2><v-card-text class="headline">{{ header }}</v-card-text></v-flex>\
          <v-flex v-for="(peg,index) in pegs" :key="\'uniqueId\'+index">\
            <peg :cfg="cfg" :color="peg" :drop_id="allow_drop?index+1:0" @drag_in="drag_in" @drag_out="drag_out"></peg>\
          </v-flex>\
          <v-flex sm4><slot></slot></v-flex>\
        </v-layout>',
  data: function () { return {
    id: _.uniqueId('row_guess')
  }},
  props: {
    header: {type: String, default: ''},
    pegs: {type: Array, required: true},
    cfg: {type: Object, required: true},
    allow_drop: {type: Boolean, default: false}
  },
  methods: {
    drag_in: function(ev) {this.$emit('drag_in', ev);},
    drag_out: function(ev) {this.$emit('drag_out', ev);}
  }
});

Vue.component('board-row',{
  template: '\
  <v-layout row>\
    <v-flex v-for="(c, index) in row.pegs" :key="id+index" sm1>\
      <peg  :cfg="cfg" :color="c"></peg>\
    </v-flex>\
    <v-flex sm2>{{row.answer}}</v-flex>\
  </v-layout>',
  props: {
    cfg: {type: Object, required: true},
    row: {type: Object, required: true}
  },
  data: function() {return {
    id: _.uniqueId('board-row')
  }}
});

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

var vm = new Vue({
  el: '#app',
  data: {
    cfg: {
      colors: ["grey", "red", "purple", "blue", "green", "yellow", "orange", "brown", "blue-grey"],
      show_number: true,
      n_color: 8,
      n_peg: 4
    },
    rows: [],
    secret: newSecret({n_peg: 4, n_color: 8}),
    gs: Array(4).fill(0)
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
});