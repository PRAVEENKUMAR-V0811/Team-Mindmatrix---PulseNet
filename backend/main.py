import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini with your FREE Key
# In a production environment, use environment variables
GENAI_API_KEY = "AIzaSyBGGEnP_LXl0fpc9k0CsQ6X4e0cmLvisVw" 
genai.configure(api_key=GENAI_API_KEY)
print("Checking available models...")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"Available: {m.name}")
model = genai.GenerativeModel('gemini-flash-latest')

app = FastAPI()

# Allow your React app to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models (Matching your Zustand Store) ---

class Vitals(BaseModel):
    temp: str
    bp: str
    hr: str
    spo2: Optional[str] = ""

class DiagnosisRequest(BaseModel):
    name: str
    age: str
    gender: str
    weight: str
    vitals: Vitals
    symptoms: str

class ChatRequest(BaseModel):
    message: str
    language: str

# --- 1. Diagnosis Endpoint ---

@app.post("/api/analyze")
async def analyze_symptoms(data: DiagnosisRequest):
    prompt = f"""
    You are a Medical AI Assistant for rural healthcare. 
    Analyze the following patient data:
    Patient: {data.name}, Age: {data.age}, Gender: {data.gender}, Weight: {data.weight}kg.
    Vitals: Temp {data.vitals.temp}F, BP {data.vitals.bp}, Heart Rate {data.vitals.hr}bpm.
    Symptoms: {data.symptoms}

    Return a JSON response (strictly follow this structure):
    {{
        "diagnosis": "Name of possible condition",
        "confidence": 85,
        "referralNeeded": true/false,
        "treatments": ["step 1", "step 2", "step 3"]
    }}
    Important: If symptoms are severe, set referralNeeded to true.
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean the response in case Gemini adds markdown ```json blocks
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="AI Analysis failed")

# --- 2. Multilingual Chatbot Endpoint ---

@app.post("/api/common-chat")
async def common_chat(data: ChatRequest):
    lang_names = {
        'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 
        'ta': 'Tamil', 'te': 'Telugu'
    }
    target_lang = lang_names.get(data.language, "English")

    prompt = f"""
    Role: You are 'PulseNet AI', a helpful medical assistant.
    User Message: {data.message}
    Constraint: You MUST reply only in {target_lang}. 
    Context: Be empathetic and concise. If the user asks medical questions, give helpful health advice but remind them to consult a doctor.
    """

    try:
        response = model.generate_content(prompt)
        return {"reply": response.text.strip()}
    except Exception as e:
        print(f"--- DETAILED ERROR LOG ---")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        print(f"--------------------------")
        return {"reply": f"Internal AI Error: {str(e)}"} # Show error in chat for debugging

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)