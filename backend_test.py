#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timezone, timedelta
from urllib.parse import urlparse, parse_qs

class REcloseAPITester:
    def __init__(self, base_url="https://4ca99975-c6ee-4715-b344-46b4ebe8a637.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_id = f"test_user_{datetime.now().strftime('%H%M%S')}"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, params=params, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, params=params, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, None
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_health_check(self):
        """Test API health endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_google_oauth_login(self):
        """Test Google OAuth login URL generation"""
        return self.run_test(
            "Google OAuth Login URL",
            "GET",
            "api/auth/google/login",
            200,
            params={"user_id": self.test_user_id}
        )

    def test_google_oauth_status(self):
        """Test Google OAuth connection status"""
        return self.run_test(
            "Google OAuth Status Check",
            "GET",
            "api/auth/google/status",
            200,
            params={"user_id": self.test_user_id}
        )

    def test_google_oauth_disconnect(self):
        """Test Google OAuth disconnect"""
        return self.run_test(
            "Google OAuth Disconnect",
            "POST",
            "api/auth/google/disconnect",
            200,
            params={"user_id": self.test_user_id}
        )

    def test_calendar_events_unauthorized(self):
        """Test calendar events without authentication (should fail)"""
        return self.run_test(
            "Calendar Events (Unauthorized)",
            "GET",
            "api/calendar/events",
            401,
            params={"user_id": self.test_user_id}
        )

    def test_cloudinary_signature(self):
        """Test Cloudinary signature generation"""
        return self.run_test(
            "Cloudinary Signature Generation",
            "GET",
            "api/cloudinary/signature",
            200,
            params={"resource_type": "raw", "folder": "knowledge_base"}
        )

    def test_cloudinary_signature_invalid_folder(self):
        """Test Cloudinary signature with invalid folder"""
        return self.run_test(
            "Cloudinary Signature (Invalid Folder)",
            "GET",
            "api/cloudinary/signature",
            400,
            params={"resource_type": "raw", "folder": "invalid_folder"}
        )

    def test_create_calendar_event_unauthorized(self):
        """Test creating calendar event without auth (should fail)"""
        event_data = {
            "title": "Test Meeting",
            "description": "Test meeting description",
            "start": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
            "end": (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat(),
            "attendee_email": "test@example.com",
            "attendee_name": "Test User"
        }
        return self.run_test(
            "Create Calendar Event (Unauthorized)",
            "POST",
            "api/calendar/events",
            401,
            data=event_data,
            params={"user_id": self.test_user_id}
        )

    def test_delete_cloudinary_asset_nonexistent(self):
        """Test deleting non-existent Cloudinary asset"""
        return self.run_test(
            "Delete Non-existent Cloudinary Asset",
            "DELETE",
            "api/cloudinary/nonexistent_asset",
            200  # Cloudinary returns success even for non-existent assets
        )

def main():
    print("🚀 Starting REclose API Backend Tests")
    print("=" * 50)
    
    tester = REcloseAPITester()
    
    # Core API Tests
    print("\n📋 CORE API TESTS")
    print("-" * 30)
    tester.test_health_check()
    
    # Google OAuth Tests
    print("\n🔐 GOOGLE OAUTH TESTS")
    print("-" * 30)
    tester.test_google_oauth_login()
    tester.test_google_oauth_status()
    tester.test_google_oauth_disconnect()
    
    # Google Calendar Tests (without auth)
    print("\n📅 GOOGLE CALENDAR TESTS")
    print("-" * 30)
    tester.test_calendar_events_unauthorized()
    tester.test_create_calendar_event_unauthorized()
    
    # Cloudinary Tests
    print("\n☁️  CLOUDINARY TESTS")
    print("-" * 30)
    tester.test_cloudinary_signature()
    tester.test_cloudinary_signature_invalid_folder()
    tester.test_delete_cloudinary_asset_nonexistent()
    
    # Print Results
    print("\n" + "=" * 50)
    print(f"📊 BACKEND TEST RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())