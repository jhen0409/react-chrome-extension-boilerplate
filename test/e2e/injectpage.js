import co from 'co';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { check } from '../func';

describe('inject page (in github.com/jhen0409/react-chrome-extension-boilerplate)', function() {
  this.timeout(15000);

  before(function(done) {
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
    this.driver.quit().then(done);
  });

  it('should open Github', function(done) {
    co(function *() {
      const title = yield this.driver.getTitle();
      expect(title).to.equal('GitHub · Where software is built');
      done();
    }.bind(this)).catch(done);
  });

  it('should render inject app', function(done) {
    co(function *() {
      yield this.driver.wait(() =>
        this.driver.findElements(webdriver.By.className('inject-react-example'))
          .then(elems => elems.length > 0)
        , 10000, 'Inject app not found');
      done();
    }.bind(this)).catch(done);
  });

  it('should link to repo page with click "view repo" link', function(done) {
    co(function *() {
      yield this.driver.wait(() =>
        this.driver.findElements(webdriver.By.className('inject-react-example-repo-button'))
          .then(elems => elems.length > 0)
      , 10000, 'Inject app not found');

      this.driver.findElement(webdriver.By.className('inject-react-example-repo-button')).click();
      const tabs = yield this.driver.getAllWindowHandles();
      this.driver.switchTo().window(tabs[1]);
      const title = yield this.driver.getTitle();
      expect(title).to.equal('jhen0409/react-chrome-extension-boilerplate · GitHub');
      done();
    }.bind(this)).catch(done);
  });
});