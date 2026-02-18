#!/usr/bin/env python3
"""Test CORS configuration for the API."""
import requests
import json
import time

def test_options():
    """Test the OPTIONS request to check CORS headers."""
    print("\n=== Testing OPTIONS request ===")
    try:
        response = requests.options('http://localhost:5000/api/options')
        print(f"Status code: {response.status_code}")
        print("Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Methods'
        ]
        
        all_present = True
        for header in cors_headers:
            if header in response.headers:
                print(f"✅ {header} is present: {response.headers[header]}")
            else:
                print(f"❌ {header} is missing")
                all_present = False
        
        return all_present
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_predict():
    """Test a POST request to the predict endpoint."""
    print("\n=== Testing POST to /api/predict ===")
    try:
        # Sample data
        sample_data = {
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
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'http://localhost:3000'
        }
        
        # First make an OPTIONS request
        print("Making OPTIONS request...")
        options_response = requests.options(
            'http://localhost:5000/api/predict',
            headers=headers
        )
        print(f"OPTIONS Status: {options_response.status_code}")
        
        # Then make the actual POST request
        print("Making POST request...")
        response = requests.post(
            'http://localhost:5000/api/predict',
            json=sample_data,
            headers=headers
        )
        
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ POST request successful")
            print("Response JSON:")
            print(json.dumps(response.json(), indent=2))
            return True
        else:
            print("❌ POST request failed")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Starting CORS tests...")
    options_success = test_options()
    predict_success = test_predict()
    
    if options_success and predict_success:
        print("\n✅ All CORS tests passed!")
    else:
        print("\n❌ Some CORS tests failed.")
        if not options_success:
            print("  - OPTIONS request test failed")
        if not predict_success:
            print("  - POST request test failed") 