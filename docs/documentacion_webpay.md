## Integración de Webpay

Para poder integrar webpay a nuestra aplicación, el primero paso es instalar la librería `'transbank-sdk'` en las dependencias del proyecto.

En nuestro caso particular, creamos dos servicios para manejar el sistema de pago de webpay: TransactionService y WebpayService.

A través de WebpayService mandamos las solicitudes HTTP a webpay. En este servicio utilizamos dos endpoints provistos por webpay, el `create` y el `commit`.

Por otro lado, utilizamos Transaction para almacenar la información correspondiente a cada compra para uso propio dentro de la aplicación, reuniendo tanto la información obtenida desde webpay como desde el front o la base de datos.

El roadmap que se siguió fue:

1. Crear ambos servicios. Dentro de WebpayService, crear una transacción y métodos para mandar solicitudes HTTP a Webpay.

2. Agregar la opción de pagar con Webpay en la UI, y gatillar un post al modelo transacción junto a su elección.

3. Dentro de la creación de una transacción, se utiliza la función que crea una transacción en nuestro WebpayService. A esta se le entrega la sessionId y el url de retorno final, donde el usuario sera redirigido luego del pago. Como respuesta obtenemos el url de redirección de webpay y el token de la transacción.

4. Se entrega la información obtenida al front, para luego mostrarle un formulario al usuario de confirmación de pago, donde nos encargamos de realizar un POST al url entregado por webpay en el paso anterior, con el atributo del token escondido. En este punto el usuario es redirigido a webpay y realiza el pago de manera normal.

5. Una vez redirigdo el usuario a nuestro url de redirección, webpay nos entrega un token_ws como query param en la url. Nosotros obtenemos dicho token, para luego entregarlo al back de la aplicación, y realizar una  solicitud HTTP al endpoint commit de webpay. Esto nos entregará información sobre el resultado de la transacción, entre esto su status y response_code.

6. Desde transaction leemos y trabajamos la respuesta de webpay, para actualizar nuestra transacción y devolverle la respuesta al front.

7. El front muestra el componente correspondiente, dependiendo si la transacción fue aprobada con éxito o no.