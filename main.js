const fs = require("fs");
const path = require("path");
const { ServiceBuilder, Options } = require("selenium-webdriver/chrome");
const { Builder, By, Key, until, Select } = require("selenium-webdriver");

class AutoChrome {
  constructor(user_data_dir) {
    let options = new Options();
    let service = new ServiceBuilder("chromedriver.exe");
    let userdir = path.join(__dirname, "XiaoMaRPA", user_data_dir);

    console.log(userdir);

    options.excludeSwitches(`enable-automation`);
    options.addArguments([
      `--user-data-dir=${userdir}`,
      `--profile-directory=Default`,
      `--disable-blink-features=AutomationControlled`,
    ]);

    this.web = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    this.web.manage().window().maximize();
    this.web.manage().setTimeouts({ implicit: 20000 });
  }

  async formTest() {
    try {
      // 读取文件
      let profile = JSON.parse(fs.readFileSync("./example/profile.json", { encoding: "utf-8" }));
      // 打开页面
      await this.web
        .get("http://www.vrbrothers.com/cn/wqm/demo/pages/Demo-ComplexForm.aspx")
        .then(async () => {
          let item;
          let select;
          let selectElement;
          // 遍历数据
          for (let i = 0; i < 5; i++) {
            item = profile.data[i];
            await this.web
              .findElement(By.xpath('//*[@id="ctl00_mainContent_tbUsername"]'))
              .sendKeys(item["用户名"]);
            await this.web
              .findElement(By.xpath('//*[@id="ctl00_mainContent_tbPassword"]'))
              .sendKeys(item["密码"]);
            await this.web
              .findElement(By.xpath('//*[@id="ctl00_mainContent_tbEMail"]'))
              .sendKeys(item["EMail地址"]);
            await this.web
              .findElement(By.xpath(`//input[@type="radio" and @value="${item["性别"]}"]`))
              .click();
            // 选择省份
            selectElement = await this.web.findElement(
              By.xpath('//*[@id="ctl00_mainContent_ddlProvince"]')
            );
            select = new Select(selectElement);
            await select.selectByVisibleText(item["省份"]);
            // 选择城市
            selectElement = await this.web.findElement(
              By.xpath('//*[@id="ctl00_mainContent_ddlCity"]')
            );
            select = new Select(selectElement);
            await select.selectByVisibleText(item["城市"]);
            // 选择求职意向
            selectElement = await this.web.findElement(
              By.xpath('//*[@id="ctl00_mainContent_lbObjectives"]')
            );
            select = new Select(selectElement);
            await select.deselectByIndex(0);
            await select.selectByVisibleText(item["求职意向"]);
            // 选择爱好
            await item["爱好"].split(",").forEach(async (hobby) => {
              await this.web.findElement(By.xpath(`//label[text()="${hobby}"]`)).click();
            });
            // 输入自我介绍
            await this.web
              .findElement(By.xpath('//*[@id="ctl00_mainContent_tbSelfAssement"]'))
              .sendKeys(item["自我介绍"]);
            await this.web
              .findElement(By.xpath('//*[@id="ctl00_mainContent_cbAcceptTerms"]'))
              .click();
            await this.web.findElement(By.xpath('//*[@id="ctl00_mainContent_btnSubmit"]')).click();
            await this.web.wait(
              until.elementLocated(By.xpath('//*[@id="content"]/div/table/thead/tr/th'))
            );
            await this.web.sleep(1000);
            await this.web.navigate().back();
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      await this.web.sleep(1000);
      await this.web.quit();
    }
  }
}

(async function demo() {
  const client = new AutoChrome("demo");
  await client.formTest();
})();

(async function demo_2() {
  const client = new AutoChrome("demo_2");
  await client.formTest();
})();
