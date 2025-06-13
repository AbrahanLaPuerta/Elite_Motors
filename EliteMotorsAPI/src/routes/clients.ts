import express from "express";
import * as MySQLService from "../services/MySQLService";
import toNewClientEntry from "../utils";

const router = express.Router();

router.get("/", async (_req, res) => {
    const Clientes = await MySQLService.getClients();
    console.log(Clientes);
    res.send(Clientes);
});

router.get("/:dni", async (req, res) => {
    const cliente = await MySQLService.getClientsByDni(req.params.dni);

    if (cliente.length != 0){
        res.send(cliente);
    } else {
        res.status(404).send("Client not found");
    }
    
});

router.post("/register", async (req, res) => {
    try {
        const newClientEntry = toNewClientEntry(req.body);
        
        const addedDiaryEntry = await MySQLService.addClient(newClientEntry); // Usa await

        res.json(addedDiaryEntry);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
});

router.get("/login/:usuario/:passwd", async (req, res) => {
    const cliente = await MySQLService.getLogedUser(req.params.usuario, req.params.passwd);
    if (cliente != null && cliente.length != 0){
        res.send(cliente);
    } else {
        res.status(404).send("Client not found");
    }
});

router.post("/", async (req, res) => {
    try {
        const newDiaryEntry = toNewClientEntry(req.body);
        
        const addedDiaryEntry = await MySQLService.addClient(newDiaryEntry); // Usa await

        res.json(addedDiaryEntry);
    } catch (e: any) {
        res.status(400).send(e.message);
    }
});

export default router;