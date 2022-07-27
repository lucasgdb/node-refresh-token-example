import "express-async-errors";

import express from "express";

import { interceptErrors } from "./middlewares/interceptErrors";
import { router } from "./routes";

const app = express();

app.use(express.json());

app.use(router);

app.use(interceptErrors);

app.listen(3000).on("listening", () => console.log("listening on 3000"));
