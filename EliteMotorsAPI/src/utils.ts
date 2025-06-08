import { Cliente } from "./types";
import { createHash } from "crypto";

const parseDni = (dniFromRequest: any): string => {
    if (!isString(dniFromRequest) || !isDni(dniFromRequest)) {
        throw new Error("Incorrect or missing dni");
    }
    return dniFromRequest;
}

const parseUsuario = (usuarioFromRequest: any): string => {
    if (!isString(usuarioFromRequest) || usuarioFromRequest.length < 5) {
        throw new Error("Incorrect or missing usuario");
    }

    return usuarioFromRequest;
}

const parsePasswd = (passwdFromRequest: any): string => {
    if (!isString(passwdFromRequest) || passwdFromRequest.length < 8) {
        throw new Error("Incorrect or missing passwd");
    }

    return sha256Hash(passwdFromRequest);
}

const parseNombre = (nombreFromRequest: any): string => {
    if (!isString(nombreFromRequest) || nombreFromRequest.length < 4) {
        throw new Error("Incorrect or missing nombre");
    }

    return nombreFromRequest;
}

const parseApellidos = (apellidosFromRequest: any): string => {
    if (!isString(apellidosFromRequest)) {
        throw new Error("Incorrect or missing apellidos");
    }

    return apellidosFromRequest;
}

const parseTelefono = (telefonoFromRequest: any): string | null => {
    if (!isTelefono(telefonoFromRequest) && isString(telefonoFromRequest)) {
        throw new Error("Incorrect or missing telefono");
    }

    return telefonoFromRequest;
}

const parseEmail = (emailFromRequest: any): string | null => {
    if (isString(emailFromRequest) && !isEmail(emailFromRequest)) {
        throw new Error("Incorrect or missing email");
    }

    return emailFromRequest;
}

const parseDireccion = (direccionFromRequest: any): string | null => {
    if (!isString(direccionFromRequest) || direccionFromRequest.length < 10) {
        throw new Error("Incorrect or missing direccion");
    }

    return direccionFromRequest;
}

//Funciones de validación
const isEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/.test(email);
};

export const sha256Hash = (pass: string): string => {
    return createHash("sha256").update(pass).digest("hex");
};

const isDni = (dni: string): boolean => {
    const patron = /^\d{8}[a-zA-Z]$/;

    if (!patron.test(dni)) {
        return false;
    }

    const letrasDNI = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(dni.slice(0, -1), 10);
    const letra = dni.slice(-1).toUpperCase();

    return (letrasDNI[numero % 23] === letra);
}

const isString = (string: string): boolean => {
    return typeof string === "string";
}

const isTelefono = (telefono: string): boolean => {
    telefono = telefono.replace(/\s+/g, "").replace(/-/g, "");

    // Patrón para números de teléfono españoles válidos
    const patron = /^(\+34)?(\d{9})$/;
    return patron.test(telefono);
}

// const isDate = (date: string): boolean => {
//     return Boolean(Date.parse(date));
// }

// const isWeather = (param : any ) : boolean =>{
//     return Object.values(Weather).includes(param);
// }

function toNewClientEntry(object: any): Cliente {
    const newEntry: Cliente = {
        dni_cliente: parseDni(object.dni_cliente),
        usuario: parseUsuario(object.usuario),
        passwd: parsePasswd(object.passwd),
        nombre: parseNombre(object.nombre),
        apellidos: parseApellidos(object.apellidos),
        telefono: parseTelefono(object.telefono),
        email: parseEmail(object.email),
        direccion: parseDireccion(object.direccion)
    }
    return newEntry;
}

export default toNewClientEntry