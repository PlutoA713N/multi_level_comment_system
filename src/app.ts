import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import httpLogger from "./middleware/logger_middleware/http.logger";
import {setupSwaggerDocs} from "./swagger";
import {errorHandler} from "./middleware/express_middleware/error.middleware";
import {helmetOptions} from "./helmet/helmet.options";
import {apiLimiter} from "./middleware/express_middleware/rate.limiter.middleware";
import {requestIdMiddleware} from "./middleware/express_middleware/requestId.middleware";
import path from "node:path";
import HTTP from "http-status-codes";

import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/user/index"
import postRoutes from "./routes/post/index"

const app = express();

app.use(requestIdMiddleware)
app.use(helmet(helmetOptions))
app.use(cors());
app.use(apiLimiter)
app.use(httpLogger)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

setupSwaggerDocs(app)

app.get('/', (req: Request, res: Response) => {
   res.redirect("/Architecture.html")
});

app.use("/health", healthRoutes)
app.use("/user", userRoutes)
app.use("/api/posts", postRoutes)


app.use((req: Request, res: Response) => {
    res.status(HTTP.NOT_FOUND).send(path.join(__dirname, "../public/Not-Found.html"));
})

app.use(errorHandler)

export {app}