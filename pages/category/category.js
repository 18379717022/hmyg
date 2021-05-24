// pages/category/category.js
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList:[],//左侧的菜单数据
    rightContent:[],//右侧内容数据
    Cates:[],//商品分类总数据
    currentIndex:0,
    scrollTop:0,//右侧滚动条的位置
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates()
  },
  //获取分类数据
  async getCates(){
      const res=await request({url:'/categories'})
      let Cates=res.data.message
      let leftMenuList=Cates.map(v=>v.cat_name)
      let rightContent=Cates[0].children
      this.setData({
        Cates,
        leftMenuList,
        rightContent
      })
    
  },
  handleItemTap(e){
    const {index}=e.currentTarget.dataset
    let rightContent=this.data.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
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