// pages/feedback/feedback.js
/*
 1 点击"+"触发tap点击事件
   1 调用小程序内置的 选择图片的api
   2 获取到图片的路径 数组
   3 把图片路径存到data的变量中
   4 页面就可以根据图片数组进行循环显示 自定义组件
 2 点击自定义图片组件删除图片
   1 获取被点击的元素的索引
   2 获取data中的图片数组
   3 根据索引 数组中删除对应的元素
   4 把数组重新设置回data中
 3 点击提交按钮
   1 获取文本域的内容
     1 data中定义变量 表示输入框内容
     2 文本域绑定输入事件 事件触发的时候 把输入框的值保存到变量中
   2 对这些内容进行合法性验证
   3 验证通过 用户选择的图片上传到专门的图片的服务器 返回图片的外网链接
     1 遍历图片数组
     2 挨个上传
     3 自己再维护图片数组 存放图片上传后的外网链接
   4 文本域 和外网图片的路径 一起提交到服务器
   5 清空当前页面
   6 返回上一页
*/
Page({
  data: {
    tabs:[
      {
        id:0,
        value:'体验问题',
        isActive:true
      },{
        id:1,
        value:'商品/商家投诉',
        isActive:false
      }
    ],
    chooseImgs:[],//被选中的图片路径 数组
    textVal:''//文本域的内容
  },
  //外网的图片的路径数组
  UpLoadImgs:[],
  //导航切换的函数
  handleTabsItemChange(e){
    const index=e.detail.index
    const tabs=this.data.tabs
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },
  //点击"+"选择图片的事件函数
  handleChooseImage(){
    wx.chooseImage({
      //同时选中的图片张数
      count: 9,
      //图片的格式 原图 压缩
      sizeType:['original','compressed'],
      //图片的来源 相册 照相机
      sourceType:['album','camera'],
      success:(res)=>{
        const chooseImgs=res.tempFilePaths
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...chooseImgs]
        })
      }
    })
    
  },
  //点击icon图标删除图片
  handleRemoveImg(e){
    console.log(e)
    //获取被点击的组件的索引
    const index=e.currentTarget.dataset.index;
    //获取data中的图片数组
    let {chooseImgs}=this.data;
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })

  },
  //点击图片 预览
  previewImg(e){
    const current=e.currentTarget.dataset.url;
    const {chooseImgs}=this.data
    const urls=chooseImgs
    console.log(urls)
    wx.previewImage({
      urls,
      current
    })
  },
  //文本域内容改变触发的函数
  handleTextInput(e){
    const textVal=e.detail.value
    this.setData({
      textVal
    })
  },
  //点击提交按钮触发的函数
  handleFormSubmit(){
    //1 获取文本域的内容
    const{textVal,chooseImgs}=this.data;
    //2 合法性验证
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon:'none',
        mask:true
      })
      return;
    }
    //显示正在上传的图片
    wx.showLoading({
      title: '正在上传中',
    })
    //判断有没有需要上传的图片数组
    if(chooseImgs.length!==0){
      //3 准备上传图片到专门的服务器
      chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        //被上传的文件的路径
        filePath:v,
        //上传的文件的名称 后台来获取文件 file
        name: 'file',
        //图片要上传到哪里
        url: 'https://images.ac.cn/Home/Index/UploadAction/',
        //顺带的文本信息
        formData:{},
        success:(result)=>{
          let url=JSON.parse(result.data).url;
          this.UpLoadImgs.push(url)
          //所有图片都上传完了才触发
          if(i===chooseImgs.length-1){
            wx.hideLoading()
            //重置页面
            this.setData({
              textVal:'',
              chooseImgs:[]
            })
            //返回上一个页面
            wx.navigateBack({
              delta: 1,
            })
          }
        },
        fail:(err)=>{
          wx.hideLoading({
            success: (res) => {
              console.log('上传成功')
              this.setData({
                textVal:'',
                chooseImgs:[]
              })
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        }
      })
    })
    }else{
      console.log('只是提交了文本')
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
    }
    
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