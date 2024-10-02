## Consideraciones generales

Para correr api nestjs, hay que dirigirse a ./app y usar el comando npm run start

Con npm install se descargan las dependencias necesarias para correr el proyecto.

Para correr mqtt, hay que dirigirse a ./mqtt-service y usar el comando node mqtt-service

Para partir la base de datos, hay que dirigirse a ./app y usar el comando mongod

Se usa Nestjs, Typescript, MongoDB Atlas y MQTT broker, para correr esta aplicación.


Todo se levanta junto con docker compose, basta con correrlo desde la carpeta e0-olguitab-master, y se suben los contenedores al mismo tiempo con docker compose up --build

## Nombre del dominio del backend
https://olguitabarriga.me

## Método de acceso al servidor con archivo .pem y ssh 

ssh -i "olguitakey.pem" ubuntu@ec2-3-14-1-216.us-east-2.compute.amazonaws.com

http://ec2-3-14-1-216.us-east-2.compute.amazonaws.com:3000/fixtures



En local al haber hecho el load balancer de nginx, los servidores locales del backend corren en el puerto 3001 y 3002.

