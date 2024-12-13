from googleapiclient.discovery import build
from google.oauth2 import service_account
from ..config import get_settings
from typing import List, Dict

settings = get_settings()

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SHEET_ID = settings.google_sheets_spreadsheet_id

def get_service():
    creds = service_account.Credentials.from_service_account_file(
        "app/utils/credentials.json", scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    return service

def backup_inventory_to_sheets(inventory_data: List[Dict]):
    # inventory_data is a list of inventory items as dicts
    service = get_service()
    # Prepare data for Sheets
    # Let's assume columns: ID, SKU, Brand, Model, Size, Type, Quantity, Price, Location
    values = [["ID","SKU","Brand","Model","Size","Type","Quantity","Price","Location"]]
    for item in inventory_data:
        values.append([
            item["id"],
            item["sku"],
            item["brand"],
            item["model"],
            item["size"],
            item["type"],
            item["quantity"],
            item["price"],
            item["location"]
        ])

    body = {
        'values': values
    }
    service.spreadsheets().values().update(
        spreadsheetId=SHEET_ID, range="Inventory!A1",
        valueInputOption="RAW", body=body).execute()

def fetch_inventory_from_sheets() -> List[Dict]:
    service = get_service()
    result = service.spreadsheets().values().get(
        spreadsheetId=SHEET_ID, range="Inventory!A2:I"
    ).execute()
    rows = result.get('values', [])
    inventory = []
    for row in rows:
        # Expecting exactly 9 columns as defined above
        if len(row) < 9:
            continue
        inventory.append({
            "id": int(row[0]),
            "sku": row[1],
            "brand": row[2],
            "model": row[3],
            "size": row[4],
            "type": row[5],
            "quantity": int(row[6]),
            "price": float(row[7]),
            "location": row[8]
        })
    return inventory
