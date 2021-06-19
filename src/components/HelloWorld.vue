<template>
  <div id="app">
    <div class="top" ><img src="../assets/画板4.png" alt=""></div>
    <div style="position:relative;">
        <div style="display:flex;position:absolute;left:36%;top:60px;">
            <div v-for="index of 10" :key="index"><img src="../assets/主席台位.png" alt=""></div>
        </div>
        <div style="position:absolute;left:35%;top:100px"><img src="../assets/画板13.png" alt=""></div>
    </div>
    <div class="banner">
        <div class="t23">已选的座位数：{{sums}}</div>
      <div style="display:flex;">
        <div
          style="position:absolute;"
          id="reset"
          draggable="true"
          @dragstart="handleDragStart($event)"
          @dragover.prevent="handleDragOver($event)"
          @dropstop="handleDrop($event)"
        >占位</div>
        <div
          @click="changeVisibility"
          v-show="!isShown"
          class="xianshi"
        >选择区域</div>
        <div
          @click="changeVisibility"
          v-show="isShown"
          class="xianshi"
        >确定区域</div>
        <div
          @click="Sort"
          class="quyu"
        >排序</div>
        <div
          @click="insertPeople"
          class="daoru"
        >导入人员数据</div>
      </div>
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
    <div class="hello1">
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
      isShown: false
    };
  },
  components: {
    Hello,
    children
  },

  mounted: function() {},
  methods: {
    onDragstop(x, y, width, height) {
      this.txtList.x1 = x + 10;
      this.txtList.y1 = y + 180;
      this.txtList.y2 = y + this.height +130;
      this.txtList.x2 = x + this.width - 10;
    },
    onResizstop(x, y, width, height) {
      this.txtList.x1 = x + 10;
      this.txtList.y1 = y + 180;
      this.txtList.x2 = x + this.width - 10;
      this.txtList.y2 = y + this.height + 130;
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
      this.isShown = false;
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
    changeVisibility() {
      this.isShown = !this.isShown;
    },
    // 拖拽开始
    handleDragStart() {
      //   this.dragging = item;
      console.log("开始拖拽");
    }
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
#app {
  background-image: url("../assets/画板3.png");
  background-repeat: no-repeat;
}
.top{
    position:relative;
    margin-left: 50px;
}
#selectbc {
  background-color: rebeccapurple;
  overflow: hidden;
}
.banner{
    position: relative;
    height:50px;
    color: #fff;
}
.xianshi{
    position:absolute;
    right:270px;
    top:100px;
    z-index: 999; 
    width: 115px; 
    height: 35px;
    text-align: center;
    line-height: 35px;
    background-image: url('../assets/画板9.png');
    background-repeat: no-repeat;
}
.quyu{
    position: absolute;
    right:150px;
    top:100px;
    z-index: 999; 
    width: 115px; 
    height: 35px;
    text-align: center;
    line-height: 35px;
    background-image: url('../assets/画板9.png');
    background-repeat: no-repeat;
}
.daoru{
    position:absolute;
    right:30px;
    top:100px;
    width: 115px; 
    height: 35px; 
    z-index: 998;
    text-align: center;
    line-height: 35px;
    background-image: url('../assets/画板9.png');
    background-repeat: no-repeat;
}
.t23{
    position:absolute;
    top:200px;
    left:45%;
    font-size: 30px;
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
.hello1{
    margin-left: 30px;
    margin-top:250px;
    padding-bottom:100px;
}
.dragging1 {
  position: absolute;
  border: 1px solid #000;
  color: #000;
}
#reset {
  position:absolute;
  right:420px;
  top:100px;
  width: 50px;
  height: 47px;
  line-height: 40px;
  text-align: center;
  background-image: url("../assets/已经占用但没有人.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 10px;
  color: #fff;
}
</style>
