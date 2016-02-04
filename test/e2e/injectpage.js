import path from 'path';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import delay from 'delay';

describe('inject page (in github.com)', function() {
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

  it('should find `Open TodoApp` button', async () => {
    await this.driver.wait(() =>
      this.driver.findElements(webdriver.By.css('.inject-react-example button'))
        .then(elems => elems.length > 0)
    , 10000, 'Inject app `Open TodoApp` button not found');
  });

  it('should find iframe', async () => {
    this.driver.findElement(webdriver.By.css('.inject-react-example button')).click();
    await delay(1000);
    await this.driver.wait(() =>
      this.driver.findElements(webdriver.By.css('.inject-react-example iframe'))
        .then(elems => elems.length > 0)
    , 10000, 'Inject app iframe not found');
  });
});
