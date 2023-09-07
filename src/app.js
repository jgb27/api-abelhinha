import express from "express";
import router from "./router.js";

const app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", 'http://localhost:5173');
  res.setHeader("Access-Control-Allow-Methods", 'GET, POST, DELETE');
  res.setHeader("Access-Control-Allow-Headers", 'X-Requested-With,content-type');
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
})

app.use(express.json());
app.use(router);


export default app;
