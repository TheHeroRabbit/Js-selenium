const fs = require("fs");
const path = require("path");
const { Builder, By, Key, until } = require("selenium-webdriver");
const { ServiceBuilder, Options } = require("selenium-webdriver/chrome");

class AutoChrome {
  constructor(user_data_dir) {
    let options = new Options();
    let service = new ServiceBuilder("chromedriver.exe");
    let userdir = path.join(__dirname, user_data_dir);

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
}
