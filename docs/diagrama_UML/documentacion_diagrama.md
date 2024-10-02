El diagrama UML adjunto en esta carpeta es la representación de la relación entre los componentes de este proyecto.

Explicando las interacciones partiendo desde el Broker:

## Broker

Solicita, y recibe, información desde sus múltiples clientes. La cual almacena en una propia base de datos, apra luego proveer información específica al MQTT service. Al mismo tiempo, recibe información entrega por el servicio MQTT, ya que se puede considerar un cliente más del broker.

## Instancia EC2 

Contiene múltiples componentes que se relacionan tanto entre ellos como con componentes externos a la instancia.

### MQTT Service

Se relacion con el broker tanto solicitando datos como proveyéndolos. Estos son los JSONs que se intercambian tanto con información sobre los fixtures como sobre las requests de compras de bono. 

Por otro lado, provee los datos a la API para que esta los distribuya.

### API

Como se mencionó, solicita datos sobre fixtures y requests al MQTT Service para almacenarlos correctamente en su propia base de datos.

En nuestra implementación, la autenticación de usuarios desarrollada por el grupo con JWTs se relaciona directamente con la API pues es aquí donde se validan a los usuarios.

Al utilizar un balanceador de carga con Ngnix, podemos asumir que tenemos dos APIs duplicada con exactamente el mismo comportamiento descrito hasta el momento. Ambos componentes se comunican tanto para proveer como para solicitar datos con el balanceador de carga.

### Ngnix Load Balancer

El balanceador de carga aplicado con Ngnix provee y solicita datos a las APIs para poder comunicarse con la API Gateaway exitosamente y poder dividir la carga entre ambas APIs.

## API Gateaway

Encargado de actuar como puente entre nuestra API y el frontend del proyecto. Provee y solicita datos tanto al balanceador de carga como a la interfaz del usuario, o fronted.

## S3 Storage Bucket

El bucket de S3 es el encargado de contener la interfaz del usuario de nuestro programa.

### UserInterface

La interfaz de usuario se comunica con la API Gateaway tanto para recibir información a mostrar a nuestros usuarios, como para proveer los datos que estos mandan como respuestas a lo informado. Sin embargo, no se relaciona directamente con el usuario si no que con CLoudFront por el sistema implementado para este proyecto en particular. Siendo este último un puente entre el usuario y la interfaz.