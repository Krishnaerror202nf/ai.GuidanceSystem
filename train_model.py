import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import os
import urllib.request

# Download the dataset if not already present
dataset_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00320/student.zip"
dataset_path = "data/student.zip"

if not os.path.exists("data/student-mat.csv"):
    print("Downloading dataset...")
    if not os.path.exists(dataset_path):
        urllib.request.urlretrieve(dataset_url, dataset_path)
    
    # Unzip the dataset
    import zipfile
    with zipfile.ZipFile(dataset_path, 'r') as zip_ref:
        zip_ref.extractall("data")
    
    print("Dataset downloaded and extracted.")

# Load the dataset
try:
    df = pd.read_csv("data/student-mat.csv", sep=";")
    print("Dataset loaded successfully!")
    print(f"Dataset shape: {df.shape}")
    print(df.head())
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = None

if df is not None:
    # Preprocess the data
    print("\nPreprocessing data...")
    
    # Define target variable - let's predict if student will pass (G3 >= 10)
    df['pass'] = df['G3'].apply(lambda x: 1 if x >= 10 else 0)
    
    # Drop the original grade columns
    df = df.drop(['G1', 'G2', 'G3'], axis=1)
    
    # Separate features and target
    X = df.drop('pass', axis=1)
    y = df['pass']
    
    # Identify categorical and numerical columns
    categorical_cols = X.select_dtypes(include=['object']).columns
    numerical_cols = X.select_dtypes(exclude=['object']).columns
    
    # Preprocessing for numerical data
    numerical_transformer = StandardScaler()
    
    # Apply transformations
    X_num = X[numerical_cols].copy()
    X_num_scaled = numerical_transformer.fit_transform(X_num)
    X_num_scaled = pd.DataFrame(X_num_scaled, columns=numerical_cols)
    
    # One-hot encode categorical data
    X_cat = pd.get_dummies(X[categorical_cols])
    
    # Combine processed data
    X_processed = pd.concat([X_num_scaled, X_cat], axis=1)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)
    
    # Check for class imbalance
    print(f"\nClass distribution in training set: {np.bincount(y_train)}")
    
    # Apply SMOTE to balance classes
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
    print(f"Class distribution after SMOTE: {np.bincount(y_train_resampled)}")
    
    # Train Random Forest model
    print("\nTraining Random Forest model...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_resampled, y_train_resampled)
    
    # Evaluate Random Forest
    y_pred_rf = rf_model.predict(X_test)
    rf_accuracy = accuracy_score(y_test, y_pred_rf)
    print(f"Random Forest accuracy: {rf_accuracy:.4f}")
    print("Classification Report (Random Forest):")
    print(classification_report(y_test, y_pred_rf))
    
    # Train XGBoost model
    print("\nTraining XGBoost model...")
    xgb_model = XGBClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
    xgb_model.fit(X_train_resampled, y_train_resampled)
    
    # Evaluate XGBoost
    y_pred_xgb = xgb_model.predict(X_test)
    xgb_accuracy = accuracy_score(y_test, y_pred_xgb)
    print(f"XGBoost accuracy: {xgb_accuracy:.4f}")
    print("Classification Report (XGBoost):")
    print(classification_report(y_test, y_pred_xgb))
    
    # Save the better performing model
    if rf_accuracy > xgb_accuracy:
        print("\nSaving Random Forest model...")
        best_model = rf_model
        model_name = "student_performance_rf_model.pkl"
    else:
        print("\nSaving XGBoost model...")
        best_model = xgb_model
        model_name = "student_performance_xgb_model.pkl"
    
    # Save the model and preprocessing information
    model_info = {
        'model': best_model,
        'numerical_cols': numerical_cols,
        'categorical_cols': categorical_cols,
        'numerical_transformer': numerical_transformer
    }
    
    joblib.dump(model_info, model_name)
    print(f"Model saved as {model_name}")
else:
    print("Failed to load dataset. Model training aborted.") 