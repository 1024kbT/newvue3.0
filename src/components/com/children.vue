<template>
	<div>
		<div>{{test.name}}</div>
		<div>{{test.age}}</div>
		<!-- <button>点击</button> -->
	</div>
</template>

<script>
	export default {
		props:["test"],
		created(){
			console.log(222,this.test)
		},
		watch:{
			test:{
				handler:(newVal,oldVal)=>{
					console.log(newVal,oldVal)
				},
				deep:true
			}
			
		}
	}
	
</script>

<style>
</style>
