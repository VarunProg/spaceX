import express from "express";
import bodyParser from "body-parser";
import routes from "./routes/routes";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
