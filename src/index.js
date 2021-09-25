// import router from './routes/main';
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const typeorm = require("typeorm");
const User = require("./models/User").User;
const router = require('./routes/routes');

const app = express();

const corsConfig = {
  origin: ['*'], // Change this later
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(router);

(async () => {
  try {
    await typeorm.createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      },
      synchronize: true,
      logging: false,
      entities: [
          require("./entities/UserSchema")
      ]
    })
    app.listen(process.env.PORT, () => {
      console.log(`Server is up and listening on port ${process.env.PORT}.`);
    });
  } catch (err) {
    console.log(err);
  }
})();