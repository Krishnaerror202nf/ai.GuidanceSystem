# Career Prediction System

A machine learning system that predicts suitable career paths based on education, skills, interests, and personality traits.

## Overview

This project uses Random Forest and Gradient Boosting algorithms to predict career paths for users based on their profile. It includes:

- A Python backend with Flask API
- A modern React frontend with Material UI
- ML models trained with scikit-learn

## Project Structure

```
├── app.py                 # Flask backend API
├── requirements.txt       # Python dependencies
├── random forest + gradient boost.ipynb  # ML model notebook
├── frontend/             # React frontend application
    ├── public/           # Public assets
    ├── src/              # React source code
        ├── components/   # Reusable UI components
        ├── pages/        # Page components
        ├── App.js        # Main React app
        └── index.js      # Entry point
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Using the Application

1. Visit `http://localhost:3000` in your browser
2. Fill out the career prediction form with your information
3. Submit the form to receive personalized career recommendations
4. View detailed results including probability scores for each career option

## Model Training

The machine learning model was trained using:
- Random Forest and Gradient Boosting classifiers
- Feature engineering to improve prediction accuracy
- SMOTE for handling class imbalance

For more details about the model training process, refer to the Jupyter notebook in the repository.

## Technologies Used

- **Backend:** Python, Flask, scikit-learn, pandas, numpy
- **Frontend:** React, Material UI, Chart.js
- **ML Algorithms:** Random Forest, Gradient Boosting

## License

MIT 

