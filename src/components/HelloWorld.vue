<template>
  <div id="app">
    

    <div class="tubiao">
      <div class="tubiao-weizhi" style="margin-left: 80px;">
        <div
          style="

            color: rgb(239, 159, 94);

            margin-right: 80px;

            padding-left: 10px;

          "
        >空位</div>

        <div>
          <img src="../assets/画板 32.png" alt />
        </div>
      </div>

      <div>
        <div style="color: rgb(239, 159, 94); margin-right: 80px">已有人</div>

        <div>
          <img src="../assets/画板 34.png" alt />
        </div>
      </div>

      <div>
        <div style="color: rgb(239, 159, 94)">已占用</div>

        <div>
          <img src="../assets/画板 35.png" alt />
        </div>
      </div>
    </div>
    <div style="position: absolute; left: 35%; top: 60px">
        <span class="mainTai">主席台</span>
      </div>
    <div class="zhuxitai">
      <div style="display: flex; position: absolute; left: 36%; top: 20px">
        <div v-for="index of 10" :key="index">
          <img src="../assets/画板 32.png" alt />
        </div>
      </div>

      
    </div>

    <div class="banner">
      <div class="t23">已选的座位数：{{ sums }}</div>

      <div style="display: flex">
        <div
          style="position: absolute"
          id="reset"
          draggable="true"
          @dragstart="handleDragStart($event)"
          @dragover.prevent="handleDragOver($event)"
          @dropstop="handleDrop($event)"
        >占位</div>

        <div @click="changeVisibility" v-show="!isShown" class="xianshi">选择区域</div>

        <div @click="changeVisibility" v-show="isShown" class="xianshi">确定区域</div>

        <div @click="Sort" class="quyu">排序</div>

        <div @click="insertPeople" class="daoru">导入人员数据</div>
      </div>
    </div>

    <!-- 	  <select v-model="index">

		  <option value="1">1</option>

		  <option value="3">3</option>

		  <option value="4">4</option>

		  <option value="5">5</option>

    </select>-->

    <vue-draggable-resizable
      :w="950"
      :h="490"
      :x="370"
      :y="200"
      v-show="isShown"
      :min-width="50"
      :min-height="50"
      :grid="[10, 10]"
      @resizestop="onResizstop"
      @dragstop="onDragstop"
      class-name="dragging1"
      @dragging="onDrag"
      @resizing="onResize"
    >
      <p></p>
    </vue-draggable-resizable>

    <div class="dialog" v-show="isshows">
      <button class="close" @click="closes">x</button>

      <ul class="ullist">
        <li
          v-for="(item, index) of planList"
          :key="item.id"
          :data-id="index"
          class="itemli"
          @click="replaceInfo($event)"
        >{{ item.des }}</li>
      </ul>

      <!-- <button @click="replaceName($event)">添加</button> -->
    </div>

    <div class="xstyle">
      <div
        v-for="item of charList"
        :key="item.id"
        :datat-id="item.id"
        :class="{ grid: item.type == 1, guodao: item.type != 1 }"
      >{{item.id}}</div>
    </div>
  </div>
</template>



<script>
import Hello from "./com/kuang.vue";

import children from "./com/children.vue";

import { HappyScroll } from "vue-happy-scroll";

export default {
  data() {
    return {
      width: 980,

      height: 490,

      x: 0,

      y: 0,

      peopleName: "",

      xlist: [],

      sec: null,

      index: 1,

      option: {},

      sums: 0,

      persons: [],

      charList: [],

      txtList: {
        x1: 370,

        y1: 200,

        x2: 950,

        y2: 490
      },

      planList: [],

      isShown: false,

      isshows: false,

      temp: "",

      flag: 1
    };
  },

  components: {
    Hello,

    children,

    HappyScroll
  },

  created() {
    this.$axios

      .getDistributeData()

      .then(res => {
        this.charList = res.data.data.confSeats;
      })

      .catch(function(res) {
        console.log(res.data);
      });
  },

  mounted: function() {},

  methods: {
    closes() {
      this.isshows = false;
    },

    //修改弹窗状态

    handleType(payload, closename) {
      this.isshows = payload;

      this.peopleName = closename;
    },
    handleRectSelection(data) {
            var a = "";
            const app = this;

            $(".grid").each(function(index) {
                var rect = app.getRect($(this));
                if (app.isCross(data, rect)) {
                    var b = 0;
                    //app.xinxi[index]["blockId"] = 1;
                    b = $(this).text();
                    if (b != "占位") {
                        //app.xinxi[index].merge = 0;
                        $(this).addClass("selected");
                    } else {
                        $(this).addClass("zhanyong");
                        //app.xinxi[index].merge = 2;
                    }
                    //app.seat.push(index);
                    //app.items.push(app.xinxi[index]);
                } else {
                    //$(this).text("");
                    $(this).removeClass("selected");
                }
            });
            //app.sum = app.items.length;
            //app.$emit("showSum", app.sum);
            //app.lastSeat = app.seat;
            //app.seat = [];
            //app.items = [];
        },
    getRect($el) {
            var x1 = $el.offset().left;
            var y1 = $el.offset().top;
            var x2 = x1 + $el.outerWidth();
            var y2 = y1 + $el.outerHeight();
            return { x1, x2, y1, y2 };
        },
    isCross(rect1, rect2) {
            var xNotCross = true; //x方向上不重合
            var yNotCross = true; //y方向上不重合
            xNotCross = rect1.x1 > rect2.x2 || rect2.x1 > rect1.x2;
            yNotCross = rect1.y1 > rect2.y2 || rect2.y1 > rect1.y2;
            return !(xNotCross || yNotCross);
        },
    getList(p) {
      this.planList = p;
    },

    replaceInfo(e) {
      this.peopleName = e.target.innerText;
    },

    // replaceName() {

    //     this.peopleName = this.temp;

    //     this.flag=2;

    // },

    onDragstop(x, y, width, height) {
      this.txtList.x1 = x + 10;

      this.txtList.y1 = y + 180;

      this.txtList.y2 = y + this.height + 110;

      this.txtList.x2 = x + this.width - 10;
      this.handleRectSelection(this.txtList)
    },

    onResizstop(x, y, width, height) {
      this.txtList.x1 = x + 10;

      this.txtList.y1 = y + 180;

      this.txtList.x2 = x + this.width - 10;

      this.txtList.y2 = y + this.height + 110;
      this.handleRectSelection(this.txtList)
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
.close {
  position: relative;

  left: 216px;
}

.dialog {
  position: absolute;

  width: 240px;

  height: 240px;

  /* background-color: white; */

  top: 10px;

  border: 1px solid black;

  z-index: 100px;
}
.selected {
    background-image:url('../assets/画板 33.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.zhuxitai{
    position: relative;
}
.mainTai {
  position: relative;

  color: #fff;

  line-height: 48px;

  margin-left: 210px;

  font-size: 26px;
}

.ullist {
  width: 200px;

  height: 200px;

  overflow: auto;

  list-style: none;
}

.itemli {
  text-align: center;

  width: 100px;
}

.itemli:hover {
  border: 1px solid white;
}

.happy-slow {
  padding-left: 50px;

  margin-right: 50px;

  width: 200px;

  height: 600px;

  background-color: white;
}

.tubiao {
  display: flex;

  position:relative;

  width:30%;
}

#app {
  background-image: url("../assets/hb20.png");

  background-repeat: no-repeat;

  overflow: scroll;
}

.top {
  position: relative;

  padding-left: 50px;

  background-image: url("../assets/hb21.png");

  background-repeat: no-repeat;
}

#selectbc {
  background-color: rebeccapurple;

  background-repeat: no-repeat;

  overflow: hidden;
}

.banner {
  position: relative;

  height: 50px;

  color: #fff;
}

.xianshi {
  position: absolute;

  right: 270px;

  top: 30px;

  z-index: 999;

  width: 115px;

  height: 35px;

  text-align: center;

  line-height: 35px;

  background-image: url("../assets/画板 36.png");

  background-repeat: no-repeat;
}

.quyu {
  position: absolute;

  right: 150px;

  top: 30px;

  z-index: 999;

  width: 115px;

  height: 35px;

  text-align: center;

  line-height: 35px;

  background-image: url("../assets/画板 36.png");

  background-repeat: no-repeat;
}

.daorus {
  position: absolute;

  right: 30px;

  top: 30px;

  width: 115px;

  height: 35px;

  z-index: 998;

  text-align: center;

  line-height: 35px;

  background-image: url("../assets/画板 36.png");

  background-repeat: no-repeat;
}

.daoru {
  position: absolute;

  right: 30px;

  top: 30px;

  width: 115px;

  height: 35px;

  z-index: 998;

  text-align: center;

  line-height: 35px;

  background-image: url("../assets/画板 36.png");

  background-repeat: no-repeat;
}

.t23 {
  position: absolute;

  top: 90px;

  left: 75%;

  font-size: 18px;

  color: rgb(239, 159, 94);
}

.st {
  width: 50px;

  height: 50px;
}

.dragbox {
  width: 100%;

  margin: 10px;
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

.xstyle {
  margin-top: 100px;

  /* display: flex;

    flex-direction: row;

    flex-wrap: wrap; */

  width: 100%;

  display: grid;

  margin: 5rem 0 0 0;

  grid-template-columns: repeat(34, auto);

  grid-template-rows: repeat(8, auto);
}

.grid {
  width: 49px;

  height: 50px;

  

  margin-bottom: 20px;

  background-image: url('../assets/画板 32.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.guodao {
  width: 49px;

  height: 50px;

  margin-bottom: 20px;

  

  box-sizing: border-box;

  background: #8a4631;
}

.hello1 {
  padding-left: 30px;

  margin-top: 100px;

  
}

.dragging1 {
  position: absolute;

  border: 1px solid #000;

  color: #000;
}

#reset {
  position: absolute;

  right: 420px;

  top: 30px;

  width: 50px;

  height: 47px;

  line-height: 40px;

  text-align: center;

 

  background-size: 100% 100%;

  background-repeat: no-repeat;

  font-size: 10px;

  color: #fff;
}
</style>

