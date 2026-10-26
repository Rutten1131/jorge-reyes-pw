# Skill: Focal Point & Art Direction Responsive (Heros, Divs y Cards)

Guía completa para asegurar que cualquier imagen en contenedores fijos o fluidos (`div` con `background-image` o `<picture>` / `<img>` en Heros y Cards) mantenga el foco del sujeto sin recortes no deseados ni deformaciones.

---

## 1. El Problema Común
- **Recorte ciego:** Al usar `background-size: cover` u `object-fit: cover`, el navegador por defecto recorta desde el centro geométrico (`center center`). En retratos suele cortar la frente o la cabeza; en productos suele cortar el producto si está desfasado.
- **Deformación:** `width: 100%; height: 100%` sin `object-fit` aplasta o estira las fotos.
- **Falta de Art Direction:** Una imagen horizontal 16:9 en móvil vertical 9:16 pierde totalmente el contexto a menos que se use una variante vertical o un ajuste focal agresivo.

---

## 2. Los 3 Patrones Principales

### Patrón A: `<div>` con `background-image` (Paneles, Cards, Acordeones)
Ideal para divs que llevan capas de degradado, texto encima o efectos hover.

#### CSS Base y Override Móvil:
```css
/* Base Desktop */
.card-panel {
  background-size: cover;
  background-repeat: no-repeat;
  /* Si no hay variable definida, usa center 20% como fallback seguro para retratos */
  background-position: var(--focal, center 20%);
  transition: background-position 0.3s ease;
}

/* Override responsive en móvil */
@media (max-width: 768px) {
  .card-panel {
    background-position: var(--focal-mobile, var(--focal, center 20%));
  }
}
```

#### En JSX / React:
```tsx
<div
  className="card-panel"
  style={{
    backgroundImage: `url('/foto-servicio.webp')`,
    "--focal": "center 25%",        // Sujeto protegido en PC
    "--focal-mobile": "center 18%", // Sujeto protegido en móvil vertical
  } as React.CSSProperties}
>
  <div className="card-panel__content">
    <h3>Título del Servicio</h3>
  </div>
</div>
```

---

### Patrón B: Hero Principal con `<picture>` + `<img>` (*Art Direction*)
Estándar utilizado en e-commerce líderes (estilo GMO) para heros donde la versión móvil puede ser una imagen vertical diferente o recortada.

#### En JSX / React:
```tsx
<picture className="hero-picture">
  {mobileImage && (
    <source
      media="(max-width: 768px)"
      srcSet={mobileImage}
    />
  )}
  <img
    src={desktopImage}
    alt={imageAlt}
    className="hero-img"
    style={{
      "--focal-desktop": focalDesktop || "center 25%",
      "--focal-mobile": focalMobile || focalDesktop || "center 22%",
    } as React.CSSProperties}
    loading="eager"
  />
</picture>
```

#### En CSS:
```css
.hero-picture {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: var(--focal-desktop, center 25%);
  display: block;
}

@media (max-width: 768px) {
  .hero-img {
    object-position: var(--focal-mobile, center 22%);
  }
}
```

---

### Patrón C: Altura Fluida sin Saltos (`clamp()`)
Evita saltos visuales o que el Hero colapse o quede excesivamente alto al redimensionar:

```css
.hero-wrapper {
  /* Desktop: mínimo 380px, ideal 44vw, máximo 560px */
  height: clamp(380px, 44vw, 560px);
  position: relative;
  overflow: hidden;
}

@media (max-width: 640px) {
  .hero-wrapper {
    /* Móvil: más altura vertical para dejar respirar el contenido sobre la foto */
    height: clamp(490px, 115vw, 600px);
  }
}
```

---

## 3. Calibrador de Puntos Focales (`--focal`)

| Valor | Elemento que Protege |
|---|---|
| `center 0%` o `center top` | Logos superiores, cielo, bordes superiores. |
| `center 18%` a `center 25%` | **Personas / Retratos (Estándar de Oro):** Rostro y hombros quedan siempre protegidos del corte. |
| `center 30%` a `center 40%` | Planos medios o torso. |
| `center 50%` | Centro geométrico (fondos simétricos o abstractos). |
| `center 70%` a `center 80%` | Manos manipulando objetos, mesas, equipos en la parte inferior. |
| `left 20%` o `right 20%` | Sujeto ubicado en el tercio lateral de la fotografía. |

### Cómo calibrar en DevTools:
- **Subir el %** (ej. de 25% a 35%): Muestra más de la parte **inferior**.
- **Bajar el %** (ej. de 25% a 15%): Muestra más de la parte **superior** (rostros).

---

## 4. Estándar de Tamaños y Formatos WebP

| Tipo de Componente | Relación de Aspecto | Tamaño Desktop | Tamaño Móvil | Peso Máximo WebP |
|---|---|---|---|---|
| **Hero Full-width** | 16:9 o 21:9 | 1920 × 760 px | 750 × 940 px | < 180 KB / < 110 KB |
| **Card Cuadrada** | 1:1 | 600 × 600 px | 400 × 400 px | < 80 KB |
| **Banner de Sección** | 21:9 | 1440 × 560 px | 750 × 500 px | < 130 KB |
| **Panel / Card Vertical** | 3:4 o 4:5 | 400 × 500 px | 350 × 450 px | < 85 KB |
