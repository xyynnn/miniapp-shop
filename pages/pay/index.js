/*
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据 checked=true
2 微信支付
  1 哪些人 哪些账号可以实现微信支付
    1 企业账号
    2 企业账号的小程序后台中 必须给开发者 添加上白名单
      1 一个appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token
  3 有token。。。
  4 创建订单 获取订单编号
*/
import { request } from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
Page({

  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    //1 獲取緩存中的購物車數據
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({ address })

    //1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })

    this.setData({
      cart, totalPrice, totalNum, address
    });
  },
  //点击 支付
  async handlePrderPay() {
    //1 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    //2 判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    //3 创建订单
    //3.1 准备 请求头参数
     const header = { Authorization: token }
    //3.2 准备请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams={order_price,consignee_addr,goods};
    //4 准备发送请求 创建订单 获取订单编号
    /*const {order_number}=await request({
      url:"/my/orders/create",
      method:"POST",
      data:orderParams,
      header
     })//console.log(res)
    //5 发起 预支付接口
    const res=await request({url:"/my/orders/req_unifiedorder",method:"POST",header,data:{order_number}})
    console.log(res) */
  }
})