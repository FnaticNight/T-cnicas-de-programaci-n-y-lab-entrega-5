# Cliente Web — Rutas Turísticas (AngularJS)

Aplicativo web cliente (Parte 2 del examen) que consume la API REST de Spring Boot
ya existente. Hecho con **HTML + CSS + AngularJS (1.x)** y **Leaflet** para el mapa.

## Dónde colocar los archivos

El contenido de la carpeta `static/` va dentro del proyecto Spring Boot en:

```
src/main/resources/static/
```

Es decir, al final el árbol queda así:

```
src/main/resources/static/
├── index.html
├── css/
│   └── estilos.css
└── js/
    ├── app.js
    ├── servicios/
    │   ├── ciudadServicio.js
    │   ├── tipoServicio.js
    │   ├── rutaServicio.js
    │   └── paradaServicio.js
    ├── directivas/
    │   └── mapaParadas.js
    └── controladores/
        └── rutasControlador.js
```

Como Spring Boot sirve automáticamente lo que esté en `static/`, basta con:

1. Levantar la base de datos PostgreSQL y correr `DDL_RutasTuristicas.sql` y `DML_RutasTuristicas.sql`.
2. Ejecutar la API (`mvn spring-boot:run` o desde el IDE).
3. Abrir en el navegador: **http://localhost:8080/**

## Estructura del código (capas, igual que el backend)

- `servicios/` → encapsulan las llamadas `$http` a la API (una por entidad).
- `controladores/` → `RutasControlador` orquesta el flujo Ciudad → Ruta → Parada.
- `directivas/` → `mapaParadas` dibuja las paradas sobre el mapa Leaflet.
- `css/` → estilos.

## Funcionalidades (según el enunciado)

- Lista las **ciudades** y permite seleccionar una.
- Lista las **rutas** de la ciudad seleccionada.
- Agregar / modificar / eliminar **rutas** de esa ciudad.
- Al seleccionar una ruta, lista sus **paradas** ordenadas por el campo `orden`.
- Agregar / modificar / eliminar **paradas** de la ruta seleccionada.
- Mapa con las paradas (marcadores + línea en orden).

## Notas técnicas

- La URL base de la API se define en `js/app.js` (`API_URL`). Por defecto apunta a
  `http://localhost:8080/api`. Cámbiela si la API corre en otro host/puerto.
- Los endpoints de colección de la API usan **slash final** (`/api/rutas/`,
  `/api/paradas/`), tal como están definidos en los controladores; los servicios ya
  lo respetan.
- Si prefiere servir el cliente por separado (p. ej. Live Server en otro puerto),
  funciona igual gracias a que los controladores tienen `@CrossOrigin(origins = "*")`.
- Para agregar/modificar una ruta se envía `{ ..., ciudad: { id }, tipo: { id } }` y
  para una parada `{ ..., ruta: { id } }`, que es la forma que esperan las entidades JPA.
