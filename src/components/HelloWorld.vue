<template>
    <div id="app">
        <div class="gongnengqu">
            <div class="sample">
                <div class="sample-inner">
                    <div class="sample-text">空位:</div>
                    <div class="sample-pic">
                        <img src="../assets/画板 32.png" />
                    </div>
                </div>
                <div class="sample-inner">
                    <div class="sample-text">已有人:</div>
                    <div class="sample-pic">
                        <img src="../assets/画板 34.png" />
                    </div>
                </div>
                <div class="sample-inner">
                    <div class="sample-text">已占用:</div>
                    <div class="sample-pic">
                        <img src="../assets/画板 35.png" />
                    </div>
                </div>
            </div>
            <div class="head_right">
                <div
                    id="reset"
                    draggable="true"
                    :class="{ ownActive: ownStatus }"
                    @click="toggleOwnStatus()"
                    @dragstart="handleDragStart($event)"
                    @dragover.prevent="handleDragOver($event)"
                    @dropstop="handleDrop($event)"
                >
                    {{ this.ownStatus ? "关闭占位" : "开启占位" }}
                </div>
                <div @click="changeVisibility" class="xianshi">
                    {{ this.isShown ? "确定区域" : "选择区域" }}
                </div>
                <div class="quyu">
                    <el-select
                        v-model="index"
                        placeholder="请选择规则"
                        class="section"
                        @change="Sort"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div @click="insertPeople" class="daoru">人员排位</div>
            </div>
        </div>
        <div class="t23">
            已选的座位数：<span style="color:#ef7621;">{{ sums }}</span>
        </div>
        <div @click="toggleUnit()" class="change-person">
            <span class="cg"><img src="../assets/change.png" alt=""/></span
            ><span class="wenzi">{{ showUnit ? "显示人员" : "显示单位" }}</span>
        </div>
        <div class="zhuxitai">
            <div class="zhuxitai-context">
                <span class="mainTai">主席台</span>
            </div>
            <div class="zhuxitai-img">
                <div v-for="index of 10" :key="index" class="zhuxitai-seat">
                    <img src="../assets/画板 32.png" alt />
                </div>
            </div>
        </div>
        <!-- 规则选择 -->
        <!-- <select v-model="index">
          <option value="1">1</option>
          <option value="2">2</option>
        </select> -->
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
        <!-- 人员替换列表 -->
        <div
            class="dialog"
            id="my-table"
            v-show="isshows"
            draggable="true"
            @dragend="onDragendTable($event)"
        >
            <button class="close" @click="closes()">x</button>
            <el-table
                :data="peopleList"
                height="400"
                border
                class="tableList"
                @row-click="replaceInfo($event)"
            >
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="180"
                    align="center"
                ></el-table-column>
            </el-table>
        </div>
        <!-- 座位及过道 -->
        <div class="xstyle">
            <div class="list_wrap">
                <div
                    v-for="(item, index) of charList"
                    @contextmenu.prevent="rightClick($event)"
                    @click="own($event)"
                    :key="item.id"
                    :data-id="index"
                    :data-index="item.id"
                    :data-type="item.type"
                    :unit="'单位'"
                    :name="'姓名'"
                    class="grid"
                    :class="{ guodao: item.type != 1 }"
                    draggable="true"
                    @dragstart="onDragstart($event)"
                    @dragend="onDragend($event)"
                    @drop="onDrop($event)"
                    @dragover="onDragover($event)"
                ></div>
            </div>
        </div>
        <!-- 右键菜单 -->
        <div v-show="menuVisible">
            <ul id="menu" class="menu">
                <li class="menu__item" @click="rcReset()">移除</li>
                <li class="menu__item" @click="rcOwn()">占位</li>
                <li class="menu__item" @click="replacePeople($event)">替换</li>
            </ul>
        </div>
    </div>
</template>
<script>
import Hello from "./com/kuang.vue";
import children from "./com/children.vue";
import { HappyScroll } from "vue-happy-scroll";
import menu from "./com/menu.vue";
export default {
    data() {
        return {
            width: 980,
            height: 490,
            x: 0,
            y: 0,
            peopleName: "",
            xlist: [],
            idxList: [],
            sec: null,
            index: "",
            option: {},
            sums: 0,
            persons: [],
            charList: [],
            txtList: {
                x1: 370,
                y1: 200,
                x2: 950,
                y2: 490,
            },
            peopleList: [],
            isShown: false,
            isshows: false,
            flag: 1,
            menuVisible: false,
            ownStatus: false, // 占位按钮开关状态,
            xinxi: [],
            seat: [],
            replaceId: "", //替换ID
            replaceIndex: 0, //替换索引
            lastSeat: [],
            lastXinxi: [],
            indexList: [],
            lastIndex: [],
            newPersons: [],
            row:0,
            col:0,
            blockId: 0,
            sortMessage: [],
            sortIndex: [],
            unit: "", // 单位
            showUnit: false, // 显示单位按钮
            options: [
                {
                    value: "1",
                    label: "规则1",
                },
                {
                    value: "2",
                    label: "规则2",
                },
            ],
            value: "",
            dataIndex: "", // 保存要操作对象的索引值
        };
    },
    components: {
        Hello,
        children,
        HappyScroll,
        menu,
    },
    created() {
        this.$axios
            .getDistributeData()
            .then((res) => {
                this.charList = res.data.data.confSeats;
                this.row=res.data.data.row;
                this.col=res.data.data.col;
                
                this.changeClass()
                
            })
            .catch(function(res) {
                console.log(res.data);
            });
        this.$axios
            .getNoPeople()
            .then((res) => {
                this.peopleList = res.data.data;
                
            })
            .catch(function(res) {
                console.log(res.data);
            });

        
        
            
    },
    mounted: function() {
        
    },
    methods: {
        changeClass(){
            let aa = document.querySelector('.list_wrap')
            aa.style.gridTemplateColumns = 'repeat('+this.col+', auto)'
            aa.style.gridTemplateRows = 'repeat('+this.row+', auto)'
        },
        //拖动人员列表
        onDragendTable(e) {
            let obj = document.querySelector("#my-table");
            obj.style.left = e.x + "px";
            obj.style.top = e.y + "px";
        },
        //获取对象在数组的索引值
        replacePeople(e) {
            this.isshows = true;
            for (let i in this.charList) {
                if (this.dataIndex == this.charList[i].id) {
                    this.replaceIndex = i;
                    // console.log("22", i);
                }
                // console.log(this.charList[i].id);
            }
        },
        //保存替换人员姓名的变量
        replaceInfo(e) {
            this.flag = 2;
            this.charList[this.replaceIndex].userUnit = e;
            console.log(this.charList[this.replaceIndex].userUnit);
            this.charList.splice(this.replaceIndex, 1, this.charList[this.replaceIndex]);
            this.sortPerson();
            console.log(this.charList);
            this.isshows = false;
        },
        //初次拖动获取 拖动的索引id
        onDragstart(event) {
            if (event.target.getAttribute("data-type") == 1) {
                this.stargindex = event.target.getAttribute("data-id");
            }
            // console.log(this.stargindex);
        },
        //经过容器内部
        onDragover(event) {
            event.preventDefault();
        },
        //鼠标落下获取其容器的id
        onDrop(event) {
            if (event.target.getAttribute("data-type") == 1) {
                this.endIndex = event.target.getAttribute("data-id");
            }
            // console.log(this.endIndex);
        },
        //完成拖动实现交换数组
        onDragend(event) {
            if (this.endIndex != null && this.stargindex != null) {
                let StartObj = this.charList[this.stargindex];
                let EndObj = this.charList[this.endIndex];
                this.charList.splice(this.endIndex, 1, StartObj);
                this.charList.splice(this.stargindex, 1, EndObj);
            }
        },
        closes() {
            this.isshows = false;
        },
        //修改弹窗状态
        handleType(payload, closename) {
            this.isshows = payload;
            this.peopleName = closename;
        },
        // 框选方法
        handleRectSelection(data) {
            var a = 0;
            const app = this;
            $(".grid").each(function(index) {
                var rect = app.getRect($(this));
                if (app.isCross(data, rect)) {
                    //console.log($(this).attr('data-index'));
                    var b = 0;
                    b = $(this).text();
                    if ($(this).attr("data-type") == 1) {
                        if (b != "占位") {
                            app.charList[index].merge = 0;
                            $(this).addClass("selected");
                        } else {
                            $(this).addClass("zhanyong");
                            app.charList[index].merge = 2;
                        }
                    } else {
                        app.charList[index].merge = 0;
                    }
                    if ($(this).attr("data-type") == 1) {
                        a = a + 1;
                    }
                    app.indexList.push($(this).attr("data-index"));
                    app.seat.push(index);
                    app.xinxi.push(app.charList[index]);
                } else {
                    //$(this).text("");
                    $(this).removeClass("selected");
                }
            });
            app.lastSeat = app.seat;
            app.lastXinxi = app.xinxi;
            app.lastIndex = app.indexList;
            app.seat = [];
            app.xinxi = [];
            app.indexList = [];
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

        onDragstop(x, y, width, height) {
            this.txtList.x1 = x + 10;
            this.txtList.y1 = y + 210;
            this.txtList.y2 = y + this.height + 180;
            this.txtList.x2 = x + this.width - 10;
            this.handleRectSelection(this.txtList);
        },
        onResizstop(x, y, width, height) {
            this.txtList.x1 = x + 10;
            this.txtList.y1 = y + 210;
            this.txtList.x2 = x + this.width - 10;
            this.txtList.y2 = y + this.height + 180;
            this.handleRectSelection(this.txtList);
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
                age: 5,
            };
            console.log(111, this.test);
        },
        Sort: function() {
            // this.isShown = false;
            this.sortMessage = [];
            const app = this;
            var oT1 = document.querySelectorAll(".grid");
            if (JSON.stringify(app.lastXinxi) == "[]") {
                app.lastXinxi = app.charList;
                for (var i = 0; i < app.lastXinxi.length; i++) {
                    if (oT1[i].innerText != "占位") {
                        app.lastXinxi[i]["merge"] = 0;
                    } else {
                        app.lastXinxi[i]["merge"] = 2;
                    }
                    app.lastXinxi[i]["blockId"] = 1;
                    app.lastSeat.push(i);
                    app.sortIndex.push(i);
                    app.sortMessage.push(app.lastXinxi[i]);
                    app.lastIndex.push(app.lastXinxi[i].id);
                }
            } else {
                app.blockId = app.blockId + 1;
                for (var i = 0; i < app.lastXinxi.length; i++) {
                    app.lastXinxi[i]["blockId"] = app.blockId;
                    app.sortMessage.push(app.lastXinxi[i]);
                    app.sortIndex.push(app.lastSeat[i]);
                }
                // console.log(app.sortMessage);
            }
            let data = {
                confSeatList: app.lastXinxi,
                sortType: app.index,
            };
            this.$axios
                .getSort(data)
                .then((res) => {
                    app.option = res.data.data;
                    this.seatSort();
                })
                .catch((err) => {});
        },
        // 排序
        seatSort() {
            var a = 0;
            var oT1 = document.querySelectorAll(".grid");
            // console.log(oT1.attributes.data-type.nodeValue)
            for (var i = 0; i < oT1.length; i++) {
                // console.log(i)
                for (var j = 0; j < this.lastSeat.length; j++) {
                    // console.log(j);
                    if (i == this.lastSeat[j]) {
                        // console.log(`${i}-${j}`)
                        // console.log( oT1[0].attributes['data-type']);
                        var dataType = oT1[i].getAttribute("data-type");
                        // console.log(oT1[0].attributes['data-type'].substring(5,6))
                        if (dataType == 1) {
                            // console.log(`${i}-${j}`)
                            // console.log(this.option[this.lastIndex[j]])
                            this.lastXinxi[j].orderMark = null;
                            if (oT1[i].innerText != "占位") {
                                if (this.option[this.lastIndex[j]] != null) {
                                    oT1[i].innerText = this.option[this.lastIndex[j]];
                                    this.lastXinxi[j].orderMark = this.option[this.lastIndex[j]];
                                    oT1[i].className = "grid selected";
                                } else {
                                    oT1[i].innerText = "";
                                    oT1[i].className = "grid";
                                }
                            } else {
                                oT1[i].innerText = "占位";
                                oT1[i].className = "grid zhanyong";
                            }
                        }
                    }
                }
            }
        },
        insertPeople() {
            let data = {
                blocks: [
                    {
                        id: 1,
                        num: 1,
                    },
                ],
                confSeats: this.sortMessage,
            };
            this.$axios
                .getPeople(data)
                .then((res) => {
                    // let { confSeats } = res.data.data;
                    // //合并两个数组
                    // this.persons.push(...confSeats);
                    // //去重
                    // let arr3 = [...new Set(this.persons)];
                    // console.log(arr3);
                    // // this.persons.push(res.data.data.confSeats);
                    // // console.log(this.persons);

                    this.persons = res.data.data.confSeats;
                    this.flag = 1;
                    this.sortPerson();
                })
                .catch((err) => {});
        },
        sortPerson() {
            var a = 0;
            var oT1 = document.querySelectorAll(".grid");
            this.persons.forEach((item) => {
                // console.log(item);
                let attr = `div[data-index='${item.id}']`;
                let obj = document.querySelector(attr);
                let index = parseInt(obj.getAttribute("data-id"));
                this.idxList.push(index);
            });
            if (this.flag == 1) {
                for (let i of this.idxList) {
                    for (let j in this.persons) {
                        if (this.charList[i].id == this.persons[j].id) {
                            this.charList[i].userUnit = this.persons[j].userUnit;
                            if (this.persons[j].userUnit != null) {
                                a++;
                            }
                        }
                    }
                }
                this.sums = this.sums + a;
            }

            for (var k = 0; k < oT1.length; k++) {
                if (this.charList[k].userUnit) {
                    oT1[k].innerText = this.charList[k].userUnit.name;
                    oT1[k].setAttribute("name", this.charList[k]["userUnit"].name);
                    oT1[k].setAttribute("unit", this.charList[k]["userUnit"].unitName);
                    oT1[k].className = "grid choose";
                }
            }
            this.index = "";
        },
        changeVisibility() {
            this.isShown = !this.isShown;
        },
        // 拖拽开始
        handleDragStart() {
            //   this.dragging = item;
        },
        // 实现右键菜单
        rightClick(e) {
            console.log("rightClick");
            this.dataIndex = e.currentTarget.getAttribute("data-index");
            console.log(this.dataIndex);
            this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
            this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
            var menu = document.querySelector("#menu");
            this.styleMenu(menu);
        },
        foo() {
            // 取消鼠标监听事件 菜单栏
            this.menuVisible = false;
            document.removeEventListener("click", this.foo); // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
        },
        styleMenu(menu) {
            if (event.clientX > 1800) {
                menu.style.left = event.clientX - 100 + "px";
            } else {
                menu.style.left = event.clientX + 1 + "px";
            }
            document.addEventListener("click", this.foo); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
            if (event.clientY > 700) {
                menu.style.top = event.clientY - 30 + "px";
            } else {
                menu.style.top = event.clientY - 10 + "px";
            }
        },
        doubleClick(e) {
            console.log(e);
        },
        // 右键菜单重置
        rcReset() {
            let attr = `div[data-index='${this.dataIndex}']`;
            let obj = document.querySelector(attr);
            obj.innerText = "";
            obj.className = "grid";
        },
        // 占位和人员替换
        own(e) {
            if (e.target.getAttribute("data-type") == 1) {
                if (this.ownStatus) {
                    e.currentTarget.innerText = "占位";
                    e.currentTarget.className = "grid zhanyong";
                } else {
                    let id = e.target.getAttribute("data-index");
                    for (let ids in this.persons) {
                        if (this.persons[ids].id == id) {
                            if (this.peopleName) {
                                e.currentTarget.innerText = this.peopleName;
                                e.currentTarget.className = "grid choose";
                                this.persons[ids].userUnit.name = this.peopleName;
                                this.persons[ids] = Object.assign({}, this.persons[ids]);
                                console.log(this.peopleName);
                            }
                            this.peopleName = "";
                        }
                    }
                }
            }
        },
        // 切换占位按钮样式
        toggleOwnStatus() {
            this.ownStatus = !this.ownStatus;
            console.log(this.ownStatus);
        },
        // 离开时隐藏单位
        hideUnit() {
            console.log("leave");
        },
        // 点击切换座位与人员
        toggleUnit() {
            this.showUnit = !this.showUnit;
            // console.log(document.querySelectorAll('.selected'));
            let objSelected = document.querySelectorAll(".choose");
            if (this.showUnit) {
                objSelected.forEach((element) => {
                    element.innerText = element.getAttribute("unit");
                });
            } else {
                objSelected.forEach((element) => {
                    element.innerText = element.getAttribute("name");
                });
            }
        },
        // 右键菜单占位
        rcOwn() {
            let attr = `div[data-index='${this.dataIndex}']`;
            let obj = document.querySelector(attr);
            obj.innerText = "占位";
            obj.className = "grid zhanyong";
        },
    },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../assets/css/var.less";
//表格样式
.tableList {
    font-size: 18px;
    text-align: center;
}
// 示例样式 开始
.gongnengqu {
    width: 100%;
    // position: relative;
    // padding-right:-50px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    .head_right {
        margin-top: 10px;
        display: flex;
    }
}
.sample {
    .sample-inner:nth-child(2),
    .sample-inner:nth-child(3) {
        padding-left: 30px;
        display: flex;
        line-height: 40px;
    }
    .sample-inner:nth-child(1) {
        padding-left: 10px;
        display: flex;
        line-height: 40px;
    }
    .sample-inner {
        .sample-text {
            color: @sample-text-color;
            margin-right: 10px;
        }
        .sample-text:nth-child(1) {
            margin-left: 10px;
        }
        .sample-pic img {
            width: 40px;
            height: 40px;
        }
    }
}
// 示例样式 结束
.close {
    position: absolute;
    left: 180px;
    width: 25px;
    z-index: 999;
}
.section {
    width: 120px;
    background-color: #e6edf4 !important;
}
.dialog {
    position: absolute;
    background-color: white;
    /* background-color: white; */
    top: 110px;
    left: 20px;
    border: 1px solid black;
    z-index: 100px;
}
// 框选中的样式
.selected {
    background-image: url("../assets/画板 33.png") !important;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.zhuxitai {
    width: 550px;
    margin: 0 auto;
    margin-top: 30px;
}
.zhuxitai .zhuxitai-img {
    display: flex;
}
.zhuxitai-seat img {
    width: 55px;
    height: 55px;
}
.zhuxitai-context {
    width: 100%;
    text-align: center;
}
.mainTai {
    line-height: 48px;
    font-size: 26px;
}
// 导入数据后的样式
.choose {
    width: 49px;
    height: 50px;
    margin-bottom: 20px;
    background-image: url("../assets/画板 34.png") !important;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.zhanyong {
    width: 49px;
    height: 50px;
    margin-bottom: 20px;
    background-image: url("../assets/画板 35.png") !important;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.sample {
    display: flex;
    position: relative;
    width: 30%;
    margin-top: 10px;
}
#app {
    background-color: #e6edf4;
    width: 100%;
    height: 100%;
    // border: 1px solid black;
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
.xianshi {
    width: 115px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    background-image: url("../assets/画板 36.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #000;
    margin-right: 20px;
}
.change-person {
    position: absolute;
    top: 220px;
    right: 42px;
    width: 115px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #000;
}
.change-person span:nth-child(1) img {
    margin-right: 10px;
}
.change-person .wenzi {
    font-weight: bold;
    color: rgb(0, 103, 165);
}
.quyu {
    z-index: 999;
    width: 115px;
    height: 30px;
    text-align: center;
    line-height: 35px;
    background-image: url("../assets/画板 36.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #000;
    margin-right: 20px;
}
.daoru {
    width: 115px;
    height: 35px;
    z-index: 998;
    text-align: center;
    line-height: 35px;
    background-image: url("../assets/画板 36.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #000;
    margin-right: 40px;
}
.t23 {
    position: absolute;
    top: 15px;
    left: 27%;
    font-size: 20px;
    color: #000;
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
    /* -webkit-user-select: none; */
    -webkit-user-drag: none;
}
.draging {
    background-color: aquamarine;
}
* {
    cursor: default;
}
.xstyle {
    /* display: flex;
    flex-direction: row;
    flex-wrap: wrap; */
    width: calc(100% - 76px);
    padding: 20px;
    .list_wrap {
        //  margin-top: 100px;
        //  border: 1px solid black;
        width: 100%;
        height: 600px;
        overflow-x: scroll;
        display: grid;
        margin: 3rem 0 0 0;
        padding: 0 1rem 0 1rem;
        
        background-color: #e6edf4;
    }
}
.grid {
    cursor: grab;
    width: 55px;
    height: 55px;
    color: black;
    text-align: center;
    margin-bottom: 20px;
    background-image: url("../assets/画板 32.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.guodao {
    width: 20px;
    height: 50px;
    margin-bottom: 20px;
    box-sizing: border-box;
    background: #e6edf4;
}
.hello1 {
    padding-left: 30px;
    margin-top: 100px;
}
.dragging1 {
    position: absolute;
    border: 6px solid gray;
    color: #000;
}
#reset {
    width: 115px;
    height: 35px;
    line-height: 40px;
    text-align: center;
    background-image: url("../assets/画板 36.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 20px;
    color: #000;
}
/* 右键菜单样式 */
.menu__item {
    display: block;
    line-height: 20px;
    text-align: center;
    margin: 10px;
    cursor: default;
}
.menu__item:hover {
    color: #ff0000;
}
.menu {
    height: auto;
    width: auto;
    position: absolute;
    font-size: 14px;
    text-align: left;
    border-radius: 10px;
    border: 1px solid #c1c1c1;
    background-color: #ffffff;
    padding-left: 0;
}
li:hover {
    background-color: #e0e0e2;
    color: white;
}
/* 右键菜单样式 结束 */
/* 重置按钮 */
.ownActive {
    background-image: url("../assets/画板 37.png") !important;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #fff !important;
}
// 选中样式
</style>
