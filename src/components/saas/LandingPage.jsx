import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle,
  Building,
  BarChart3,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Building size={40} />,
      title: 'Gestión Completa de Edificios',
      description: 'Administra múltiples edificios desde una sola plataforma con jerarquía completa.'
    },
    {
      icon: <BarChart3 size={40} />,
      title: 'Análisis en Tiempo Real',
      description: 'Monitoreo continuo con dashboards personalizables y alertas inteligentes.'
    },
    {
      icon: <Shield size={40} />,
      title: 'Seguridad Empresarial',
      description: 'Protección de datos de nivel empresarial con autenticación multi-factor.'
    },
    {
      icon: <Zap size={40} />,
      title: 'Automatización Inteligente',
      description: 'Programación avanzada de dispositivos y optimización energética automática.'
    }
  ];

  const plans = [
    {
      name: 'Básico',
      price: '$29',
      period: '/mes',
      description: 'Perfecto para pequeñas empresas',
      features: [
        'Hasta 5 edificios',
        '50 dispositivos IoT',
        'Dashboard básico',
        'Reportes mensuales',
        'Soporte por email'
      ],
      popular: false,
      color: 'primary'
    },
    {
      name: 'Profesional',
      price: '$99',
      period: '/mes',
      description: 'Ideal para empresas en crecimiento',
      features: [
        'Hasta 25 edificios',
        '500 dispositivos IoT',
        'Dashboards personalizables',
        'Reportes en tiempo real',
        'API completa',
        'Soporte prioritario'
      ],
      popular: true,
      color: 'secondary'
    },
    {
      name: 'Empresarial',
      price: '$299',
      period: '/mes',
      description: 'Para grandes organizaciones',
      features: [
        'Edificios ilimitados',
        'Dispositivos ilimitados',
        'White-label disponible',
        'Integraciones personalizadas',
        'Soporte 24/7',
        'Gestor de cuenta dedicado'
      ],
      popular: false,
      color: 'primary'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      company: 'TechCorp',
      text: 'La plataforma ha revolucionado cómo gestionamos nuestros edificios corporativos.',
      rating: 5
    },
    {
      name: 'Carlos Ruiz',
      company: 'Smart Buildings SA',
      text: 'Increíble facilidad de uso y potencia. Nuestros clientes están encantados.',
      rating: 5
    }
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            IoT Building Manager
          </Typography>
          <Button color="primary" sx={{ mr: 2 }}>
            Iniciar Sesión
          </Button>
          <Button variant="contained" color="primary">
            Prueba Gratis
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            fontWeight="bold"
            gutterBottom
          >
            Gestión Inteligente de Edificios
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
          >
            Transforma tus edificios en espacios inteligentes con nuestra plataforma IoT completa
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
              endIcon={<ArrowRight />}
            >
              Comenzar Prueba Gratis
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Ver Demo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Características Principales
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="textSecondary"
          sx={{ mb: 6 }}
        >
          Todo lo que necesitas para gestionar edificios inteligentes
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Planes y Precios
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="textSecondary"
            sx={{ mb: 6 }}
          >
            Elige el plan perfecto para tu organización
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    border: plan.popular ? 2 : 1,
                    borderColor: plan.popular ? 'secondary.main' : 'divider',
                    transform: plan.popular ? 'scale(1.05)' : 'none'
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Más Popular"
                      color="secondary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" fontWeight="bold" color={`${plan.color}.main`}>
                        {plan.price}
                        <Typography component="span" variant="h6" color="textSecondary">
                          {plan.period}
                        </Typography>
                      </Typography>
                    </Box>

                    <List sx={{ mb: 3 }}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle size={20} color={theme.palette[plan.color].main} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant={plan.popular ? 'contained' : 'outlined'}
                      color={plan.color}
                      fullWidth
                      size="large"
                    >
                      Comenzar Ahora
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Lo que dicen nuestros clientes
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" color="#ffc107" />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.company}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Únete a cientos de empresas que ya confían en nuestra plataforma
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Comenzar Prueba Gratis de 14 días
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                IoT Building Manager
              </Typography>
              <Typography variant="body2" color="grey.400">
                La plataforma líder en gestión inteligente de edificios
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Contacto
              </Typography>
              <Typography variant="body2" color="grey.400">
                Email: info@iotbuilding.com
              </Typography>
              <Typography variant="body2" color="grey.400">
                Teléfono: +1 (555) 123-4567
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ borderTop: 1, borderColor: 'grey.800', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="grey.400">
              © 2024 IoT Building Manager. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;