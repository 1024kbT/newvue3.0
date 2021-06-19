<template>
  <div id="app">
    <div style="display:flex;">
      <button
        @click="Sort"
        style="position: relative; z-index: 999; width: 150px; height: 30px"
      >选择区域</button>
      <button
        @click="changeVisibility"
        v-show="isShown"
        style="position: relative; z-index: 999; width: 150px; height: 30px"
      >显示</button>
      <button
        @click="changeVisibility"
        v-show="!isShown"
        style="position: relative; z-index: 999; width: 150px; height: 30px"
      >隐藏</button>
      <button
        @click="insertPeople"
        style="position: relative; width: 100px; height: 30px; z-index: 998"
      >导入人员数据</button>
          <div
      id="reset"
      draggable="true"
      @dragstart="handleDragStart($event)"
      @dragover.prevent="handleDragOver($event)"
      @dropstop="handleDrop($event)"
    >
      占位
    </div>
      <p style="position:relative;">{{sums}}</p>
    </div>

    <!-- 	  <select v-model="index">
		  <option value="1">1</option>
		  <option value="3">3</option>
		  <option value="4">4</option>
		  <option value="5">5</option>
    </select>-->
    <vue-draggable-resizable
      :w="980"
      :h="490"
      :x="370"
      :y="10"
            v-show="isShown"
      :min-width="50"
      :min-height="50"
      :parent="true"
      :grid="[10, 10]"
      @resizestop="onResizstop"
      @dragstop="onDragstop"
      class-name="dragging1"
      @dragging="onDrag"
      @resizing="onResize"
    >
      <p></p>
    </vue-draggable-resizable>
    <Hello
      v-for="index of 8"
      class="dragbox"
      :options="option"
      :selects="sec"
      @aa="tty"
      :txtlist="txtList"
      :key="index"
      :persons="persons"
      @showSum="showSums"
    ></Hello>
  </div>
</template>

<script>
import Hello from "./com/kuang.vue";
import children from "./com/children.vue";
export default {
  data() {
    return {
      width: 980,
      height: 490,
      x: 0,
      y: 0,
      xlist: [],
      sec: null,
      index: 1,
      option: {},
      sums: 0,
      persons: [],
      txtList: {
        x1: 370,
        y1: 10,
        x2: 980,
        y2: 490
      },
      isShown: true
    };
  },
  components: {
    Hello,
    children
  },

  mounted: function() {},
  methods: {
    onDragstop(x, y, width, height) {
      this.txtList.x1 = x + 40;
      this.txtList.y1 = y + 20;
      this.txtList.y2 = y + this.height + 30;
      this.txtList.x2 = x + this.width;
    },
    onResizstop(x, y, width, height) {
      this.txtList.x1 = x + 20;
      this.txtList.y1 = y + 20;
      this.txtList.x2 = x + this.width + 20;
      this.txtList.y2 = y + this.height + 20;
      console.log(this.txtList);
    },
    onResize: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    onDrag: function(x, y) {
      this.x = x;
      this.y = y;
    },
    tty(a) {},
    showSums(data) {
      this.sums = data;
    },
    setChildren() {
      this.test = {
        name: "lisi",
        age: 5
      };
      console.log(111, this.test);
    },
    Sort: function() {
      const app = this;
      let data = {
        confSeatList: this.GLOBAL.baseURL,
        sortType: 1
      };
      console.log(this.GLOBAL.baseURL);
      this.$axios
        .getSort(data)
        .then(res => {
          app.option = res.data.data;
        })
        .catch(err => {});
    },
    insertPeople() {
      let data = {
        blocks: [
          {
            id: 1,
            num: 1
          }
        ],
        confSeats: this.GLOBAL.baseURL
      };
      this.$axios
        .getPeople(data)
        .then(res => {
          this.persons = res.data.data.confSeats;
        })
        .catch(err => {});
    },
    changeVisibility(){
        this.isShown = !this.isShown
    },
        // 拖拽开始
    handleDragStart() {
      //   this.dragging = item;
      console.log('开始拖拽')
    },
    //首先把div变成可以放置的元素，即重写dragenter/dragover
    // handleDragOver(e) {
    //   e.preventDefault();
    //   console.log(e);
    //   console.log('handleDragOver');
    //   // e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    // },
    // // 鼠标释放
    // handleDrop(e){
    //     console.log(e);
    //     console.log('释放');
    //   e.currentTarget.innerText = ''
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#selectbc {
  background-color: rebeccapurple;
}

.st {
  width: 50px;
  height: 50px;
  border: 1px so;
}
.dragbox {
  width: 100%;
  margin: 20px;
}
.dragbox,
img {
  -webkit-user-select: none;
  -webkit-user-drag: none;
}
.draging {
  background-color: aquamarine;
}

* {
  cursor: default;
}
.dragging1 {
  position: absolute;
  border: 1px solid #000;
  color: #000;
}
#reset {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: gray;
}
</style>
