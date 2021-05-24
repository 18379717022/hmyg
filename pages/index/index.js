// index.js
// 获取应用实例
const app = getApp()
import {request} from "../../request/index.js"
Page({
  data: {
   swiperList:[],//轮播图数组
   catesList:[],//分类导航数组
   floorList:[],//楼层数据
  },
  // 事件处理函数
  onLoad(options){
    
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  //获取轮播图数据
  getSwiperList(){
    request({url: '/home/swiperdata'})
    .then(result=>{
      this.setData({
        swiperList:result.data.message
      })
    })
  },
  //获取导航数据
  getCateList(){
    request({url: '/home/catitems'})
    .then(result=>{
      this.setData({
        catesList:result.data.message
      })
    })
  },
  //获取楼层数据
  getFloorList(){
    request({url: '/home/floordata'})
    .then(result=>{
      this.setData({
        floorList:result.data.message
      })
    })
  }
})
