## Consideraciones generales

Para correr api nestjs, hay que dirigirse a ./app y usar el comando npm run start

Para correr mqtt, hay que dirigirse a ./mqtt-service y usar el comando node mqtt-service

Para partir la base de datos, hay que dirigirse a ./app y usar el comando mongod

Se usa Nestjs, Typescript, MongoDB Atlas y MQTT breker, para correr esta aplicación.

## Nombre del dominio
https://olguitabarriga.me

## Método de acceso al servidor con archivo .pem y ssh (no publicar estas credenciales en
el repositorio).

ssh -i "olguitakey.pem" ubuntu@ec2-3-14-1-216.us-east-2.compute.amazonaws.com

http://ec2-3-14-1-216.us-east-2.compute.amazonaws.com:3000/fixtures


## Puntos logrados o no logrados y comentarios si son necesarios para cada aspecto a evaluar en la Parte mínima y en la Parte variable.

- Requisitos Funcionales: (10/10) 

RF1: Logrado

RF2: Logrado

RF3: Logrado

RF4: Logrado

- Requisitos no Funcionales (20/20)

RNF1: Logrado

RNF2: Logrado

RNF3: Logrado (com)

RNF4: Logrado

RNF5: Logrado

RNF6: Logrado

- Docker compose (15/15)

RNF1: Logrado

RNF2: Logrado

RNF3: Logrado

- Variable

- HTTPS(15/15)

RNF1: Logrado

RNF2: Logrado

RNF3: Logrado

- Balanceo de Carga con Nginx (15/15)

RF1: Logrado

RF2: logrado

*** Puntaje total estimado (75/60) ***

Se buscan hacer todas las funciones extras, se hace un networking entre las app1 y app2, con bridge. En la consola de EC2 AWS, se puede evidenciar la relación con localhost:3001 y localhost:3002 para hacer dos contenedores. 


María Olga Barriga

