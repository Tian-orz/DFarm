const axios = require("axios"); 

// http这部分比较简单,用自己熟悉的库就行,我用的较多的是axios和request
// 过google验证我用的是yescaptcha的服务,具体使用方法可以去看下使用文档

const clientKey = '' // yescaptcha的账户秘钥
const walletAddress = '' // 领水的钱包地址

/**
 * 生成yescaptcha的任务
 */
const createTask = () => {
    return new Promise(async resolve => {
        let data = {
            clientKey,
            task: {
                websiteURL: "https://faucets.chain.link/",
                websiteKey: "6LcKyLYbAAAAANM74ESqR5Q7Z_W2yolLdyK3fzFP",
                type: "NoCaptchaTaskProxyless"
            }
        }
        axios.post('https://api.yescaptcha.com/createTask', data).then(res=>{
            console.log('taskId=>',res.data.taskId);   
            resolve(res.data.taskId   )     
        })
    })
}

/**
 * 获取yescaptcha的任务执行结果
 */
const getCaptchaToken = () => {
    return new Promise(async (resolve, reject) => {
        const taskId = await createTask()
        const getTaskResult = (taskId) => {
            let data = {
                clientKey,
                taskId: taskId
            }
            axios.post('https://api.yescaptcha.com/getTaskResult', data).then(res=>{
                let data = res.data
                if(data.errorId === 0){
                    if(data.status === 'ready'){
                        console.log('Captcha 识别成功')
                        console.log(data.solution.gRecaptchaResponse)
                        resolve(data.solution.gRecaptchaResponse)
                    }else if(data.status === 'processing'){
                        console.log('Captcha 识别中,3s后重试')
                        setTimeout(() => {
                            getTaskResult(taskId)
                        }, 3000)
                    }
                }else{
                    console.log(`Captcha 识别出错: ${data.errorDescription}`)
                    reject(data.errorDescription)
                }
            })
        }
        getTaskResult(taskId)
    })
}

/**
 * 领水
 */
const faucet = async () => {
    let captchaToken = await getCaptchaToken()
    let data = {
        captchaToken: captchaToken,
        accountAddress: walletAddress,
        network: 'rinkeby',
        tokens: ['ETH']
    }
    axios({
        method: 'POST',
        url: 'https://faucets.chain.link/api/faucet',
        headers: {
            "content-type": "text/plain;charset=UTF-8",
        },
        data
    }).then(res => {
        console.log(`领水成功! ${JSON.stringify(res.data)}`)
    }).catch(e => {
        console.log('领水失败!')
    })
}

faucet()