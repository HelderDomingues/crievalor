# Analytics Integration - Crie Valor

Sistema de integração com Google Analytics 4 (GA4) e Google Tag Manager (GTM) para rastreamento completo de eventos, conversões e comportamento do usuário.

## 📋 Índice

- [Configuração Inicial](#configuração-inicial)
- [Google Analytics 4](#google-analytics-4)
- [Google Tag Manager](#google-tag-manager)
- [Eventos Customizados](#eventos-customizados)
- [E-commerce Tracking](#e-commerce-tracking)
- [Conformidade LGPD](#conformidade-lgpd)

---

## 🚀 Configuração Inicial

### 1. Criar Contas

**Google Analytics 4:**
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma propriedade GA4
3. Copie o ID de medição (formato: `G-XXXXXXXXXX`)

**Google Tag Manager:**
1. Acesse [Google Tag Manager](https://tagmanager.google.com/)
2. Crie um contêiner para Web
3. Copie o ID do contêiner (formato: `GTM-XXXXXX`)

### 2. Configurar Variáveis de Ambiente

Crie/edite o arquivo `.env` na raiz do projeto:

```env
# Google Analytics 4
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Google Tag Manager
VITE_GTM_ID=GTM-XXXXXX
```

### 3. Implementar no App

Edite `src/App.tsx` ou `src/main.tsx`:

```tsx
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';

function App() {
  return (
    <AnalyticsProvider 
      gaTrackingId={import.meta.env.VITE_GA_TRACKING_ID}
      gtmId={import.meta.env.VITE_GTM_ID}
    >
      {/* Seu app aqui */}
      <RouterProvider router={router} />
    </AnalyticsProvider>
  );
}
```

---

## 📊 Google Analytics 4

### Rastreamento Automático

O componente rastreia automaticamente:
- ✅ Page views em mudanças de rota
- ✅ Sessões de usuário
- ✅ Dados demográficos (quando disponíveis)

### Eventos Customizados

```tsx
import { trackEvent, trackButtonClick, trackFormSubmit } from '@/components/analytics/GoogleAnalytics';

// Evento genérico
trackEvent('custom_event', {
  category: 'engagement',
  label: 'user_action',
  value: 1
});

// Clique em botão
trackButtonClick('download_ebook', 'hero_section');

// Submissão de formulário
trackFormSubmit('contact_form', true);
```

### Funções Disponíveis

```tsx
// Page view manual
trackPageView('/custom-page');

// Link externo
trackOutboundLink('https://example.com', 'Example Link');

// Reprodução de vídeo
trackVideoPlay('Demo Video', 'https://youtube.com/...');

// Download de arquivo
trackDownload('ebook.pdf', 'PDF');
```

---

## 🏷️ Google Tag Manager

### Configuração de Tags no GTM

#### 1. Tag de Google Analytics 4

No GTM:
1. **Tags** → **Nova**
2. Tipo: **Google Analytics: Configuração do GA4**
3. ID de medição: `{{GA4 Measurement ID}}`
4. Acionador: **All Pages**

#### 2. Tag de Eventos Personalizados

1. **Tags** → **Nova**
2. Tipo: **Google Analytics: evento do GA4**
3. Nome do evento: Use variável `{{Event Name}}`
4. Acionador: **Custom Event**

#### 3. Variáveis Recomendadas

Crie estas variáveis em **Variáveis** → **Nova**:

- `Page Path`: Tipo **Variável de camada de dados**, Nome: `page.path`
- `Event Name`: Tipo **Variável de camada de dados**, Nome: `event`
- `Form Name`: Tipo **Variável de camada de dados**, Nome: `form_name`
- `Button Name`: Tipo **Variável de camada de dados**, Nome: `button_name`

### Eventos via Data Layer

```tsx
import { trackGTMEvent, trackLead, trackPurchase } from '@/components/analytics/GoogleTagManager';

// Evento customizado
trackGTMEvent('button_click', {
  button_name: 'cta_principal',
  section: 'hero'
});

// Lead gerado
trackLead({
  form_name: 'contact_form',
  lead_type: 'consultation',
  value: 100
});

// Compra (e-commerce)
trackPurchase({
  transactionId: 'TXN-12345',
  value: 997.00,
  currency: 'BRL',
  items: [
    {
      item_id: 'plano-essencial',
      item_name: 'Plano Essencial MAR',
      price: 997.00,
      quantity: 1
    }
  ]
});
```

---

## 🎯 Eventos Customizados

### Eventos Importantes para Rastrear

#### Navegação
```tsx
// Hero CTA
trackButtonClick('cta_hero', 'home_hero_section');

// Menu navegação
trackEvent('navigation_click', {
  menu_item: 'produtos',
  destination: '/mar'
});
```

#### Formulários
```tsx
// Início do preenchimento
trackEvent('form_start', { form_name: 'contact' });

// Sucesso
trackFormSubmit('contact_form', true);

// Erro
trackFormSubmit('contact_form', false);
```

#### Conversões
```tsx
// Lead qualificado
trackLead({
  form_name: 'mar_consultation',
  lead_type: 'high_value',
  value: 997
});

// Download de material
trackDownload('mar_ebook.pdf', 'lead_magnet');

// Vídeo assistido
trackVideoPlay('MAR Explicação', '/video/mar-intro');
```

---

## 🛒 E-commerce Tracking

### Visualização de Produto
```tsx
import { pushToDataLayer } from '@/components/analytics/GoogleTagManager';

pushToDataLayer({
  event: 'view_item',
  ecommerce: {
    items: [{
      item_id: 'plano-essencial-mar',
      item_name: 'Plano Essencial MAR',
      price: 997.00,
      item_category: 'Assinatura',
      item_variant: 'Mensal'
    }]
  }
});
```

### Adicionar ao Carrinho
```tsx
pushToDataLayer({
  event: 'add_to_cart',
  ecommerce: {
    items: [{
      item_id: 'plano-profissional-mar',
      item_name: 'Plano Profissional MAR',
      price: 1497.00,
      quantity: 1
    }]
  }
});
```

### Início do Checkout
```tsx
pushToDataLayer({
  event: 'begin_checkout',
  ecommerce: {
    value: 1497.00,
    currency: 'BRL',
    items: [...]
  }
});
```

### Compra Completa
```tsx
trackPurchase({
  transactionId: 'TXN-' + Date.now(),
  affiliation: 'Website',
  value: 1497.00,
  currency: 'BRL',
  tax: 0,
  shipping: 0,
  items: [{
    item_id: 'plano-profissional-mar',
    item_name: 'Plano Profissional MAR',
    price: 1497.00,
    quantity: 1
  }]
});
```

---

## 🔒 Conformidade LGPD

### Integração com CookieConsent

O sistema já está integrado com o `CookieConsent` existente:

```tsx
// O AnalyticsProvider verifica automaticamente o consentimento
const hasAnalyticsConsent = () => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) return false;
  
  const consentData = JSON.parse(consent);
  return consentData.analytics === true;
};
```

### Atualizar Consentimento

Quando o usuário aceitar/rejeitar cookies:

```tsx
// No componente CookieConsent.tsx
const handleAccept = () => {
  const consent = {
    necessary: true,
    analytics: true,
    marketing: true
  };
  localStorage.setItem('cookieConsent', JSON.stringify(consent));
  
  // Recarregar para ativar analytics
  window.location.reload();
};
```

---

## 📈 Métricas Recomendadas

### Google Analytics 4

**Principais Relatórios:**
- Aquisição → Visão geral do tráfego
- Engajamento → Eventos
- Monetização → Compras de e-commerce
- Retenção → Análise de coorte

**Conversões Importantes:**
1. `generate_lead` - Leads capturados
2. `purchase` - Compras realizadas
3. `form_submit` - Formulários enviados
4. `file_download` - Downloads de materiais

### Google Tag Manager

**Tags Essenciais:**
1. ✅ GA4 Configuration Tag
2. ✅ GA4 Event Tag (custom events)
3. ✅ Conversion Linker (para ads)
4. ✅ Facebook Pixel (se aplicável)

**Acionadores Críticos:**
- All Pages (pageview)
- Form Submission
- Button Clicks
- Custom Events (data layer)

---

## 🧪 Testando a Implementação

### 1. Google Tag Assistant

Instale a extensão [Tag Assistant](https://tagassistant.google.com/) e verifique:
- ✅ Tags disparando corretamente
- ✅ Data layer sendo populado
- ✅ Eventos sendo enviados

### 2. GA4 DebugView

No GA4:
1. Admin → Data Streams → Web → Configure tag settings
2. Ative **Enable debug mode**
3. Verifique eventos em tempo real em **DebugView**

### 3. Console do Navegador

```javascript
// Verificar data layer
console.log(window.dataLayer);

// Verificar gtag
console.log(window.gtag);
```

---

## 📝 Checklist de Implementação

- [ ] Criar conta Google Analytics 4
- [ ] Criar conta Google Tag Manager
- [ ] Adicionar IDs nas variáveis de ambiente
- [ ] Implementar AnalyticsProvider no App
- [ ] Configurar tags no GTM
- [ ] Testar page views
- [ ] Testar eventos customizados
- [ ] Configurar conversões no GA4
- [ ] Testar e-commerce tracking
- [ ] Verificar conformidade LGPD
- [ ] Publicar versão do contêiner GTM

---

## 🆘 Suporte

**Documentação Oficial:**
- [Google Analytics 4](https://support.google.com/analytics/answer/9304153)
- [Google Tag Manager](https://support.google.com/tagmanager)
- [GA4 E-commerce](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

**Problemas Comuns:**
- Analytics não carrega → Verificar consentimento de cookies
- Eventos não aparecem → Verificar se GTM está publicado
- Double tracking → Remover tags duplicadas GA4/GTM
