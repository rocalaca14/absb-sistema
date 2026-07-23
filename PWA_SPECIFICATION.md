# PWA_SPECIFICATION — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define a especificação completa de PWA (Progressive Web App) do projeto. Cobre manifest, service worker, instalação, atualização, cache, offline, push notifications e meta tags de plataforma.

---

## 2. Stack PWA

| Componente | Tecnologia |
|---|---|
| Plugin de build | `vite-plugin-pwa` |
| Service Worker | Workbox (gerado automaticamente) |
| Manifesto | `manifest.webmanifest` |
| Registro de SW | Automático em produção, desabilitado em dev |

---

## 3. Manifesto

Arquivo: `public/manifest.webmanifest` (gerado pelo `vite-plugin-pwa`).

### 3.1 Conteúdo

```json
{
  "name": "ABSB — Associação dos Bugueiros de São Bento",
  "short_name": "ABSB",
  "description": "Gestão da Associação dos Bugueiros de São Bento",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "lang": "pt-BR",
  "dir": "ltr",
  "theme_color": "#00BAB9",
  "background_color": "#F4F5F7",
  "prefer_related_applications": false,
  "categories": ["business", "productivity", "utilities"],
  "icons": [
    {
      "src": "/logo-absb-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logo-absb-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logo-absb-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### 3.2 Ícones

| Arquivo | Tamanho | Uso |
|---|---|---|
| `logo-absb-192.png` | 192x192 | Ícone padrão Android/iOS |
| `logo-absb-512.png` | 512x512 | Ícone alta resolução |
| `logo-absb-maskable-512.png` | 512x512 | Ícone com safe zone para máscara Android |

> **Bloqueio:** ícones serão gerados a partir da logo oficial quando fornecida. Enquanto isso, o manifest referencia placeholders.

---

## 4. Meta Tags

### 4.1 `index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
    <meta name="theme-color" content="#00BAB9" />
    <meta name="description" content="Gestão da Associação dos Bugueiros de São Bento" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="ABSB" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="ABSB" />
    <meta name="msapplication-TileColor" content="#00BAB9" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" type="image/png" sizes="192x192" href="/logo-absb-192.png" />
    <link rel="apple-touch-icon" href="/logo-absb-180.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/logo-absb-180.png" />
    <link rel="mask-icon" href="/logo-absb-maskable-512.png" color="#00BAB9" />
    <title>ABSB — Associação dos Bugueiros de São Bento</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 4.2 Viewport

`viewport-fit=cover` é obrigatório para que `env(safe-area-inset-*)` funcione em iOS.

`maximum-scale=1` impede zoom (UX mobile padrão).

---

## 5. Service Worker

### 5.1 Registro

```ts
// main.tsx
import { registerSW } from 'virtual:pwa-register';

if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onRegisteredSW: (swUrl) => {
      logger.info('SW registrado', { swUrl });
    },
    onRegisterError: (error) => {
      logger.error('Erro ao registrar SW', { error });
    },
  });
}
```

### 5.2 Configuração (`vite.config.ts`)

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo-absb-*.png', 'robots.txt'],
      manifest: {
        // ... conteúdo do manifest
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          // Estratégias (ver 5.3)
        ],
      },
    }),
  ],
});
```

### 5.3 Estratégias de Cache

| Recurso | Estratégia | TTL | Justificativa |
|---|---|---|---|
| Assets estáticos (JS, CSS, fontes) | `CacheFirst` | 30 dias | Conteúdo imutável com hash no nome |
| Imagens locais (logo) | `CacheFirst` | 30 dias | Conteúdo estático |
| Chamadas a `*.supabase.co/rest/*` | `NetworkFirst` com fallback para cache | TTL 60s | Dados dinâmicos, sempre buscar versão mais recente |
| Chamadas a `*.supabase.co/auth/*` | `NetworkOnly` | — | Autenticação nunca pode ser cacheada |
| Chamadas a `*.supabase.co/storage/*` | `CacheFirst` | 7 dias | Uploads de comprovantes |
| Páginas HTML (navegação) | `NetworkFirst` com fallback para `/offline` | — | Tentar rede, cair em página offline |
| Google Sheets CSV (importação) | `NetworkOnly` | — | Sempre buscar valor atual |

### 5.4 Tamanho Máximo de Cache

```ts
workbox: {
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  // Limite total via runtimeCaching
}
```

Cache total sugerido: 50MB (suficiente para app + 1 mês de dados).

### 5.5 Limpeza de Cache

Cache antigo é limpo automaticamente via `cleanupOutdatedCaches: true`.

Em logout, cache em memória (não SW) é limpo. Cache do SW é limpo por versão.

---

## 6. Instalação

### 6.1 Android (Chrome, Edge)

- Banner de instalação aparece após 2+ visitas.
- Botão "Instalar" disponível em `beforeinstallprompt`.
- `App instalado` → abre em modo standalone (sem barra do navegador).

### 6.2 iOS (Safari)

- Usuário deve usar "Compartilhar > Adicionar à Tela de Início".
- App instalado aparece com nome "ABSB".
- Modo standalone (sem Safari UI).

### 6.3 Desktop (Chrome, Edge)

- Ícone de instalação na barra de endereço.
- App roda em janela própria.

### 6.4 Prompt de Instalação (futuro)

```ts
// Capturar evento
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar UI customizada (futuro)
});
```

> **Fase futura:** instalar UI customizada para prompt de instalação. Nesta fase, comportamento padrão do navegador.

---

## 7. Atualização

### 7.1 Estratégia

- `registerType: 'autoUpdate'` faz o SW atualizar automaticamente.
- Nova versão é detectada em background.
- Usuário é notificado via toast: "Nova versão disponível. Recarregue para atualizar." (fase 1.2).
- Botão "Recarregar" chama `updateSW()` e recarrega a página.

### 7.2 Versionamento

- `package.json` define versão.
- Build injeta `VITE_APP_VERSION`.
- SW só é substituído quando há nova versão do app.

---

## 8. Offline

### 8.1 Estratégia

- Páginas acessadas recentemente ficam disponíveis offline (cache de HTML).
- Dados de listagens ficam disponíveis via cache de runtime (TTL 60s).
- Mutações offline: **não suportadas nesta fase**. Operações de escrita exigem conexão.

### 8.2 Página Offline

- Rota `/offline` (placeholder) com mensagem: "Você está offline. Algumas funcionalidades podem não estar disponíveis."
- Exibida quando navegação falha e não há cache.

### 8.3 Indicador de Conexão

- Componente `OfflineIndicator` (futuro) exibe banner quando `navigator.onLine === false`.

---

## 9. Notificações Push (fase 1.2)

### 9.1 Configuração

- Service Worker registra push handler.
- Permissão solicitada via `Notification.requestPermission()`.
- Subscription armazenada em `profiles` (campo `push_subscription`).

### 9.2 Triggers

- Vencimento de mensalidade em 3 dias.
- Vencimento de mensalidade no dia.
- Pagamento confirmado (notificação para o associado, fase futura).
- Atualizações importantes do sistema.

### 9.3 Backend (fase 1.2)

- Edge Function do Supabase envia push via `web-push`.
- Chave VAPID armazenada em secrets.

---

## 10. Armazenamento Local

| Tecnologia | Uso | Limite |
|---|---|---|
| `localStorage` | Apenas Supabase Auth (gerenciado) | ~5MB |
| `Cache Storage (SW)` | Assets e dados de runtime | ~50MB |
| `IndexedDB` | Não usado nesta fase | — |
| Cookies | Não usado | — |

> **Regra:** nenhum dado de aplicação em `localStorage` (exceto sessão do Supabase). Toda persistência via Supabase.

---

## 11. CSP (Content Security Policy)

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" />
```

> **`style-src 'unsafe-inline'`** necessário para CSS Modules (estilos podem ser inline no build de produção). Avaliar em refatoração futura.

---

## 12. Performance

### 12.1 Core Web Vitals (alvos)

| Métrica | Alvo | Mobile |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | ✓ |
| FID (First Input Delay) | < 100ms | ✓ |
| CLS (Cumulative Layout Shift) | < 0.1 | ✓ |

### 12.2 Otimizações

- Code splitting por rota.
- Preload de rotas prováveis (Início após login).
- Imagens em WebP.
- Fontes pré-carregadas.
- SW cacheia assets críticos.

### 12.3 Lighthouse (alvo)

- Performance: > 90.
- Accessibility: > 95.
- Best Practices: > 95.
- SEO: > 90.
- PWA: ✓ (instalável, manifest válido, SW registrado).

---

## 13. Compatibilidade

| Plataforma | Versão mínima |
|---|---|
| iOS Safari | 14+ |
| Android Chrome | 90+ |
| Desktop Chrome | 90+ |
| Desktop Edge | 90+ |
| Desktop Firefox | 90+ (PWA parcial, sem instalação) |
| Desktop Safari | 14+ (PWA parcial) |

---

## 14. Testes PWA

- Manifest válido: `npx pwa-asset-generator` ou validador online.
- SW registrado: DevTools > Application > Service Workers.
- Instalável: DevTools > Application > Manifest.
- Offline: DevTools > Network > Offline.
- Lighthouse: `npx lighthouse <url> --view`.

---

## 15. Bloqueios

- Logo oficial: ícones do manifest dependem dela.
- Domínio GitHub Pages: `start_url` e `scope` dependem do path final.
- Push notifications: configuradas em fase 1.2.
