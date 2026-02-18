import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress, 
  Chip, 
  Divider
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

function ResultCard({ career, probability, isPrimary = false }) {
  // Determine color based on probability
  const getColorForProbability = (prob) => {
    if (prob >= 75) return 'success';
    if (prob >= 50) return 'info';
    if (prob >= 25) return 'warning';
    return 'error';
  };

  const color = getColorForProbability(probability);

  return (
    <Card 
      sx={{ 
        mb: 2,
        transform: isPrimary ? 'scale(1.05)' : 'scale(1)',
        border: isPrimary ? '2px solid' : 'none',
        borderColor: isPrimary ? 'primary.main' : 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent>
        {isPrimary && (
          <Chip 
            label="Primary Recommendation" 
            color="primary" 
            size="small" 
            sx={{ mb: 2 }} 
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div" fontWeight={600}>
            {career}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Match confidence:
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={probability} 
              color={color}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: '#e0e0e0' 
              }}
            />
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 700 }}
          >
            {`${Math.round(probability)}%`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResultCard; 