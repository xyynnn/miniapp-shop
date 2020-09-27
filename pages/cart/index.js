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
  1 获取本地存储中的地址数据 第一次添加商品的时候 手动添加了属性
    1 num=1
    2 checked=true
  2 把数据 设置给data中的一个变量
3 onShow
  0 回到了商品详情页面
  1 把數據緩存中的購物車數組
  2 把購物車數據 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车的商品数据 所有的商品都被选中 checked=true 全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 数量
  6 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。总价格 总数量。。。
    
*/

import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js";
Page({
  
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    //1 獲取緩存中的購物車數據
    const cart=wx.getStorageSync("cart")||[];
    //1 计算全选
    //every数组方法 全遍历 会接受一个回调函数 那么 每一个回调函数都返回true 那么 every方法的返回值为true
    //只要 有一个回调函数返回false 那么不再循环执行，直接返回false
    //空数组 调用every，返回值就是true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    let allChecked=true;
    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    //2 给data赋值
    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
  },
  //点击 收货地址
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
  },
  //商品的选中
  handleItemChange(e){
    //1 获取到被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    //2 获取购物车数组
    let {cart}=this.data;
    //3 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //4 选中状态取反
    cart[index].checked=!cart[index].checked;
    // 5 6 把购物车数据重新设置回data中和缓存中
    this.setData({
      cart
    });
    wx.setStorageSync("cart", cart);
  }

})