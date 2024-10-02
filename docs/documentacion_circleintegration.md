## Pipeline de Circle Integration

Como grupo decidimos utilizar GitHub Actions como proveedor para implementar el pipeline de CI.

Los pasos que esté sigue se pueden encontrar a nivel de programa en el archivo ```ci.yml``` dentro de la carpeta ```.github/workflows```. Para esto, tuvimos que en primer lugar crear dicho archivo en la la carpeta mencionada, en la raíz del repositorio.

Luego, se debe crear el contenido del archivo ```.yml```. En nuestro caso, está configurado para activarse al realizar push o pull request a alguna de las ramas ```main``` o ```develop``` del repositorio.

Creamos dos trabajos distintos. El primero es el encargado de correr linter en el proyecto, y el segundo de correr un test trivial a modo de prueba para el futuro. Ambos trabajos comparten los pasos iniciales, que son:

- Clonar el repositorio
- Configurar Node.js
- Instalar las dependencias del proyecto

Luego, cada uno corre el comando específico para ejecutar linter (```npm run lint```) y ejecutar el test de prueba (```npm run test -- --findRelatedTests src/app.service.spec.ts```) respectivamente. 

Cabe mencionar que por la disposición de nuestro proyecto en el repositorio, es necesario navegar hasta el directorio adecuado de ejecución de los comandos en consola, es por esto que se agrega la indicación ```cd e0-olguitab-master``` a ciertos pasos de los trabajos.

Las dependencias necesarias para que esto pueda ejecutarse sin problemas son ESLint
```
npm install --save-dev eslint
```
y Jest para los tests
```
npm install --save-dev jest @nestjs/testing ts-jest @types/jest
```
Además de Node.js y sus diferentes módulos.

Si se corrieran los comandos expuestos a modo local desde el directorio ```cd e0-olguitab-master``` se podría simular la pipeline que sigue nuestro proyecto al ser activado.