# VK MAILER
Este servicio permite enviar correos.

## Set Up

Para usar correos de Gmail hay que activar esta opción en la configuración de la cuenta de Google.
https://www.google.com/settings/security/lesssecureapps

### Variables de entorno
```
AMQP_URL=amqp://localhost
AMQP_QUEUE=vk_mailer_queue
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_SECURE=false
MAIL_SERVICE=Gmail
MAIL_AUTH_USER=tucorreo@gmail.com
MAIL_AUTH_PASS=tucontraseña
```
### Instalar  
`npm i`

## Docs

### Comandos

#### Levantar producción
`npm start`

#### Levantar dev
`npm run dev`

### Enviar un correo desde otro servicio
Hay que conectarse a una cola de rabbitMQ y enviar los datos del correo.
Son necesarios los parámetros from, to, subject, text y html, este objeto se transforma a texto antes de enviar.

```js
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) { // Misma ruta que en AMQP_URL
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const toSend = {
          from: '"Fred Foo 👻" <foo@example.com>',
          to: "tuemail@gmail.com",
          subject: "Hello ✔ again",
          text: "Hello world? yea",
          html: "<b>Hello world?</b>",
        };

        var queue = 'vk_mailer_queue'; // Nombre de la cola que "AMQP_QUEUE" que hay en las variables de entorno
        var msg = JSON.stringify(toSend);

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
```
## Stack
- Node
- nodemailer
- rabbitMQ
