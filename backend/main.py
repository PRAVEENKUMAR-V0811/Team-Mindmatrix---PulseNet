import os
import json
import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from database import records_collection
from models import DiagnosisRequest, ChatRequest 

app = FastAPI()

# CORS for React
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Gemini Config
genai.configure(api_key=os.getenv("GENAI_API_KEY"))
# Note: Ensure the model name is 'gemini-1.5-flash-latest' for best results
model = genai.GenerativeModel('gemini-flash-latest')

@app.post("/api/analyze")
async def analyze_symptoms(data: DiagnosisRequest):
    print(f"Received request for: {data.patient.name}")
    
    # We use f-string for variables, but DOUBLE the curly braces for the literal JSON part
    prompt = f"""
You are a Clinical Decision Support Medical AI assisting licensed physicians.
All medication dosages MUST be adjusted based on patient age category and safety standards.

PATIENT DETAILS:
Name: {data.patient.name}
Age: {data.patient.age}
Gender: {data.patient.gender}

AGE CATEGORIZATION (MANDATORY):
- Infant (0–1 years)
- Child (2–12 years)
- Adolescent (13–17 years)
- Adult (18–59 years)
- Geriatric (60+ years)

VITAL SIGNS:
Temperature: {data.vitals.temperature} °C
Blood Pressure: {data.vitals.bp.systolic}/{data.vitals.bp.diastolic} mmHg
Pulse Rate: {data.vitals.pulse} bpm

SYMPTOMS:
{data.symptoms}

OUTPUT FORMAT:
Return ONLY valid JSON in the structure below. Do not include markdown or conversational text.

{{
  "ageCategory": "",
  "diagnosis": "",
  "confidence": "",
  "referralNeeded": true,
  "treatments": [
    {{
      "medication": "",
      "dosage": "",
      "route": "",
      "frequency": "",
      "duration": "",
      "ageSpecificRationale": ""
    }}
  ],
  "drugInteractions": [
    {{
      "substances": "",
      "riskLevel": "",
      "clinicalExplanation": "",
      "recommendation": ""
    }}
  ],
  "clinicalNotes": ""
}}
"""
    
    try:
        # 1. Generate AI Response
        response = model.generate_content(prompt)
        
        # 2. Clean Gemini's markdown if present
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        ai_data = json.loads(text_response)
        
        # 3. Prepare for MongoDB
        full_record = {
            "doctorId": data.doctorId,
            "doctorEmail": data.doctorEmail,
            "patient_info": data.dict(),
            "diagnosis_result": ai_data,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        
        # 4. Save to MongoDB Atlas
        try:
            await records_collection.insert_one(full_record)
            print("Successfully saved to MongoDB Atlas")
        except Exception as db_err:
            print(f"DATABASE ERROR: {db_err}")
            pass 
        
        return ai_data

    except Exception as e:
        print(f"CRITICAL ERROR IN ANALYZE: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")

@app.get("/api/doctor/records")
async def get_doctor_records(email: str = Query(None)):
    query = {"doctorEmail": email} if email else {}
    cursor = records_collection.find(query).sort("timestamp", -1)
    records = await cursor.to_list(length=50)
    for r in records:
        r["_id"] = str(r["_id"])
    return records

@app.post("/api/common-chat")
async def common_chat(data: ChatRequest):
    lang_names = {
        'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 
        'ta': 'Tamil', 'te': 'Telugu'
    }
    target_lang = lang_names.get(data.language, "English")

    prompt = f"""
You are PulseNet AI, a healthcare-only virtual assistant. 
Reply ONLY in {target_lang}.
USER MESSAGE: {data.message}

MEDICAL SAFETY RULES:
- Provide general health info.
- Do NOT diagnose or prescribe.
- Remind the user to see a doctor.
"""
    try:
        response = model.generate_content(prompt)
        return {"reply": response.text.strip()}
    except Exception as e:
        return {"reply": f"Internal AI Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)