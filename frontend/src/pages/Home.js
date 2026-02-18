import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';

function Home() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced ML Algorithms',
      description: 'Utilizes Random Forest and Gradient Boosting algorithms for high accuracy predictions.'
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Education Assessment',
      description: 'Considers your educational background and academic strengths to match suitable careers.'
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      title: 'Skill Analysis',
      description: 'Analyzes your technical, communication, and leadership skills to find the best career fit.'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: 'auto', md: '70vh' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          py: 4
        }}
      >
        {/* Left Side - Text */}
        <Box sx={{ maxWidth: 600, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            sx={{
              mb: 3,
              background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Discover Your Ideal Career Path
          </Typography>
          
          <Typography
            variant="h6"
            component="div"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Our advanced machine learning algorithms analyze your skills, interests,
            and personality to recommend the best career options for your unique profile.
          </Typography>
          
          <Button
            component={RouterLink}
            to="/predict"
            variant="contained"
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(63, 81, 181, 0.4)'
            }}
          >
            Start Prediction
          </Button>
        </Box>
        
        {/* Right Side - Icon */}
        {!isSmallScreen && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
              width: 300,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(63, 81, 181, 0.1) 30%, rgba(245, 0, 87, 0.1) 90%)',
              border: '2px dashed',
              borderColor: 'primary.light',
              p: 4
            }}
          >
            <PsychologyIcon
              sx={{
                fontSize: 180,
                color: 'primary.main',
                animation: 'pulse 2s infinite ease-in-out'
              }}
            />
          </Box>
        )}
      </Box>
      
      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          fontWeight={600}
          sx={{ mb: 6 }}
        >
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    width: 80,
                    height: 80
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* CTA Section */}
      <Box
        sx={{
          py: 6,
          mb: 4,
          textAlign: 'center',
          borderRadius: 4,
          bgcolor: 'primary.light',
          color: 'primary.contrastText'
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Ready to find your perfect career?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Answer a few questions about your skills, interests, and personality to receive
          personalized career recommendations.
        </Typography>
        <Button
          component={RouterLink}
          to="/predict"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Start Now
        </Button>
      </Box>
    </Container>
  );
}

export default Home; 