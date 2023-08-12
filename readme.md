Para configurar el servidor, se debe tener primero instalado express y node
luego de esto levantar la app con el comando

node app.js

estara escuchando al puerto 8080

Una vez levantado el servidor, en postman, configuramos las diferentes consultas de cada endpoint
Sea el metodo que fuere, GET / POST / PUT / DELETE, definimos la URL del servidor, que en este caso es:
http://localhost:8080/

Y dependiendo si apuntamos a carrito:
http://localhost:8080/api/carts

o a products:
http://localhost:8080/api/products

Primero en la seccion de Headers tenemos que agregar uno nuevo a la tabla, siendo este

Key = Content-Type
Value= application/json

Para finalizar, agregamos en el body, la solicitud correspondiente, siendo este el caso necesarias para los endpoint POST y PUT 
Los endpoint GET y DELETE no necesitan de body estrictamente, pero si de una URL en especifico que apunte al atributo necesario siendo este el parametro al cual se hara referencia en el codigo