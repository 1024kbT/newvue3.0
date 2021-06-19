<template>
  <div id="kz" style="display: flex">
    <div v-for="index of 5" class="main" :key="index.id" :gindex="index">
      <div style="display: flex">
        <div
          class="t1"
          v-for="index of 6"
          :key="index.id"
          draggable="true"
            @contextmenu.prevent="mousemove()"

          @click="handlePeople($event)"
          @dragstart="handleDrag($event)"
          @drop="handleDrop($event)"
          @dragover="handleDragOver($event)"
          v-on:dblclick="clear($event)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Hello",
  props: {
    txtlist: {
      type: Object,
      default: function() {
        return {
          x1: 430,
          y1: 420,
          x2: 1440,
          y2: 860
        };
      }
    },
    persons: Array,
    options: Object,
    pName: String,
    flag:Number
  },
  data() {
    return {
      xinxi: [],
      items: [],
      seat: [],
      sort: [],
      planList: [],
      sum: 0,
      lastSeat: [],
      temp1: null,
      temp2: "",
      isshows: true,
    };
  },
  created() {
    const app = this;

    this.$axios
      .getDistributeData()
      .then(res => {
        app.xinxi = res.data.data.confSeats;
      })
      .catch(function(res) {
        console.log(res.data);
      });
  },
  mounted: function() {
    var rector = $("#selectionRect");

    //拖选起点
    var startX = 0;
    var startY = 0;
    //选择框核心代码

    function resizeToPoint(x, y) {
      var width = Math.abs(x - startX);
      var height = Math.abs(y - startY);
      rector.width(width);
      rector.height(height);
      //当鼠标x方向上为向左拖动 设置left位置
      if (x < startX) {
        rector.css({
          left: startX - width + "px"
        });
      }
      //当鼠标y方向上为向上拖动 设置top位置
      if (y < startY) {
        rector.css({
          top: startY - height + "px"
        });
      }
    }

    /**
     *核心相交算法
     * @param rect1{x1,y1,x2,y2}
     * @param rect2 {x1,y1,x2,y2}
     */

    /**
     *获取元素的矩形的起始点坐标与其对角点坐标
     * @param $el
     * @return {x1,y1,x2,y2}
     */

    //框选处理 如果元素与选择框相交则设置样式
  },
  watch: {
    options: {
      handler: function(newVal, oldVal) {
        this.seatSort();
        // console.log(11111,newVal,oldVal)
        // console.log(this.options)
      },
      deep: true
    },
    persons: {
      handler: function(newVal, oldVal) {
        this.sortPerson();
      },
      deep: true
    },
    txtlist: {
      handler: function(newVal, oldVal) {
        console.log(this.txtlist);
        this.handleRectSelection(this.txtlist);
      },
      deep: true
    }
  },
  methods: {
      mousemove() {
            this.$axios.getNoPeople().then((res) => {
                this.planList = res.data.data;
            });
            this.$emit("getList", this.planList);
        },
     handlePeople(e) {
       
         this.$emit("changeType", this.isshows, this.closeName);
       
            if (!this.pName) {
              console.log();
              
            } else {
                e.currentTarget.innerText = this.pName;
                e.currentTarget.className =e.currentTarget.className + " choose"
            }
            
            
        },
    seatSort() {
      var oT1 = document.querySelectorAll(".t1");
      for (var i = 0; i < oT1.length; i++) {
        for (var j = 0; j < this.lastSeat.length; j++) {
          if (i == this.lastSeat[j]) {
            var a = "";
            var r,
              w = 0;
            r = Math.ceil((i + 1) / 30);
            w = parseInt((i + 1) % 30);
            a = r + "-" + w;
            if (this.options[a] != null) {
              oT1[i].innerText = this.options[a];
            } else {
              oT1[i].innerText = "占位";
            }
            this.GLOBAL.baseURL[j]["orderMark"] = parseInt(this.options[a]);
          }
        }
      }
    },
    handleRectSelection(data) {
      var a = "";
      const app = this;

      $(".t1").each(function(index) {
        var rect = app.getRect($(this));
        if (app.isCross(data, rect)) {
          var b = 0;
          app.xinxi[index]["blockId"] = 1;
          b = $(this).text();
          if (b != "占位") {
            app.xinxi[index].merge = 0;
            $(this).addClass("selected");
          } else {
            $(this).addClass("zhanyong");
            app.xinxi[index].merge = 2;
          }
          app.seat.push(index);
          app.items.push(app.xinxi[index]);
        } else {
          $(this).text("");
          $(this).removeClass("selected");
        }
      });
      this.GLOBAL.baseURL = app.items;
      app.sum = app.items.length;
      app.$emit("showSum", app.sum);
      app.lastSeat = app.seat;
      app.seat = [];
      app.items = [];
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
    sortPerson() {
      var oT1 = document.querySelectorAll(".t1");
      for (var i = 0; i < oT1.length; i++) {
        for (var j = 0; j < this.lastSeat.length; j++) {
          if (i == this.lastSeat[j]) {
            if (this.persons[j].merge == 0) {
              if(this.persons[j]["userUnit"] != null){
                oT1[i].className = oT1[i].className + " choose";
                oT1[i].innerText = this.persons[j]["userUnit"].des;
              }
              
            } else {
              oT1[i].innerText = "占位";
            }
          }
        }
      }
    },
    // 进入时
    // handleDragEnter(e) {
    //   console.log('拖拽进入')
    //   console.log(e.currentTarget);
    //   e.currentTarget.innerText = ''
    // },
    handleDrag(event) {
      this.temp1 = event.currentTarget;
      this.temp2 = event.currentTarget.innerText;
      //   this.temp1 = event.currentTarget.innerText;
    },
    handleDrop(e) {
      e.preventDefault();
      if (!e.currentTarget.innerText) {
        e.currentTarget.innerText = "占位";
        e.currentTarget.className = "zhanyong";
        
      } else {
        this.temp1.innerText = e.currentTarget.innerText;
        e.currentTarget.innerText = this.temp2;
      }
    },
    handleDragOver(e) {
      e.preventDefault();
    },
  
    // 拖拽结束
    // handleDragEnd(){
    //     console.log('拖拽结束');
    // }
        clear(e) {
      e.currentTarget.innerText = ''
      e.currentTarget.className = 't1'
    }
  }
};
</script>

<style scoped>
.dialog {
  width: 100px;
  height: 100px;
  position: absolute;
}
.t1 {
  width: 40px;
  height: 37px;
  margin: 3px;
  font-size: 10px;
  line-height: 30px;
  background-image: url("../../assets/默认空位.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
  border-radius: 25%;
  box-shadow: 5px 5px 10px #000;
}
.selected {
  width: 40px;
  height: 37px;
  margin: 3px;
  font-size: 10px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background-image: url("../../assets/框选中.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.choose {
  width: 40px;
  height: 37px;
  margin: 2px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background-image: url("../../assets/已经有人.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.zhanyong {
  width: 40px;
  height: 37px;
  margin: 2px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background-image: url("../../assets/已经占用但没有人.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.main {
  width: 20%;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>
