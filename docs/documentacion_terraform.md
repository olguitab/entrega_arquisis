Pasos del Flujo

1. Configuración del Proveedor: Se define AWS como proveedor en la región us-east-1.

2. Despliegue de Infraestructura:
    - Se crea la instancia EC2 con Docker preconfigurado.
    - Se asigna un EIP para conectividad estática.

3. Seguridad:
    - Se define un Security Group para permitir tráfico en puertos HTTP y específicos del backend.

4. API Gateway:
    - Configuración de endpoints para fixtures y bets.
    - Integración con el backend en EC2.

5. S3 Bucket: Creación de un bucket con versionado habilitado para almacenamiento seguro.

6. Salida: Se generan URLs y datos clave para interacción con los recursos.

Para iniciar terraform se debe ejecutar en la consola, dentro del directorio /terraform, "terraform init"
Luego, para ver los pasos que va a ejecutar el archivo, se debe ejecutar "terraform plan"