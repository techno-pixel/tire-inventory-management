from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..utils.security import verify_token
from typing import List, Dict, Any
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from googleapiclient.discovery import build
from ..config import get_settings
import json

router = APIRouter()
settings = get_settings()

def get_sheets_service():
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    creds = service_account.Credentials.from_service_account_info(
        json.loads(settings.google_sheets_credentials),
        scopes=SCOPES
    )
    return build('sheets', 'v4', credentials=creds)

@router.post("/sheets/append")
async def append_to_sheet(
    values: Dict[str, List[str]],
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = get_sheets_service()
        spreadsheet_id = settings.google_sheets_spreadsheet_id
        range_name = 'Inventory!A:G'  # Adjust based on your sheet
        
        body = {
            'values': [values['values']]
        }
        
        result = service.spreadsheets().values().append(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='USER_ENTERED',
            body=body
        ).execute()
        
        return {"status": "success", "updates": result.get('updates')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sheets/data")
async def get_sheet_data(
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = get_sheets_service()
        spreadsheet_id = settings.google_sheets_spreadsheet_id
        range_name = 'Inventory!A:G'  # Adjust based on your sheet
        
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        rows = result.get('values', [])
        if not rows:
            return []
            
        # Convert to list of dictionaries with headers
        headers = rows[0]
        data = []
        for row in rows[1:]:
            row_dict = {}
            for i, value in enumerate(row):
                if i < len(headers):
                    row_dict[headers[i]] = value
            data.append(row_dict)
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))