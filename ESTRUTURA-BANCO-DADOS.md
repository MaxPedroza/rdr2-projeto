# 📂 Estrutura do Banco de Dados - RDR2 Tracker

**Última Atualização:** 31 de dezembro de 2025

---

## 📊 Visão Geral

O banco de dados foi reorganizado em **9 diretórios temáticos** para melhor organização e manutenção. Cada diretório contém arquivos JSON relacionados à sua categoria.

```
Banco/
├── acampamento/
├── amuletos/
├── animais_lendarios/
├── armadilheiro/
├── bugigangas/
├── desafios/
├── itens/
├── peixes_lendarios/
├── receitas/
└── Legado/
```

---

## 📁 Estrutura Detalhada

### 🏕️ **Acampamento** (3 arquivos)
Itens e upgrades do acampamento da gangue

```
acampamento/
├── rdr2_tracker_db.acampamento_acomodacoes.json   (2 itens - alojamento)
├── rdr2_tracker_db.acampamento_decoracao.json     (10 itens - decorações)
└── rdr2_tracker_db.acampamento_utensilio.json     (5 itens - utensílios)
```

**Total:** 17 itens

**Categorias:**
- **Acomodações:** Arthur, John (alojamento específico de personagem)
- **Decoração:** Mapas, mesas, chuckwagon, fogueiras
- **Utensílio:** Bolsas, tônicos, provisões, materiais

---

### 🐻 **Animais Lendários** (5 arquivos)
Animais especiais organizados por região do mapa

```
animais_lendarios/
├── rdr2_tracker_db.animais_lendarios_ambarino.json        (1 item)
├── rdr2_tracker_db.animais_lendarios_epilog.json          (3 itens)
├── rdr2_tracker_db.animais_lendarios_grizzlies.json       (5 itens)
├── rdr2_tracker_db.animais_lendarios_lemoyne.json         (5 itens)
└── rdr2_tracker_db.animais_lendarios_west_elizabeth.json  (2 itens)
```

**Total:** 16 itens

**Organização por Região:**
- **Ambarino:** Montanhas do norte (1 animal)
- **Epilog:** Animais exclusivos do epílogo (3 animais - apenas John)
- **Grizzlies:** Zona norte e montanhosa (5 animais)
- **Lemoyne:** Zona sudeste com pântanos (5 animais)
- **West Elizabeth:** Zona oeste (2 animais)

---

### 💎 **Amuletos** (2 arquivos)
Itens mágicos/especiais crafáveis

```
amuletos/
├── rdr2_tracker_db.amuletos.json   (11 itens - amuletos)
└── rdr2_tracker_db.talismans.json  (6 itens - talismãs)
```

**Total:** 17 itens

**Tipos:**
- **Amuletos:** Partes únicas, efeitos diversos (degradação, XP, qualidade)
- **Talismãs:** Itens compostos (3 partes cada), efeitos maiores (defesa, core)

---

### 🪡 **Armadilheiro** (5 arquivos)
Roupas e conjuntos crafáveis pelo armadilheiro

```
armadilheiro/
├── rdr2_tracker_db.armadilheiro_botas.json      (3 itens - botas)
├── rdr2_tracker_db.armadilheiro_chapeus.json    (15 itens - chapéus)
├── rdr2_tracker_db.armadilheiro_coletes.json    (3 itens - coletes)
├── rdr2_tracker_db.armadilheiro_conjuntos.json  (conjuntos completos)
└── rdr2_tracker_db.armadilheiro_perneiras.json  (10 itens - perneiras)
```

**Total:** 31+ itens

**Categorias por Tipo de Roupa:**
- **Botas:** 3 variantes de botas
- **Chapéus:** 15 chapéus de diferentes animais
- **Coletes:** 3 coletes especializados
- **Conjuntos:** Coleções de roupas coordenadas
- **Perneiras:** 10 variantes de chaps/perneiras

---

### 🎁 **Bugigangas** (3 arquivos)
Itens especiais com efeitos diversos

```
bugigangas/
├── rdr2_tracker_db.bugigangas_armas.json   (3 itens - efeitos de armas)
├── rdr2_tracker_db.bugigangas_outros.json  (3 itens - outros efeitos)
└── rdr2_tracker_db.bugigangas_saude.json   (7 itens - saúde e resistência)
```

**Total:** 13 itens

**Organização por Efeito:**
- **Armas:** Degradação, Olhos da Morte
- **Outros:** Percepção, caça, coleta de ervas
- **Saúde:** Resistência, dano, core, experiência

---

### 🎯 **Desafios** (9 arquivos)
Desafios e objetivos do jogo

```
desafios/
├── rdr2_tracker_db.desafios_apostador.json       (desafios de jogo)
├── rdr2_tracker_db.desafios_atirador_elite.json  (desafios de tiro)
├── rdr2_tracker_db.desafios_bandido.json         (desafios criminosos)
├── rdr2_tracker_db.desafios_cacador.json         (desafios de caça)
├── rdr2_tracker_db.desafios_equitacao.json       (desafios a cavalo)
├── rdr2_tracker_db.desafios_explorador.json      (desafios de exploração)
├── rdr2_tracker_db.desafios_herborista.json      (desafios de ervas)
├── rdr2_tracker_db.desafios_perito_armas.json    (desafios de armamento)
└── rdr2_tracker_db.desafios_sobrevivente.json    (desafios de sobrevivência)
```

**Total:** 9 categorias de desafios

---

### 🎒 **Itens** (5 arquivos)
Equipamentos diversos do jogo

```
itens/
├── rdr2_tracker_db.itens_armas_brancas.json  (facas, espadas)
├── rdr2_tracker_db.itens_armas_fogo.json     (pistolas, rifles)
├── rdr2_tracker_db.itens_chapeus.json        (chapéus encontrados)
├── rdr2_tracker_db.itens_mascaras.json       (máscaras)
└── rdr2_tracker_db.selas_trapper.json        (selas do armadilheiro)
```

**Total:** 5 categorias

---

### 🐟 **Peixes Lendários** (3 arquivos)
Peixes especiais organizados por tipo de água

```
peixes_lendarios/
├── rdr2_tracker_db.peixes_lendarios_lagos.json     (7 peixes - lagos)
├── rdr2_tracker_db.peixes_lendarios_pantanos.json  (1 peixe - pântanos)
└── rdr2_tracker_db.peixes_lendarios_rios.json      (5 peixes - rios)
```

**Total:** 13 itens

**Organização por Tipo de Água:**
- **Lagos:** Água doce em lagos estáticos
- **Pântanos:** Água estagnada em pântanos
- **Rios:** Água corrente em rios

---

### 📋 **Receitas** (1 arquivo)
Receitas crafáveis no acampamento

```
receitas/
└── rdr2_tracker_db.receitas_acampamento.json  (24 itens - receitas)
```

**Total:** 24 itens

**Tipos de Receita:**
- **Cartucheiras:** Bolsas de armazenamento (7 itens + 1 lendário)
- **Alojamento:** Decorações de alojamento (5 itens Arthur + 1 John)
- **Fogueira:** Decorações de fogueira (11 itens)

---

### 📦 **Legado** 
Arquivos originais antigos mantidos para referência

```
Legado/
├── rdr2_tracker_db.amuletos.json
├── rdr2_tracker_db.animais.json
├── rdr2_tracker_db.colecionaveis.json
├── rdr2_tracker_db.conjuntos_trapper.json
├── rdr2_tracker_db.desafios.json
├── rdr2_tracker_db.equipamentos.json
├── rdr2_tracker_db.missoes_mundo.json
├── rdr2_tracker_db.pearson.json
├── rdr2_tracker_db.pedidos_entrega.json
├── rdr2_tracker_db.pontos_interesse.json
└── rdr2_tracker_db.roupas_trapper.json
```

---

## 📊 Estatísticas

| Categoria | Arquivos | Itens | Status |
|-----------|----------|-------|--------|
| Acampamento | 3 | 17 | ✅ Ativo |
| Amuletos | 2 | 17 | ✅ Ativo |
| Animais Lendários | 5 | 16 | ✅ Ativo |
| Armadilheiro | 5 | 31+ | ✅ Ativo |
| Bugigangas | 3 | 13 | ✅ Ativo |
| Desafios | 9 | - | ✅ Ativo |
| Itens | 5 | - | ✅ Ativo |
| Peixes Lendários | 3 | 13 | ✅ Ativo |
| Receitas | 1 | 24 | ✅ Ativo |
| **TOTAL** | **36** | **130+** | ✅ **COMPLETO** |

---

## 🔄 Padrão de Nomenclatura

Todos os arquivos seguem o padrão:
```
rdr2_tracker_db.{categoria}_{subcategoria}.json
```

**Exemplos:**
- `rdr2_tracker_db.acampamento_decoracao.json`
- `rdr2_tracker_db.animais_lendarios_grizzlies.json`
- `rdr2_tracker_db.peixes_lendarios_lagos.json`

---

## 🚀 Como Usar

### Importar Dados Específicos
```javascript
// Node.js / Electron
const acampamentoData = require('./Banco/acampamento/rdr2_tracker_db.acampamento_decoracao.json');

// Front-end (Angular)
import acampamentoData from './assets/data/Banco/acampamento/rdr2_tracker_db.acampamento_decoracao.json';
```

### Carregamento Dinâmico
```typescript
async function loadCategory(category: string, subcategory: string) {
  const path = `./assets/data/Banco/${category}/rdr2_tracker_db.${category}_${subcategory}.json`;
  const response = await fetch(path);
  return await response.json();
}

// Uso
const desafios = await loadCategory('desafios', 'apostador');
const peixes = await loadCategory('peixes_lendarios', 'lagos');
```

---

## 📝 Manutenção

### Adicionar Novo Item
1. Localize o diretório apropriado
2. Encontre o arquivo JSON correto dentro do diretório
3. Adicione o novo item mantendo a estrutura JSON
4. Garanta que o ObjectId seja único

### Adicionar Nova Subcategoria
1. Crie um novo arquivo `rdr2_tracker_db.{categoria}_{subcategoria}.json`
2. Mantenha a estrutura padrão de array JSON
3. Coloque no diretório correspondente
4. Atualize este documento com a nova estrutura

---

## ✅ Benefícios da Estrutura

- ✅ **Organização Clara:** Categorias lógicas por diretório
- ✅ **Fácil Navegação:** Encontre dados facilmente
- ✅ **Escalabilidade:** Adicione novas subcategorias sem conflitos
- ✅ **Performance:** Carregue apenas dados necessários
- ✅ **Manutenção:** Atualizações isoladas por categoria
- ✅ **Versionamento:** Cada categoria pode ter histórico independente

---

**Estrutura de banco de dados concluída! 🎉**
