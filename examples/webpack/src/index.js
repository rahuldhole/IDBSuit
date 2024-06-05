import IDBSuit from './config/IDBSuit.js'
class App {
  constructor() {
    this.db = IDBSuit();
  }

  displayDB() {
    this.db.openDatabase()
      .then(dbInstance => {
        document.getElementById('root').innerText = 'DB Version '+dbInstance.version;
      })
      .catch(error => {
        console.error('Error opening database:', error);
      });

    // this.db.destroy()
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

