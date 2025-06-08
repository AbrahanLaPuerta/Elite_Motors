export interface Cliente {
    dni_cliente: string;
    usuario: string;
    passwd: string;
    nombre: string;
    apellidos: string;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
}


export type NewClientEntry = Omit<Cliente, "passwd">;
// import { Visibility, Weather } from "./enums";


// export interface DiaryEntry {
//     id: number;
//     date: string;
//     weather: Weather;
//     visibility: Visibility;
//     comment: string;
// }

// export type NonSensitiveInfoDiaryEntry = Omit<DiaryEntry, "comment">;

// export type newDiaryEntry = Omit<DiaryEntry, "id">;