<template>
    <div id="kz" style="display: flex">
        <div v-for="index of 5" class="main" :key="index.id">
            <div class="table"></div>
            <div style="display: flex">
                <div class="t1" v-for="index of 6" :key="index.id"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Hello",
    props: {
        txtlist:{
            type:Object,
            default:function () {
            return {
                x1: 370,
                y1: 10,
                x2: 980,
                y2: 490,
            }
            }
        },
        persons:Array,
        options:Object,

    },
    data() {
        return {
            xinxi: [],
            items: [],
            seat: [],
            sort: [],
            sum: 0,
        };
    },
    created() {
        const app = this;
        this.$axios
            .getDistributeData()
            .then((res) => {
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
                    left: startX - width + "px",
                });
            }
            //当鼠标y方向上为向上拖动 设置top位置
            if (y < startY) {
                rector.css({
                    top: startY - height + "px",
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
            deep: true,
        },
        persons: {
            handler: function(newVal, oldVal) {},
            deep: true,
        },
        txtlist:{
            handler:function(newVal,oldVal){
                this.handleRectSelection(this.txtlist)
            },
            deep:true,
        }
    },
    methods: {
        seatSort() {
            var oT1 = document.querySelectorAll(".t1");
            for (var i = 0; i < oT1.length; i++) {
                for (var j = 0; j < this.seat.length; j++) {
                    if (i == this.seat[j]) {
                        var a = "";
                        var r,
                            w = 0;
                        r = Math.ceil((i + 1) / 30);
                        w = parseInt((i + 1) % 30);
                        a = r + "-" + w;
                        oT1[i].innerText = this.options[a];
                        // oT1[i].className += "choose";
                        this.GLOBAL.baseURL[j]["orderMark"] = parseInt(this.options[a]);
                    }
                }
            }
        },
        handleRectSelection(data) {
            var a = "";
            const app = this;
            console.log(data)
            $(".t1").each(function(index) {
                var rect = app.getRect($(this));
                app.xinxi[index]["blockId"] = 1;
                if (app.isCross(data, rect)) {
                    app.seat.push(index);
                    app.items.push(app.xinxi[index]);
                    $(this).addClass("selected");
                } else {
                    $(this).removeClass("selected");
                }
            });
            this.GLOBAL.baseURL = app.items;
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
        sortPerson(){
			var oT1=document.querySelectorAll(".t1");
			for(var i = 0;i<oT1.length;i++){
				
				for (var j=0;j<this.seat.length;j++){
					if(i == this.seat[j]){
						
						var a=""
						var r,w=0;
						r=Math.ceil((i+1)/30)
						w=parseInt((i+1)%30)
						a=r+"-"+w
						oT1[i].innerText=this.persons[j]['userUnit'].des
						
					}
					
				}
			}
		}
    },
};
</script>

<style scoped>
.t1 {
    width: 40px;
    height: 20px;
    margin: 5px;
    background-color: rgb(135, 145, 153);
    text-align: center;
    color: #fff;
}
.selected {
    width: 40px;
    height: 20px;
    margin: 5px;
    text-align: center;
    color: #fff;
    background-color: red;
}
.selects {
    width: 40px;
    height: 20px;
    margin: 5px;
    text-align: center;
    color: #fff;
    background-color: #ff0;
}
.choose {
    background-color: #000088;
}
.table {
    width: 300px;
    height: 30px;
    background-color: rgb(191, 205, 214);
}
.main {
    margin-left: 30px;
    margin-bottom: 20px;
}
</style>
