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
  colecaoAtiva: string = 'animais_lendarios';
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
    animais_lendarios: 16, peixes_lendarios: 13, amuletos: 16, desafios: 90,
    colecionaveis: 110, itens: 25, receitas: 21, acampamento: 14,
    armadilheiro: 75,
    missoes_secundarias: 21
  };
  obtidosGlobal: any = {};

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.carregarEstadoSalvo();
    this.carregar(this.colecaoAtiva);
    this.inicializarContagemGlobal();
  }

  // ==========================================
  // SEÇÃO 1.5 - PERSISTÊNCIA DE ESTADO
  // ==========================================
  // Salva e carrega estado do localStorage

  salvarEstado() {
    const estado = {
      colecaoAtiva: this.colecaoAtiva,
      personagemSelecionado: this.personagemSelecionado,
      subFiltroAtivo: this.subFiltroAtivo,
      trapperTipo: this.trapperTipo,
      obtidosGlobal: this.obtidosGlobal,
      gruposExpandidos: Array.from(this.gruposExpandidos)
    };
    
    try {
      localStorage.setItem('rdr2-estado', JSON.stringify(estado));
    } catch (e) {
      console.warn('Erro ao salvar estado:', e);
    }
    
    // Salva os itens obtidos com NOME + ID para robustez
    const itensObtidos = this.listaItens
      .filter(i => i.obtido)
      .map(i => ({
        _id: i._id,
        nome: i.nome || i.descricao,
        personagem: i.personagem || 'Todos'
      }));
    
    const chave = `rdr2-obtidos-${this.colecaoAtiva}`;
    const valor = JSON.stringify(itensObtidos);
    
    try {
      localStorage.setItem(chave, valor);
      console.log(`💾 Salvando ${itensObtidos.length} itens`);
    } catch (e) {
      console.warn('Erro ao salvar itens obtidos:', e);
    }
  }

  carregarEstadoSalvo() {
    try {
      let estadoSalvo = localStorage.getItem('rdr2-estado');
      
      if (estadoSalvo) {
        const estado = JSON.parse(estadoSalvo);
        this.colecaoAtiva = estado.colecaoAtiva || 'animais_lendarios';
        this.personagemSelecionado = estado.personagemSelecionado || 'Todos';
        this.subFiltroAtivo = estado.subFiltroAtivo || 'Todos';
        this.trapperTipo = estado.trapperTipo || 'conjuntos';
        this.obtidosGlobal = estado.obtidosGlobal || {};
        this.gruposExpandidos = new Set(estado.gruposExpandidos || []);
      }
    } catch (e) {
      console.warn('Erro ao carregar estado salvo:', e);
    }
  }

  // Sincroniza itens obtidos salvos com os itens carregados
  sincronizarItensObtidos() {
    try {
      const chave = `rdr2-obtidos-${this.colecaoAtiva}`;
      let itensObtidosSalvos = localStorage.getItem(chave);
      
      if (itensObtidosSalvos) {
        try {
          const itensObtidos = JSON.parse(itensObtidosSalvos);
          
          let countRestaurados = 0;
          
          // Tenta restaurar por ID primeiro, depois por nome
          this.listaItens.forEach((item: any) => {
            // Busca por ID
            const itemPorId = itensObtidos.find((i: any) => i._id === item._id);
            // Busca por nome como fallback
            const itemPorNome = itensObtidos.find((i: any) => 
              (i.nome === item.nome || i.nome === item.descricao) &&
              (i.personagem === (item.personagem || 'Todos') || i.personagem === 'Todos')
            );
            
            if (itemPorId || itemPorNome) {
              item.obtido = true;
              if (item.materiais) item.materiais.forEach((m: any) => m.check = true);
              countRestaurados++;
            }
          });
          
          if (countRestaurados > 0) {
            console.log(`✅ Restaurados ${countRestaurados} itens obtidos`);
          }
        } catch (parseError) {
          console.error('❌ Erro ao parsear dados salvos:', parseError);
        }
      }
    } catch (e) {
      console.error('❌ Erro ao sincronizar itens obtidos:', e);
    }
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
  if (g === 'chaparreiras' || g === 'perneiras') return 'fa-socks'; 
  if (g === 'acessórios') return 'fa-feather-pointed';
  if (g === 'casacos') return 'fa-coat';
  if (g === 'conjuntos') return 'fa-list-check';

  // PRIORIDADE 4: DESAFIOS (Ajuste da linha quebrada que estava no seu código)
  if (g.includes('apostador')) return 'fa-dice';
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
    if (g.includes('cartões') || g.includes('cartas')) return 'fa-address-card';
    if (g.includes('tesouro')) return 'fa-coins';
    if (g.includes('apanhadores')) return 'fa-sun';
    if (g.includes('exóticos') || g.includes('artigos_exoticos')) return 'fa-feather';
    if (g.includes('túmulo') || g.includes('tumulo')) return 'fa-cross';

    // Trapper
    if (g.includes('equipamentos')) return 'fa-toolbox';
    if (g.includes('botas') || g.includes('calçados')) return 'fa-shoe-prints';
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
  // COLECIONÁVEIS - Use subcategoria se disponível
  if (this.colecaoAtiva === 'colecionaveis' && item.subcategoria) {
    return item.subcategoria.toUpperCase();
  }

  // ARMADILHEIRO - Se o item já tem a subcategoria definida no banco de dados
  if (this.colecaoAtiva.includes('armadilheiro') && item.subcategoria) {
    return item.subcategoria.toUpperCase();
  }

  // DESAFIOS - Use subcategoria se disponível
  if (this.colecaoAtiva === 'desafios' && item.subcategoria) {
    return item.subcategoria.toUpperCase();
  }

  const n = (item.nome || item.descricao || '').toLowerCase();
  
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

  if (this.colecaoAtiva === 'itens') {
    if (n.includes('máscara')) return 'MÁSCARAS';
    if (n.includes('faca') || n.includes('machado') || n.includes('espada')) return 'ARMAS BRANCAS';
    if (n.includes('chapéu')) return 'CHAPÉUS';
    return 'ARMAS DE FOGO';
  }

    // COLECIONÁVEIS - Fallback se não tiver subcategoria (Legado)
    if (this.colecaoAtiva === 'colecionaveis') {
      if (n.includes('osso')) return 'OSSOS';
      if (n.includes('cartões') || n.includes('cartão')) return 'CARTÕES';
      if (n.includes('tesouro') || n.includes('ouro')) return 'TESOUROS';
      if (n.includes('apanhador')) return 'APANHADORES';
      if (n.includes('exótico')) return 'EXÓTICOS';
      return 'ROCHAS';
    }

    // ACAMPAMENTO (Pearson)
    if (this.colecaoAtiva === 'acampamento') {
  if (n.includes('bolsa') || n.includes('satchel')) return 'BOLSAS';
  if (n.includes('acampamento') || n.includes('mesa') || n.includes('alojamento') || n.includes('tapete')) return 'ACAMPAMENTO';
  return 'COSMÉTICOS';
}

    // RECEITAS - Subcategorias visíveis
    if (this.colecaoAtiva === 'receitas') {
      if (n.includes('cavalo') || n.includes('equitação') || n.includes('selim') || n.includes('rédea')) return 'EQUITAÇÃO';
      // SAÚDE deve vir ANTES de MUNIÇÃO para evitar conflitos
      if (n.includes('remedio') || n.includes('óleo de cobra') || n.includes('folego') || n.includes('fôlego') || n.includes('milagroso') || n.includes('tôni') || n.includes('tonico')) return 'SAÚDE';
      if (n.includes('isca')) return 'CAÇA';
      // Tudo relacionado a armas vai para MUNIÇÃO
      if (n.includes('flecha') || n.includes('oleo de arma') || n.includes('buckshot') || n.includes('volatil') || n.includes('dinamite') || n.includes('arremesso') || n.includes('slug') || n.includes('ponta oca') || n.includes('arma') || n.includes('tomahawk') || n.includes('faca')) return 'MUNIÇÃO';
      return 'MUNIÇÃO';
    }

//MUNDO - Missoes Secundarias
if (this.colecaoAtiva === 'missoes_secundarias') return 'MUNDO';

    // ARMADILHEIRO (Legado)
    if (this.colecaoAtiva === 'armadilheiro') {
      if (n.includes('reforçado') || n.includes('coldre')) return 'EQUIPAMENTOS';
      if (n.includes('bota') || n.includes('calçado')) return 'CALÇADOS';
      if (n.includes('chapéu')) return 'CHAPÉUS';
      if (n.includes('colete')) return 'COLETES';
      return 'VESTUÁRIO';
    }
    

    if (this.colecaoAtiva === 'amuletos') return n.includes('talismã') ? 'TALISMÃS' : 'AMULETOS';
    if (this.colecaoAtiva === 'animais_lendarios') return 'ANIMAIS';
    if (this.colecaoAtiva === 'peixes_lendarios') return 'PEIXES';
    if (this.colecaoAtiva === 'missoes_secundarias') return 'MUNDO';

    return 'GERAL';
  }

  // ==========================================
  // SEÇÃO 5 - FORMATAÇÃO DE NOMES
  // ==========================================
  // Remove palavras de categorização do nome para exibição no front
  
  formatarNomeExibicao(item: any): string {
    // Para desafios, usa descricao como nome
    let nome = this.colecaoAtiva === 'desafios' ? item.descricao : item.nome;
    
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
    const itens = this.listaItens.filter(item => {
      const campo = this.colecaoAtiva === 'desafios' ? item.descricao : item.nome;
      const matchTexto = (campo || '').toLowerCase().includes(this.termoBusca.toLowerCase());
      const matchPerso = this.personagemSelecionado === 'Todos' || !item.personagem || item.personagem.includes(this.personagemSelecionado);
      const matchGrupo = this.extrairSubcategoria(item) === grupo;
      return matchTexto && matchPerso && matchGrupo;
    });
    
    // Para desafios, ordena por nível
    if (this.colecaoAtiva === 'desafios') {
      return itens.sort((a, b) => (a.nivel || 0) - (b.nivel || 0));
    }
    
    // Para apanhadores de sonhos, ordena por região (Nova Hanover, Lemoyne, Ambarino) e depois por número
    if (this.colecaoAtiva === 'colecionaveis' && grupo === 'APANHADORES_DE_SONHOS') {
      const ordemRegiao = { 'nova hanover': 1, 'lemoyne': 2, 'ambarino': 3 };
      return itens.sort((a, b) => {
        const regiaoA = (a.regiao || '').toLowerCase();
        const regiaoB = (b.regiao || '').toLowerCase();
        const ordemA = ordemRegiao[regiaoA as keyof typeof ordemRegiao] || 999;
        const ordemB = ordemRegiao[regiaoB as keyof typeof ordemRegiao] || 999;
        
        // Se mesma região, ordena por número do apanhador
        if (ordemA === ordemB) {
          return (a._subItemId || 0) - (b._subItemId || 0);
        }
        
        return ordemA - ordemB;
      });
    }
    
    // Para ossos de dinossauros, ordena por grupo
    if (this.colecaoAtiva === 'colecionaveis' && grupo === 'OSSOS_DINOSSAUROS') {
      return itens.sort((a, b) => {
        const grupoA = a.grupo || 0;
        const grupoB = b.grupo || 0;
        if (grupoA !== grupoB) {
          return grupoA - grupoB;
        }
        return (a._subItemId || 0) - (b._subItemId || 0);
      });
    }
    
    return itens;
  }

  isConjuntoCompleto(grupo: string): boolean {
    if (!this.colecaoAtiva.includes('armadilheiro')) return false;
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
    const nome = (item.nome || item.descricao || '').toLowerCase();
    
    // Conjuntos do armadilheiro
    if (this.colecaoAtiva.includes('armadilheiro') && item.subcategoria && item.subcategoria.toLowerCase() === 'conjuntos') {
      return 'fa-shirt';
    }
    
    // Botas/Calçados (ANTES de Chapéus para evitar conflito)
    if (nome.includes('botas') || nome.includes('mocassins') || nome.includes('polainas') || nome.includes('roper') || nome.includes('fowler boots')) return 'fa-shoe-prints';
    
    // Chapéus
    if (nome.includes('chapéu') || nome.includes('boina') || nome.includes('mole') || nome.includes('sombreiro') || nome.includes('hat') || nome.includes('sombrero')) return 'fa-hat-cowboy';
    
    // Casacos e Jaquetas
    if (nome.includes('casaco') || nome.includes('capa') || nome.includes('jaqueta')) return 'fa-shirt';
    
    // Coletes
    if (nome.includes('colete') || nome.includes('vest') || nome.includes('peitilho')) return 'fa-vest';
    
    // Chaparreiras/Perneiras
    if (nome.includes('chaparreiras') || nome.includes('escopeteiro') || nome.includes('perneira') || nome.includes('asas de morcego') || nome.includes('chap') || nome.includes('leggings')) return 'fa-socks';
    
    // Luvas
    if (nome.includes('luvas') || nome.includes('mosqueteiro')) return 'fa-hand';
    
    // Selas
    if (nome.includes('sela')) return 'fa-horse-head';
    
    // Acessórios
    if (nome.includes('acessório')) return 'fa-award';
    
    return 'fa-bookmark';
  }

  getIconeItemPorTipo(nome: string): string {
    const nomeLC = (nome || '').toLowerCase();
    
    // Peles, couros e materiais de animais (para armadilheiro e colecionáveis)
    if (nomeLC.includes('pele') || nomeLC.includes('couro') || nomeLC.includes('pena') || nomeLC.includes('fur')) return 'paw';
    
    // Chapéus
    if (nomeLC.includes('chapéu') || nomeLC.includes('boina') || nomeLC.includes('mole') || nomeLC.includes('sombreiro') || nomeLC.includes('hat') || nomeLC.includes('sombrero')) return 'hat-cowboy';
    
    // Casacos e Jaquetas
    if (nomeLC.includes('casaco') || nomeLC.includes('capa') || nomeLC.includes('jaqueta')) return 'shirt';
    
    // Coletes
    if (nomeLC.includes('colete') || nomeLC.includes('vest') || nomeLC.includes('peitilho')) return 'vest';
    
    // Chaparreiras/Perneiras
    if (nomeLC.includes('chaparreiras') || nomeLC.includes('escopeteiro') || nomeLC.includes('perneira') || nomeLC.includes('asas de morcego') || nomeLC.includes('chap') || nomeLC.includes('leggings')) return 'socks';
    
    // Luvas
    if (nomeLC.includes('luvas') || nomeLC.includes('mosqueteiro')) return 'hand';
    
    // Botas/Calçados
    if (nomeLC.includes('botas') || nomeLC.includes('mocassins') || nomeLC.includes('polainas') || nomeLC.includes('roper')) return 'shoe-prints';
    
    // Selas
    if (nomeLC.includes('sela')) return 'horse-head';
    
    // Acessórios
    if (nomeLC.includes('acessório')) return 'award';
    
    // Conjuntos
    if (nomeLC.includes('conjunto')) return 'shirt';
    
    return 'bookmark';
  }

  // ==========================================
  // SEÇÃO 8 - ÍCONES DE CATEGORIA
  // ==========================================
  // Retorna ícone FontAwesome para cada categoria principal
  
  getIconeCategoria(): string {
    switch(this.colecaoAtiva) {
      case 'animais_lendarios': return 'fa-paw';
      case 'peixes_lendarios': return 'fa-fish';
      case 'desafios': return 'fa-trophy';
      case 'amuletos': return 'fa-clover';
      case 'itens': return 'fa-briefcase';
      case 'acampamento': return 'fa-campground';
      case 'colecionaveis': return 'fa-search-location';
      case 'armadilheiro':
      case 'armadilheiro_conjuntos':
      case 'armadilheiro_roupas':
        return 'fa-hat-cowboy';
      case 'missoes_secundarias': return 'fa-globe-americas';
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
      const campo = this.colecaoAtiva === 'desafios' ? item.descricao : item.nome;
      const matchTexto = (campo || '').toLowerCase().includes(this.termoBusca.toLowerCase());
      const matchPerso = this.personagemSelecionado === 'Todos' || !item.personagem || item.personagem.includes(this.personagemSelecionado);
      // Para ARMADILHEIRO, não filtra por subFiltroAtivo; para RECEITAS, filtra normalmente
      const matchSub = this.colecaoAtiva.includes('armadilheiro') || this.subFiltroAtivo === 'Todos' || this.extrairSubcategoria(item) === this.subFiltroAtivo;
      return matchTexto && matchPerso && matchSub;
    }).sort((a, b) => {
      // Para desafios, ordena por nível
      if (this.colecaoAtiva === 'desafios') {
        return (a.nivel || 0) - (b.nivel || 0);
      }
      // Para apanhadores de sonhos, ordena por região e depois por número
      if (this.colecaoAtiva === 'colecionaveis' && a.nome && a.nome.includes('Apanhadores')) {
        const ordemRegiao = { 'nova hanover': 1, 'lemoyne': 2, 'ambarino': 3 };
        const regiaoA = (a.regiao || '').toLowerCase();
        const regiaoB = (b.regiao || '').toLowerCase();
        const ordemA = ordemRegiao[regiaoA as keyof typeof ordemRegiao] || 999;
        const ordemB = ordemRegiao[regiaoB as keyof typeof ordemRegiao] || 999;
        
        if (ordemA !== ordemB) {
          return ordemA - ordemB;
        }
        return (a._subItemId || 0) - (b._subItemId || 0);
      }
      // Para ossos de dinossauros, ordena por grupo e depois por número
      if (this.colecaoAtiva === 'colecionaveis' && a.nome && a.nome.includes('Ossos de Dinossauro')) {
        const grupoA = a.grupo || 0;
        const grupoB = b.grupo || 0;
        if (grupoA !== grupoB) {
          return grupoA - grupoB;
        }
        return (a._subItemId || 0) - (b._subItemId || 0);
      }
      // Para outros, ordena por nome
      const nomeA = this.colecaoAtiva === 'desafios' ? a.descricao : a.nome;
      const nomeB = this.colecaoAtiva === 'desafios' ? b.descricao : b.nome;
      return (nomeA || '').localeCompare(nomeB || '', undefined, {numeric: true});
    });
  }

  // ==========================================
  // SEÇÃO 10 - CARREGAMENTO DE DADOS
  // ==========================================
  // Carrega dados das coleções do banco de dados
  
  desagregarItensAninhados(dados: any[]): any[] {
    const itensDesagregados: any[] = [];
    
    dados.forEach(item => {
      // Se o item tem um array de subitens (como apanhadores de sonhos, exóticos, ossos)
      if (item.itens && Array.isArray(item.itens) && item.itens.length > 0) {
        // Desagrega cada subitem como um item independente
        item.itens.forEach((subItem: any, index: number) => {
          itensDesagregados.push({
            ...item,
            // Sobrescreve o nome: se tem numero (apanhadores), usa numero; se tem nome próprio (exóticos), usa nome
            nome: subItem.numero ? `${item.nome} #${subItem.numero}` : subItem.nome,
            descricao: subItem.descricao,
            localizacao: subItem.localizacao,
            obtido: subItem.check || false,
            _subItemId: subItem.numero || index,
            _parentId: item._id
          });
        });
      } else if (item.ossos && Array.isArray(item.ossos) && item.ossos.length > 0) {
        // Para ossos de dinossauros
        item.ossos.forEach((osso: any, index: number) => {
          itensDesagregados.push({
            ...item,
            nome: osso.numero ? `${item.nome} #${osso.numero}` : osso.nome,
            descricao: osso.descricao || osso.nome,
            localizacao: osso.localizacao,
            obtido: osso.check || false,
            _subItemId: osso.numero || index,
            _parentId: item._id
          });
        });
      } else if (item.rochas && Array.isArray(item.rochas) && item.rochas.length > 0) {
        // Para rochas entalhadas
        item.rochas.forEach((rocha: any, index: number) => {
          itensDesagregados.push({
            ...item,
            nome: rocha.numero ? `${item.nome} #${rocha.numero}` : rocha.nome,
            descricao: rocha.descricao || rocha.nome,
            localizacao: rocha.localizacao,
            obtido: rocha.check || false,
            _subItemId: rocha.numero || index,
            _parentId: item._id
          });
        });
      } else {
        // Se não tem subitens, adiciona normalmente
        itensDesagregados.push(item);
      }
    });
    
    return itensDesagregados;
  }
  
  normalizarColecionaveis(dados: any[]): any[] {
    return dados.map(item => {
      // Renomeia 'itens' para 'materiais' (apanhadores, rochas, exóticos)
      if (item.itens && Array.isArray(item.itens) && !item.ossos && !item.rochas && !item.cartas && !item.materiais_totais) {
        return {
          ...item,
          materiais: item.itens.map((subItem: any) => ({
            // Se tem numero (apanhadores), usa numero; se tem nome (exóticos), usa nome
            nome: subItem.numero ? `#${subItem.numero} - ${subItem.descricao}` : subItem.nome,
            tipo: 'COLECIONÁVEL',
            check: subItem.check || false,
            localizacao: subItem.localizacao
          }))
        };
      }
      
      // Renomeia 'ossos' para 'materiais' (ossos de dinossauros)
      if (item.ossos && Array.isArray(item.ossos)) {
        return {
          ...item,
          materiais: item.ossos.map((osso: any) => ({
            nome: osso.numero ? `#${osso.numero} - ${osso.nome}` : osso.nome,
            tipo: 'OSSO',
            check: osso.check || false,
            localizacao: osso.localizacao
          }))
        };
      }
      
      // Renomeia 'rochas' para 'materiais' (rochas entalhadas)
      if (item.rochas && Array.isArray(item.rochas)) {
        return {
          ...item,
          materiais: item.rochas.map((rocha: any) => ({
            nome: rocha.numero ? `#${rocha.numero} - ${rocha.nome}` : rocha.nome,
            tipo: 'ROCHA',
            check: rocha.check || false,
            localizacao: rocha.localizacao
          }))
        };
      }
      
      // Renomeia 'materiais_totais' para 'materiais' (armadilheiro)
      if (item.materiais_totais && Array.isArray(item.materiais_totais)) {
        return {
          ...item,
          materiais: item.materiais_totais.map((material: any) => ({
            nome: material.nome,
            tipo: material.tipo || 'MATERIAL',
            check: material.check || false,
            quantidade: material.quantidade
          }))
        };
      }
      
      // Renomeia 'cartas' para 'materiais' (cartas de cigarros)
      if (item.cartas && Array.isArray(item.cartas)) {
        return {
          ...item,
          materiais: item.cartas.map((carta: any) => ({
            nome: `#${carta.numero} - ${carta.nome}`,
            tipo: 'CARTA',
            check: carta.check || false,
            localizacao: carta.localizacao,
            descricao: carta.descricao
          }))
        };
      }
      
      return item;
    });
  }
  
  carregar(colecao: string) {
    this.colecaoAtiva = colecao;
    this.subFiltroAtivo = 'Todos';
    this.gruposExpandidos.clear();
    this.tituloAtual = colecao.replace('_', ' ').toUpperCase();
    this.dbService.getDados(colecao).subscribe(dados => {
      this.listaItens = this.normalizarColecionaveis(dados || []);
      // Restaura itens obtidos do localStorage
      this.sincronizarItensObtidos();
      this.atualizarEstatisticasGlobais();
      this.salvarEstado();
    });
  }

  carregarTrapperTipo(tipo: string) {
    this.trapperTipo = tipo;
    const colecao = 'armadilheiro';
    this.colecaoAtiva = colecao;
    this.subFiltroAtivo = 'Todos';
    this.gruposExpandidos.clear();
    this.tituloAtual = 'ARMADILHEIRO - ' + (tipo === 'conjuntos' ? 'CONJUNTOS' : 'ROUPAS');
    this.dbService.getDados(colecao).subscribe(dados => {
      // Filtra por tipo (conjuntos ou roupas)
      let itensFiltrados = (dados || []).filter((item: any) => {
        const subcategoria = (item.subcategoria || '').toLowerCase();
        if (tipo === 'conjuntos') {
          return subcategoria === 'conjuntos';
        } else {
          // Roupas incluem botas, chapéus, coletes, perneiras, selas
          return ['botas', 'chapéus', 'coletes', 'perneiras', 'selas'].includes(subcategoria);
        }
      });
      // Normaliza os colecionáveis para transformar materiais_totais em materiais
      this.listaItens = this.normalizarColecionaveis(itensFiltrados);
      // Restaura itens obtidos do localStorage
      this.sincronizarItensObtidos();
      this.atualizarEstatisticasGlobais();
      this.salvarEstado();
    });
  }

  // ==========================================
  // SEÇÃO 11 - INTERAÇÃO COM ITENS
  // ==========================================
  // Alterna status de itens e subitens
  
  alternarStatus(item: any) {
    console.log(`🔄 Alternando status de: ${item.nome || item.descricao}`);
    console.log(`   Antes: obtido=${item.obtido}`);
    
    item.obtido = !item.obtido;
    
    console.log(`   Depois: obtido=${item.obtido}`);
    console.log(`   Total de obtidos em this.listaItens: ${this.listaItens.filter((i: any) => i.obtido).length}`);
    
    const nomeItem = this.colecaoAtiva === 'desafios' ? item.descricao : item.nome;
    if (item.obtido && nomeItem) {
      // Adiciona aos últimos obtidos (máximo 5)
      this.ultimosObtidos.unshift({ nome: nomeItem, data: new Date() });
      if (this.ultimosObtidos.length > 5) {
        this.ultimosObtidos.pop();
      }
    }
    if (item.materiais) item.materiais.forEach((m: any) => m.check = item.obtido);
    
    // Atualiza estatísticas ANTES de tentar salvar
    this.atualizarEstatisticasGlobais();
    
    // Depois salva
    this.salvarEstado();
    
    // Tenta salvar no backend, mas não falha se não conseguir
    this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe(
      () => {
        console.log('✅ Sincronizado com backend');
      },
      (error) => {
        console.warn('⚠️ Backend indisponível, salvando apenas localmente', error);
      }
    );
  }

  alternarSubItem(item: any, subItem: any, event: Event) {
    event.stopPropagation();
    subItem.check = !subItem.check;
    // Marca item como obtido APENAS se TODOS os materiais estão checados
    item.obtido = item.materiais && item.materiais.every((m: any) => m.check);
    
    // Atualiza estatísticas ANTES de tentar salvar
    this.atualizarEstatisticasGlobais();
    
    // Depois salva
    this.salvarEstado();
    
    // Tenta salvar no backend, mas não falha se não conseguir
    this.dbService.atualizarStatus(this.colecaoAtiva, item._id, item).subscribe(
      () => {
        console.log('✅ Sincronizado com backend');
      },
      (error) => {
        console.warn('⚠️ Backend indisponível, salvando apenas localmente', error);
      }
    );
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
    this.salvarEstado();
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
    return this.getGrupos().length > 1 && !this.colecaoAtiva.includes('armadilheiro');
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

  // ==========================================
  // SEÇÃO 15 - FUNÇÕES AUXILIARES DE DETALHES
  // ==========================================
  // Extrai informações detalhadas para exibição
  
  getDetalhesItem(item: any): Array<{icone: string; label: string; valor: string | string[]}> {
    const detalhes: Array<{icone: string; label: string; valor: string | string[]}> = [];
    
    // Localização
    if (item.localizacao) {
      detalhes.push({ icone: 'map-marker-alt', label: 'LOCALIZAÇÃO', valor: item.localizacao });
    }
    
    // Região
    if (item.regiao) {
      detalhes.push({ icone: 'compass', label: 'REGIÃO', valor: item.regiao });
    }
    
    // Tipo/Categoria
    if (item.tipo && this.colecaoAtiva !== 'receitas') {
      detalhes.push({ icone: 'tag', label: 'TIPO', valor: item.tipo });
    }
    
    // Para Itens: obtenção/método
    if (item.obtencao) {
      detalhes.push({ icone: 'circle-info', label: 'OBTENÇÃO', valor: item.obtencao });
    }
    
    // Para Receitas: descrição
    if (item.descricao && this.colecaoAtiva === 'receitas') {
      detalhes.push({ icone: 'quote-left', label: 'DESCRIÇÃO', valor: item.descricao });
    }
    
    // Para Receitas: fonte/panfleto
    if (item.fonte_panfleto) {
      detalhes.push({ icone: 'scroll', label: 'FONTE', valor: item.fonte_panfleto });
    }
    
    // Para Receitas: disponibilidade
    if (item.disponibilidade) {
      let disponibilidadeTexto = '';
      if (typeof item.disponibilidade === 'object') {
        // Se for um objeto, monta a string com as informações
        disponibilidadeTexto = item.disponibilidade.notas || 
                               (item.disponibilidade.acessivel_arthur && item.disponibilidade.acessivel_john ? 'Arthur e John' :
                                item.disponibilidade.acessivel_arthur ? 'Arthur' :
                                item.disponibilidade.acessivel_john ? 'John' : 'Indisponível');
      } else {
        disponibilidadeTexto = item.disponibilidade.toString();
      }
      detalhes.push({ icone: 'hourglass-start', label: 'DISPONÍVEL', valor: disponibilidadeTexto });
    }
    
    // Para Receitas: uso
    if (item.uso) {
      detalhes.push({ icone: 'hammer', label: 'USO', valor: item.uso });
    }
    
    // Para Receitas: dano
    if (item.dano) {
      detalhes.push({ icone: 'fire', label: 'DANO', valor: item.dano });
    }
    
    // Para Amuletos: efeito
    if (item.efeito) {
      detalhes.push({ icone: 'sparkles', label: 'EFEITO', valor: item.efeito });
    }
    
    // Para Amuletos: custo
    if (item.custo) {
      const custo = item.moeda ? `${item.custo} ${item.moeda}` : item.custo.toString();
      detalhes.push({ icone: 'coins', label: 'CUSTO', valor: custo });
    }
    
    // Para Peixes: tipo de água
    if (item.tipo_agua) {
      detalhes.push({ icone: 'droplet', label: 'TIPO DE ÁGUA', valor: item.tipo_agua });
    }
    
    // Para Peixes: iscas
    if (item.iscas && item.iscas.length > 0) {
      detalhes.push({ icone: 'hook', label: 'ISCAS', valor: item.iscas });
    }
    
    // Para Peixes: período
    if (item.periodo) {
      detalhes.push({ icone: 'clock', label: 'PERÍODO', valor: item.periodo });
    }
    
    // Para Peixes: condição climática
    if (item.condicao_climatica) {
      detalhes.push({ icone: 'cloud', label: 'CONDIÇÃO', valor: item.condicao_climatica });
    }
    
    // Para Desafios: nível
    if (item.nivel) {
      detalhes.push({ icone: 'star', label: 'NÍVEL', valor: item.nivel.toString() });
    }
    
    // Para Desafios: recompensas
    if (item.recompensas) {
      detalhes.push({ icone: 'gift', label: 'RECOMPENSA', valor: item.recompensas });
    }
    
    // Notas
    if (item.notas) {
      detalhes.push({ icone: 'circle-info', label: 'NOTAS', valor: item.notas });
    }
    
    // Dica
    if (item.dica) {
      detalhes.push({ icone: 'lightbulb', label: 'DICA', valor: item.dica });
    }
    
    return detalhes;
  }

  isArrayDeStrings(valor: any): boolean {
    return Array.isArray(valor);
  }

  getArrayValue(valor: any): string[] {
    return Array.isArray(valor) ? valor : [];
  }
}
