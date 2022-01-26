const puppeteer = require('puppeteer-core');
const path = require("path");
// 在nodejs上是使用puppeteer库来实现web自动化,这里使用core 可以不用下载Chromium,通过指定本地chrome运行脚本
// 小伟哥文章里的跨链对我来说过于久远我就没去实现了,下面是一个用puppeteer使用小狐狸生成创建钱包的流程,理解完了其他的业务可以自己摸索
// 官方文档写的很详细 https://zhaoqize.github.io/puppeteer-api-zh_CN/

const main = async () => {
    // 用户配置地址 建议新建空文件夹使用,若想使用本利chrome默认配置也建议复制一份出来引用新地址
    const user_data_dir = path.join(process.cwd(), "/User Data"); 
    // 小狐狸插件的地址,puppeteer需要指定每个需要引用的扩展本地路径,多个扩展用逗号分隔 `--load-extension=${MetaMask},${其他扩展}`  `--disable-extensions-except=${MetaMask},${其他扩展}`
    const MetaMask = path.join(process.cwd(), "/User Data/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.8.1_0")
    const options = {
        //headless为true时，客户端不会打开，使用无头模式；为false时，可打开浏览器界面
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
            '--no-sandbox',
            `--user-data-dir=${user_data_dir}`,
            `--load-extension=${MetaMask}`,
            `--disable-extensions-except=${MetaMask}`
        ],
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // 本地chrome路径
    };
    // 启动chrome
    const browser = await puppeteer.launch(options);
    // 打开新页面
    const metaMaskPage = await browser.newPage()
    // 跳转小狐狸钱包 路径参考小伟哥文章内如何通过页面打开扩展呈现
    await metaMaskPage.goto('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html')
    // 登录小狐狸
    await metaMaskPage.waitForSelector(".MuiInputBase-input")
    await metaMaskPage.type('input[id=password]', '这是自己的密码', {delay: 20});
    await metaMaskPage.click('.button')
    // 点击账户
    let elem = await metaMaskPage.waitForSelector("*[class='account-menu__icon']", {
        visible: true,
    });
    await elem.click();
    await sleep(1000)
    // 点击创建账户
    elem = await metaMaskPage.waitForXPath("//div[contains(text(), '创建账户')]",{
            visible: true,
    });
    await elem.click();
    // 输入新的账户名称
    let input = await metaMaskPage.waitForSelector("*[class='new-account-create-form__input']",{
        visible: true,
    });
    await input.type('这是账户名', {delay: 20});
    // 点击创建按钮
    elem = await metaMaskPage.waitForXPath("//button[contains(text(), '创建')]",{
            visible: true,
    });
    await elem.click();
    // 到这就创建成功了,需要创建多个写个循环就ok
}

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

main()

