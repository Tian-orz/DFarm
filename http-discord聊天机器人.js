const axios = require("axios"); 

// discord自动发送文本到指定频道,这仅仅是发送的基本实现,一个好用的机器人需要考虑各种情况设置不同的策略,这部分就靠自己设计了
const proxyHost = '127.0.0.1' // 代理ip
const proxyPort = '7890' // 代理端口号

/**
 * 获取随机剧本
 */
const get_context = () => {
    context_list = [
        "hello bro", "let's go !", "to the moon!", "nice", "project", "have a good day",
        "good", "luck", "how's going", "so do i", "yeah", "same to me", "1", "cool", "so far so good",
        "hi~", "of course", "really", "cool~", "ok", "what?", "why?", "not bad", "well done", "great",
        "perferct", "thanks", "ture", "yes", "no", "here", "interesting", "it's funny", "i am tired"
    ]
    let randomNum= Math.floor(Math.random() * context_list.length);
    return context_list[randomNum]
}

/**
 * 发送内容到指定频道
 */
const chat = (authorization, chanel_id) => {
    let header = {
        "Authorization": authorization,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
    }
    let msg = {
        "content": get_context(),
        "tts": false
    }
    axios({
        method: 'POST',
        url: `https://discord.com/api/v9/channels/${chanel_id}/messages`,
        headers: header,
        proxy: {
            host: proxyHost,
            port: proxyPort
        },
        data: msg
    }).then(res => {
       console.log(`发送成功: ${msg.content}`)
    })
}

chat('自己的authorization','频道id')