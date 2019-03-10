import peg from './peg.js'
export default {
  name: 'pegrow',
  components: {
    peg
  },
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
};
