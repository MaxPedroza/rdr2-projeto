import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from './services/database';

// ============================================
// COMPONENTE PRINCIPAL - RDR2 TRACKER DASHBOARD
// ============================================

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  
  // ==========================================
  // SEÇÃO 1 - PROPRIEDADES DE ESTADO
  // ==========================================
  // Gerencia dados, filtros e estado da aplicação
  
  listaItens: any[] = [];
  termoBusca: string = ''; 
  tituloAtual: string = 'ANIMAIS LENDÁRIOS';
  colecaoAtiva: string = 'animais';
  personagemSelecionado: string = 'Todos';
  subFiltroAtivo: string = 'Todos';
  gruposExpandidos: Set<string> = new Set();
  trapperTipo: string = 'conjuntos'; // 'conjuntos' ou 'roupas'
  ultimosObtidos: any[] = []; // Rastreia últimos itens obtidos

  // Modal de confirmação
  confirmarVisivel: boolean = false;
  mensagemConfirmacao: string = '';
  acaoConfirmada: (() => void) | null = null;

  totaisPorCategoria: any = { 
    animais: 16, peixes_lendarios: 13, amuletos: 16, desafios: 90,
    colecionaveis: 50, equipamentos: 25, receitas: 21, pearson: 14,
    trapper_conjuntos: 75,
    trapper_roupas: 60,
    missoes_mundo: 21
  };
  obtidosGlobal: any = {};

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.carregar(this.colecaoAtiva);
    this.inicializarContagemGlobal();
  }

  // ==========================================
  // SEÇÃO 2 - CONTROLE DE MODAL
  // ==========================================
  // Gerencia modal de confirmação para ações destrutivas
  
  mostrarConfirmacao(mensagem: string, acao: () => void) {
    this.mensagemConfirmacao = mensagem;
    this.acaoConfirmada = acao;
    this.confirmarVisivel = true;
  }

  confirmar() {
    if (this.acaoConfirmada) {
      this.acaoConfirmada();
    }
    this.confirmarVisivel = false;
    this.acaoConfirmada = null;
  }

  cancelar() {
    this.confirmarVisivel = false;
    this.acaoConfirmada = null;
  }

  // ==========================================
  // SEÇÃO 3 - MAPA DE ÍCONES
  // ==========================================
  // Define ícone FontAwesome para cada subcategoria
  
  getIconeSub(grupo: string): string {
  if (!grupo) return 'fa-bookmark';
  const g = grupo.toLowerCase();

  // PRIORIDADE 0: ANIMAIS E PEIXES (máxima prioridade)
  if (g === 'animais') return 'fa-paw';
  if (g === 'peixes') return 'fa-fish';

  // PRIORIDADE 1: RECEITAS (precisa ser primeiro para evitar conflitos)
  if (g === 'munição') return 'fa-box-open'; 
  if (g === 'saúde') return 'fa-medkit';
  if (g === 'caça') return 'fa-paw';
  if (g === 'equitação') return 'fa-horse-head';

  // PRIORIDADE 2: EQUIPAMENTOS (Igualdade exata para evitar conflito de "Armas")
  if (g === 'armas brancas') return 'fa-screwdriver-wrench'; 
  if (g === 'armas de fogo') return 'fa-gun';
  if (g === 'máscaras') return 'fa-mask';
  if (g === 'chapéus') return 'fa-hat-cowboy';

  // PRIORIDADE 3: TRAPPER (Novas Categorias do PDF)
  if (g === 'selas') return 'fa-horse-head';
  if (g === 'luvas') return 'fa-mitten';
  if (g === 'botas') return 'fa-shoe-prints';
  if (g === 'coletes') return 'fa-vest';
  if (g === 'chaparreiras') return 'fa-socks'; 
  if (g === 'acessórios') return 'fa-feather-pointed';
  if (g === 'casacos') return 'fa-coat';

  // PRIORIDADE 4: DESAFIOS (Ajuste da linha quebrada que estava no seu código)
  if (g.includes('caçador')) return 'fa-crosshairs';
  if (g.includes('atirador')) return 'fa-bullseye';
  if (g.includes('bandido')) return 'fa-user-secret';
  if (g.includes('equitador')) return 'fa-horse';
  if (g.includes('explorador')) return 'fa-map-marked-alt';
  if (g.includes('herborista')) return 'fa-leaf';
  if (g.includes('jogador')) return 'fa-dice';
  if (g.includes('sobrevivente')) return 'fa-campground';
  if (g.includes('armas')) return 'fa-gun';
  if (g.includes('estrategista')) return 'fa-chess-knight';
   
    
    // Amuletos/Talismãs
    if (g.includes('talismã')) return 'fa-hand-sparkles';
    if (g.includes('amuleto')) return 'fa-clover';

    if (g.includes('chapéu')) return 'fa-hat-cowboy';
    if (g.includes('máscara')) return 'fa-mask'; 

    // Coletas
    if (g.includes('osso')) return 'fa-bone';
    if (g.includes('rochas')) return 'fa-mountain';
    if (g.includes('cartões')) return 'fa-address-card';
    if (g.includes('tesouro')) return 'fa-coins';
    if (g.includes('apanhadores')) return 'fa-sun';
    if (g.includes('exóticos')) return 'fa-feather';

    // Trapper
    if (g.includes('equipamentos')) return 'fa-toolbox';
    if (g.includes('calçados')) return 'fa-shoe-prints';
    if (g.includes('coletes')) return 'fa-vest';
    if (g.includes('vestuário')) return 'fa-tshirt';

    // Mundo
    if (g.includes('mundo')) return 'fa-globe-americas';
    
    // Pearson
    if (g.includes('pearson') || g.includes('acampamento')) return 'fa-tents';
    if (g.includes('bolsa') || g.includes('satchel')) return 'fa-bag-shopping';
    if (g.includes('cosmético')) return 'fa-wand-magic-sparkles';

    return 'fa-bookmark';
  }

  // ==========================================
  // SEÇÃO 4 - LÓGICA DE CATEGORIZAÇÃO
  // ==========================================
  // Extrai subcategoria do item baseado no nome ou campo dedicado
  
 extrairSubcategoria(item: any): string {
  // TRAPPER: Se o item já tem a subcategoria definida no banco de dados
  if (this.colecaoAtiva.includes('trapper') && item.subcategoria) {
    return item.subcategoria.toUpperCase();
  }

  const n = item.nome.toLowerCase();
  
  // Lógica para coleções que ainda dependem do nome (Legado)
  if (this.colecaoAtiva === 'desafios') {
      if (n.includes('estrategista')) return 'ESTRATEGISTA';
      if (n.includes('especialista em armas')) return 'ESPECIALISTA EM ARMAS';
      if (n.includes('bandido')) return 'BANDIDO';
      if (n.includes('atirador')) return 'ATIRADOR';
      if (n.includes('equitador')) return 'EQUITADOR';
      if (n.includes('explorador')) return 'EXPLORADOR';
      if (n.includes('herborista')) return 'HERBORISTA';
      if (n.includes('sobrevivente')) return 'SOBREVIVENTE';
      if (n.includes('caçador')) return 'CAÇADOR';
      return 'JOGADOR';
  }

  if (this.colecaoAtiva === 'equipamentos') {
    if (n.includes('máscara')) return 'MÁSCARAS';
    if (n.includes('faca') || n.includes('machado') || n.includes('espada')) return 'ARMAS BRANCAS';
    if (n.includes('chapéu')) return 'CHAPÉUS';
    return 'ARMAS DE FOGO';
  }

    // COLECIONÁVEIS - Ossos, Cartões e Tesouros separados
    if (this.colecaoAtiva === 'colecionaveis') {
      if (n.includes('osso')) return 'OSSOS';
      if (n.includes('cartões') || n.includes('cartão')) return 'CARTÕES';
      if (n.includes('tesouro') || n.includes('ouro')) return 'TESOUROS';
      if (n.includes('apanhador')) return 'APANHADORES';
      if (n.includes('exótico')) return 'EXÓTICOS';
      return 'ROCHAS';
    }

    // PEARSON
    if (this.colecaoAtiva === 'pearson') {
  if (n.includes('bolsa') || n.includes('satchel')) return 'BOLSAS';
  if (n.includes('acampamento') || n.includes('mesa') || n.includes('alojamento') || n.includes('tapete')) return 'ACAMPAMENTO';
  return 'COSMÉTICOS';
}

    // RECEITAS - Subcategorias visíveis
    if (this.colecaoAtiva === 'receitas') {
      if (n.includes('cavalo') || n.includes('equitação') || n.includes('selim') || n.includes('rédea')) return 'EQUITAÇÃO';
      if (n.includes('oleo de arma') || n.includes('buckshot') || n.includes('volatil') || n.includes('dinamite') || n.includes('arremesso') || n.includes('slug') || n.includes('ponta oca') || n.includes('arma')) return 'MUNIÇÃO';
      if (n.includes('remedio') || n.includes('óleo de cobra') || n.includes('folego') || n.includes('milagroso') || n.includes('tôni')) return 'SAÚDE';
      if (n.includes('flecha')) return n.includes('caça pequena') ? 'CAÇA' : 'MUNIÇÃO';
      if (n.includes('isca') || n.includes('caça')) return 'CAÇA';
      return 'CAÇA';
    }

//MUNDO - Missoes Mundo
if (this.colecaoAtiva === 'missoes_mundo') return 'MUNDO';

    // TRAPPER_CONJUNTOS E TRAPPER_ROUPAS
    if (this.colecaoAtiva === 'trapper_conjuntos' || this.colecaoAtiva === 'trapper_roupas') {
      return item.subcategoria ? item.subcategoria.toUpperCase() : 'GERAL';
    }

    // TRAPPER (Legado)
    if (this.colecaoAtiva === 'trapper') {
      if (n.includes('reforçado') || n.includes('coldre')) return 'EQUIPAMENTOS';
      if (n.includes('bota') || n.includes('calçado')) return 'CALÇADOS';
      if (n.includes('chapéu')) return 'CHAPÉUS';
      if (n.includes('colete')) return 'COLETES';
      return 'VESTUÁRIO';
    }
    

    if (this.colecaoAtiva === 'amuletos') return n.includes('talismã') ? 'TALISMÃS' : 'AMULETOS';
    if (this.colecaoAtiva === 'animais') return 'ANIMAIS';
    if (this.colecaoAtiva === 'peixes_lendarios') return 'PEIXES';
    if (this.colecaoAtiva === 'missoes_mundo') return 'MUNDO';

    return 'GERAL';
  }

  // ==========================================
  // SEÇÃO 5 - FORMATAÇÃO DE NOMES
  // ==========================================
  // Remove palavras de categorização do nome para exibição no front
  
  formatarNomeExibicao(item: any): string {
    let nome = item.nome;
    
    // Para equipamentos, remove palavras de categorização
    if (this.colecaoAtiva === 'equipamentos') {
      nome = nome.replace(/^Chapéu\s+/i, '').replace(/\s+-\s+Chapéu$/i, '').replace(/Chapéu\s+/i, '');
      nome = nome.replace(/^Máscara\s+/i, '').replace(/\s+-\s+Máscara$/i, '').replace(/Máscara\s+/i, '');
    }
    
    return nome;
  }

  // ==========================================
  // SEÇÃO 6 - FILTROS E AGRUPAMENTOS
  // ==========================================
  // Retorna grupos/subcategorias únicas dos itens atuais
  
  getGrupos() {
    const grupos = new Set<string>();
    this.listaItens.forEach(item => grupos.add(this.extrairSubcategoria(item)));
    return Array.from(grupos).sort();
  }

  getItensPorGrupo(grupo: string): any[] {
    // Retorna itens filtrados (por texto e personagem) que pertencem ao grupo
    return this.listaItens.filter(item => {
      const matchTexto = item.nome.toLowerCase().includes(this.termoBusca.toLowerCase());
      const matchPerso = this.personagemSelecionado === 'Todos' || !item.personagem || item.personagem.includes(this.personagemSelecionado);
      const matchGrupo = this.extrairSubcategoria(item) === grupo;
      return matchTexto && matchPerso && matchGrupo;
    });
  }

  isConjuntoCompleto(grupo: string): boolean {
    if (!this.colecaoAtiva.includes('trapper')) return false;
    const itensGrupo = this.getItensPorGrupo(grupo);
    if (itensGrupo.length === 0) return false;
    return itensGrupo.every(item => item.obtido === true);
  }

  getContagemGrupo(grupo: string): { completos: number; total: number } {
    const itens = this.getItensPorGrupo(grupo);
    const completos = itens.filter(item => item.obtido).length;
    return { completos, total: itens.length };
  }

  alternarGrupo(grupo: string) {
    if (this.gruposExpandidos.has(grupo)) {
      this.gruposExpandidos.delete(grupo);
    } else {
      this.gruposExpandidos.add(grupo);
    }
  }

  // ==========================================
  // SEÇÃO 7 - ÍCONES DE ITENS
  // ==========================================
  // Retorna ícone FontAwesome baseado no tipo/nome do item
  
  getIconeItem(item: any): string {
    const nome = item.nome.toLowerCase();
    
    // Chapéus
    if (nome.includes('chapéu') || nome.includes('boina') || nome.includes('mole') || nome.includes('sombreiro')) return 'fa-hat-cowboy';
    
    // Casacos e Jaquetas
    if (nome.includes('casaco') || nome.includes('capa') || nome.includes('jaqueta')) return 'fa-shirt';
    
    // Coletes
    if (nome.includes('colete')) return 'fa-vest';
    
    // Chaparreiras
    if (nome.includes('chaparreiras') || nome.includes('escopeteiro') || nome.includes('perneira') || nome.includes('asas de morcego')) return 'fa-socks';
    
    // Luvas
    if (nome.includes('luvas') || nome.includes('mosqueteiro')) return 'fa-hand';
    
    // Botas/Calçados
    if (nome.includes('botas') || nome.includes('mocassins') || nome.includes('polainas') || nome.includes('roper')) return 'fa-shoe-prints';
    
    // Selas
    if (nome.includes('sela')) return 'fa-horse-head';
    
    // Acessórios
    if (nome.includes('acessório')) return 'fa-award';
    
    return 'fa-bookmark';
  }

  // ==========================================
  // SEÇÃO 8 - ÍCONES DE CATEGORIA
  // ==========================================
  // Retorna ícone FontAwesome para cada categoria principal
  
  getIconeCategoria(): string {
    switch(this.colecaoAtiva) {
      case 'animais': return 'fa-paw';
      case 'peixes_lendarios': return 'fa-fish';
      case 'desafios': return 'fa-trophy';
      case 'amuletos': return 'fa-clover';
      case 'equipamentos': return 'fa-briefcase';
      case 'pearson': return 'fa-campground';
      case 'colecionaveis': return 'fa-search-location';
      case 'trapper_conjuntos':
      case 'trapper_roupas':
        return 'fa-hat-cowboy';
      case 'missoes_mundo': return 'fa-globe-americas';
      case 'receitas': return 'fa-scroll';
      default: return 'fa-bookmark';
    }
  }

  // ==========================================
  // SEÇÃO 9 - FILTROS DE ITENS
  // ==========================================
  // Filtra itens por busca, personagem e subcategoria
  
  get itensFiltrados() {
    return this.listaItens.filter(item => {
      const matchTexto = item.nome.toLowerCase().includes(this.termoBusca.toLowerCase());
      const matchPerso = this.personagemSelecionado === 'Todos' || !item.personagem || item.personagem.includes(this.personagemSelecionado);
      // Para TRAPPER, não filtra por subFiltroAtivo; para RECEITAS, filtra normalmente
      const matchSub = this.colecaoAtiva.includes('trapper') || this.subFiltroAtivo === 'Todos' || this.extrairSubcategoria(item) === this.subFiltroAtivo;
      return matchTexto && matchPerso && matchSub;
    }).sort((a, b) => a.nome.localeCompare(b.nome, undefined, {numeric: true}));
  }

  // ==========================================
  // SEÇÃO 10 - CARREGAMENTO DE DADOS
  // ==========================================
  // Carrega dados das coleções do banco de dados
  
  carregar(colecao: string) {
    this.colecaoAtiva = colecao;
    this.subFiltroAtivo = 'Todos';
    this.gruposExpandidos.clear();
    this.tituloAtual = colecao.replace('_', ' ').toUpperCase();
    this.dbService.getDados(colecao).subscribe(dados => {
      this.listaItens = dados || [];
      this.atualizarEstatisticasGlobais();
    });
  }

  carregarTrapperTipo(tipo: string) {
    this.trapperTipo = tipo;
    const colecao = tipo === 'conjuntos' ? 'trapper_conjuntos' : 'trapper_roupas';
    this.colecaoAtiva = colecao;
    this.subFiltroAtivo = 'Todos';
    this.gruposExpandidos.clear();
    this.tituloAtual = 'ARMADILHEIRO - ' + (tipo === 'conjuntos' ? 'CONJUNTOS' : 'ROUPAS');
    this.dbService.getDados(colecao).subscribe(dados => {
      this.listaItens = dados || [];
      this.atualizarEstatisticasGlobais();
    });
  }

  // ==========================================
  // SEÇÃO 11 - INTERAÇÃO COM ITENS
  // ==========================================
  // Alterna status de itens e subitens
  
  alternarStatus(item: any) {
    item.obtido = !item.obtido;
    if (item.obtido && item.nome) {
      // Adiciona aos últimos obtidos (máximo 5)
      this.ultimosObtidos.unshift({ nome: item.nome, data: new Date() });
      if (this.ultimosObtidos.length > 5) {
        this.ultimosObtidos.pop();
      }
    }
    if (item.materiais) item.materiais.forEach((m: any) => m.check = item.obtido);
    this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe(() => this.atualizarEstatisticasGlobais());
  }

  alternarSubItem(item: any, subItem: any, event: Event) {
    event.stopPropagation();
    subItem.check = !subItem.check;
    // Marca item como obtido APENAS se TODOS os materiais estão checados
    item.obtido = item.materiais && item.materiais.every((m: any) => m.check);
    this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe(() => this.atualizarEstatisticasGlobais());
  }

  // ==========================================
  // SEÇÃO 12 - ESTATÍSTICAS GLOBAIS
  // ==========================================
  // Inicializa e atualiza contadores globais por categoria
  
  inicializarContagemGlobal() {
    Object.keys(this.totaisPorCategoria).forEach(cat => {
      this.dbService.getDados(cat).subscribe(dados => this.obtidosGlobal[cat] = dados ? dados.filter(i => i.obtido).length : 0);
    });
  }

  atualizarEstatisticasGlobais() {
    this.obtidosGlobal[this.colecaoAtiva] = this.listaItens.filter(i => i.obtido).length;
  }

  getContagemObtidos(): number { return this.listaItens.filter(i => i.obtido).length; }
  calcularProgresso(): number { return this.listaItens.length ? Math.round((this.getContagemObtidos() / this.listaItens.length) * 100) : 0; }

  getProgressoGlobal(): number {
    let tT = 0; let tO = 0;
    for (let c in this.totaisPorCategoria) { tT += this.totaisPorCategoria[c]; tO += (this.obtidosGlobal[c] || 0); }
    return tT > 0 ? Math.round((tO / tT) * 100) : 0;
  }

  // Contadores por personagem
  getContagemPorPersonagem(personagem: string): number {
    return this.listaItens.filter(i => i.obtido && i.personagem && i.personagem.includes(personagem)).length;
  }

  // ==========================================
  // SEÇÃO 13 - CÁLCULOS E ANÁLISES
  // ==========================================
  // Calcula progresso, ranking e tempo estimado
  
  // Itens faltando
  getItensFaltando(): number {
    return this.listaItens.length - this.getContagemObtidos();
  }

  // Tempo estimado (assumindo 1 minuto por item)
  getTempoEstimado(): string {
    const faltando = this.getItensFaltando();
    if (faltando === 0) return 'Completo!';
    const horas = Math.floor(faltando / 60);
    const minutos = faltando % 60;
    if (horas === 0) return `${minutos}m`;
    return `${horas}h ${minutos}m`;
  }

  // Ranking de categorias
  getRankingCategorias(): any[] {
    return Object.keys(this.obtidosGlobal)
      .map(cat => ({
        nome: cat.replace('_', ' ').toUpperCase(),
        obtidos: this.obtidosGlobal[cat] || 0,
        total: this.totaisPorCategoria[cat] || 0,
        percentual: this.totaisPorCategoria[cat] ? Math.round(((this.obtidosGlobal[cat] || 0) / this.totaisPorCategoria[cat]) * 100) : 0
      }))
      .sort((a, b) => b.percentual - a.percentual)
      .slice(0, 3); // Top 3
  }

  // ==========================================
  // SEÇÃO 14 - AÇÕES EM MASSA
  // ==========================================
  // Marca/desmarcar todos os itens de uma categoria ou subcategoria
  
  // Marca todos os itens de uma categoria como obtidos
  marcarTodosCategorias(grupo: string) {
    const itensGrupo = this.getItensPorGrupo(grupo);
    itensGrupo.forEach(item => {
      if (!item.obtido) {
        item.obtido = true;
        if (item.materiais) item.materiais.forEach((m: any) => m.check = true);
        this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe();
      }
    });
    this.atualizarEstatisticasGlobais();
  }

  // Remove todos os itens de uma categoria (com confirmação)
  removerTodosCategorias(grupo: string) {
    this.mostrarConfirmacao(`Tem certeza que deseja remover todos os itens de "${grupo}"?`, () => {
      const itensGrupo = this.getItensPorGrupo(grupo);
      itensGrupo.forEach(item => {
        if (item.obtido) {
          item.obtido = false;
          if (item.materiais) item.materiais.forEach((m: any) => m.check = false);
          this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe();
        }
      });
      this.atualizarEstatisticasGlobais();
    });
  }

  // Restaura todos os itens para o zero (remove tudo)
  restaurarTudo() {
    this.mostrarConfirmacao('ATENÇÃO: Isso removerá TODOS os itens marcados. Tem certeza?', () => {
      this.listaItens.forEach(item => {
        if (item.obtido) {
          item.obtido = false;
          if (item.materiais) item.materiais.forEach((m: any) => m.check = false);
          this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe();
        }
      });
      this.atualizarEstatisticasGlobais();
    });
  }

  // Verifica se a categoria atual tem subcategorias
  temSubcategorias(): boolean {
    return this.getGrupos().length > 1 && !this.colecaoAtiva.includes('trapper');
  }

  // Marca todos os itens da categoria (quando não há subcategorias)
  marcarTodosCategoria(): void {
    const itens = this.listaItens.filter((item: any) => !item.obtido);
    itens.forEach((item: any) => {
      item.obtido = true;
      if (item.materiais) item.materiais.forEach((m: any) => m.check = true);
      this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe();
    });
    this.atualizarEstatisticasGlobais();
  }

  // Remove todos os itens da categoria (quando não há subcategorias)
  removerTodosCategoria(): void {
    this.mostrarConfirmacao(`Deseja desmarcar todos os itens desta categoria?`, () => {
      const itens = this.listaItens.filter((item: any) => item.obtido);
      itens.forEach((item: any) => {
        item.obtido = false;
        if (item.materiais) item.materiais.forEach((m: any) => m.check = false);
        this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe();
      });
      this.atualizarEstatisticasGlobais();
    });
  }

  // Marcar todos da subcategoria ativa
  marcarTodosSubcategoria(): void {
    if (this.subFiltroAtivo === 'Todos') return;
    const itens = this.listaItens.filter((item: any) => this.extrairSubcategoria(item) === this.subFiltroAtivo);
    itens.forEach((item: any) => {
      if (!item.obtido) {
        item.obtido = true;
        if (item.materiais) item.materiais.forEach((m: any) => m.check = true);
        this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe();
      }
    });
    this.atualizarEstatisticasGlobais();
  }

  // Desmarcar todos da subcategoria ativa
  removerTodosSubcategoria(): void {
    if (this.subFiltroAtivo === 'Todos') return;
    this.mostrarConfirmacao(`Deseja desmarcar todos os itens da subcategoria "${this.subFiltroAtivo}"?`, () => {
      const itens = this.listaItens.filter((item: any) => this.extrairSubcategoria(item) === this.subFiltroAtivo);
      itens.forEach((item: any) => {
        if (item.obtido) {
          item.obtido = false;
          if (item.materiais) item.materiais.forEach((m: any) => m.check = false);
          this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe();
        }
      });
      this.atualizarEstatisticasGlobais();
    });
  }
}
