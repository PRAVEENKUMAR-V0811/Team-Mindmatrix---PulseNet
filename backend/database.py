import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Replace with your Atlas Connection String in .env
MONGO_URI = os.getenv("MONGO_URI") 
client = AsyncIOMotorClient(MONGO_URI)
db = client.pulsenet_db
records_collection = db.diagnosis_history