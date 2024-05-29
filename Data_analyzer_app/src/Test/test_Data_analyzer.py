import unittest
import sys
import os

# Add the path to the main directory
main_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Main'))
sys.path.append(main_path)

# Import the Flask app from the data_analyzer module
from Data_analyzer_app import app

class TestDataAnalyzer(unittest.TestCase):

    def setUp(self):
        # Create a test client using the Flask app
        self.app = app.test_client()

        # Set the Flask app to testing mode
        app.config['TESTING'] = True

    def tearDown(self):
        pass

    def test_analyze_data_endpoint(self):
        # Define the test data (you can customize this based on your requirements)
        test_data = [
            {"value": 10},
            {"value": 20},
            {"value": 30}
        ]

        # Make a POST request to the /analyze-data endpoint with the test data
        response = self.app.post('/analyze-data', json=test_data)

        # Assert that the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Uncomment the below lines to print the response content and check manually
        print(response.data.decode('utf-8'))
        self.assertTrue("Analysis result stored successfully in the database" in response.data.decode('utf-8'))

if __name__ == '__main__':
    unittest.main()
