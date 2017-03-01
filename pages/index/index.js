//index.js
import util from '../../utils/util.js';

//获取应用实例
// 推荐轮播图的地址
const tuiUrl =  "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";

// 排行榜的地址
const paiUrl = "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg";

// 热门搜索的地址
const hotKey = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";

// 搜索接口
const searchUrl = "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?";


const APP_ID = "30436";
const APP_KEY = "447795992f2d432081bc8718abd9b3b3";
const APP_url = "http://route.showapi.com/213-4";


Page({
  data: {
     nownav:2, 
     tuijiandata:{}, //推荐的数据
     orderdata:[],  //排行榜的数据
     hotdata:[],    //热门搜索的数据
     ifLoading:true,  //默认显示loading的图片
     change:false,  //输入框聚焦的时候显示取消文字
     close:false,  //输入文字的时候显示关闭图片
     inputVal:'',
     showList:true,
     randNum:3,
     list:[], //搜索歌曲得到的结果
     
  },
  onLoad: function () {
      //推荐
      var that = this;
      wx.request({
        url: tuiUrl,
        data: {},
        
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          // console.log(res.data.data);
          var resdata = res.data.data;
          that.setData({
            tuijiandata:resdata
          });
        },
      
      });
      // 排行榜的数据请求
      wx.request({
        url: paiUrl,
        data: {
          format:'json'
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          console.log(res.data.data.topList);
          var orderdataList = res.data.data.topList;
          for(var i=0;i<orderdataList.length;i++){
            orderdataList[i].listenCount = util.formatsong(orderdataList[i].listenCount)
          }
          that.setData({
            orderdata:res.data.data.topList,
            ifLoading:false
          })
        }
     
      });
      // 热门搜索的数据请求
       wx.request({
         url: hotKey,
         data: {},
         method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         // header: {}, // 设置请求的 header
         success: function(res){
          //  console.log(res.data.data)
          //  var hotdata = res.data.data;
           that.setData({
             hotdata:res.data.data
           })
         },
       }) 

 
  },
  // 检测输入框获取焦点的时候 取消按钮显示
  iffocus(){
     this.setData({
       change:true,
       showList:false
     })
  },
  // 检测输入框输入文字时 关闭文字的显示
  textInput(e){
    console.log(e.detail.value);
    this.setData({
      inputVal:e.detail.value
    });
    if(e.detail.value.length){
      this.setData({
         close:true
      })
    }else{
      this.setData({
        close:false
      })
    }

  },
 // 点击close按钮删除输入框里面的文字
   close(e){
     console.log("close按钮");
     this.setData({
       inputVal:'',
       showList:true,
        close:false,
     })

   },
// 点击取消按钮时删除输入框里面的内容
    cancel(){
      this.setData({
        inputVal:'',
        close:false,
        change:false,
        showList:true
      })
    },

  // 检测输入框失去焦点的时候
  lost(){
     this.setData({
       change:false
     })
  },
  
    // 点击热门搜索里面的文字想应得输入框里面显示，并进行搜索
  keySearch(e){
    console.log(e.target.dataset.text);
    this.setData({
      inputVal: e.target.dataset.text,
      showList:false,
      change:true,
      close:true
    });
     this.search();
  },

  // 键盘按下enter键的时候也去搜索歌曲
finish(){
  this.search();
},

  
// 搜索按钮的时候去搜索相应歌曲
 search(){
   var that = this;
   wx.request({
     url: searchUrl,
     data: {
        format:'json',
        w:this.data.inputVal
     },
     method: 'GET', 
     success: function(res){
       // success
       console.log(res.data.data.song.list);
       var searchList = res.data.data.song.list;
       that.setData({
         list:searchList
       })
     }
   })
 },




  // 定义菜单切换的函数
  changenav(e){
    // e.target代表当前点击的元素
    // e.target.dataset.index 获取当前点击元素的datadata-set 的indexindex
    // console.log(e.target);
     let index = e.target.dataset.index;
     this.setData({
       nownav:index
     });

    //  当页面切换到搜索页面的时候显示热门搜索的列表
    if(index == 2){
      this.setData({
        randNum:Math.floor(Math.random()*11)+1
      });
    }
    //  判断排行榜里面是数据，有就把loading设置为FALSE
     if(this.data.orderdata.length){
       this.setData({
         ifLoading:false
       })
     } 
  }
})
