from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
import os
import time
import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from pathlib import Path
import cloudinary
import cloudinary.utils
import cloudinary.uploader
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from googleapiclient.discovery import build
from pydantic import BaseModel
from typing import Optional, List
import json

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

app = FastAPI(title="REclose API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google OAuth Config
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI')
GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

# Cloudinary Config
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

# In-memory token storage (in production, use database)
user_tokens = {}

# Pydantic Models
class CalendarEvent(BaseModel):
    title: str
    description: Optional[str] = None
    start: str  # ISO 8601
    end: str    # ISO 8601
    attendee_email: Optional[str] = None
    attendee_name: Optional[str] = None

class UpdateEvent(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None

# Health check
@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "reclose-api"}

# ============ GOOGLE CALENDAR ============

@app.get("/api/auth/google/login")
async def google_login(user_id: str = Query(...)):
    """Start Google OAuth flow"""
    auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope={' '.join(GOOGLE_SCOPES)}&"
        f"access_type=offline&"
        f"prompt=consent&"
        f"state={user_id}"
    )
    return {"authorization_url": auth_url}

@app.get("/api/auth/google/callback")
async def google_callback(code: str, state: str = None):
    """Handle Google OAuth callback"""
    try:
        # Exchange code for tokens
        token_resp = requests.post('https://oauth2.googleapis.com/token', data={
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': GOOGLE_REDIRECT_URI,
            'grant_type': 'authorization_code'
        }).json()
        
        if 'error' in token_resp:
            return RedirectResponse(f"/?error={token_resp.get('error_description', 'OAuth failed')}")
        
        # Get user info
        user_info = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {token_resp["access_token"]}'}
        ).json()
        
        # Store tokens (keyed by state which is user_id)
        user_id = state or user_info.get('email')
        user_tokens[user_id] = {
            'access_token': token_resp['access_token'],
            'refresh_token': token_resp.get('refresh_token'),
            'email': user_info.get('email'),
            'expires_at': time.time() + token_resp.get('expires_in', 3600)
        }
        
        # Redirect back to frontend
        return RedirectResponse(f"/dashboard/integrations?google_connected=true&email={user_info.get('email')}")
    except Exception as e:
        return RedirectResponse(f"/?error={str(e)}")

@app.get("/api/auth/google/status")
async def google_status(user_id: str = Query(...)):
    """Check if user has Google Calendar connected"""
    tokens = user_tokens.get(user_id)
    if tokens:
        return {
            "connected": True,
            "email": tokens.get('email')
        }
    return {"connected": False}

@app.post("/api/auth/google/disconnect")
async def google_disconnect(user_id: str = Query(...)):
    """Disconnect Google Calendar"""
    if user_id in user_tokens:
        del user_tokens[user_id]
    return {"success": True}

async def get_google_creds(user_id: str):
    """Get valid Google credentials, refreshing if needed"""
    tokens = user_tokens.get(user_id)
    if not tokens:
        raise HTTPException(status_code=401, detail="Google Calendar not connected")
    
    creds = Credentials(
        token=tokens['access_token'],
        refresh_token=tokens.get('refresh_token'),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET
    )
    
    # Refresh if expired
    if tokens.get('expires_at', 0) < time.time() and tokens.get('refresh_token'):
        try:
            creds.refresh(GoogleRequest())
            user_tokens[user_id]['access_token'] = creds.token
            user_tokens[user_id]['expires_at'] = time.time() + 3600
        except Exception as e:
            raise HTTPException(status_code=401, detail="Token refresh failed. Please reconnect.")
    
    return creds

@app.get("/api/calendar/events")
async def get_calendar_events(
    user_id: str = Query(...),
    max_results: int = Query(50),
    time_min: str = Query(None)
):
    """Get calendar events"""
    creds = await get_google_creds(user_id)
    service = build('calendar', 'v3', credentials=creds)
    
    if not time_min:
        time_min = datetime.now(timezone.utc).isoformat()
    
    events_result = service.events().list(
        calendarId='primary',
        timeMin=time_min,
        maxResults=max_results,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    
    return events_result.get('items', [])

@app.post("/api/calendar/events")
async def create_calendar_event(
    event: CalendarEvent,
    user_id: str = Query(...)
):
    """Create a calendar event"""
    creds = await get_google_creds(user_id)
    service = build('calendar', 'v3', credentials=creds)
    
    event_body = {
        'summary': event.title,
        'description': event.description,
        'start': {'dateTime': event.start, 'timeZone': 'UTC'},
        'end': {'dateTime': event.end, 'timeZone': 'UTC'},
    }
    
    if event.attendee_email:
        event_body['attendees'] = [{
            'email': event.attendee_email,
            'displayName': event.attendee_name
        }]
    
    created_event = service.events().insert(
        calendarId='primary',
        body=event_body,
        sendUpdates='all' if event.attendee_email else 'none'
    ).execute()
    
    return created_event

@app.put("/api/calendar/events/{event_id}")
async def update_calendar_event(
    event_id: str,
    event: UpdateEvent,
    user_id: str = Query(...)
):
    """Update a calendar event"""
    creds = await get_google_creds(user_id)
    service = build('calendar', 'v3', credentials=creds)
    
    # Get existing event
    existing = service.events().get(calendarId='primary', eventId=event_id).execute()
    
    # Update fields
    if event.title:
        existing['summary'] = event.title
    if event.description:
        existing['description'] = event.description
    if event.start:
        existing['start'] = {'dateTime': event.start, 'timeZone': 'UTC'}
    if event.end:
        existing['end'] = {'dateTime': event.end, 'timeZone': 'UTC'}
    
    updated = service.events().update(
        calendarId='primary',
        eventId=event_id,
        body=existing
    ).execute()
    
    return updated

@app.delete("/api/calendar/events/{event_id}")
async def delete_calendar_event(
    event_id: str,
    user_id: str = Query(...)
):
    """Delete a calendar event"""
    creds = await get_google_creds(user_id)
    service = build('calendar', 'v3', credentials=creds)
    
    service.events().delete(calendarId='primary', eventId=event_id).execute()
    return {"success": True}

# ============ CLOUDINARY ============

@app.get("/api/cloudinary/signature")
async def get_cloudinary_signature(
    resource_type: str = Query("raw", enum=["image", "video", "raw"]),
    folder: str = Query("knowledge_base")
):
    """Generate signed upload params for Cloudinary"""
    ALLOWED_FOLDERS = ("knowledge_base", "avatars", "uploads")
    
    if not any(folder.startswith(f) for f in ALLOWED_FOLDERS):
        raise HTTPException(status_code=400, detail="Invalid folder path")
    
    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": folder,
    }
    
    signature = cloudinary.utils.api_sign_request(
        params,
        os.environ.get('CLOUDINARY_API_SECRET')
    )
    
    return {
        "signature": signature,
        "timestamp": timestamp,
        "cloud_name": os.environ.get('CLOUDINARY_CLOUD_NAME'),
        "api_key": os.environ.get('CLOUDINARY_API_KEY'),
        "folder": folder,
        "resource_type": resource_type
    }

@app.delete("/api/cloudinary/{public_id:path}")
async def delete_cloudinary_asset(public_id: str):
    """Delete a Cloudinary asset"""
    try:
        result = cloudinary.uploader.destroy(public_id, invalidate=True, resource_type='raw')
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
