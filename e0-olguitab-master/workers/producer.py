from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from celery.result import AsyncResult
from celery_config.tasks import generate_recommendations_task  # Asegúrate de que este import esté correcto

app = FastAPI()

class JobRequest(BaseModel):
    user_id: str

@app.post("/job")
async def create_job(request: JobRequest):
    task = generate_recommendations_task.delay(request.user_id)  # Asegúrate de que este método está definido en tasks.py
    return {"job_id": task.id}

@app.get("/job/{job_id}")
async def get_job_result(job_id: str):
    result = AsyncResult(job_id)
    
    if result.ready():
        if isinstance(result.result, list):
            return {
                "ready": True,
                "recommendations": result.result
            }
        else:
            return {
                "ready": True,
                "result": result.result
            }
    return {"ready": False}

