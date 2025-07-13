# Guía de Despliegue - IoT Building Management Platform

## 🚀 Opciones de Despliegue

### 1. Despliegue en Netlify (Recomendado para Frontend)

#### Preparación
```bash
# Build de producción
npm run build

# El directorio 'dist' contiene los archivos estáticos
```

#### Configuración de Netlify
1. Conectar repositorio de GitHub
2. Configurar build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18.x`

#### Variables de Entorno
```env
VITE_API_BASE_URL=https://tu-api.com/api/v1
VITE_APP_NAME=IoT Building Manager
VITE_ENVIRONMENT=production
```

#### Redirects para SPA
Crear archivo `public/_redirects`:
```
/*    /index.html   200
```

### 2. Despliegue en Vercel

#### Configuración vercel.json
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Despliegue en AWS S3 + CloudFront

#### Script de despliegue
```bash
#!/bin/bash
# deploy-aws.sh

# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://tu-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 4. Despliegue con Docker

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔧 Configuración de Producción

### Variables de Entorno
```env
# API Configuration
VITE_API_BASE_URL=https://api.iotbuilding.com/v1
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=IoT Building Manager
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true

# External Services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### Optimizaciones de Build

#### vite.config.ts para producción
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['echarts', 'echarts-for-react'],
          utils: ['axios', 'date-fns', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
```

## 📊 Monitoreo y Analytics

### 1. Error Tracking con Sentry
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/utils/sentry.js
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.VITE_ENVIRONMENT,
});
```

### 2. Google Analytics
```javascript
// src/utils/analytics.js
import ReactGA from 'react-ga4';

if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
}

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (action, category, label) => {
  ReactGA.event({
    action,
    category,
    label
  });
};
```

### 3. Performance Monitoring
```javascript
// src/utils/performance.js
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(end - start)
      });
    }
    
    return result;
  };
};
```

## 🔒 Seguridad

### Content Security Policy
```html
<!-- En index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.iotbuilding.com;
">
```

### Headers de Seguridad (Netlify)
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📈 Optimización de Performance

### 1. Lazy Loading de Rutas
```javascript
// src/App.tsx
import { lazy, Suspense } from 'react';

const BuildingDetailsPage = lazy(() => import('./pages/BuildingDetailsPage'));
const DeviceDetailsPage = lazy(() => import('./pages/DeviceDetailsPage'));

// En las rutas
<Route 
  path="buildings/:buildingId" 
  element={
    <Suspense fallback={<LoadingOverlay />}>
      <BuildingDetailsPage />
    </Suspense>
  } 
/>
```

### 2. Service Worker para Cache
```javascript
// public/sw.js
const CACHE_NAME = 'iot-building-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### 3. Preload de Recursos Críticos
```html
<!-- En index.html -->
<link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://api.iotbuilding.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

## 🔍 Testing en Producción

### Health Check Endpoint
```javascript
// src/utils/healthCheck.js
export const performHealthCheck = async () => {
  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
```

### Smoke Tests
```javascript
// tests/smoke.test.js
describe('Smoke Tests', () => {
  test('App loads without crashing', () => {
    render(<App />);
  });
  
  test('Login page is accessible', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
```

## 📱 PWA Configuration

### Manifest
```json
{
  "name": "IoT Building Manager",
  "short_name": "IoT Manager",
  "description": "Gestión inteligente de edificios",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔄 Rollback Strategy

### Versioning
```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Quick rollback
git checkout v1.0.0
npm run build
# Deploy previous version
```

### Feature Flags
```javascript
// src/utils/featureFlags.js
export const featureFlags = {
  newDashboard: import.meta.env.VITE_ENABLE_NEW_DASHBOARD === 'true',
  advancedAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  betaFeatures: import.meta.env.VITE_ENABLE_BETA === 'true'
};
```

---

Esta guía cubre todos los aspectos importantes del despliegue en producción. Asegúrate de adaptar las configuraciones según tus necesidades específicas y el proveedor de hosting elegido.