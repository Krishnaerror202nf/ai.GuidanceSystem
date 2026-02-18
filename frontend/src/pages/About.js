import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import DataObjectIcon from '@mui/icons-material/DataObject';

function About() {
  // Benefits of career prediction
  const benefits = [
    "Personalized career recommendations based on your unique profile",
    "Discover career paths you might not have considered before",
    "Make informed decisions about your education and career path",
    "Gain insights into what skills to develop for your desired career",
    "Higher confidence in career choices through data-driven recommendations"
  ];

  // ML model features
  const modelFeatures = [
    "Random Forest and Gradient Boosting classification algorithms",
    "Feature engineering to improve prediction accuracy",
    "Balanced training with SMOTE to handle class imbalance",
    "Comprehensive feature set including education, skills, interests, and personality"
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight={600} gutterBottom>
          About Career Prediction System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn more about how our machine learning system helps predict suitable careers.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* How It Works Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AutoGraphIcon sx={{ fontSize: 28, mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                How It Works
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              Our Career Prediction System uses advanced machine learning algorithms to analyze
              your profile and recommend suitable career paths. The system considers multiple
              factors including your education level, skills, interests, and personality traits.
            </Typography>
            
            <Typography variant="body1" paragraph>
              By processing this information through our trained models, we can identify
              patterns that match your profile with successful professionals in various fields,
              providing you with personalized career recommendations.
            </Typography>
            
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Key Benefits
              </Typography>
              <List>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Technical Details Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ModelTrainingIcon sx={{ fontSize: 28, mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                ML Model
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              Our prediction system employs ensemble learning techniques to achieve high accuracy
              in career recommendations.
            </Typography>
            
            <List>
              {modelFeatures.map((feature, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DataObjectIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Career Paths Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ fontSize: 28, mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Career Paths
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              Our system can predict suitability for various career paths including:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Software Engineer
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Data Scientist
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Financial Analyst
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Marketing Specialist
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Doctor
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Teacher
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Project Information */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'primary.light',
              color: 'primary.dark'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Project Information
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3, borderColor: 'primary.main' }} />
            
            <Typography variant="body1" paragraph>
              This Career Prediction System was developed as a machine learning project
              using Random Forest and Gradient Boosting algorithms. It demonstrates how
              ML can be applied to provide personalized career guidance based on
              individual characteristics.
            </Typography>
            
            <Typography variant="body1">
              The project combines data science, machine learning, and web development
              to create an interactive tool for career exploration and guidance.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About; 