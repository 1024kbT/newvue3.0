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
        <div class="quyu">
          <el-select
            v-model="index2"
            placeholder="请选择布局"
            class="section2"
            @change="newdistributions"
          >
            <el-option
              v-for="item in distributions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-upload
          class="upload-demo"
          ref="upload"
          action
          :show-file-list="false"
          :http-request="devUpload"
          multiple
          :limit="1"
        >
          <el-button size="medium " type="primary">点击上传</el-button>
        </el-upload>
        <div
          v-if="secshow"
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
        <div class="xianshi" @click="showArea" v-if="secshow">
          {{ this.isShown1 ? "确定区域" : "选择区域" }}
        </div>
        <div class="quyu" v-if="secshow">
          <el-select
            v-model="index1"
            placeholder="请选择规则"
            class="section"
            @change="Sort"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </div>
        <div style="margin-left: 10px" v-if="secshow">
          <el-select
            v-model="index3"
            placeholder="请选择排序模板"
            class="section3"
            @change="changeSort"
          >
            <el-option
              v-for="item in sortMudle"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div @click="insertPeople" class="daoru" v-if="aresshow">人员排位</div>
        <el-button
          type="primary"
          @click="saveModlu"
          style="height: 40px"
          v-if="secshow"
          >保存排序模板</el-button
        >
        <el-button
          type="primary"
          @click="saveCofe"
          style="height: 40px"
          v-if="thireshow"
          >保存会议室流程</el-button
        >
      </div>
    </div>
    <div class="t23">
      已选的座位数：
      <span style="color: #ef7621">{{ sums }}</span>
    </div>
    <div @click="toggleUnit()" class="change-person">
      <span class="cg">
        <img src="../assets/change.png" alt />
      </span>
      <span class="wenzi">{{ showUnit ? "显示人员" : "显示单位" }}</span>
    </div>
    <div class="zhuxitai">
      <div class="zhuxitai-context">
        <span class="mainTai">主席台</span>
      </div>
    </div>
    <!-- 规则选择 -->
    <!-- <select v-model="index">
          <option value="1">1</option>
          <option value="2">2</option>
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
    <!-- 人员替换列表 -->

    <!-- 座位及过道 -->
    <div class="xstyle">
      <el-button
        @click="drawer = true"
        type="primary"
        style="position: absolute"
        v-if="secshow"
        >点我打开</el-button
      >
      <el-drawer title="人员列表" :visible.sync="drawer" :direction="direction">
        <el-button type="primary" @click="dialogVisible = true"
          >新增人员</el-button
        >
        <ul>
          <li
            v-for="(item, index) in this.exportPeople"
            class="lists"
            :key="item.index"
            :data-id="index"
            :data-status="item.status"
            draggable="true"
            @click="replaceInfo($event)"
            @dragstart="onLiDragstart($event)"
            @dragend="onLiDragend($event)"
            @drop="onLiDrop($event)"
            @dragover="onLiDragover($event)"
          >
            {{ index }}--
            {{ item.username == "" ? item.unitName : item.username }}
            {{ item.status == 1 ? "未排序" : "已排序" }}
          </li>
        </ul>
      </el-drawer>
      <el-button
        @click="changeVisibility"
        type="primary"
        style="position: absolute; left: 150px"
        v-show="isShown1"
        >{{ !this.isShown ? "显示选框" : "隐藏选框" }}</el-button
      >
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
        <li class="menu__item" @click="rcReset()">清空</li>
        <li class="menu__item" @click="rcOwn()">占位</li>
        <li class="menu__item" @click="addPeople($event)">插入</li>
        <li class="menu__item" @click="replacePeople($event)">替换</li>
        <li class="menu__item" @click="deletePeople($event)">删除</li>
      </ul>
    </div>
    <!-- 新增人员弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="人员名称">
          <el-input
            v-model="form.username"
            placeholder="请输入人员名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位名称">
          <el-input
            v-model="form.unitName"
            placeholder="请输入单位名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员职位">
          <el-input
            v-model="form.position"
            placeholder="请输入人员职位"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
            v-model="form.phoneNum"
            placeholder="请输入联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 保存模板弹窗 -->
    <el-dialog
      title="保存排序模板"
      :visible.sync="dialogVisible1"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <span>请填写模板名称:</span
        ><input type="text" v-model="name" class="input" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="saveName()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 保存模板弹窗 -->
    <el-dialog
      title="保存会议流程"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <span>请填写会议流程名称:</span
        ><input type="text" v-model="name1" class="input" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="saveCofes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HappyScroll } from "vue-happy-scroll";
import menu from "./com/menu.vue";
export default {
  data() {
    return {
      width: 980,
      height: 490,
      x: 0,
      y: 0,
      //第二步显示
      secshow: false,
      //第三部显示
      thireshow: false,
      peopleName: "",
      //新增用户表单
      form: {
        username: "",
        unitName: "",
        position: "",
        phoneNum: null,
      },
      //新增弹窗显示
      dialogVisible1: false,
      dialogVisible2: false,
      //excel导入的人员列表
      exportPeople: [],
      drawer: false,
      direction: "rtl",
      //新增后人员列表
      addList: [],
      xlist: [],
      idxList: [],
      sec: null,
      index1: "",
      index2: "",
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
      dialogVisible: false,
      name: "",
      //流程名称
      name1: "",
      menuVisible: false,
      ownStatus: false, // 占位按钮开关状态,
      xinxi: [],
      seat: [],
      replaceId: "", //替换ID
      replaceIndex: 0, //替换索引
      //规则显示
      aresshow: false,
      stargindex: 0,
      //座位索引
      endIndex: 0,
      StrartId: 0,
      //列表索引
      //会议室编号
      conferenceId: "",
      //布局编号
      confLayoutId: "",

      endId: 0,
      lastSeat: [],
      lastXinxi: [],
      indexList: [],
      lastIndex: [],
      newPersons: [],
      row: 8,
      col: 34,
      blockId: 0,
      flag1: 1,
      sortMessage: [],
      sortIndex: [],
      unit: "", // 单位
      showUnit: false, // 显示单位按钮
      options: [],
      distributions: [],
      dataIndex: "", // 保存要操作对象的索引值
      xinXinxi: [],
      xinSeat: [],
      xinIndex: [],
      length: 0,
      confID: "1412656941364285440",
      charLists: [],
      isShown1: false,
      delList: [],
      sortMudle: [],
      sortMudles: [],
      index3: "",
      tets: [],
      //保存所有的排序规则
      lastSortMessage: [],
    };
  },
  components: {
    HappyScroll,
    menu,
  },
  created() {
    let data = { conferenceId: this.confID };
    this.$axios
      .getDistributeData(data)
      .then((res) => {
        this.charLists = res.data.data;
        for (var i = 0; i < this.charLists.length; i++) {
          let option = {
            value: i + "",
            label: this.charLists[i].confLayoutName,
          };
          this.conferenceId = res.data.data[i].id;
          this.distributions.push(option);
        }
        this.newdistributions(1);
      })
      .catch(function (res) {
        console.log(res.data);
      });
    //查询所有规则
    this.$axios.getSortList().then((res) => {
      for (let i in res.data.data) {
        this.options.push(res.data.data[i]);
      }
      console.log(this.options);
    });
  },
  mounted: function () {},
  methods: {
    //选择排序模板
    showMudle() {
      let data = {
        layoutId: this.confLayoutId,
      };

      this.$axios
        .getSortMudle(data)
        .then((res) => {
          console.log(res.data.data);
          for (var i = 0; i < res.data.data.length; i++) {
            let option = {
              value: i + "",
              label: res.data.data[i].name,
            };
            this.sortMudle.push(option);
          }
          this.sortMudles = res.data.data;
        })
        .catch((err) => {});
    },
    changeSort() {
      this.aresshow = true;
      this.xinXinxi = this.sortMudles[this.index3].confSeatVoList;
      this.seatSort(1);
    },
    //新增人员
    submit() {
      this.dialogVisible = false;
      let data = {
        username: this.form.username,
        unitName: this.form.unitName,
        position: this.form.position,
        phoneNum: this.form.phoneNum,
        status: 1,
      };
      this.exportPeople.push(data);
      this.form = {};
      this.$refs["form"].resetFields();
    },
    addPeople(e) {
      this.flag = 5;
      this.drawer = true;
    },
    //侧边栏拖动
    //初次拖动获取 拖动的索引id
    onLiDragstart(event) {
      if (event.target.getAttribute("data-status") == 1) {
        this.StrartId = event.target.getAttribute("data-id");
      }
    },
    //经过容器内部
    onLiDragover(event) {
      event.preventDefault();
    },
    //鼠标落下获取其容器的id
    onLiDrop(event) {
      if (event.target.getAttribute("data-status") == 1) {
        this.endId = event.target.getAttribute("data-id");
      }
    },
    //完成拖动实现交换数组
    onLiDragend(event) {
      if (this.endId != null && this.StrartId != null) {
        let StartObj = this.exportPeople[this.StrartId];
        let EndObj = this.exportPeople[this.endId];
        this.exportPeople.splice(this.endId, 1, StartObj);
        this.exportPeople.splice(this.StrartId, 1, EndObj);
      }
    },
    //控制侧边栏
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //上传文件
    devUpload(file) {
      this.secshow = true;
      let param = new FormData();
      param.append("file", file.file);
      this.$axios
        .getPeoples(param)
        .then((res) => {
          this.exportPeople = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message("这是一条消息提示");
        });
      this.$refs.upload.clearFiles();
    },
    //上串人员列表
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log("11", file);
    },
    //保存会议室流程
    saveCofe() {
      this.dialogVisible2 = true;
    },
    saveCofes() {
      let index = 0;
      if (parseInt(this.index2)) {
        index = parseInt(this.index2);
      }
      this.charLists[index].confLayoutVo = this.charList;
      delete this.charLists[index].seatList;
      let data = {
        pcOrPhone: 1,
        processName: this.name1,
        confLayoutId: this.confLayoutId,
        conferenceId: this.conferenceId,
        confSeatVoList: this.charLists[index].confLayoutVo,
        sortOrgVoLastList: this.exportPeople,
      };

      this.$axios.saveConference(data).then((res) => {
        console.log(res);
      });
      this.dialogVisible2 = false;
    },
    //保存模板
    saveModlu() {
      this.dialogVisible1 = true;
    },
    saveName() {
      let index = 0;
      if (!parseInt(this.index2)) {
        index = 0;
      } else {
        index = parseInt(this.index2);
      }
      let data = {
        confLayoutId: this.charLists[index].conferenceId,
        confSeatVoList: this.lastSortMessage,
        conferenceId: this.charLists[index].id,
        name: this.name,
      };
      this.$axios
        .postMould(data)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {});
      this.dialogVisible1 = false;
    },
    //删除人员 获取新的数组
    deletePeople() {
      this.flag = 4;
      let data = {
        confSeatVoList: this.charList,
        seatNum: this.dataIndex,
      };
      console.log("删除时的数组", this.charList);
      this.charList[this.replaceIndex].sortOrgVo.status = 1;

      this.exportPeople.push(this.charList[this.replaceIndex].sortOrgVo);
      this.$axios.getDeleteList(data).then((res) => {
        this.delList = res.data.data.confSeatVoList;
        console.log(res);
        this.sortPerson();
      });
    },
    showArea() {
      this.isShown1 = !this.isShown1;

      if (this.isShown1 == false && this.isShown == true) {
        this.changeVisibility();
      } else {
        this.aresshow = true;
      }
    },
    changeClass() {
      let aa = document.querySelector(".list_wrap");
      aa.style.gridTemplateColumns = "repeat(" + this.col + ", auto)";
      aa.style.gridTemplateRows = "repeat(" + this.row + ", auto)";
    },
    //拖动人员列表
    onDragendTable(e) {
      let obj = document.querySelector("#my-table");
      obj.style.left = e.x + "px";
      obj.style.top = e.y + "px";
    },
    //获取对象在数组的索引值
    replacePeople(e) {
      this.drawer = true;
      this.flag = 2;
    },
    //保存替换人员姓名的变量
    replaceInfo(e) {
      let exportId = e.target.getAttribute("data-id");
      if (this.flag != 5) {
        let repVo = this.charList[this.replaceIndex].sortOrgVo;
        repVo.status = 1;
        this.charList[this.replaceIndex].sortOrgVo = this.exportPeople[
          exportId
        ];
        this.charList.splice(
          this.replaceIndex,
          1,
          this.charList[this.replaceIndex]
        );
        this.exportPeople.splice(exportId, 1, repVo);
        this.sortPerson();
        this.drawer = false;
      } else {
        //获取插入人员信息
        let repVo = this.exportPeople[exportId];
        let data = {
          confSeatNum: this.dataIndex,
          confSeatVoList: this.charList,
          sortOrgVo: repVo,
        };
        this.$axios.getAddList(data).then((res) => {
          //删除插入人员在人员列表的信息
          this.exportPeople.splice(exportId, 1);
          //把排出人员加入未排序人员列表
          if (res.data.data.sortOrgVoOut) {
            res.data.data.sortOrgVoOut.status = 1;
            this.exportPeople.push(res.data.data.sortOrgVoOut);
          }

          this.addList = res.data.data.confSeatVoList;
          this.sortPerson();
          this.drawer = false;
        });
      }
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
      console.log(this.endIndex);
    },
    //完成拖动实现交换数组
    onDragend(event) {
      if (this.endIndex && this.stargindex) {
        // // let temp = {};
        let temp = JSON.parse(
          JSON.stringify(this.charList[this.stargindex].sortOrgVo)
        );
        this.charList[this.stargindex].sortOrgVo = JSON.parse(
          JSON.stringify(this.charList[this.endIndex].sortOrgVo)
        );

        this.charList[this.endIndex].sortOrgVo = JSON.parse(
          JSON.stringify(temp)
        );
        // console.log(temp);
        let StartObj = this.charList[this.stargindex];
        let EndObj = this.charList[this.endIndex];
        console.log(
          this.charList[this.stargindex].sortOrgVo,
          this.charList[this.endIndex].sortOrgVo
        );

        this.charList.splice(this.stargindex, 1, StartObj);
        this.charList.splice(this.endIndex, 1, EndObj);
        this.tets = this.charList;
        this.flag = 9;
        this.sortPerson();
      }
    },
    closes() {
      this.isshows = false;
    },
    //修改弹窗状态
    //选择布局
    newdistributions(index) {
      for (var i = 0; i < this.charLists.length; i++) {
        if (this.index2 == i) {
          let data = {
            conferenceId: this.charLists[i].conferenceId,
            confLayoutId: this.charLists[i].id,
          };
          this.$axios
            .getNewDistributions(data)
            .then((res) => {
              this.confLayoutId = res.data.data.id;
              this.charList = res.data.data.confLayoutVo.confSeatVoList;
              this.col = res.data.data.confLayoutVo.col;
              this.row = res.data.data.confLayoutVo.row;
              this.changeClass();
              this.showMudle();
            })
            .catch(function (res) {
              console.log(res.data);
            });
        }
      }
      if (index == 1) {
        this.index2 = this.distributions[0].label;
      }
    },
    // 框选方法
    handleRectSelection(data) {
      var a = 0;
      const app = this;
      this.flag1 = 2;
      $(".grid").each(function (index) {
        var rect = app.getRect($(this));
        if (!app.charList[index].selected) {
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
      //  $(document).on('touchmove',function(e){
      //   e.preventDefault();
      // })
      this.txtList.x1 = x + 10;
      this.txtList.y1 = y + 210;
      this.txtList.y2 = y + this.height + 180;
      this.txtList.x2 = x + this.width - 10;
      this.handleRectSelection(this.txtList);
    },
    onResizstop(x, y, width, height) {
      //  $(document).on('touchmove',function(e){
      //   e.preventDefault();
      // })
      this.txtList.x1 = x + 10;
      this.txtList.y1 = y + 210;
      this.txtList.x2 = x + this.width - 10;
      this.txtList.y2 = y + this.height + 180;
      this.handleRectSelection(this.txtList);
    },
    onResize: function (x, y, width, height) {
      //  $(document).on('touchmove',function(e){
      //   e.preventDefault();
      // })
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    onDrag: function (x, y) {
      // $(document).on('touchmove',function(e){
      //   e.preventDefault();
      // })
      this.x = x;
      this.y = y;
    },
    showSums(data) {
      this.sums = data;
    },
    setChildren() {
      this.test = {
        name: "lisi",
        age: 5,
      };
    },
    Sort: function () {
      // this.isShown = false;
      var app = this;
      console.log(app.xinXinxi);
      if (app.flag1 == 2) {
        app.blockId += 1;
        for (var i = 0; i < app.xinXinxi.length; i++) {
          app.xinXinxi[i]["blockId"] = app.blockId;
        }
      } else {
        app.xinXinxi = app.charList;
        for (var i = 0; i < app.xinXinxi.length; i++) {
          app.xinXinxi[i]["blockId"] = 1;
        }
      }
      let data = {
        confSeatList: app.xinXinxi,
        sortType: app.index1 + 1,
        rostrumFace: 1,
      };
      this.$axios
        .getSort(data)
        .then((res) => {
          if (res.data.code == "200") {
            app.xinXinxi = res.data.data;
            this.seatSort(2);
          } else {
            alert(res.data.data);
          }
        })
        .catch((err) => {});
    },
    // 排序
    seatSort(index) {
      //   this.sortMessage = [];
      var oT1 = document.querySelectorAll(".grid");
      if (index != 2) {
        for (var i = 0; i < oT1.length; i++) {
          if (this.charList[i].type == 1) {
            oT1[i].innerText = "";
            oT1[i].className = "grid";
          }
        }
      }
      for (var i = 0; i < oT1.length; i++) {
        for (var j = 0; j < this.xinXinxi.length; j++) {
          if (this.charList[i].type == 1) {
            if (this.charList[i].id == this.xinXinxi[j].id) {
              if (this.xinXinxi[j].merge == 0) {
                if (this.xinXinxi[j].orderMark != null) {
                  oT1[i].className = "grid selected";
                  oT1[i].innerText = this.xinXinxi[j].orderMark;
                  this.sortMessage.push(this.xinXinxi[j]);
                  this.lastSortMessage.push(this.xinXinxi[j]);
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
      this.xinXinxi = [];
    },
    insertPeople() {
      this.thireshow = true;
      let data = {
        sortOrgVoList: this.exportPeople,
        confLayoutVo: { confSeatVoList: this.sortMessage },
      };
      this.$axios
        .getPeople(data)
        .then((res) => {
          console.log(res.data);
          if (res.data.code == "200") {
            let person = res.data.data.sortOrgVoList;
            this.exportPeople = [];
            for (var i = 0; i < person.length; i++) {
              if (person[i].status == 1) {
                this.exportPeople.push(person[i]);
              }
            }
            this.persons = res.data.data.confLayoutVo.confSeatVoList;
            for (var i = 0; i < this.persons.length; i++) {
              this.newPersons.push(this.persons[i]);
            }
            this.flag = 1;
            this.sortMessage = [];
            this.sortPerson();
          } else if (res.data.code == "400") {
            alert(res.data.data);
          }
        })
        .catch((err) => {});
    },
    sortPerson() {
      var a = 0;
      var oT1 = document.querySelectorAll(".grid");
      this.persons.forEach((item) => {
        let attr = `div[data-index='${item.id}']`;
        let obj = document.querySelector(attr);
        let index = parseInt(obj.getAttribute("data-id"));
        this.idxList.push(index);
      });
      //初始获取人员导入
      if (this.flag == 1) {
        for (let i of this.idxList) {
          for (let j in this.newPersons) {
            if (this.charList[i].id == this.newPersons[j].id) {
              this.charList[i] = this.newPersons[j];
              //删除人员列表
              if (this.newPersons[j].sortOrgVo != null) {
                a++;
              }
            }
          }
        }
        this.sums = this.sums + a;
        //获取删除后的人员列表
      } else if (this.flag == 9) {
        for (let i of this.idxList) {
          for (let j in this.tets) {
            if (this.charList[i].id == this.tets[j].id) {
              this.charList[i].sortOrgVo = this.tets[j].sortOrgVo;
            }
          }
        }
      } else if (this.flag == 4) {
        for (let i of this.idxList) {
          for (let j in this.delList) {
            if (this.charList[i].id == this.delList[j].id) {
              this.charList[i].sortOrgVo = this.delList[j].sortOrgVo;
            }
          }
        }
        console.log("删除后", this.delList);
        //获取插入人员后的数据
      } else if (this.flag == 5) {
        for (let i of this.idxList) {
          for (let j in this.addList) {
            if (this.charList[i].id == this.addList[j].id) {
              this.charList[i].sortOrgVo = this.addList[j].sortOrgVo;
            }
          }
        }
      }
      for (var k = 0; k < oT1.length; k++) {
        if (oT1[k].innerText != "占位") {
          if (this.charList[k].type == 1) {
            if (this.charList[k].sortOrgVo) {
              if (this.charList[k].sortOrgVo.username == "") {
                oT1[k].innerText = this.charList[k].sortOrgVo.unitName;
                oT1[k].setAttribute(
                  "name",
                  this.charList[k]["sortOrgVo"].unitName
                );
              } else {
                oT1[k].innerText = this.charList[k].sortOrgVo.username;
                oT1[k].setAttribute(
                  "name",
                  this.charList[k]["sortOrgVo"].username
                );
              }

              oT1[k].setAttribute(
                "unit",
                this.charList[k]["sortOrgVo"].unitName
              );
              oT1[k].className = "grid choose";
            } else {
              oT1[k].innerText = "";
              oT1[k].className = "grid";
            }
          }
        }
      }
      this.index = "";
    },
    changeVisibility() {
      this.isShown = !this.isShown;
      this.index1 = "";
      if (!this.isShown) {
        for (var i = 0; i < this.lastXinxi.length; i++) {
          this.xinXinxi.push(this.lastXinxi[i]);
          this.xinSeat.push(this.lastSeat[i]);
          this.xinIndex.push(this.lastIndex[i]);
        }
        for (var j = 0; j < this.charList.length; j++) {
          for (var t = 0; t < this.lastSeat.length; t++) {
            if (j == this.lastSeat[t]) {
              this.charList[j].selected = true;
            }
          }
        }
      }
    },
    // 拖拽开始
    handleDragStart() {
      //   this.dragging = item;
    },
    // 实现右键菜单
    rightClick(e) {
      // console.log("rightClick");
      this.dataIndex = e.currentTarget.getAttribute("data-index");
      // console.log(this.dataIndex);
      this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
      var menu = document.querySelector("#menu");
      this.styleMenu(menu);
      for (let i in this.charList) {
        if (this.dataIndex == this.charList[i].id) {
          this.replaceIndex = i;
        }
      }
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
    doubleClick(e) {},
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
    },
    // 离开时隐藏单位
    hideUnit() {
      // console.log("leave");
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
      color: #fff;
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
.section2 {
  width: 150px;
  margin-left: -30px;
  background-color: #e6edf4 !important;
}
.section3 {
  width: 150px;
  margin-left: -10px;
  margin-right: 10px;
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
    height: 780px;
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
.lists {
  text-align: center;
  list-style: none;
  cursor: pointer;
}
// 选中样式

.input {
  height: 30px;
  margin-left: 20px;
  width: 50%;
  margin-bottom: 10px;
  padding-left: 10px;
}
</style>
