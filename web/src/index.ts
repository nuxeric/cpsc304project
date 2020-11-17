import Server from "./server";

new Server(Number(process.env.BACKEND_PORT)).listen();