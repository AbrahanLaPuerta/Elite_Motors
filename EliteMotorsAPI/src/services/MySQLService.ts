import { PrismaClient } from '@prisma/client'
import { Cliente, NewClientEntry } from '../types'
import { sha256Hash } from '../utils'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();


const prisma = new PrismaClient()

export const getClients = async (): Promise<Cliente[]> => {
    const users = await prisma.cliente.findMany()

    return users
}

export const getClientsByDni = async (dni: string): Promise<Cliente[]> => {
    const user = await prisma.cliente.findMany({
        where: { dni_cliente: dni }
    })

    return user
}

export const addClient = async (Cliente: Cliente): Promise<NewClientEntry> => {

    const { passwd, ...rest } = Cliente;
    const newClient = {
        passwd: sha256Hash(Cliente.passwd),
        ...rest
    }

    await prisma.cliente.create({
        data: newClient
    })

    return newClient;
}

export const getLogedUser = async (usuario: string, passwd: string): Promise<any> => {
    const user = await prisma.cliente.findFirst({
        where: {
            usuario: usuario,
            passwd: sha256Hash(passwd)
        }
    })

    if (user) {
    const secretKey = process.env.JWT_SECRET || "SECRETPASSWD3409234";

    const payload = {
        id: user?.dni_cliente,
        usuario: user?.usuario,
        email: user?.email,
    };
    
    // Opciones del token (expira en 1 hora por ejemplo)
    const options = { expiresIn: '1h' };

    const tokenAndUser = {
        "token" : jwt.sign(payload, secretKey as any, options as any),
        ...user
    };
    return tokenAndUser;
    }
    return null;
}

export const getVehiculos = async (): Promise<any[]> => {
    const vehiculos = await prisma.vehiculo.findMany()
    return vehiculos
}