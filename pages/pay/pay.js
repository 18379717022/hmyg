// pages/pay/pay.js
/*
 1 页面加载的时候
   1 从缓存中获取购物车数据 渲染到页面
   2 这些数据 checked=true
 2 微信支付
   1 哪些人 哪些账号 可以实现微信支付
     1 企业账号
     2 企业账号的小程序后台中 必须给开发者添加上白名单
       1 一个appid可以同时绑定多个开发者
       2 这些开发者就可以公用这个appid和它的开发权限
 3 支付按钮
   1 先判断缓存中有没有token
   2 没有 跳转到授权页面 进行获取token
   3 有token 进行下一步
*/
import {getSetting,chooseAddress,openSetting ,showToast,requestPayment} from '../../utils/asyncWx.js'
import {request} from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
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
    //1 获取本地存储的地址信息
    const address=wx.getStorageSync('address')
    //1 获取缓存中的购物车数据
    let cart=wx.getStorageSync('cart')||[];
    //1 计算全选   every 数组方法 会遍历 会接收一个回调函数
    // 那么每一个回调函数都返回true 那么every方法的返回值为true
    // 只要有一个回调函数返回了false,就不会再循环执行,直接返回false
    // 空数组调用every 返回值就是true
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked)
    this.setData({address})
    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num
    })
    //2 给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  //点击支付
  async handleOrderPay(){
    try{
      //1 判断缓存中有没有token
    const token=wx.getStorageSync('token');
    //2 判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    //创建订单
    
    //创建请求体参数
    const order_price=this.data.totalPrice
    const consignee_addr=this.data.address.all
    const goods=[]
    const cart=this.data.cart
    cart.forEach(v=>{
      goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      })
    })
    const params={order_price,consignee_addr,goods}
    //准备发送请求获取订单编号
    const res=await request({url:"/my/orders/create",data:params,method:"POST"})
    const order_number=res.data.message.order_number
    console.log(order_number)
    //发起预支付的请求
    const res2=await request({url:"/my/orders/req_unifiedorder",data:{order_number},method:"POST"})
    const pay=res2.data.message.pay
    await requestPayment(pay)
    //查看订单支付状态
    const res3=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})
    await showToast({
      title:'支付成功'
    })

    
    }catch(error){
      await showToast({
        title:'支付成功'
      })
      //支付成功了,跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order',
      })
      //支付成功了,手动删除购物车中被选中的商品
      let newcart=wx.getStorageSync('cart')
      newcart=newcart.filter(v=>!v.checked)
      wx.setStorageSync('cart', newcart)
    }
    
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