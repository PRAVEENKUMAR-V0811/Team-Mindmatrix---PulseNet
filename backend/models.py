from pydantic import BaseModel, Field
from typing import List, Optional

# --- SUB-MODELS ---
class BP(BaseModel):
    systolic: int
    diastolic: int

class Vitals(BaseModel):
    temperature: float
    bp: BP
    pulse: int

class Patient(BaseModel):
    name: str
    age: int
    gender: str
    weight: float

# --- REQUEST MODELS ---

# Used by the /analyze endpoint
class DiagnosisRequest(BaseModel):
    language: str
    patient: Patient
    vitals: Vitals
    symptoms: str
    doctorId: str
    doctorEmail: str

# Used by the /common-chat endpoint
class ChatRequest(BaseModel):
    message: str
    language: str

# --- RESPONSE/DB MODELS ---

class AIResponse(BaseModel):
    diagnosis: str
    confidence: int
    referralNeeded: bool
    treatments: List[str]

class PatientRecord(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    doctorId: str
    doctorEmail: str
    patient_info: DiagnosisRequest
    diagnosis_result: AIResponse
    timestamp: str