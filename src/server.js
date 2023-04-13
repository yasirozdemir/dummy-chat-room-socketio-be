import Express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";
import { newSocketConnection } from "./socket/index.js";

const expressServer = Express();
const port = process.env.PORT || 3001;

const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);

socketioServer.on("connection", newSocketConnection);

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(expressServer));
  });
});
