from celery import shared_task
from .recommendation_logic import generate_recommendations
import asyncio

# Tareas de Celery
@shared_task
def generate_recommendations_task(user_id):
    recommendations = asyncio.run(generate_recommendations(user_id))
    return recommendations
