# IoT Building Management Platform

Una plataforma completa de gestión de edificios inteligentes con capacidades IoT, simulación en tiempo real y análisis de datos.

## 🚀 Características Principales

### 📊 Dashboard Personalizable
- Widgets arrastrables y redimensionables
- KPIs en tiempo real
- Gráficos interactivos con ECharts
- Control de simulación global

### 🏢 Gestión de Edificios
- Jerarquía completa: Edificios → Pisos → Habitaciones → Dispositivos
- Simulación individual por nivel
- Monitoreo de consumo energético
- Datos en vivo y históricos

### 🔧 Control de Dispositivos
- Ejecución de acciones remotas
- Programación de tareas (cron)
- Estados personalizables
- Telemetría en tiempo real

### 🚨 Sistema de Alarmas
- Umbrales configurables
- Notificaciones en tiempo real
- Gestión de estados (activa/reconocida/resuelta)
- Filtros avanzados

### 📈 Reportes y Análisis
- Exportación a PDF, Excel, CSV
- Reportes programados
- Análisis de consumo energético
- Gráficos de rendimiento

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Material-UI (MUI)** - Componentes de diseño
- **Tailwind CSS** - Estilos utilitarios
- **ECharts** - Gráficos interactivos
- **Zustand** - Gestión de estado
- **React Router** - Navegación
- **React Hook Form** - Manejo de formularios

### Herramientas de Desarrollo
- **Vite** - Bundler y servidor de desarrollo
- **TypeScript** - Tipado estático
- **ESLint** - Linting de código

### Librerías Adicionales
- **Axios** - Cliente HTTP
- **React Grid Layout** - Layouts arrastrables
- **jsPDF & XLSX** - Exportación de documentos
- **Lucide React** - Iconos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd iot-building-management-platform

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de producción
npm run lint     # Verificar código
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── api/                    # Configuración de API
│   ├── client.js          # Cliente Axios
│   └── endpoints.js       # Endpoints de la API
├── components/            # Componentes reutilizables
│   ├── auth/             # Autenticación
│   ├── common/           # Componentes comunes
│   ├── dashboard/        # Dashboard y widgets
│   ├── layout/           # Layout de la aplicación
│   ├── reports/          # Reportes
│   └── settings/         # Configuraciones
├── hooks/                # Custom hooks
├── pages/                # Páginas principales
├── store/                # Gestión de estado (Zustand)
├── theme/                # Temas de Material-UI
└── utils/                # Utilidades
```

## 🔧 Configuración de la API

La aplicación se conecta a una API REST. Configurar la URL base en `src/api/client.js`:

```javascript
const API_BASE_URL = 'https://your-api-url.com/api/v1';
```

### Endpoints Principales
- `/buildings` - Gestión de edificios
- `/floors` - Gestión de pisos
- `/rooms` - Gestión de habitaciones
- `/devices` - Control de dispositivos
- `/alarms` - Sistema de alarmas
- `/telemetry` - Datos de telemetría
- `/simulation` - Control de simulación

## 📱 Responsividad

La aplicación está optimizada para:
- **Desktop** (1200px+) - Experiencia completa
- **Tablet** (768px - 1199px) - Layout adaptado
- **Mobile** (320px - 767px) - Interfaz móvil optimizada

### Breakpoints
```css
xs: 0px      /* Extra small devices */
sm: 600px    /* Small devices */
md: 900px    /* Medium devices */
lg: 1200px   /* Large devices */
xl: 1536px   /* Extra large devices */
```

## 🎨 Temas y Personalización

### Modo Oscuro/Claro
La aplicación soporta temas claro y oscuro con cambio dinámico.

### Colores Principales
```javascript
primary: '#1976d2'      // Azul principal
secondary: '#14b8a6'    // Verde secundario
success: '#22c55e'      // Verde éxito
warning: '#f59e0b'      // Amarillo advertencia
error: '#ef4444'        // Rojo error
```

## 🔐 Autenticación

Sistema de autenticación simulado para desarrollo:
- **Email**: demo@example.com
- **Password**: demo123

Para producción, integrar con sistema de autenticación real.

## 📊 Dashboard Widgets

### Widgets Disponibles
1. **KPIs** - Indicadores clave de rendimiento
2. **Simulación** - Control de simulación global
3. **Gráficos** - Visualización de datos
4. **Edificios** - Lista de edificios
5. **Alarmas** - Alarmas recientes
6. **Energía** - Consumo energético

### Personalización
- Arrastrar y soltar widgets
- Redimensionar widgets
- Agregar/eliminar widgets
- Guardar layout personalizado

## 🚨 Sistema de Alarmas

### Configuración de Umbrales
```javascript
// Ejemplo de configuración
thresholds: {
  temperature: { min: 18, max: 26, enabled: true },
  humidity: { min: 30, max: 70, enabled: true },
  energy: { max: 1000, enabled: true },
  co2: { max: 1000, enabled: true }
}
```

### Estados de Alarma
- **Activa** - Alarma sin reconocer
- **Reconocida** - Alarma reconocida por operador
- **Resuelta** - Problema solucionado

## 📈 Exportación de Datos

### Formatos Soportados
- **PDF** - Reportes formateados
- **Excel** - Hojas de cálculo
- **CSV** - Datos tabulares

### Reportes Programados
- Configuración de frecuencia (diario, semanal, mensual)
- Múltiples destinatarios
- Diferentes tipos de reporte

## 🔄 Simulación

### Niveles de Simulación
1. **Global** - Todos los edificios
2. **Edificio** - Edificio específico
3. **Piso** - Piso específico
4. **Habitación** - Habitación específica

### Control de Simulación
- Iniciar/detener simulación
- Estado en tiempo real
- Datos simulados realistas

## 🌐 Integración SaaS (Próximamente)

### Características Planificadas
- **Landing Page** - Página de marketing
- **Planes de Suscripción** - Diferentes niveles de servicio
- **Facturación** - Integración con Stripe
- **Multi-tenancy** - Soporte para múltiples clientes
- **API Keys** - Gestión de acceso a API

### Planes Propuestos
1. **Básico** - Hasta 5 edificios
2. **Profesional** - Hasta 25 edificios
3. **Empresarial** - Edificios ilimitados

## 🐛 Manejo de Errores

### Estrategias Implementadas
- Componentes de error con retry
- Fallbacks para datos faltantes
- Notificaciones de error amigables
- Logging de errores en consola

### Componentes de Error
```jsx
<ErrorDisplay 
  error={error} 
  onRetry={retryFunction}
  title="Error personalizado"
/>
```

## 🧪 Testing

### Estrategia de Testing (Recomendada)
```bash
# Instalar dependencias de testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm run test
```

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Variables de Entorno
```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=IoT Building Manager
```

## 📝 Contribución

### Estándares de Código
- Usar TypeScript para nuevos archivos
- Seguir convenciones de Material-UI
- Componentes funcionales con hooks
- Gestión de estado con Zustand

### Estructura de Commits
```
feat: nueva característica
fix: corrección de bug
docs: actualización de documentación
style: cambios de estilo
refactor: refactorización de código
```

## 📞 Soporte

Para soporte técnico o consultas:
- Crear issue en el repositorio
- Documentar pasos para reproducir problemas
- Incluir capturas de pantalla si es necesario

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la gestión inteligente de edificios**