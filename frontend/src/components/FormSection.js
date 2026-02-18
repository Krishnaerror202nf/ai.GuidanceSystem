import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider 
} from '@mui/material';

function FormSection({ title, description, icon, children }) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Box 
            sx={{ 
              mr: 2, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h5" component="h2" fontWeight={500}>
          {title}
        </Typography>
      </Box>
      
      {description && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 3 }}
        >
          {description}
        </Typography>
      )}
      
      <Divider sx={{ mb: 3 }} />
      
      {children}
    </Paper>
  );
}

export default FormSection; 