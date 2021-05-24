// pages/search/search.js
/*
 1  输入框绑定 值改变事件 input事件
    1 获取到输入框的值
    2 合法性判断
    3 检验通过 把输入框的值发送到后台
    4 返回的数据打印到页面
 2  防抖  需要通过定时器  节流
    1 防抖 一般输入框中 防止重复输入 重复发送请求
    2 节流 一般是用在页面下拉和上拉
    3 定义全局的定时器id
*/
import {request} from '../../request/index.js'
Page({
  data: {
    goods:[],
    isFocus:false,//取消按钮是否显示
    Inpvalue:''//输入框的值
  },
  TimeId:-1,
  //输入框的值改变就会触发的事件
  handleInput(e){
    //1 获取输入框的值
    const {value}=e.detail
    console.log(value)
    //2 检测合法性 trim方法判断value是不是空字符串
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false,
      })
      //值不合法
      return;
    }
    //3 准备发送请求
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value)
    },1000)
    
  },
  //发送请求获取搜索数据的函数
  async qsearch(query){
    const res=await request({url:'/goods/qsearch',data:{query}})
    console.log(res)
    this.setData({
      goods:res.data.message
    })
  },
  //清除输入框的值
  handleCanle(){
    this.setData({
      isFocus:false,
      goods:[],
      Inpvalue:''
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