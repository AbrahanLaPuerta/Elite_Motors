import express from "express";
import * as MySQLService from "../services/MySQLService";

const router = express.Router();

router.get("/", async (_req, res) => {
  const Vehiculos = await MySQLService.getVehiculos();
  console.log(Vehiculos);
  res.send(Vehiculos);
});

// router.post("/", async (req, res) => {
//   const nuevoVehiculo = req.body;
//   await MySQLService.createVehiculo(nuevoVehiculo);
//   res.send("Vehículo creado");
// });

export default router;
