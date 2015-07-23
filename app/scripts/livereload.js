let host = 'localhost';
let port = 35729;
let connection = new WebSocket(`ws://${host}:${port}/livereload`);

connection.onerror = (error) => {
  console.log('reload connection got error:', error);
};

connection.onmessage = (e) => {
  if (e.data) {
    let data = JSON.parse(e.data);
    if (data && data.command === 'reload') {
      chrome.runtime.reload();
    }
  }
};