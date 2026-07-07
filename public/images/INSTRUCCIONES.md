# Guía de Implementación de Favicon

Para que Google y todos los navegadores (Chrome, Safari, Firefox) muestren correctamente tu imagen como favicon, sigue estos pasos:

## 1. Sube los archivos
Sube todos los archivos generados a la **carpeta raíz** de tu dominio (ejemplo: `https://tudominio.com/`).

## 2. Agrega este código a tu HTML
Copia y pega el siguiente código dentro de la etiqueta `<head>` de tu página web (en todas las páginas si es posible):

```html
<!-- Favicon estándar para la mayoría de los navegadores -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Tamaño recomendado específicamente por Google -->
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">

<!-- Icono para dispositivos Apple (iPhone/iPad) -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Iconos para Android/Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
```

## Recomendaciones de Google para Favicons:
1. **Accesibilidad:** El archivo debe ser accesible para el robot de Google (Googlebot). No lo bloquees en tu `robots.txt`.
2. **Representación:** Google prefiere que el favicon represente visualmente tu marca para que los usuarios lo identifiquen rápido en los resultados de búsqueda.
3. **Tamaño:** Google requiere que el favicon sea un múltiplo de 48px (por eso incluimos el de 48x48px).

---
*Generado automáticamente para Jorge.*
