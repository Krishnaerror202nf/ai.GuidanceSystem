#!/usr/bin/env python3
"""
Utility script to check if the Flask API is working properly with the ML model.
"""
import requests
import json
import time
import os

def test_options_endpoint():
    """Test the /api/options endpoint to get education and skill levels."""
    try:
        response = requests.get('http://localhost:5000/api/options')
        if response.status_code == 200:
            print("✅ Successfully connected to /api/options endpoint")
            print("Data received:", json.dumps(response.json(), indent=2))
            return True
        else:
            print("❌ Failed to connect to /api/options endpoint")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing /api/options endpoint: {e}")
        return False

def test_model_exists():
    """Check if the ML model file exists."""
    model_paths = [
        'student_performance_rf_model.pkl',
        'student_performance_xgb_model.pkl'
    ]
    
    for path in model_paths:
        if os.path.exists(path):
            print(f"✅ ML model found: {path}")
            print(f"   File size: {os.path.getsize(path) / (1024*1024):.2f} MB")
            return True
    
    print("❌ No ML model found. You need to train the model first.")
    print("   Run: python train_model.py")
    return False

def test_predict_endpoint():
    """Test the /api/predict endpoint with different sample data."""
    test_cases = [
        {
            "name": "Data Science Profile",
            "data": {
                "education": "PhD",
                "technicalSkills": "Expert",
                "communicationSkills": "Advanced",
                "analyticalThinking": "Expert",
                "creativity": "Intermediate",
                "leadership": "Advanced",
                "yearsExperience": 5,
                "interestScience": 9,
                "interestArts": 4,
                "interestBusiness": 6,
                "personalityExtroversion": 6,
                "personalityOpenness": 8,
                "personalityConscientiousness": 9
            }
        },
        {
            "name": "Creative Profile",
            "data": {
                "education": "Bachelor",
                "technicalSkills": "Intermediate",
                "communicationSkills": "Advanced", 
                "analyticalThinking": "Intermediate",
                "creativity": "Expert",
                "leadership": "Intermediate",
                "yearsExperience": 2,
                "interestScience": 4,
                "interestArts": 9,
                "interestBusiness": 5,
                "personalityExtroversion": 8,
                "personalityOpenness": 9,
                "personalityConscientiousness": 6
            }
        },
        {
            "name": "Business Profile",
            "data": {
                "education": "Master",
                "technicalSkills": "Intermediate",
                "communicationSkills": "Expert",
                "analyticalThinking": "Advanced",
                "creativity": "Intermediate",
                "leadership": "Expert",
                "yearsExperience": 8,
                "interestScience": 5,
                "interestArts": 4,
                "interestBusiness": 9,
                "personalityExtroversion": 8,
                "personalityOpenness": 7,
                "personalityConscientiousness": 9
            }
        }
    ]
    
    success_count = 0
    
    for test_case in test_cases:
        print(f"\nTesting prediction with {test_case['name']}...")
        try:
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            
            start_time = time.time()
            response = requests.post(
                'http://localhost:5000/api/predict',
                json=test_case['data'],
                headers=headers
            )
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Successfully got prediction for {test_case['name']}")
                print(f"   Response time: {(end_time - start_time) * 1000:.2f} ms")
                print(f"   Primary prediction: {result['primaryPrediction']}")
                print("   Recommendations:")
                for i, rec in enumerate(result['recommendations'], 1):
                    print(f"     {i}. {rec['career']} ({rec['probability']}%)")
                if 'modelDetails' in result:
                    print(f"   Model: {result['modelDetails'].get('modelType', 'Unknown')}")
                    print(f"   Student performance score: {result['modelDetails'].get('studentPerformanceScore', 0):.2f}%")
                success_count += 1
            else:
                print(f"❌ Failed to get prediction for {test_case['name']}")
                print(f"   Status code: {response.status_code}")
                print(f"   Response: {response.text}")
        except Exception as e:
            print(f"❌ Error testing predict endpoint with {test_case['name']}: {e}")
    
    return success_count == len(test_cases)

if __name__ == "__main__":
    print("Testing Flask API...")
    print("\n=== Checking if ML model exists ===")
    model_exists = test_model_exists()
    
    print("\n=== Testing /api/options endpoint ===")
    options_success = test_options_endpoint()
    
    print("\n=== Testing /api/predict endpoint ===")
    predict_success = test_predict_endpoint()
    
    print("\n=== Summary ===")
    if model_exists and options_success and predict_success:
        print("✅ All API tests passed successfully!")
    else:
        print("❌ Some tests failed:")
        print(f"   - ML model check: {'✅ Passed' if model_exists else '❌ Failed'}")
        print(f"   - Options endpoint: {'✅ Passed' if options_success else '❌ Failed'}")
        print(f"   - Predict endpoint: {'✅ Passed' if predict_success else '❌ Failed'}")
        
        if not model_exists:
            print("\nTo fix the missing model issue:")
            print("1. Run the training script: python train_model.py")
            print("2. Verify that student_performance_rf_model.pkl or student_performance_xgb_model.pkl is created")
            print("3. Run this test script again") 