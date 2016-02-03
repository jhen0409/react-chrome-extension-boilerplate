import path from 'path';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import delay from 'delay';

describe('inject page (in github.com/jhen0409/react-chrome-extension-boilerplate)', function() {
  this.timeout(15000);

  before(async () => {
    const extPath = path.resolve('build');
    this.driver = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .withCapabilities({
        chromeOptions: {
          args: [ `load-extension=${extPath}` ]
        }
      })
      .forBrowser('chrome')
      .build();
    await this.driver.get('https://github.com');
  });

  after(async () => {
    await this.driver.quit();
  });

  it('should open Github', async () => {
    const title = await this.driver.getTitle();
    expect(title).to.equal('GitHub · Where software is built');
  });

  it('should render inject app', async () => {
    await this.driver.wait(() =>
      this.driver.findElements(webdriver.By.className('inject-react-example'))
        .then(elems => elems.length > 0)
      , 10000, 'Inject app not found');
  });

  it('should link to repo page with click "view repo" link', async () => {
    await this.driver.wait(() =>
      this.driver.findElements(webdriver.By.className('inject-react-example-repo-button'))
        .then(elems => elems.length > 0)
    , 10000, 'Inject app not found');

    this.driver.findElement(webdriver.By.className('inject-react-example-repo-button')).click();
    await delay(1000);
    const tabs = await this.driver.getAllWindowHandles();
    this.driver.switchTo().window(tabs[1]);
    const title = await this.driver.getTitle();
    expect(title).to.equal('jhen0409/react-chrome-extension-boilerplate: Boilerplate for Chrome Extension React.js project');
  });
});
