import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============================================
// SERVIÇO DE BANCO DE DADOS
// ============================================
// Gerencia todas as requisições HTTP para MongoDB

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ==========================================
  // SEÇÃO 1 - LEITURA DE DADOS
  // ==========================================
  // Recupera documentos da coleção
  
  getDados(colecao: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${colecao}`);
  }

  // ==========================================
  // SEÇÃO 2 - ATUALIZAÇÃO DE DADOS
  // ==========================================
  // Sincroniza status do item com o banco (obtido, materiais)
  
  atualizarStatus(colecao: string, id: string, item: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${colecao}/${id}`, item);
  }

  // ==========================================
  // SEÇÃO 3 - INSERÇÃO DE DADOS
  // ==========================================
  // Cria novo documento na coleção
  
  cadastrarItem(colecao: string, item: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${colecao}`, item);
  }
}