// pages/order/order.js
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },{
        id:1,
        value:"代付款",
        isActive:false
      },{
        id:2,
        value:"代发货",
        isActive:false
      },{
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
    orders:[]
  },
  //根据标题索引来激活选中标题数组
  changeTitleByIndex(index){
    let{tabs}=this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    let index=e.detail.index
    this.changeTitleByIndex(index)
    //重新发起请求 type=1 index=0
    this.getOrders(index+1)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    //获取当前的小程序的页面栈-数组 长度最大是10个页面
    //数组中索引最大的页面就是当前页面
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1]
    let type=currentPage.options.type
    //激活页面中选中的标题
    this.changeTitleByIndex(type-1)
    const token=wx.getStorageSync('token')
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    }else{
      this.getOrders(type)
    }
    
  },
  //获取订单列表的封装函数
  async getOrders(type){
    const res=await request({url:'/my/orders/all',data:{type}})
    const orders=res.data.message.orders
    this.setData({
      orders:orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})