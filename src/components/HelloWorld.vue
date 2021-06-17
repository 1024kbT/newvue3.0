<template>
  <div id="app">
	  <button @click="Sort" style="position: relative;z-index: 999; width: 80px;height: 50px;">排序</button>
	  <select v-model="index">
		  <option value="1">1</option>
		  <option value="3">3</option>
		  <option value="4">4</option>
		  <option value="5">5</option>
	  </select>
	  <Hello v-for="index of 8" class='dragbox' :options="option" @aa="tty"></Hello>

	 
  </div>
</template>

<script>
	import Hello from './com/kuang.vue';
	import children from "./com/children.vue"
export default {
	data(){
		return{

			items:[],
			index:1,
			option:{}
		}
	},
	components: {
    	Hello,
		children
  	},
	
	mounted:function(){
		this.items=this.GLOBAL.baseURL;
		
	},
	methods:{
		tty(a){
			
		},
		setChildren(){
			this.test={
				name:"lisi",
				age:5
			}
			console.log(111,this.test)
		},
		Sort:function(){
			const app = this
			let data = {
			    confSeatList: this.items,
			    sortType: this.index,
			}
			this.$axios.getSort(data).then((res) => {
				app.option=res.data.data
			})
			    .catch(err => {
			    })
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#app{
		
	}
	.st{
		width: 50px;
		height: 50px;
		border: 1px so;
	}
	.dragbox {
	    width: 100%;
	    margin: 20px;
	}
	.dragbox, img {
	    -webkit-user-select: none;
	    -webkit-user-drag: none;
	}
	.draging {
	    background-color: aquamarine;;
	}
	
	* {
	    cursor: default;
	}
</style>
