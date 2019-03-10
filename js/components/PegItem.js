//A peg: color 0 means undefined
export default {
  // https://vuejs.org/v2/style-guide/#Component-name-casing-in-JS-JSX-strongly-recommended
  name: 'PegItem',
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
};
