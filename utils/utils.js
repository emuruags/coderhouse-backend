import {mySqlDatabase, sqlLite3Database} from '../config/configuration.js';

export class KnexConfiguration {
  constructor(config, tableName) {
    this.config = config;
    this.tableName = tableName;
  }


  async insertData(object) {
    try {
      await this.config(this.tableName).insert(object);
    } catch (error) {
      console.log(error);
    } 
  }

  async deleteData() {
    try {
      await this.config(this.tableName).del();
    } catch (error) {
      console.log(error);
    } finally {
      this.config.destroy();
    }
  }

  async deleteDataById(id) {
    try {
      await this.config(this.tableName).where('id', id).del();
    } catch (error) {
      console.log(error);
    } finally {
      this.config.destroy();
    }
  }

  async getAll() {
    try {
      return await this.config.select('*').from(this.tableName).timeout(1000);
    } catch (error) {
      console.log(error);
    } 
  }

  async getById(id) {
    try {
      return await this.config(this.tableName).from(this.tableName).select('*').where('id', '=', id);
    } catch (error) {
      console.log(error);
    } finally {
      this.config.destroy();
    }
  }

  async updateData(object) {
    try {
      await this.config(this.tableName).from(this.tableName).where('id', '=', id).update(object);
    } catch (error) {
      console.log(error);
    } finally {
      this.config.destroy();
    }
  }
}

export const createProductTable = () => {

  mySqlDatabase.schema.hasTable('products').then((exist)=>{
    if(!exist) {
      mySqlDatabase.schema.createTableIfNotExists('products', function (table) {
      table.increments();
      table.string('title');
      table.decimal('price');
      table.string('thumbnails');
      }).then(()=> console.log("Tabla created"))
      .catch(error => console.log(error));
    }
  }).catch(error => console.log(error));



};

export const createMessagesTable = () => {
  sqlLite3Database.schema.hasTable('messages').then((exist)=>{
    if(!exist) {
      sqlLite3Database.schema.createTableIfNotExists('messages', function (table) {
        table.increments();
        table.string('email');
        table.datetime('dateTime');
        table.string('text');
      }).then(()=> console.log("Table messages created"))
          .catch(error => console.log(error));
    }
  }).catch(error => console.log(error));
};

export default { createProductTable, createMessagesTable, KnexConfiguration }; 