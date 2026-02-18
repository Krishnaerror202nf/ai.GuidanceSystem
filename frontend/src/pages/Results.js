import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Divider,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmailIcon from '@mui/icons-material/Email';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

const SkillChip = ({ label, level }) => {
  const getColor = () => {
    switch(level) {
      case 'Beginner': return 'default';
      case 'Intermediate': return 'primary';
      case 'Advanced': return 'success';
      case 'Expert': return 'secondary';
      default: return 'default';
    }
  };
  
  return (
    <Chip 
      label={`${label}: ${level}`} 
      color={getColor()} 
      variant="outlined" 
      size="small" 
      sx={{ m: 0.5 }}
    />
  );
};

const ProgressBar = ({ value, label, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight="bold">{value}/10</Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={value * 10} 
      sx={{ 
        height: 8, 
        borderRadius: 5,
        bgcolor: 'rgba(0,0,0,0.1)',
        '& .MuiLinearProgress-bar': {
          bgcolor: color
        }
      }} 
    />
  </Box>
);

function Results() {
  const navigate = useNavigate();
  const [predictionResult, setPredictionResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Retrieve results from session storage
    const storedResult = sessionStorage.getItem('predictionResult');
    const storedFormData = sessionStorage.getItem('formData');
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setPredictionResult(parsedResult);
        
        if (storedFormData) {
          setFormData(JSON.parse(storedFormData));
        }
        
        // Simulate loading for better UX
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            setShowResults(true);
          }, 300);
        }, 1200);
        
      } catch (error) {
        console.error('Error parsing prediction result:', error);
        setError('Failed to load prediction results');
        setLoading(false);
      }
    } else {
      setError('No prediction results found. Please complete the prediction form first.');
      setLoading(false);
    }
  }, []);

  const handleBackToForm = () => {
    navigate('/predict');
  };

  const handleSavePrediction = () => {
    setSaved(!saved);
    // Here you could implement saving functionality
  };
  
  const handleShare = () => {
    alert("Share feature would be implemented here");
    // Here you could implement sharing functionality
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleContact = () => {
    alert("Contact feature would be implemented here");
    // Contact advisor functionality
  };

  // Prepare chart data
  const getChartData = () => {
    if (!predictionResult || !predictionResult.recommendations) return null;

    const careers = predictionResult.recommendations.map(rec => rec.career);
    const probabilities = predictionResult.recommendations.map(rec => rec.probability);
    
    // Generate dynamic colors
    const backgroundColors = [
      'rgba(63, 81, 181, 0.8)',
      'rgba(245, 0, 87, 0.8)',
      'rgba(33, 150, 243, 0.8)'
    ];
    
    return {
      labels: careers,
      datasets: [
        {
          data: probabilities,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToForm}
        >
          Go to Prediction Form
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Analyzing your profile...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preparing your personalized career recommendations
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ 
        mb: 5, 
        textAlign: 'center',
        opacity: showResults ? 1 : 0,
        transform: showResults ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}>
        <Typography variant="h3" component="h1" fontWeight={600} gutterBottom>
          Your Career Prediction Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Based on your profile, we've identified these career paths as your best matches.
        </Typography>
      </Box>

      {/* Action buttons */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 4,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          opacity: showResults ? 1 : 0,
          transition: 'opacity 0.6s ease 0.1s',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToForm}
          size="small"
        >
          Try Another Prediction
        </Button>
        
        <Box>
          <Tooltip title="Save prediction">
            <IconButton onClick={handleSavePrediction} color={saved ? "primary" : "default"}>
              {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Share results">
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print results">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Contact career advisor">
            <IconButton onClick={handleContact} color="primary">
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Primary Recommendation */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(to right, rgba(63, 81, 181, 0.08), rgba(33, 150, 243, 0.08))',
              opacity: showResults ? 1 : 0,
              transform: showResults ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '150px', 
              height: '150px', 
              background: 'radial-gradient(circle at top right, rgba(63, 81, 181, 0.2), transparent 70%)',
              borderRadius: '0 0 0 100%',
              zIndex: 0
            }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ fontSize: 30, mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Primary Career Recommendation
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 300,
                    position: 'relative',
                  }}
                >
                  <Typography 
                    variant="h3" 
                    component="div" 
                    fontWeight={700}
                    sx={{ mr: 2 }}
                  >
                    {predictionResult.primaryPrediction}
                  </Typography>
                  
                  <Box sx={{ 
                    width: 70, 
                    height: 70, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '3px solid white'
                  }}>
                    <Typography variant="h5" fontWeight="bold">
                      {predictionResult.recommendations && predictionResult.recommendations.length > 0 
                        ? `${Math.round(predictionResult.recommendations[0].probability)}%` 
                        : '95%'}
                    </Typography>
                  </Box>
                  
                  <CheckCircleIcon sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: -10, 
                    color: 'success.main', 
                    bgcolor: 'white', 
                    borderRadius: '50%',
                    fontSize: 28,
                    padding: 0.3,
                    boxShadow: 2
                  }} />
                </Paper>
              </Box>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                align="center" 
                sx={{ mb: 2 }}
              >
                This career aligns perfectly with your technical expertise, interests, and personality traits.
              </Typography>
              
              {predictionResult.modelDetails && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mt: 2
                }}>
                  <Chip 
                    icon={<BarChartIcon />} 
                    label={`${Math.round(predictionResult.modelDetails.studentPerformanceScore)}% Success Probability`} 
                    color="success" 
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* User Profile and Recommendations Grid */}
        <Grid container item spacing={4}>
          {/* User Profile Summary */}
          <Grid item xs={12} md={5} sx={{ 
            opacity: showResults ? 1 : 0,
            transform: showResults ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Your Profile Summary
            </Typography>
            
            {formData && (
              <Card elevation={0} sx={{ 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 3,
                mb: 3
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Education & Experience
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.education || 'Not specified'} • {formData.yearsExperience} years experience
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                    <EngineeringIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                    Skills Assessment
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
                    {formData.technicalSkills && (
                      <SkillChip label="Technical" level={formData.technicalSkills} />
                    )}
                    {formData.communicationSkills && (
                      <SkillChip label="Communication" level={formData.communicationSkills} />
                    )}
                    {formData.analyticalThinking && (
                      <SkillChip label="Analytical" level={formData.analyticalThinking} />
                    )}
                    {formData.creativity && (
                      <SkillChip label="Creativity" level={formData.creativity} />
                    )}
                    {formData.leadership && (
                      <SkillChip label="Leadership" level={formData.leadership} />
                    )}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                    <PsychologyIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                    Interests & Personality
                  </Typography>
                  
                  <Box sx={{ px: 1 }}>
                    <ProgressBar 
                      value={formData.interestScience} 
                      label="Science & Technology" 
                      color="#1976d2" 
                    />
                    <ProgressBar 
                      value={formData.interestArts} 
                      label="Arts & Humanities" 
                      color="#e91e63" 
                    />
                    <ProgressBar 
                      value={formData.interestBusiness} 
                      label="Business & Commerce" 
                      color="#ff9800" 
                    />
                  </Box>
                </CardContent>
              </Card>
            )}
            
            {/* Chart */}
            <Card elevation={0} sx={{ 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 3,
              height: 320,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Career Match Distribution
                </Typography>
                <Box sx={{ flex: 1, position: 'relative' }}>
                  {getChartData() ? (
                    <Doughnut data={getChartData()} options={chartOptions} />
                  ) : (
                    <Typography color="text.secondary" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      No chart data available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Career Recommendations */}
          <Grid item xs={12} md={7} sx={{ 
            opacity: showResults ? 1 : 0,
            transform: showResults ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
          }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Your Career Path Recommendations
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {predictionResult.recommendations && predictionResult.recommendations.map((recommendation, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: recommendation.career === predictionResult.primaryPrediction 
                      ? 'primary.main' 
                      : 'divider',
                    backgroundColor: recommendation.career === predictionResult.primaryPrediction
                      ? 'rgba(63, 81, 181, 0.05)'
                      : 'background.paper',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {recommendation.career === predictionResult.primaryPrediction && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      py: 0.5,
                      px: 1.5,
                      borderRadius: '0 0 0 8px',
                      zIndex: 1
                    }}>
                      TOP MATCH
                    </Box>
                  )}
                  
                  <CardContent sx={{ position: 'relative', zIndex: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {recommendation.career}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {getCareerDescription(recommendation.career)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        width: 70, 
                        height: 70, 
                        bgcolor: 'rgba(63, 81, 181, 0.1)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '2px solid',
                        borderColor: recommendation.career === predictionResult.primaryPrediction 
                          ? 'primary.main' 
                          : 'divider'
                      }}>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          {recommendation.probability}%
                        </Typography>
                        <Typography variant="caption" sx={{ mt: -0.5 }}>
                          match
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {getCareerSkills(recommendation.career).map((skill, i) => (
                        <Chip 
                          key={i} 
                          label={skill} 
                          size="small" 
                          sx={{ bgcolor: 'rgba(63, 81, 181, 0.08)' }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {/* Final CTA */}
            <Card elevation={0} sx={{ 
              mt: 3, 
              p: 3, 
              bgcolor: 'rgba(33, 150, 243, 0.08)', 
              borderRadius: 3,
              border: '1px solid #bbdefb'
            }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Next Steps
              </Typography>
              <Typography variant="body2" paragraph>
                Want to explore these career paths further? Connect with a career advisor to discuss your options.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleContact}
                startIcon={<EmailIcon />}
              >
                Contact Career Advisor
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Replace the complex footer with a simpler one matching PredictionForm */}
      <Box sx={{ 
        mt: 8, 
        pt: 3, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        textAlign: 'center',
        opacity: showResults ? 1 : 0,
        transform: showResults ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s'
      }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Career Prediction System
        </Typography>
        <Typography variant="body2" fontWeight="bold" color="primary">
          Developed by Krishna Gehlot
        </Typography>
        <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block', mt: 0.5 }}>
          Minor Project | Manipal University Jaipur
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
          © {new Date().getFullYear()} All Rights Reserved
        </Typography>
      </Box>
    </Container>
  );
}

// Helper functions for career descriptions and skills
function getCareerDescription(career) {
  const descriptions = {
    'Software Engineer': 'Design, develop, and maintain software systems and applications with strong technical and problem-solving skills.',
    'Data Scientist': 'Extract valuable insights from complex data using statistical analysis, machine learning, and visualization techniques.',
    'Doctor': 'Diagnose and treat medical conditions with a focus on patient care, requiring extensive education and strong interpersonal skills.',
    'Teacher': 'Educate and inspire students through effective communication, subject expertise, and adaptive teaching methods.',
    'Marketing Specialist': 'Create and implement marketing strategies to promote products or services using creative and analytical skills.',
    'Financial Analyst': 'Analyze financial data and market trends to help organizations make informed business and investment decisions.',
    'Graphic Designer': 'Create visual concepts and designs for digital and print media using creative skills and design software.',
  };
  
  return descriptions[career] || 'A profession aligned with your skills and interests.';
}

function getCareerSkills(career) {
  const skills = {
    'Software Engineer': ['Programming', 'Problem Solving', 'System Design', 'Debugging'],
    'Data Scientist': ['Statistics', 'Machine Learning', 'Data Visualization', 'Python/R'],
    'Doctor': ['Medical Knowledge', 'Diagnosis', 'Patient Care', 'Communication'],
    'Teacher': ['Communication', 'Subject Expertise', 'Planning', 'Assessment'],
    'Marketing Specialist': ['Market Research', 'Campaign Planning', 'Social Media', 'Analytics'],
    'Financial Analyst': ['Financial Modeling', 'Data Analysis', 'Forecasting', 'Reporting'],
    'Graphic Designer': ['Visual Design', 'Typography', 'Adobe Creative Suite', 'UI/UX'],
  };
  
  return skills[career] || ['Communication', 'Problem Solving', 'Teamwork'];
}

export default Results; 