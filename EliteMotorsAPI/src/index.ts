import express from "express";
import cors from "cors";

import clientsRouter from "./routes/clients";
import vehiculosRouter from "./routes/vehiculos";

const app = express();

app.use(express.json()); //Middleware to parse JSON

app.use(cors());

const PORT = 3000;

app.get("/alive", (_req, res) => {
    console.log(new Date().toLocaleDateString());
    res.send("is alive");
});

app.use("/get/clients", clientsRouter);
app.use("/get/vehiculos", vehiculosRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});