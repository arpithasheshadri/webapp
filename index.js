import express from 'express';
import Router from './routes/index.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import sequelize from './db/sequelize.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({
  override: true,
  path: path.join(__dirname,'development.env')
});


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.raw({type: '*/*'}));



Router(app);
sequelize.sync({ force: false, alter:true })
    .then(() => {
        console.log('Database synchronization successful.');
    })
    .catch(err => {
        console.error('Database synchronization failed:', err);
    });

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`);
});

export default app;

// Resources used -
// https://stackoverflow.com/questions/60647282/how-to-consume-json-in-express-js
// https://stackoverflow.com/questions/28927836/prevent-sequelize-from-outputting-sql-to-the-console-on-execution-of-query
// https://stackoverflow.com/questions/74018236/in-nodejs-how-to-have-individual-allowed-methods-for-each-express-enpoint
// https://stackoverflow.com/questions/13371284/curl-command-line-url-parameters