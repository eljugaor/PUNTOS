Demo Node + Express

Pequeña demo que sirve la página estática y provee varios endpoints para probar desde el frontend.

Features añadidas (10):

- /ping (GET) — respuesta JSON simple
- /api/mensaje (GET) — mensaje con fecha
- /api/time (GET) — hora del servidor
- /api/random (GET) — número aleatorio y cita
- /api/visits (GET) — contador de visitas (persistente en visits.json)
- /api/visits/reset (POST) — reset contador visitas
- /api/echo (POST) — devuelve el cuerpo enviado
- /api/headers (GET) — muestra headers que envía el cliente
- /download (GET) — descarga un archivo de texto generado
- /sse (GET) — Server-Sent Events que envía la hora cada segundo

Ejecutar:

1. Abrir terminal en la carpeta del proyecto
2. Instalar dependencias:

```pwsh
npm install
```

3. Iniciar servidor:

```pwsh
npm start
```

4. Abrir http://localhost:3000/
