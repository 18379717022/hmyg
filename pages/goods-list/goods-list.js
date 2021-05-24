// pages/goods-list/goods-list.js
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },{
        id:1,
        value:"销量",
        isActive:false
      },{
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    QueryParams:{
      query:"",
      cid:"",
      pagenum:1,
      pagesize:10
    },
    goodsList:[],
    totalPages:1
  },
  handleTabsItemChange(e){
    let index=e.detail.index
    let{tabs}=this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.QueryParams.cid=options.cid||'';
    this.data.QueryParams.query=options.query||''
    this.getGoodsList()
  },
  //获取商品列表数据
  async getGoodsList(){
    let res=await request({url:'/goods/search',data:this.QueryParams})
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.data.message.goods],
      totalPages:Math.ceil(23/10)
    })
    //关闭下拉刷新小窗口
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    this.setData({
      //重置数组
      goodsList:[],
    })
    //重置页码
    this.data.QueryParams.pagenum=1;
    //发送请求
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    /*
    1 用户上滑页面 滚动条触底 开始加载下一页数据
      1 找到滚动条触底事件
      2 判断还有没有下一页数据
        1获取到总页数 
         总页数=Math.ceil(总条数/页容量 pagesize)
         总页数=Math.ceil(23/10)=3
        2 获取到当前的页码 pagenum
        3 判断当前页码是否大于等于总页数 表示没有下一页数据
      3 假如没有下一页数据 弹出一个提示
      4 假如还有下一页数据 发请求加载下一页数据
        1 当前页码++
        2 重新发起请求
        3 数据请求回来 要对data中的数组进行拼接 而不是全部替换
    2 下拉刷新页面
      1触发下拉刷新事件
      2重置数据 数组
      3重置页码设置为1
      4重新发送请求
      5数据请求回来了就需要关闭下拉刷新的小窗口
    */
   if(this.data.QueryParams.pagenum>=this.data.totalPages){
     //没有下一页数据
     wx.showToast({
       title: '没有更多数据了',
     })
   }else{
     this.data.QueryParams.pagenum++
     this.getGoodsList()
   }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})