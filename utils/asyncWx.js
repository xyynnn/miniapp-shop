// promise 形式 getSetting
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

// promise 形式 chooseAddress
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

// promise 形式 openSetting
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

/**
 * promise 形式 showModal
 * @param {object} param0  参数
 */
export const showModal = ({content}) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

/**
 * promise 形式 showToast
 * @param {object} param0  参数
 */
export const showToast = ({title}) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

/**
 * promise 形式 login
 */
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout:10000,
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });

    })
}

/* export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout:10000,
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });

    })
} */