/*
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress

  2 获取用户对小程序所授予 获取地址的权限状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
      scope 值 true 直接调用 获取收货地址
    2 假设用户从来没有调用过 收货地址的api
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消
      scope 值 false
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给予 获取地址权限的时候
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中
2 页面加载完毕
  0 onLoad onShow
    1 获取本地存储中的地址数据
    2 把数据 设置给data中的一个变量
3 onShow
  1 把數據緩存中的購物車數組
  2 把購物車數據 填充到data中
    
*/

import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js";
Page({
  //点击 收货地址
  data:{
    address:{},
    cart:[]
  },
  onShow(){
    //1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    //1 獲取緩存中的購物車數據
    const cart=wx.getStorageSync('cart');
    //2 给data赋值
    this.setData({
      address
    })
  },
  async handleChooseAddress() {
    try {
      //2 获取收货地址
      // wx.chooseAddress({
      //   success: (result) => {
      //     console.log(result);
      //   }
      // });

      //1 获取权限状态
      // wx.getSetting({
      //   success: (result) => {
      //     // 2 获取权限状态 主要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
      //     const scopeAddress =result.authSetting["scope.address"]
      //     if(scopeAddress==true||scopeAddress===undefined){
      //       wx.chooseAddress({
      //         success: (result1) => {
      //           console.log(result1);
      //         }
      //       });
      //     }else{
      //       //3 用户 以前拒绝过授予权限 先诱导用户打开授权页面
      //       wx.openSetting({
      //         success: (result2) => {
      //           //4 可以调用 收货收货地址代码
      //           wx.chooseAddress({
      //             success: (result3)=>{
      //               console.log(result3);
      //             }
      //           });
      //         }
      //       });
      //     }
      //   },
      //   fail: () => {},
      //   complete: () => {}
      // });

      //1 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      //4 调用获取收货地址的api
      let address = await chooseAddress(); 
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      //5 存入到缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  }

})