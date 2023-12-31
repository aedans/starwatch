import http from "http";
import express from "express";
import{ Server } from "socket.io";
import { Lib } from "lance-gg";
import StarwatchGameEngine from "../common/StarwatchGameEngine";
import StarwatchServerEngine from "./StarwatchServerEngine";

const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  allowEIO3: true,
  cors: {
    credentials: true,
    origin: "http://localhost:5173",
  },
});

app.use(express.static("dist"));
app.use(express.static("public"));

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const gameEngine = new StarwatchGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
const serverEngine = new StarwatchServerEngine(io, gameEngine);

serverEngine.start();
