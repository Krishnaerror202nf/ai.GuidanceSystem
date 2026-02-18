import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'white',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Career Prediction System - '}
          <Link
            color="inherit"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            ML Project
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 