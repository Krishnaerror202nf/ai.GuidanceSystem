import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  MenuItem,
  TextField,
  Button,
  Slider,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InterestsIcon from '@mui/icons-material/Interests';
import FormSection from '../components/FormSection';

// Default form values
const defaultFormData = {
  education: '',
  technicalSkills: '',
  communicationSkills: '',
  analyticalThinking: '',
  creativity: '',
  leadership: '',
  yearsExperience: 0,
  interestScience: 5,
  interestArts: 5,
  interestBusiness: 5,
  personalityExtroversion: 5,
  personalityOpenness: 5,
  personalityConscientiousness: 5
};

function PredictionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    educationLevels: [],
    skillLevels: []
  });
  const [prediction, setPrediction] = useState(null);

  // Fetch options from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Use a direct URL instead of a relative path to avoid CORS issues
        const baseUrl = window.location.protocol + '//' + window.location.hostname + ':5001';
        const apiUrl = `${baseUrl}/api/options`;
        
        console.log("Fetching options from:", apiUrl);
        
        // Check if server is available first
        try {
          const pingResponse = await fetch(`${baseUrl}/`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            timeout: 3000
          });
          
          if (!pingResponse.ok) {
            console.warn(`Backend server ping responded with status: ${pingResponse.status}`);
          } else {
            console.log("Backend server is available");
          }
        } catch (pingError) {
          console.error("Failed to ping backend server:", pingError);
          setError("Cannot connect to the prediction server. Please check if it's running at " + baseUrl);
          throw new Error("Backend server is not available");
        }
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          credentials: 'omit',
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch options: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Options API response:", data);
        
        setOptions({
          educationLevels: data.educationLevels || [],
          skillLevels: data.skillLevels || []
        });
      } catch (error) {
        console.error('Error fetching options:', error);
        // Set default options if API fails and show error
        setOptions({
          educationLevels: ['High School', 'Bachelor', 'Master', 'PhD'],
          skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        });
        
        if (!error.message.includes("Backend server is not available")) {
          setError(`Error connecting to the server: ${error.message}. Using default options.`);
        }
      }
    };

    fetchOptions();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle slider changes
  const handleSliderChange = (name) => (e, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    const baseUrl = window.location.protocol + '//' + window.location.hostname + ':5001';
    const apiUrl = `${baseUrl}/api/predict`;
    
    try {
      console.log("Submitting form data to:", apiUrl);
      console.log("Form data being sent:", formData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(formData),
        credentials: 'omit',
        mode: 'cors'
      });
      
      console.log("Received response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Server responded with status: ${response.status}. Details: ${errorText}`);
      }
      
      let data;
      try {
        data = await response.json();
        console.log("Prediction response:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error("Invalid response from server. Please check backend logs.");
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Store prediction result in sessionStorage
      sessionStorage.setItem('predictionResult', JSON.stringify(data));
      sessionStorage.setItem('formData', JSON.stringify(formData));
      
      // Navigate to results page instead of showing results inline
      navigate('/results');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Career Path Prediction</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Education and Experience Section */}
        <FormSection
          title="Education & Experience"
          description="Tell us about your educational background and work experience."
          icon={<SchoolIcon fontSize="large" />}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                name="education"
                label="Education Level"
                value={formData.education}
                onChange={handleChange}
                variant="outlined"
              >
                {options.educationLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="yearsExperience"
                label="Years of Work Experience"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 50 } }}
                value={formData.yearsExperience}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </FormSection>

        {/* Skills Section */}
        <FormSection
          title="Skills Assessment"
          description="Rate your proficiency in the following skill areas."
          icon={<EngineeringIcon fontSize="large" />}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                name="technicalSkills"
                label="Technical Skills"
                value={formData.technicalSkills}
                onChange={handleChange}
                variant="outlined"
                helperText="Programming, data analysis, etc."
              >
                {options.skillLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                name="communicationSkills"
                label="Communication Skills"
                value={formData.communicationSkills}
                onChange={handleChange}
                variant="outlined"
                helperText="Speaking, writing, presentation, etc."
              >
                {options.skillLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                name="analyticalThinking"
                label="Analytical Thinking"
                value={formData.analyticalThinking}
                onChange={handleChange}
                variant="outlined"
                helperText="Problem-solving, logical reasoning, etc."
              >
                {options.skillLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                name="creativity"
                label="Creativity"
                value={formData.creativity}
                onChange={handleChange}
                variant="outlined"
                helperText="Innovative thinking, design skills, etc."
              >
                {options.skillLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                name="leadership"
                label="Leadership"
                value={formData.leadership}
                onChange={handleChange}
                variant="outlined"
                helperText="Team management, decision making, etc."
              >
                {options.skillLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </FormSection>

        {/* Interests Section */}
        <FormSection
          title="Interests"
          description="Rate your level of interest in these areas (1-10)."
          icon={<InterestsIcon fontSize="large" />}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography id="interest-science-label" gutterBottom>
                Interest in Science & Technology
              </Typography>
              <Slider
                aria-labelledby="interest-science-label"
                value={formData.interestScience}
                onChange={handleSliderChange('interestScience')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <FormHelperText>
                Physics, biology, computer science, engineering, etc.
              </FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <Typography id="interest-arts-label" gutterBottom>
                Interest in Arts & Humanities
              </Typography>
              <Slider
                aria-labelledby="interest-arts-label"
                value={formData.interestArts}
                onChange={handleSliderChange('interestArts')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <FormHelperText>
                Literature, design, music, history, etc.
              </FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <Typography id="interest-business-label" gutterBottom>
                Interest in Business & Commerce
              </Typography>
              <Slider
                aria-labelledby="interest-business-label"
                value={formData.interestBusiness}
                onChange={handleSliderChange('interestBusiness')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <FormHelperText>
                Marketing, finance, management, entrepreneurship, etc.
              </FormHelperText>
            </Grid>
          </Grid>
        </FormSection>

        {/* Personality Section */}
        <FormSection
          title="Personality Traits"
          description="Rate yourself on these personality traits (1-10)."
          icon={<PsychologyIcon fontSize="large" />}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography id="personality-extroversion-label" gutterBottom>
                Extroversion
              </Typography>
              <Slider
                aria-labelledby="personality-extroversion-label"
                value={formData.personalityExtroversion}
                onChange={handleSliderChange('personalityExtroversion')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <FormHelperText>
                How outgoing and sociable you are (1=highly introverted, 10=highly extroverted)
              </FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <Typography id="personality-openness-label" gutterBottom>
                Openness to Experience
              </Typography>
              <Slider
                aria-labelledby="personality-openness-label"
                value={formData.personalityOpenness}
                onChange={handleSliderChange('personalityOpenness')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <FormHelperText>
                How curious and open to new ideas you are
              </FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <Typography id="personality-conscientiousness-label" gutterBottom>
                Conscientiousness
              </Typography>
              <Slider
                aria-labelledby="personality-conscientiousness-label"
                value={formData.personalityConscientiousness}
                onChange={handleSliderChange('personalityConscientiousness')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <FormHelperText>
                How organized and responsible you are
              </FormHelperText>
            </Grid>
          </Grid>
        </FormSection>

        <div className="mt-6">
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white font-semibold">Analyzing your profile...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-lg">Predict My Career Path</span>
              </div>
            )}
          </button>
        </div>
      </form>
      
      {loading && !error && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-blue-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-4 bg-blue-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-blue-100 rounded"></div>
            <div className="h-4 bg-blue-100 rounded w-5/6"></div>
            <div className="h-4 bg-blue-100 rounded w-4/6"></div>
            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="h-8 bg-blue-200 rounded col-span-1"></div>
              <div className="h-8 bg-blue-200 rounded col-span-1"></div>
              <div className="h-8 bg-blue-200 rounded col-span-1"></div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500">
            Analyzing your unique skills, interests, and personality traits...
          </div>
        </div>
      )}
      
      {prediction && !loading && !error && (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg shadow-lg transform transition-all duration-500 opacity-100 translate-y-0">
          <h2 className="text-2xl font-bold mb-4 text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your Career Prediction Results
          </h2>
          
          <div className="mb-6 p-5 bg-white rounded-lg border-l-4 border-indigo-500 shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">PRIMARY RECOMMENDATION</h3>
                <p className="text-2xl font-bold text-indigo-700">{prediction.primaryPrediction}</p>
              </div>
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-700">
                  {prediction.modelDetails && prediction.modelDetails.studentPerformanceScore ? 
                    `${Math.round(prediction.modelDetails.studentPerformanceScore)}%` : 
                    '95%'}
                </span>
              </div>
            </div>
          </div>
          
          {prediction.recommendations && prediction.recommendations.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Alternative Recommendations</h3>
              <div className="grid gap-3">
                {prediction.recommendations.slice(1).map((rec, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{rec.career}</span>
                      <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {rec.probability}% match
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {prediction.modelDetails && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Prediction based on {prediction.modelDetails.modelType} model</span>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => {setPrediction(null); setFormData(defaultFormData);}}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200 flex items-center font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Another Prediction
            </button>
          </div>
        </div>
      )}
      
      {/* Add footer with attribution */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-600 font-medium mb-1">
            Career Prediction System
          </div>
          <div className="text-sm text-indigo-600 font-bold">
            Developed by Krishna Gehlot
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Minor Project | Manipal University Jaipur
          </div>
          <div className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionForm; 