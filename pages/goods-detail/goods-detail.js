// pages/goods-detail/goods-detail.js
/*
 1.点击轮播图 预览大图
   1 给轮播图绑定点击事件
   2 调用小程序的api previewImage
 2.点击加入购物车
   1 先绑定点击事件
   2 获取缓存中的购物车数据 数组格式
   3 先判断当前商品是否已经存在于购物车
   4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
   5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 带上 购买数量属性num 重新把购物车数组 填充回缓存中
   6 弹出提示
 3.商品收藏
   1 页面onShow的时候 加载缓存中的商品收藏数据
   2 判断当前商品是否被收藏
     1 是 改变页面的图标
     2 否。。
   3 点击收藏按钮
     1 判断该商品是否存在于缓存数据中
     2 已经存在 把该商品删除
     3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
*/
import {request} from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false,//商品是否被收藏过
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面显示
   */
  
  onLoad(options){
    const goods_id=options.goods_id
    this.getGoodsDetail(goods_id)
    
  },
  onShow(){
    console.log('你好')
  },
  //发送请求获取商品详情数据
  async getGoodsDetail(goods_id){
    let res=await request({url:"/goods/detail",data:{goods_id}});
    console.log(res)
    this.GoodsInfo=res.data.message;//代码执行到这里可以确保GoodsInfo有值了
    //1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync('collect')||[]
    //判断当前商品是否被收藏,some方法接收的返回值里面只要有一个为true,则返回值就是true
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)

    this.setData({
      goodsObj:{
        pics:res.data.message.pics,
        goods_price:res.data.message.goods_price,
        goods_name:res.data.message.goods_name,
        goods_introduce:res.data.message.goods_introduce
      },
      isCollect
    })
  },
  //点击预览图片
  handlePrevewImage(e){
    let current=e.currentTarget.dataset.url;
    let urls=this.data.goodsObj.pics.map(v=>v.pics_mid)
    wx.previewImage({
      urls,
      current
    })
  },
  //点击加入购物车
  handleCartAdd(){
    //1 获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    //2 判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    if(index===-1){
      //3 不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //4 已经存在购物车数据 执行num++
      cart[index].num++
    }
    //5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon:'success',
      mask:true
    })
  },
  //点击商品收藏
  handleCollect(){
    let isCollect=false
    // 1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync('collect')||[]
    // 2 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3 当index!=-1表示已经收藏过了
    if(index!=-1){
      // 能找到 收藏过了 在数组中删除该商品
      collect.splice(index,1)
      isCollect=false
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true
      })
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      })
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync('collect',collect)
    // 5 修改data中的属性 isCollect
    this.setData({
      isCollect
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