import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { cliente } from '../model/cliente';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  constructor(private http: HttpClient) {}


  /**
   * Peticiónes a la API para obtener los clientes
   * @returns Observable de un array de las clientes
   *  de tipo {}
   */

  login(user: string, pass: string): Observable<cliente[]> {
    const url = `${environment.api.login}/${user}/${pass}`; // Construcción de la URL
    return this.http.get<cliente[]>(url);
  }
  
  
  getAllClientes(): Observable<cliente[]> {
    return this.http.get<cliente[]>(environment.api.clientes);  
  }

  addCliente(cliente: any): Observable<cliente[]> {
    return this.http.post<cliente[]>(environment.api.register, cliente);
  }

  getClienteById(id: number): void {
    console.log('getClienteById');
  }

  updateCliente(cliente: any): void {
    console.log('updateCliente');
  }

  deleteCliente(id: number): void {
    console.log('deleteCliente');
  }
}
