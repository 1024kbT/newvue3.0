<template>
    <div id="kz" style="display: flex;">
		<div v-for="index of 5" class="main">
			<div class="table">
				
			</div>
			<div style="display: flex;">
				<div class='t1' v-for="index of 6">
				    
				</div>
			</div>
		</div>
        
         <div id="selectionRect" style="position: absolute;background-color: rgba(204,246,251,0.5);border:1px solid rgb(137,189,189);;"></div>
    </div>
</template>

<script>
    export default{
	name:"Hello",
	props:['options'],
	data(){
		return{
			xinxi:[],
			items:[],
			seat:[],
			sort:[]
		}
	},
	created(){
		const app = this;	
		this.$axios.getDistributeData().then((res) => {
			app.xinxi=res.data.data.confSeats
		}).catch(function (res) {
	    	console.log(res.data);
	  	});
		
	},
    mounted:function(){
		var rector = $('#selectionRect');
		    //拖选起点
		    var startX = 0;
		    var startY = 0;
		    //选择框核心代码
			
		    function resizeToPoint(x,y){
		        var width = Math.abs(x-startX);
		        var height = Math.abs(y-startY);
		        rector.width(width);
		        rector.height(height);
		        //当鼠标x方向上为向左拖动 设置left位置
		        if(x<startX){
		            rector.css({
		                left:(startX-width)+'px',
		            });
		        }
		        //当鼠标y方向上为向上拖动 设置top位置
		        if(y<startY){
		            rector.css({
		                top:(startY-height)+'px',
		            });
		        }
		    }
		
		    /**
		     *核心相交算法
		     * @param rect1{x1,y1,x2,y2}
		     * @param rect2 {x1,y1,x2,y2}
		     */
		    function isCross(rect1,rect2){
		        var xNotCross=true;//x方向上不重合
		        var yNotCross = true;//y方向上不重合
		        xNotCross =((rect1.x1>rect2.x2) || (rect2.x1>rect1.x2));
		        yNotCross =  ((rect1.y1>rect2.y2) || (rect2.y1>rect1.y2));
		        return !(xNotCross || yNotCross);
		    }
		    /**
		     *获取元素的矩形的起始点坐标与其对角点坐标
		     * @param $el
		     * @return {x1,y1,x2,y2}
		     */
		    function getRect($el){
		        var x1 = $el.offset().left;
		        var y1 = $el.offset().top;
		        var x2 = x1 +$el.outerWidth();
		        var y2 = y1+$el.outerHeight();
		        return {x1,x2,y1,y2};
		    }
			const app = this;
		    //框选处理 如果元素与选择框相交则设置样式
		    function handleRectSelection(){	
		        var selectionReact = getRect(rector);
				var a = '';
		        $('.t1').each(function( index){
		            var rect = getRect($(this));
		            if(isCross(selectionReact,rect)){
						app.seat.push(index)
						app.items.push(app.xinxi[index])
						console.log(app.items)
						$(this).addClass('selected');
		            }else{
		                $(this).removeClass('selected');
		            }
		        });
				
		    }
			this.GLOBAL.baseURL=app.items;
			this.$emit('aa', this.items)
			
			
		$(window).on({
		    mousemove:function(e){
		        if(e.which===1){
		            rector.show();
		            resizeToPoint(e.pageX, e.pageY);
		        }
		    },
		    mouseup:function(){
		       handleRectSelection();
		    },
		    mousedown:function(e){
		        startX = e.pageX;
		        startY = e.pageY;
		        rector.css({
		            top: startY+'px',
		            left: startX+'px',
					
		        });
		    }
		});
		
	},
	watch:{
		options:{
			handler:function(newVal,oldVal){
				this.seatSort();
				// console.log(11111,newVal,oldVal)
				// console.log(this.options)
				
			},
			deep:true
		}
	},
	methods:{
		seatSort(){
			
			var oT1=document.querySelectorAll(".t1");
			
			for(var i = 0;i<oT1.length;i++){
				for (var j=0;j<this.seat.length;j++){
					if(i == this.seat[j]){
						var a=""
						var r,w=0;
						r=Math.ceil((i+1)/30)
						w=parseInt((i+1)%30)
						a=r+"-"+w
						oT1[i].innerText=this.options[a]
					}
					
				}
			}
			this.seat=[]
			this.items=[]
			// var a = ""
			// $('.t1').each(function(index){
			// 	var row,col=0;
			// 	row=Math.ceil((index+1)/30)
			// 	col=parseInt((index+1)%30)
			// 	a=row+"-"+col
				
			// })
		}
	}
}
    
</script>

<style scoped>
    #kz{
       
    }
    .t1{
        width:40px;
        height:20px;
        margin:5px;
		background-color: rgb(135,145,153);
		text-align: center;
		color: #fff;
    }
    .selected{
	    background-color: #FF0;
	}
	.table{
		width: 300px;
		height: 30px;
		background-color:rgb(191,205,214);
	}
	.main{
		margin-left:30px;
		margin-bottom: 20px;
	}
</style>