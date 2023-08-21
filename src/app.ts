import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";

import HttpException from "@/libs/http-exception";
import ErrorFilter from "@/middlewares/error.filter";
import { postRouter } from "@/routes";

dotenv.config();

const app: Express = express();

app.set("port", process.env.PORT || 8080);

if (process.env.NODE_ENV === "production") {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(cors());
}
app.use(morgan("dev"));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpException(
    `${req.method} ${req.url} 라우터가 없습니다.`,
    404
  );
  next(error);
});

app.use(ErrorFilter);

app.listen(app.get("port"), async () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${app.get("port")}`
  );
});
