const { defineConfig } = require("cypress");

const { configurePlugin } = require('cypress-mongodb');

module.exports = defineConfig({
  env: {
    mongodb: {
      uri: 'mongodb+srv://srayssa:sarah1801@livroapi.kkb69.mongodb.net/?retryWrites=true&w=majority&appName=LivroAPI',
      database: 'test',
      collection: 'livros'
    }
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      configurePlugin(on);
    },
  },
});