// pages/cart/cart.js
/*
 1.获取用户的收货地址
   1 绑定点击事件
   2 调用小程序内置的api 获取用户的收货地址 wx.chooseAddress
   2 获取用户对小程序所授予获取地址 权限的状态 scope
     1 假设用户点击获取收货地址的提示框 确定 authSetting scope.address
     scope 值 true 直接调用 获取收货地址
     2 假设用户从来没有调用过收货地址的api
     scope undefined 直接调用获取收货地址
     3 假设用户点击获取收货地址的提示框 取消  scope 值 false
       1诱导用户自己打开授权设置页面 当用户重新给予 获取收货地址权限的时候
       2 获取收货地址
    4 把获取到的收货地址存储到本地
 2.页面加载完毕
   1 onShow
   2 获取本地存储的地址数据
   3 把数据设置给data中的一个变量
 3.全选的实现 数据的展示
   1 onShow 获取缓存中的购物车数据
   2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
 4.总价格和总数量
   1 都需要商品被选中 我们才拿它来计算
   2 获取购物车数组
   3 遍历
   4 判断商品是否被选中
   5 总价格+=商品的单价*商品数量
   6 总数量+=商品的数量
   7 把计算后的价格和数量 设置回data中即可
 5.商品的选中
   1 绑定change事件
   2 获取到被修改的商品对象
   3 商品对象的选中状态 取反
   4 重新填充回data中和缓存中
   5 重新计算全选 总价格 总数量
 6.全选和反选
   1 全选复选框绑定事件
   2 获取data中的全选变量 allChecked
   3 直接取反 allChecked=!allChecked
   4 遍历购物车数组 让里面 商品 选中状态跟随 allChecked改变而改变
   5 把购物车数组和allChecked 重新设置回data把购物车重新设置回缓存中
 7. 商品数量的编辑
   1 "+"  "-"按钮绑定同一个点击事件 区分的关键 自定义属性
     1 "+" "+1"
     2 "-" "-1"
   2 传递被点击的商品id goods_id
   3 获取data中的购物车数组 来获取需要被编辑的商品对象
   4 直接修改商品对象的数量 num
     当购物车的数量=1 同时用户点击 "-" 弹窗提示(showModal) 询问用户是否要删除商品
     1 确定 直接删除
     2 取消 什么都不做
   5 把cart数组 重新设置回缓存中和data中
*/
import {getSetting,chooseAddress,openSetting ,showToast} from '../../utils/asyncWx.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  //点击收货地址
  async handleChooseAddress(){
    try{
      //1 获取权限状态
    const res1=await getSetting();
    const scopeAddress=res1.authSetting["scope.address"]
    //2 判断权限状态
    if(scopeAddress===false){
      await openSetting()
    }
    let address=await chooseAddress()
    address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo
    //3 将地址存储到本地
    wx.setStorageSync('address', address)
    }catch(error){
      console.log(error)
    }
  },
  //商品的选中
  handleItemChange(e){
    //1 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    //2 获取购物车数组
    let {cart}=this.data;
    //3 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    //4 选中状态取反
    cart[index].checked=!cart[index].checked;
    //5 把购物车数据重新设置回data中和缓存中
    this.setCart(cart)
  },
  //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    const allChecked=cart.length?cart.every(v=>v.checked):false
    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num
      }
    })
    //2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart",cart)
  },
  //商品的全选功能
  handleItemAllCheck(){
    //1 获取data中的数据
    let {cart,allChecked}=this.data;
    //2 复选框的allChecked取反
    allChecked=!allChecked;
    //3 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //4 把修改后的值填充回data或缓存中
    this.setCart(cart)
  },
  //商品数量的编辑功能
  handleItemNumEdit(e){
    //1 获取传递过来参数
    const {operation,id}=e.currentTarget.dataset;
    //2 获取购物车数组
    let {cart}=this.data;
    //3 找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id)
    //4 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      //4.1 弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除?',
        success:(res)=>{
          if(res.confirm){
            cart.splice(index,1)
            this.setCart(cart)
          }
        }
      })
    }else{
    //4 进行修改数量
    cart[index].num+=operation;
    //5 设置回缓存和data中
    this.setCart(cart)
    }
  },
  //点击结算
  async handlePay(){
    //判断是否选择收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'})
      return;
    }
    //判断是否选中购物商品
    if(totalNum===0){
      await showToast({title:'您还没有选择商品'})
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
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
    //1 获取本地存储的地址信息
    const address=wx.getStorageSync('address')
    //1 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    //1 计算全选   every 数组方法 会遍历 会接收一个回调函数
    // 那么每一个回调函数都返回true 那么every方法的返回值为true
    // 只要有一个回调函数返回了false,就不会再循环执行,直接返回false
    // 空数组调用every 返回值就是true
    this.setData({address})
    this.setCart(cart)
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