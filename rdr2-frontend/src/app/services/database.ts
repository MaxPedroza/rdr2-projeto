import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============================================
// SERVIÇO DE BANCO DE DADOS
// ============================================
// Gerencia todas as requisições HTTP para MongoDB

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private API_URL = this.getApiUrl();

  constructor(private http: HttpClient) {}

  // Detecta URL da API baseado no ambiente
  private getApiUrl(): string {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Development
      return 'http://localhost:3000/api';
    } else {
      // Production (Render ou outro)
      return 'https://rdr2-backend.onrender.com/api';
    }
  }

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