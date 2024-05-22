import IDBSuit from './config/IDBSuit.js'
class App {
  constructor() {
    this.message = 'Hello, ES6!';
  }

  displayDB() {
    console.log(this.message);

    const idbs = IDBSuit();

    console.log(idbs);

    idbs.openDatabase()
      .then(dbInstance => {
        document.getElementById('root').innerText = 'DB Version '+dbInstance.version;
      })
      .catch(error => {
        console.error('Error opening database:', error);
      });

    // idbs.destroy()
    //   .then(() => {
    //     console.log('Database deleted successfully');
    //   })
    //   .catch(error => {
    //     console.error('Error deleting database:', error);
    //   });
  }
}

// Create an instance of SimpleApp
const myApp = new App();

// Display the message
myApp.displayDB();

