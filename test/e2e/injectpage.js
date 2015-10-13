import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { check } from '../func';

describe('inject page (in github.com/jhen0409/react-chrome-extension-boilerplate)', function() {

  before(function(done) {
    this.timeout(6000);
    this.driver = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .withCapabilities({
        chromeOptions: {
          args: [ 'load-extension=./build' ]
        }
      })
      .forBrowser('chrome')
      .build();
    this.driver.get('https://github.com').then(done);
  });

  after(function(done) {
    this.timeout(20000);
    this.driver.quit().then(done);
  });

  it('should open Github', function(done) {
    this.driver.getTitle().then((title) => {
      expect(title).to.equal('GitHub · Where software is built');
      done();
    });
  });

  it('should render inject app', function(done) {
    // inject load & run bundle time
    this.timeout(8000);
    this.driver.wait(() =>
      this.driver.findElements(webdriver.By.className('inject-react-example'))
        .then(elems => elems.length > 0)
    , 5000);
    done();
  });

  it('should link to repo page with click "view repo" link', function(done) {
    this.timeout(8000);
    this.driver.wait(() =>
      this.driver.findElements(webdriver.By.className('inject-react-example-repo-button'))
        .then(elems => elems.length > 0)
    , 5000);
    this.driver.findElement(webdriver.By.className('inject-react-example-repo-button')).click();
    this.driver.getAllWindowHandles().then(tabs => {
      this.driver.switchTo().window(tabs[1]);
      return this.driver.getTitle();
    }).then((title) => {
      expect(title).to.equal('jhen0409/react-chrome-extension-boilerplate · GitHub');
      done();
    });
  });
});