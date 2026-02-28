# 🎨 Visual Identity Skill — HarmoniFace CRM
**Arquivo:** `.github/instructions/visual-identity.instructions.md`

---

## 📌 IDENTIDADE DA MARCA

**Nome:** HarmoniFace  
**Segmento:** CRM para consultórios de harmonização facial  
**Persona:** Profissional estética sofisticada, confiável, premium  
**Tom visual:** Luxo acessível · Elegância clínica · Feminino refinado

---

## 🎨 PALETA DE CORES

### Cores Primárias

```css
:root {
  /* ═══════════════════════════════════════════ */
  /* BRAND CORE                                  */
  /* ═══════════════════════════════════════════ */
  --brand-burgundy:       #591D1E;  /* Primária — força, sofisticação */
  --brand-blush:          #E6C0B8;  /* Secundária — delicadeza, pele */
  --brand-black:          #000000;  /* Base — autoridade, contraste  */

  /* ═══════════════════════════════════════════ */
  /* DERIVAÇÕES AUTOMÁTICAS                      */
  /* ═══════════════════════════════════════════ */
  --brand-burgundy-light: #7A2E30;  /* Hover states, bordas ativas  */
  --brand-burgundy-dark:  #3D1314;  /* Pressed states, sombras      */
  --brand-burgundy-10:    #591D1E1A;/* Overlays, fundos sutis       */
  --brand-burgundy-20:    #591D1E33;/* Cards com tint               */

  --brand-blush-light:    #F2D8D2;  /* Inputs focus, highlights     */
  --brand-blush-dark:     #C9967F;  /* Tags, badges, separadores    */
  --brand-blush-10:       #E6C0B81A;/* Fundos de seções alternadas  */

  /* ═══════════════════════════════════════════ */
  /* NEUTROS CLÍNICOS                            */
  /* ═══════════════════════════════════════════ */
  --neutral-white:        #FFFFFF;
  --neutral-50:           #FAF8F7;  /* Background padrão das páginas*/
  --neutral-100:          #F4EFED;  /* Cards, painéis secundários   */
  --neutral-200:          #E8E0DE;  /* Bordas, divisores            */
  --neutral-400:          #B09E9A;  /* Placeholders, ícones inativos*/
  --neutral-600:          #6B5755;  /* Textos auxiliares, captions  */
  --neutral-800:          #2C1F1E;  /* Textos principais            */
  --neutral-900:          #160F0F;  /* Títulos de alto contraste    */

  /* ═══════════════════════════════════════════ */
  /* SEMÂNTICAS (Status / Feedback)              */
  /* ═══════════════════════════════════════════ */
  --status-success:       #2D6A4F;
  --status-success-bg:    #D8F3DC;
  --status-warning:       #7B4F12;
  --status-warning-bg:    #FDEBD0;
  --status-error:         #8B0000;
  --status-error-bg:      #FFE4E4;
  --status-info:          #1A4A6B;
  --status-info-bg:       #D6EAF8;

  /* ═══════════════════════════════════════════ */
  /* AI / IA — Elementos de Inteligência         */
  /* ═══════════════════════════════════════════ */
  --ai-primary:           #591D1E;
  --ai-glow:              #E6C0B866;/* Glow ring em elementos de IA */
  --ai-border:            #C9967F;
  --ai-bg:                #F9F2F0;
}
```

### Mapa Visual da Paleta

```
DARK THEME (modo escuro do CRM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background:   #000000 / #160F0F
Surface:      #2C1F1E
Border:       #3D1314
Primary:      #591D1E   → hover: #7A2E30
Accent:       #E6C0B8
Text primary: #FAF8F7
Text muted:   #B09E9A

LIGHT THEME (modo claro — padrão)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background:   #FAF8F7
Surface:      #FFFFFF
Border:       #E8E0DE
Primary:      #591D1E   → hover: #7A2E30
Accent:       #E6C0B8
Text primary: #2C1F1E
Text muted:   #6B5755
```

---

## 🔤 TIPOGRAFIA

### Fontes da Marca

```html
<!-- No <head> do layout.tsx -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet" />
```

```css
/* ═══════════════════════════════════════════ */
/* HIERARQUIA TIPOGRÁFICA HARMONYFACE          */
/* ═══════════════════════════════════════════ */

/* Display / Títulos principais */
--font-display: 'Playfair Display', Georgia, serif;

/* Corpo / Interface / Labels */
--font-body:    'Lato', system-ui, sans-serif;

/* Monospace (código, IDs, lotes) */
--font-mono:    'Courier New', Courier, monospace;
```

### Escala Tipográfica

| Token          | Fonte           | Tamanho | Peso | Uso                         |
|----------------|-----------------|---------|------|-----------------------------|
| `text-hero`    | Playfair Display| 48–64px | 700  | Hero section, splash screen |
| `text-h1`      | Playfair Display| 36px    | 600  | Títulos de página           |
| `text-h2`      | Playfair Display| 28px    | 600  | Seções principais           |
| `text-h3`      | Playfair Display| 22px    | 500  | Subseções, card titles      |
| `text-h4`      | Lato            | 18px    | 700  | Labels de seção, nav items  |
| `text-body`    | Lato            | 16px    | 400  | Texto corrido               |
| `text-small`   | Lato            | 14px    | 400  | Captions, metadados         |
| `text-micro`   | Lato            | 12px    | 700  | Tags, badges, status labels |
| `text-clinical`| Lato            | 15px    | 300  | Anotações clínicas (itálico)|

```css
/* Tailwind config extension */
fontFamily: {
  display: ['Playfair Display', 'Georgia', 'serif'],
  body:    ['Lato', 'system-ui', 'sans-serif'],
}
```

---

## 🖼️ LOGOTIPOS — USO CORRETO

### Versões Disponíveis

| Arquivo           | Variação    | Fundo recomendado         | Uso                           |
|-------------------|-------------|---------------------------|-------------------------------|
| `principal.png`   | Bordô/Preto | Fundo preto `#000000`     | Splash, dark mode, hero       |
| `negativo.png`    | Dark fill   | Fundo bordô `#591D1E`     | Headers, sidebars dark, CTAs  |
| `positivo.png`    | Branco/Preto| Fundo preto `#000000`     | Impressão, versão monocromática|

### Regras de Uso

```
✅ PERMITIDO                          ❌ PROIBIDO
──────────────────────────────────    ──────────────────────────────────
Logo principal em fundo preto         Distorcer proporções da logo
Logo negativo em fundo #591D1E        Recolorir a logo manualmente
Logo positivo em fundo escuro         Aplicar efeitos (sombra, blur)
Tamanho mínimo: 32px altura           Logo em fundos com baixo contraste
Espaçamento: 16px de clearspace       Logo sobre fotos sem overlay escuro
```

### Implementação Next.js

```tsx
// components/ui/brand-logo.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

type LogoVariant = 'principal' | 'negativo' | 'positivo'

interface BrandLogoProps {
  variant?: LogoVariant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = { sm: 32, md: 48, lg: 64, xl: 96 }
const logoFiles: Record<LogoVariant, string> = {
  principal: '/brand/logo-principal.png',
  negativo:  '/brand/logo-negativo.png',
  positivo:  '/brand/logo-positivo.png',
}

export function BrandLogo({ variant = 'principal', size = 'md', className }: BrandLogoProps) {
  const px = sizes[size]
  return (
    <Image
      src={logoFiles[variant]}
      alt="HarmoniFace"
      width={px * 0.7}
      height={px}
      className={cn('object-contain', className)}
      priority
    />
  )
}
```

---

## 🧩 COMPONENTES DE IDENTIDADE — DESIGN TOKENS

### Tailwind CSS Config

```js
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: {
            DEFAULT: '#591D1E',
            light:   '#7A2E30',
            dark:    '#3D1314',
          },
          blush: {
            DEFAULT: '#E6C0B8',
            light:   '#F2D8D2',
            dark:    '#C9967F',
          },
          black: '#000000',
        },
        clinical: {
          50:  '#FAF8F7',
          100: '#F4EFED',
          200: '#E8E0DE',
          400: '#B09E9A',
          600: '#6B5755',
          800: '#2C1F1E',
          900: '#160F0F',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Lato', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand-sm':   '0 2px 8px rgba(89, 29, 30, 0.15)',
        'brand-md':   '0 4px 16px rgba(89, 29, 30, 0.20)',
        'brand-lg':   '0 8px 32px rgba(89, 29, 30, 0.25)',
        'brand-glow': '0 0 24px rgba(230, 192, 184, 0.40)',
        'ai-glow':    '0 0 16px rgba(230, 192, 184, 0.50)',
      },
      borderRadius: {
        'brand': '12px',
        'brand-lg': '20px',
        'brand-card': '16px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #591D1E 0%, #3D1314 100%)',
        'blush-gradient': 'linear-gradient(135deg, #E6C0B8 0%, #F2D8D2 100%)',
        'dark-gradient':  'linear-gradient(180deg, #160F0F 0%, #000000 100%)',
        'hero-overlay':   'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(89,29,30,0.7) 100%)',
        'face-mesh':      'radial-gradient(ellipse at 50% 0%, rgba(230,192,184,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 🏥 ELEMENTOS VISUAIS TEMÁTICOS

### 1. Hero Section — Consultório / Face

```tsx
// components/brand/hero-section.tsx
// Padrão visual para páginas de login, splash e marketing

export function HeroBackground() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-brand-black">
      {/* Imagem de fundo — rosto/consultório */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/brand/hero-face-bg.jpg')" }}
      />
      {/* Gradient overlay da marca */}
      <div className="absolute inset-0 bg-hero-overlay" />
      {/* Mesh de blush sutil no topo */}
      <div className="absolute inset-0 bg-face-mesh" />
      {/* Ornamento circular — referência ao rosto/oval */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[500px] h-[600px] rounded-[50%] border border-brand-blush/20
                      shadow-brand-glow pointer-events-none" />
    </div>
  )
}
```

### 2. Oval Ornamental — Símbolo da Marca

```tsx
// O logotipo usa um oval — reforçar esse motivo na UI
// Representa: face oval, elegância, harmonia

// Usar em:
// - Avatars de paciente (moldura oval)
// - Cards de procedimento (border-radius especial)
// - Ícones de status clínico
// - Separadores decorativos

const OvalFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex items-center justify-center
                  rounded-[50%] border-2 border-brand-burgundy
                  shadow-brand-sm overflow-hidden
                  aspect-[3/4]">
    {children}
  </div>
)
```

### 3. Padrão de Cards — Área Clínica

```tsx
// Cartão padrão para prontuários, sessões, procedimentos
<div className="
  bg-white border border-clinical-200
  rounded-brand-card shadow-brand-sm
  hover:shadow-brand-md hover:border-brand-burgundy/30
  transition-all duration-300
  p-6
">
  {/* Linha decorativa superior — bordô */}
  <div className="w-12 h-0.5 bg-brand-burgundy mb-4 rounded-full" />
  {/* Conteúdo */}
</div>
```

### 4. Sidebar — Dark Mode (padrão CRM)

```tsx
// Layout base do CRM — sidebar bordô escuro
<aside className="
  w-64 h-screen bg-gradient-to-b from-[#160F0F] to-[#000000]
  border-r border-brand-burgundy/20
  flex flex-col
">
  {/* Logo */}
  <div className="p-6 border-b border-brand-burgundy/20">
    <BrandLogo variant="positivo" size="md" />
    <p className="text-clinical-400 text-xs font-body mt-1 tracking-widest uppercase">
      Harmonização Facial
    </p>
  </div>

  {/* Nav items */}
  <nav className="flex-1 p-4 space-y-1">
    {/* Item ativo */}
    <a className="flex items-center gap-3 px-4 py-3 rounded-brand
                  bg-brand-burgundy text-white font-body font-700
                  shadow-brand-sm">
      ...
    </a>
    {/* Item inativo */}
    <a className="flex items-center gap-3 px-4 py-3 rounded-brand
                  text-clinical-400 hover:text-brand-blush
                  hover:bg-brand-burgundy/10 transition-colors">
      ...
    </a>
  </nav>
</aside>
```

### 5. Botões — Sistema Completo

```tsx
// Variantes de botão da marca
const buttonVariants = {
  primary: `
    bg-brand-burgundy text-white font-body font-700
    hover:bg-brand-burgundy-light active:bg-brand-burgundy-dark
    shadow-brand-sm hover:shadow-brand-md
    transition-all duration-200
    px-6 py-3 rounded-brand
  `,
  secondary: `
    bg-transparent text-brand-burgundy font-body font-700
    border-2 border-brand-burgundy
    hover:bg-brand-burgundy hover:text-white
    transition-all duration-200
    px-6 py-3 rounded-brand
  `,
  ghost: `
    bg-transparent text-brand-burgundy font-body font-400
    hover:bg-brand-burgundy/10
    transition-colors duration-200
    px-4 py-2 rounded-brand
  `,
  blush: `
    bg-brand-blush text-brand-burgundy-dark font-body font-700
    hover:bg-brand-blush-dark hover:text-white
    transition-all duration-200
    px-6 py-3 rounded-brand
  `,
  ai: `
    bg-brand-burgundy text-brand-blush font-body font-700
    border border-brand-blush/30
    shadow-ai-glow hover:shadow-brand-glow
    transition-all duration-300
    px-6 py-3 rounded-brand
    relative overflow-hidden
  `,
}
```

---

## 🌸 MOTION & ANIMAÇÕES

```css
/* globals.css — Animações da marca */

/* Entrada suave de elementos clínicos */
@keyframes harmonyFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulsação para status de IA / processamento */
@keyframes aiBreathe {
  0%, 100% { box-shadow: 0 0 8px rgba(230, 192, 184, 0.3); }
  50%       { box-shadow: 0 0 24px rgba(230, 192, 184, 0.7); }
}

/* Shimmer para loading states */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.harmony-enter   { animation: harmonyFadeIn 0.4s ease-out forwards; }
.ai-pulse        { animation: aiBreathe 2.5s ease-in-out infinite; }
.skeleton-shimmer {
  background: linear-gradient(90deg, #F4EFED 25%, #E8E0DE 50%, #F4EFED 75%);
  background-size: 400px 100%;
  animation: shimmer 1.5s infinite;
}

/* Delay classes para stagger */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
```

---

## 📊 ELEMENTOS DE DADOS — KPIs e Métricas

```tsx
// KPI Card — Faturamento, pacientes, procedimentos
<div className="bg-white rounded-brand-card p-6 border border-clinical-200
                shadow-brand-sm hover:shadow-brand-md transition-shadow">
  {/* Ícone com fundo bordô */}
  <div className="w-10 h-10 rounded-brand bg-brand-burgundy/10
                  flex items-center justify-center mb-4">
    <Icon className="w-5 h-5 text-brand-burgundy" />
  </div>
  {/* Valor em Playfair Display */}
  <p className="font-display text-3xl font-700 text-clinical-800">
    R$ 12.400
  </p>
  {/* Label em Lato */}
  <p className="font-body text-sm text-clinical-600 mt-1">
    Faturamento do mês
  </p>
  {/* Variação */}
  <span className="inline-flex items-center gap-1 text-xs font-body font-700
                   text-status-success bg-status-success-bg
                   px-2 py-0.5 rounded-full mt-3">
    ↑ 12% vs mês anterior
  </span>
</div>
```

---

## 🔬 BADGES DE PROCEDIMENTO

```tsx
// Cores por tipo de procedimento — harmonização facial
const procedureBadges = {
  'Toxina Botulínica':  'bg-purple-50 text-purple-800 border-purple-200',
  'Ácido Hialurônico':  'bg-blue-50 text-blue-800 border-blue-200',
  'Bioestimulador':     'bg-green-50 text-green-800 border-green-200',
  'Fios PDO':           'bg-amber-50 text-amber-800 border-amber-200',
  'Skinbooster':        'bg-cyan-50 text-cyan-800 border-cyan-200',
  'Peeling':            'bg-orange-50 text-orange-800 border-orange-200',
  'Microagulhamento':   'bg-rose-50 text-rose-800 border-rose-200',
} as const

// Uso:
<span className={cn(
  'text-xs font-body font-700 px-2.5 py-0.5 rounded-full border',
  procedureBadges[procedure]
)}>
  {procedure}
</span>
```

---

## 🤖 ELEMENTOS DE IA — Componentes especiais

```tsx
// Badge "Sugestão de IA" — obrigatório em todas respostas geradas por IA
export function AIDisclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-brand
                    bg-brand-burgundy/5 border border-brand-blush/40
                    ai-pulse">
      <div className="w-6 h-6 rounded-full bg-brand-burgundy/20
                      flex items-center justify-center flex-shrink-0 mt-0.5">
        <SparklesIcon className="w-3.5 h-3.5 text-brand-burgundy" />
      </div>
      <p className="text-xs font-body text-clinical-600 italic">
        <span className="font-700 text-brand-burgundy not-italic">
          Sugestão gerada por IA.
        </span>{' '}
        A decisão clínica é de responsabilidade exclusiva do profissional habilitado.
      </p>
    </div>
  )
}
```

---

## 🎯 PATTERNS DE PÁGINA — Templates

### Login Page

```
┌─────────────────────────────────────────────────────┐
│  Background: Foto consultório + overlay bordô 70%    │
│  ┌──────────────────────────────────────────────┐   │
│  │  Logo positivo (branco) — tamanho xl         │   │
│  │  "HarmoniFace" — Playfair Display 40px       │   │
│  │  "CRM para Harmonização Facial" — Lato 16px  │   │
│  │                                              │   │
│  │  ────────────────────────────────────────    │   │
│  │  Input: E-mail                               │   │
│  │  Input: Senha                                │   │
│  │  Button: Entrar [bg-brand-burgundy]          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Dashboard Principal

```
┌──────────────┬──────────────────────────────────────┐
│  SIDEBAR     │  HEADER                              │
│  dark        │  bg-white border-b clinical-200      │
│  #160F0F     ├──────────────────────────────────────┤
│              │  HERO KPIs  (4 cards — shadow-brand) │
│  Logo        ├──────────────────────────────────────┤
│  positivo    │  Agenda Hoje  |  Últimos Pacientes   │
│              │  rounded-brand-card                  │
│  Nav items   ├──────────────────────────────────────┤
│  Lato 14px   │  IA Insights (ai-pulse border)       │
│              │  Gráfico Faturamento (Recharts)      │
└──────────────┴──────────────────────────────────────┘
```

---

## 📋 REGRAS DE USO — CHECKLIST

Antes de entregar qualquer componente UI, verificar:

```
MARCA
  □ Fonte display = Playfair Display
  □ Fonte corpo = Lato
  □ Cor primária = #591D1E (nunca aproximações)
  □ Logo usada na variante correta para o fundo
  □ Clearspace da logo respeitado (16px mínimo)

VISUAL TEMÁTICO
  □ Cards com rounded-brand-card + shadow-brand-sm
  □ Bordas em clinical-200 (não generic gray-200)
  □ Hovers com transição suave 200-300ms
  □ Elementos IA com ai-pulse + disclaimer obrigatório

TIPOGRAFIA
  □ Títulos h1/h2 em Playfair Display
  □ Interface/labels em Lato
  □ Peso correto: display 600-700, body 400-700
  □ Cores de texto: clinical-800 (principal), clinical-600 (muted)

PROCEDIMENTOS
  □ Badges com cores específicas por procedimento
  □ Regiões faciais listadas com nomenclatura padronizada
  □ Lote/validade sempre visível em cards de procedimento
```

---

## 🗂️ ESTRUTURA DE ARQUIVOS DE MARCA

```
public/
  brand/
    logo-principal.png    ← Versão bordô s/ fundo (uso: dark bg)
    logo-negativo.png     ← Versão dark fill (uso: fundo #591D1E)
    logo-positivo.png     ← Versão branca (uso: fundo escuro)
    hero-face-bg.jpg      ← Foto de fundo — harmonização/consultório
    hero-face-bg-2.jpg    ← Variação para diferentes seções
    og-image.png          ← Open Graph 1200×630

src/
  styles/
    globals.css           ← Variáveis CSS + animações da marca
    brand-tokens.css      ← Todos os --brand-* tokens
  components/
    ui/
      brand-logo.tsx      ← Componente de logo com variantes
    brand/
      hero-section.tsx    ← Hero com background temático
      ai-disclaimer.tsx   ← Badge obrigatório para IA
      procedure-badge.tsx ← Badges de procedimento coloridos
      kpi-card.tsx        ← Cards de métricas com identidade
```

---

*Skill criada para o projeto HarmoniFace CRM — Harmonização Facial*  
*Versão: 1.0.0 | Fontes: Playfair Display + Lato | Paleta: #591D1E + #E6C0B8 + #000000*
