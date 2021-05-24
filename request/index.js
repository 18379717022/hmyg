//定义发送异步请求的次数
let ajaxtimes=0
export const request=(params)=>{
  //判断url中是否含有/my/ 请求的是私有的路径 带上header token
  let header={...params.header}
  if(params.url.includes("/my/")){
    //拼接header带上token
    header["Authorization"]=wx.getStorageSync('token')
  }
  ajaxtimes++;
  //显示加载中的效果
  wx.showLoading({
    title: '加载中',
    mask:true
  });
  //定义公共的url
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result)
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxtimes--;
        //关闭正在加载的图标
        if(ajaxtimes===0){
          wx.hideLoading()
        }
      }
    })
  })
}