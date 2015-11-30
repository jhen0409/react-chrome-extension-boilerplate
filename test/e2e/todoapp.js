import path from 'path';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';

function findList(driver) {
  return driver.findElements(webdriver.By.css('.todo-list > li'));
}

const addTodo = async (driver, key) => {
  // add todo
  driver.findElement(webdriver.By.className('new-todo')).sendKeys(key + webdriver.Key.RETURN);
  const todos = await findList(driver);
  return { todo: todos[0], count: todos.length };
};

const editTodo = async (driver, index, key) => {
  let todos = await findList(driver);
  const label = todos[index].findElement(webdriver.By.tagName('label'));
  // dbl click to enable textarea
  await driver.actions().doubleClick(label).perform();
  // typing & enter
  driver.actions().sendKeys(key + webdriver.Key.RETURN).perform();

  todos = await findList(driver);
  return { todo: todos[index], count: todos.length };
};

const completeTodo = async (driver, index) => {
  let todos = await findList(driver);
  todos[index].findElement(webdriver.By.className('toggle')).click();
  todos = await findList(driver);
  return { todo: todos[index], count: todos.length };
};

const deleteTodo = async (driver, index) => {
  let todos = await findList(driver);
  driver.executeScript(
    `document.querySelectorAll('.todo-list > li')[${index}]
      .getElementsByClassName('destroy')[0].style.display = 'block'`
  );
  todos[index].findElement(webdriver.By.className('destroy')).click();
  todos = await findList(driver);
  return { count: todos.length };
};

describe('window (popup) page', function() {
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
    await this.driver.get('chrome://extensions-frame');
    const elems = await this.driver.findElements(webdriver.By.className('extension-list-item-wrapper'));
    const extensionId = await elems[1].getAttribute('id');
    await this.driver.get(`chrome-extension://${extensionId}/window.html`);
  });

  after(async () => {
    await this.driver.quit();
  });

  it('should open Redux TodoMVC Example', async () => {
    const title = await this.driver.getTitle();
    expect(title).to.equal('Redux TodoMVC Example');
  });

  it('should can add todo', async () => {
    const { todo, count } = await addTodo(this.driver, 'Add tests');
    expect(count).to.equal(2);
    const text = await todo.findElement(webdriver.By.tagName('label')).getText();
    expect(text).to.equal('Add tests');
  });

  it('should can edit todo', async () => {
    const { todo, count } = await editTodo(this.driver, 0, 'Ya ');
    expect(count).to.equal(2);
    const text = await todo.findElement(webdriver.By.tagName('label')).getText();
    expect(text).to.equal('Ya Add tests');
  });

  it('should can complete todo', async () => {
    const { todo, count } = await completeTodo(this.driver, 0);
    expect(count).to.equal(2);
    const className = await todo.getAttribute('class');
    expect(className).to.equal('completed');
  });

  it('should can complete all todos', async () => {
    this.driver.findElement(webdriver.By.className('toggle-all')).click();
    const todos = await findList(this.driver);
    const classNames = await Promise.all(todos.map((todo) => todo.getAttribute('class')));
    expect(classNames.every((name) => name === 'completed')).to.equal(true);
  });

  it('should can delete todo', async () => {
    const { count } = await deleteTodo(this.driver, 0);
    expect(count).to.equal(1);
  });

  it('should can clear completed todos if completed todos count > 0', async () => {
    // current todo count: 1
    await addTodo(this.driver, 'Add 1');
    const { count } = await addTodo(this.driver, 'Add 2');
    expect(count).to.equal(3);

    await completeTodo(this.driver, 0);
    this.driver.findElement(webdriver.By.className('clear-completed')).click();
    const todos = await findList(this.driver);
    const classNames = await Promise.all(todos.map((todo) => todo.getAttribute('class')));
    expect(classNames.every((name) => name !== 'completed')).to.equal(true);
  });

  it('should cannot clear completed todos if completed todos count = 0', async () => {
    const todos = await this.driver.findElements(webdriver.By.className('clear-completed'));
    expect(todos.length).to.equal(0);
  });

  it('should can filter active todos', async () => {
    // current todo count: 2
    await addTodo(this.driver, 'Add 1');
    const { count } = await addTodo(this.driver, 'Add 2');
    expect(count).to.equal(3);

    await completeTodo(this.driver, 0);
    let todos = await this.driver.findElements(webdriver.By.css('.filters > li'));
    todos[1].click();
    todos = await findList(this.driver);
    expect(todos.length).to.equal(2);
  });

  it('should can filter completed todos', async () => {
    // current todo count: 2
    let todos = await this.driver.findElements(webdriver.By.css('.filters > li'));
    todos[2].click();
    todos = await findList(this.driver);
    expect(todos.length).to.equal(1);
  });
});