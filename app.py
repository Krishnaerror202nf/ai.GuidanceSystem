import sys
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

# Configure logging for debugging
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('backend.log')
    ]
)
logger = logging.getLogger(__name__)

# Create the Flask app with the simplest possible configuration
app = Flask(__name__, static_folder='frontend/build', static_url_path='/')

# Apply CORS with appropriate settings - fixing the supports_credentials + wildcard error
CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
     allow_headers=["*"], 
     methods=["*"], 
     supports_credentials=True,
     send_wildcard=True)

# Remove the after_request handler as it might be conflicting
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#     return response

# Define the path to the new model
MODEL_PATH = 'student_performance_rf_model.pkl'
# Alternative model if the above doesn't exist
ALT_MODEL_PATH = 'student_performance_xgb_model.pkl'

# Pre-defined categories
EDUCATION_LEVELS = ['High School', 'Bachelor', 'Master', 'PhD']
SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
CAREERS = ['Software Engineer', 'Data Scientist', 'Doctor', 'Teacher',
          'Marketing Specialist', 'Financial Analyst', 'Graphic Designer']

# Define the feature names for the model (should match those in student-mat.csv)
STUDENT_FEATURES = {
    'school': ['GP', 'MS'],
    'sex': ['F', 'M'],
    'age': range(15, 23),
    'address': ['U', 'R'],
    'famsize': ['LE3', 'GT3'],
    'Pstatus': ['T', 'A'],
    'Medu': range(0, 5),  # 0-4
    'Fedu': range(0, 5),  # 0-4
    'Mjob': ['teacher', 'health', 'services', 'at_home', 'other'],
    'Fjob': ['teacher', 'health', 'services', 'at_home', 'other'],
    'reason': ['home', 'reputation', 'course', 'other'],
    'guardian': ['mother', 'father', 'other'],
    'traveltime': range(1, 5),  # 1-4
    'studytime': range(1, 5),  # 1-4
    'failures': range(0, 4),  # 0-3
    'schoolsup': ['yes', 'no'],
    'famsup': ['yes', 'no'],
    'paid': ['yes', 'no'],
    'activities': ['yes', 'no'],
    'nursery': ['yes', 'no'],
    'higher': ['yes', 'no'],
    'internet': ['yes', 'no'],
    'romantic': ['yes', 'no'],
    'famrel': range(1, 6),  # 1-5
    'freetime': range(1, 6),  # 1-5
    'goout': range(1, 6),  # 1-5
    'Dalc': range(1, 6),  # 1-5
    'Walc': range(1, 6),  # 1-5
    'health': range(1, 6),  # 1-5
    'absences': range(0, 94)  # 0-93
}

# Global variables to store model information
model_info = None
model = None
numerical_cols = None
categorical_cols = None
numerical_transformer = None
used_model_path = None  # Track which model file we loaded

def load_model():
    """Load the ML model and return success status."""
    global model_info, model, numerical_cols, categorical_cols, numerical_transformer, used_model_path
    
    try:
        if os.path.exists(MODEL_PATH):
            logger.info(f"Loading model from {MODEL_PATH}")
            model_path = MODEL_PATH
        elif os.path.exists(ALT_MODEL_PATH):
            logger.info(f"Loading model from {ALT_MODEL_PATH}")
            model_path = ALT_MODEL_PATH
        else:
            logger.error("No model file found. Please train the model first.")
            return False
        
        # Store which model path we used
        used_model_path = model_path
        
        # Load model
        model_info = joblib.load(model_path)
        
        # Extract components
        model = model_info.get('model')
        numerical_cols = model_info.get('numerical_cols')
        categorical_cols = model_info.get('categorical_cols')
        numerical_transformer = model_info.get('numerical_transformer')
        
        # Verify all components are loaded - Fix for pandas Index objects
        missing_components = []
        if model is None:
            missing_components.append('model')
        if numerical_cols is None or (hasattr(numerical_cols, 'empty') and numerical_cols.empty):
            missing_components.append('numerical_cols')
        if categorical_cols is None or (hasattr(categorical_cols, 'empty') and categorical_cols.empty):
            missing_components.append('categorical_cols')
        if numerical_transformer is None:
            missing_components.append('numerical_transformer')
            
        if missing_components:
            logger.error(f"Model loaded but missing components: {missing_components}")
            return False
            
        logger.info(f"Model loaded successfully: {type(model).__name__}")
        logger.info(f"Model features: {model.feature_names_in_}")
        return True
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        traceback.print_exc()
        return False

# Load the model at startup
model_loaded = load_model()
if not model_loaded:
    logger.warning("Starting without a model. Predictions won't work until a model is loaded.")

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        logger.debug("Received OPTIONS request. Responding with CORS headers.")
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        return response, 200
        
    try:
        # Check if model is loaded
        if not model_loaded or model is None:
            logger.error("Model is not loaded. Cannot make predictions.")
            return jsonify({
                'error': 'Model not loaded',
                'details': 'The ML model is not loaded. Please train or load the model first.'
            }), 500
        
        # Get data from request
        logger.debug(f"Request headers: {request.headers}")
        if not request.is_json:
            logger.error("Request does not contain JSON data")
            return jsonify({
                'error': 'Not JSON data',
                'details': 'Content-Type must be application/json'
            }), 400
            
        data = request.json
        logger.debug(f"Received data: {data}")
        
        if not data:
            logger.error("No JSON data received in the request")
            return jsonify({
                'error': 'No data received',
                'details': 'Request body must contain JSON data'
            }), 400
         
        # Map form data to student model features
        # We need to transform the career prediction form data to match the student performance dataset
        try:
            # Extract key features from form data
            education_level = data.get('education', 'Bachelor')
            tech_skills = data.get('technicalSkills', 'Intermediate') 
            analytical = data.get('analyticalThinking', 'Intermediate')
            comm_skills = data.get('communicationSkills', 'Intermediate')
            creativity = data.get('creativity', 'Intermediate')
            leadership = data.get('leadership', 'Intermediate')
            years_exp = int(data.get('yearsExperience', 0))
            interest_science = int(data.get('interestScience', 5))
            interest_arts = int(data.get('interestArts', 5))
            interest_business = int(data.get('interestBusiness', 5))
            
            # Map education level to Medu/Fedu
            education_map = {
                'High School': 1,
                'Bachelor': 2,
                'Master': 3,
                'PhD': 4
            }
            
            # Map skill levels to numeric values
            skill_map = {
                'Beginner': 1,
                'Intermediate': 2,
                'Advanced': 3,
                'Expert': 4
            }
            
            # Create student data point mapped from form data
            student_data = {
                'school': 'GP',  # Default value
                'sex': 'M',      # Default value
                'age': min(max(15, 15 + years_exp), 22),  # Map experience to age within dataset range
                'address': 'U',  # Default value
                'famsize': 'GT3', # Default value
                'Pstatus': 'T',  # Default value
                'Medu': education_map.get(education_level, 2),  # Map education level
                'Fedu': education_map.get(education_level, 2),  # Map education level
                'Mjob': 'other', # Default value
                'Fjob': 'other', # Default value
                'reason': 'course', # Default value
                'guardian': 'mother', # Default value
                'traveltime': 1,  # Default value
                'studytime': max(1, min(4, skill_map.get(tech_skills, 2))),  # Map technical skills
                'failures': 0,   # Assume no failures
                'schoolsup': 'yes' if skill_map.get(tech_skills, 2) > 2 else 'no',
                'famsup': 'yes',  # Default value
                'paid': 'no',     # Default value
                'activities': 'yes' if interest_arts > 5 else 'no',
                'nursery': 'yes', # Default value
                'higher': 'yes',  # Default value
                'internet': 'yes', # Default value
                'romantic': 'no',  # Default value
                'famrel': max(1, min(5, skill_map.get(comm_skills, 3))),  # Map communication skills
                'freetime': max(1, min(5, int((10 - interest_science)/2))),
                'goout': max(1, min(5, int(interest_arts/2))),
                'Dalc': 1,        # Default value
                'Walc': 1,        # Default value
                'health': 5,      # Default value
                'absences': min(int(years_exp * 2), 30)  # Map experience to absences
            }
            
            logger.debug(f"Mapped student data: {student_data}")
            
            # Convert to DataFrame
            student_df = pd.DataFrame([student_data])
            
            # Process numerical features
            student_num = student_df[numerical_cols].copy()
            student_num_scaled = numerical_transformer.transform(student_num)
            student_num_scaled = pd.DataFrame(student_num_scaled, columns=numerical_cols)
            
            # Process categorical features
            student_cat = pd.get_dummies(student_df[categorical_cols])
            
            # Align student_cat columns with the model's expected columns from training
            # This handles the case where one-hot encoded columns don't match exactly
            expected_cat_cols = [col for col in model.feature_names_in_ if col not in numerical_cols]
            
            # Check if we need to manually create the expected columns
            missing_cols = set(expected_cat_cols) - set(student_cat.columns)
            if missing_cols:
                logger.debug(f"Adding missing one-hot encoded columns: {missing_cols}")
                for col in missing_cols:
                    student_cat[col] = 0
            
            # Keep only the columns that the model expects
            student_cat = student_cat.reindex(columns=expected_cat_cols, fill_value=0)
            
            # Combine features
            student_processed = pd.concat([student_num_scaled, student_cat], axis=1)
            
            # Ensure columns are aligned with what the model expects
            missing_features = set(model.feature_names_in_) - set(student_processed.columns)
            extra_features = set(student_processed.columns) - set(model.feature_names_in_)
            
            if missing_features:
                logger.error(f"Missing required features: {missing_features}")
                return jsonify({
                    'error': 'Missing features',
                    'details': f'The model requires features that are missing: {missing_features}'
                }), 500
                
            if extra_features:
                logger.warning(f"Extra features detected: {extra_features}")
                student_processed = student_processed.drop(columns=extra_features)
            
            # Ensure columns are in the right order
            student_processed = student_processed[model.feature_names_in_]
            
            # Log the final processed data
            logger.debug(f"Final processed features: {student_processed.columns.tolist()}")
            
            # Make prediction
            prediction = model.predict(student_processed)[0]
            probabilities = model.predict_proba(student_processed)[0]
            pass_probability = float(probabilities[1]) * 100  # Probability of passing
            
            logger.info(f"Prediction: {prediction}, Pass probability: {pass_probability:.2f}%")
            
        except Exception as e:
            logger.error(f"Error processing data: {str(e)}")
            traceback.print_exc()
            return jsonify({
                'error': 'Data processing error',
                'details': str(e)
            }), 500
        
        # Map student performance prediction to career recommendations
        # Based on the ML model prediction and form input
        try:
            # Instead of hardcoded recommendations, use the model prediction and form inputs
            # to determine suitable careers
            
            # Determine potential career paths based on skills and interests
            potential_careers = []
            
            # Data Science/Tech careers
            if tech_skills in ['Advanced', 'Expert'] and interest_science >= 7:
                potential_careers.append({
                    'career': 'Data Scientist',
                    'score': interest_science * 0.6 + skill_map.get(analytical, 2) * 10 + pass_probability * 0.3
                })
                potential_careers.append({
                    'career': 'Software Engineer',
                    'score': interest_science * 0.5 + skill_map.get(tech_skills, 2) * 10 + pass_probability * 0.3
                })
            
            # Business careers
            if interest_business >= 6:
                potential_careers.append({
                    'career': 'Financial Analyst',
                    'score': interest_business * 0.6 + skill_map.get(analytical, 2) * 10 + pass_probability * 0.2
                })
                potential_careers.append({
                    'career': 'Marketing Specialist',
                    'score': interest_business * 0.5 + skill_map.get(comm_skills, 2) * 10 + skill_map.get(creativity, 2) * 5
                })
            
            # Creative careers
            if interest_arts >= 7 and creativity in ['Advanced', 'Expert']:
                potential_careers.append({
                    'career': 'Graphic Designer',
                    'score': interest_arts * 0.7 + skill_map.get(creativity, 2) * 15
                })
            
            # Healthcare/education
            if education_level in ['Master', 'PhD'] and interest_science >= 6:
                potential_careers.append({
                    'career': 'Doctor',
                    'score': interest_science * 0.6 + pass_probability * 0.4 + education_map.get(education_level, 2) * 5
                })
                potential_careers.append({
                    'career': 'Teacher',
                    'score': interest_arts * 0.3 + interest_science * 0.3 + skill_map.get(comm_skills, 2) * 10
                })
            
            # If we don't have enough careers yet, add some based on the ML model prediction
            if len(potential_careers) < 3:
                # Add all careers that weren't already added
                for career in CAREERS:
                    if not any(pc['career'] == career for pc in potential_careers):
                        # Base score on prediction and randomization
                        base_score = pass_probability
                        # Add some randomness but keep it consistent for the same inputs
                        random_factor = hash(career + str(data)) % 20  # 0-19 random factor
                        score = base_score + random_factor
                        potential_careers.append({
                            'career': career,
                            'score': score
                        })
            
            # Sort careers by score and select top 3
            potential_careers.sort(key=lambda x: x['score'], reverse=True)
            top_careers = potential_careers[:3]
            
            # Calculate probabilities based on scores
            total_score = sum(career['score'] for career in top_careers)
            if total_score > 0:
                for career in top_careers:
                    # Convert score to probability percentage
                    career['probability'] = round((career['score'] / total_score) * 100, 1)
                    # Ensure probability is within reasonable range (30-95%)
                    career['probability'] = max(30, min(95, career['probability']))
            else:
                # Fallback probabilities if scores are all zero
                for i, career in enumerate(top_careers):
                    career['probability'] = 90 - (i * 20)
            
            # Format recommendations
            recommendations = [
                {'career': career['career'], 'probability': career['probability']}
                for career in top_careers
            ]
            
            primary_prediction = recommendations[0]['career']
            logger.info(f"Top career recommendation: {primary_prediction}")
            
        except Exception as e:
            logger.error(f"Error generating career recommendations: {str(e)}")
            return jsonify({
                'error': 'Recommendation error',
                'details': str(e)
            }), 500
        
        # Generate a unique request ID
        unique_id = f"{hash(str(data) + str(np.random.random()))}"[:8]
        
        # Return the result
        return jsonify({
            'primaryPrediction': primary_prediction,
            'recommendations': recommendations,
            'requestId': unique_id,
            'modelDetails': {
                'modelType': type(model).__name__,
                'modelPath': os.path.basename(used_model_path),
                'studentPerformanceScore': pass_probability
            }
        })
                
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500

@app.route('/api/options', methods=['GET', 'OPTIONS'])
def options():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        logger.debug("Received OPTIONS request for /api/options. Responding with CORS headers.")
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        return response, 200
    
    logger.debug("Processing GET request for /api/options")
    response = jsonify({
        'educationLevels': EDUCATION_LEVELS,
        'skillLevels': SKILL_LEVELS,
        'careers': CAREERS
    })
    # Add CORS headers directly to this response
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin')
    return response

if __name__ == '__main__':
    logger.info("Starting the Flask server...")
    logger.info(f"Model path: {MODEL_PATH if os.path.exists(MODEL_PATH) else ALT_MODEL_PATH if os.path.exists(ALT_MODEL_PATH) else 'No model found'}")
    
    # Allow connections from any IP and use port 5001 instead of 5000 (which conflicts with AirPlay on macOS)
    app.run(debug=True, host='127.0.0.1', port=5001)