import os
from celery import Celery

# Crear la instancia de Celery
celery_app = Celery(
    __name__,
    broker=os.environ.get('CELERY_BROKER_URL', ''),
    backend=os.environ.get('CELERY_RESULT_BACKEND', '')
)

# Configuración desde un archivo específico
celery_app.config_from_object('celery_config.config', namespace='CELERY')

# Configuraciones adicionales para optimizar el uso de recursos
celery_app.conf.update(
    task_acks_late=True,  # Asegura que las tareas no se reintenten innecesariamente si no se completan correctamente
    worker_concurrency=2,  # Limitar la concurrencia de workers (reduce el uso de CPU)
    task_time_limit=300,  # Limitar el tiempo máximo de ejecución de una tarea (reduce el uso de memoria por tarea)
    worker_max_tasks_per_child=5,  # Limitar el número de tareas que un worker puede procesar antes de ser reciclado
    task_routes={
        'your_module.tasks.some_task': {'queue': 'high_priority'},  # Ejemplo de rutas para manejar tareas específicas
    }
)

