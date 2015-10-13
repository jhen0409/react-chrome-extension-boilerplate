import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { check } from '../func';

function findList(driver) {
  return driver.findElements(webdriver.By.css('.todo-list > li'));
}

function addTodo(driver, key) {
  // add todo
  driver.findElement(webdriver.By.className('new-todo')).sendKeys(key + webdriver.Key.RETURN);
  return driver.findElements(
    webdriver.By.css('.todo-list > li')
  ).then((elems) => ({ elem: elems[0], length: elems.length }));
}

function editTodo(driver, index, key) {
  return findList(driver).then(elems => {
    // double click label
    const label = elems[index].findElement(webdriver.By.tagName('label'));
    return driver.actions().doubleClick(label).perform();
  }).then(() => {
    // edit todo
    driver.actions().sendKeys(key + webdriver.Key.RETURN).perform();
    return driver.findElements(
      webdriver.By.css('.todo-list > li')
    ).then((elems) => ({ elem: elems[index], length: elems.length }));
  });
}

function completeTodo(driver, index) {
  return findList(driver).then(elems => {
    // complete todo
    elems[index].findElement(webdriver.By.className('toggle')).click();
    return ({ elem: elems[index], length: elems.length });
  });
}

function deleteTodo(driver, index) {
  return findList(driver).then(elems => {
    // delete todo
    driver.executeScript(
      `document.querySelectorAll('.todo-list > li')[${index}]
        .getElementsByClassName('destroy')[0].style.display = 'block'`
    );
    elems[index].findElement(webdriver.By.className('destroy')).click();
    return findList(driver);
  }).then((elems) => ({ length: elems.length }));
}

describe('window (popup) page', function() {

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
    this.driver.get('chrome://extensions-frame').then(() =>
      this.driver.findElements(webdriver.By.className('extension-list-item-wrapper'))
    ).then(elems =>
      elems[1].getAttribute('id')
    ).then(id =>
      this.driver.get(`chrome-extension://${id}/window.html`).then(done)
    );
  });

  after(function(done) {
    this.timeout(15000);
    this.driver.quit().then(done);
  });

  it('should open Redux TodoMVC Example', function(done) {
    this.driver.getTitle().then((title) => {
      expect(title).to.equal('Redux TodoMVC Example');
      done();
    });
  });

  it('should can add todo', function(done) {
    addTodo(this.driver, 'Add tests').then(({ elem, length }) => {
      expect(length).to.equal(2);
      return elem.findElement(webdriver.By.tagName('label')).getText();
    }).then(text => {
      expect(text).to.equal('Add tests');
      done();
    });
  });

  it('should can edit todo', function(done) {
    editTodo(this.driver, 0, 'Ya ').then(({ elem, length }) => {
      expect(length).to.equal(2);
      return elem.findElement(webdriver.By.tagName('label')).getText();
    }).then(text => {
      expect(text).to.equal('Ya Add tests');
      done();
    });
  });

  it('should can complete todo', function(done) {
    completeTodo(this.driver, 0).then(({ elem, length }) => {
      expect(length).to.equal(2);
      return elem.getAttribute('class');
    }).then(className => {
      expect(className).to.equal('completed');
      done();
    });
  });

  it('should can complete all todos', function(done) {
    this.driver.findElement(webdriver.By.className('toggle-all')).click().then(() =>
      findList(this.driver)
    ).then((elems) =>
      Promise.all(elems.map((elem) => elem.getAttribute('class')))
    ).then(classNames => {
      expect(classNames.every((name) => name === 'completed')).to.equal(true);
      done();
    });
  });

  it('should can delete todo', function(done) {
    deleteTodo(this.driver, 0).then(({ length }) => {
      expect(length).to.equal(1);
      done();
    });
  });

  it('should can clear completed todos if completed todos count > 0', function(done) {
    // current list length: 1
    addTodo(this.driver, 'Add 1').then(() =>
      addTodo(this.driver, 'Add 2')
    ).then(({ length }) => {
      expect(length).to.equal(3);
      return completeTodo(this.driver, 0);
    }).then(() => {
      this.driver.findElement(webdriver.By.className('clear-completed')).click();
      return findList(this.driver);
    }).then(elems =>
      Promise.all(elems.map((elem) => elem.getAttribute('class')))
    ).then(classNames => {
      expect(classNames.every((name) => name !== 'completed')).to.equal(true);
      done();
    });
  });

  it('should cannot clear completed todos if completed todos count = 0', function(done) {
    this.driver.findElements(webdriver.By.className('clear-completed')).then((elems) => {
      expect(elems.length).to.equal(0);
      done();
    });
  });

  it('should can filter active todos', function(done) {
    // current todo count: 2
    addTodo(this.driver, 'Add 1').then(() =>
      addTodo(this.driver, 'Add 2')
    ).then(({ length }) => {
      expect(length).to.equal(3);
      return completeTodo(this.driver, 0);
    }).then(() =>
      this.driver.findElements(webdriver.By.css('.filters > li'))
    ).then(elems => {
      // elems[1] -> Active btn
      elems[1].click();
      return findList(this.driver);
    }).then(elems => {
      expect(elems.length).to.equal(2);
      done();
    });
  });

  it('should can filter completed todos', function(done) {
    // current todo count: 2
    this.driver.findElements(webdriver.By.css('.filters > li')).then(elems => {
      // elems[2] -> Completed btn
      elems[2].click();
      return findList(this.driver);
    }).then(elems => {
      expect(elems.length).to.equal(1);
      done();
    });
  });
});