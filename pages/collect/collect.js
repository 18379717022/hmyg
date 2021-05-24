// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },{
        id:1,
        value:"品牌收藏",
        isActive:false
      },{
        id:2,
        value:"店铺收藏",
        isActive:false
      },{
        id:3,
        value:"浏览足迹",
        isActive:false
      }
    ],
    collectTitle:[
      {
        id:0,
        value:'全部',
        ischoosed:true
      },{
        id:1,
        value:'正在热卖',
        ischoosed:false
      },{
        id:2,
        value:'即将上线',
        ischoosed:false
      },
    ],
    collect:[]
  },
  handletitleclick(e){
    const index=e.currentTarget.dataset.index
    console.log(index)
    let collectTitle=this.data.collectTitle
    collectTitle.forEach((v,i)=>i===index?v.ischoosed=true:v.ischoosed=false)
    this.setData({
      collectTitle
    })
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
    const collect=wx.getStorageSync('collect')||[]
    this.setData({
      collect
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