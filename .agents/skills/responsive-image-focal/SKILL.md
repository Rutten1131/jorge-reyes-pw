---
name: responsive-image-focal
description: >-
  Técnica profesional de Focal Point y Art Direction para Heros, Banners, Cards y divs con
  background-image o <picture>/<img>. Evita cortes indeseados de rostros, productos y textos
  tanto en desktop como en responsive móvil usando variables CSS dinámicas y clamp().
---

# Skill: Focal Point & Art Direction Responsive (Heros, Divs y Cards)

Esta guía define el estándar de implementación para que cualquier componente con imágenes dentro de contenedores de tamaño fijo o fluido (`div` con `background-image` o etiquetas `<picture>` / `<img>`) mantenga siempre enfocado el sujeto principal (rostros, productos, equipos) sin deformación ni recortes accidentales en móvil y desktop.

---

## 1. El Problema de Fondo

Cuando el contenedor tiene una relación de aspecto distinta a la imagen original (ej. imagen 16:9 mostrada en una pantalla móvil 9:16 o en un banner 21:9):
- **Corte por defecto (`center center`):** Corta cabezas, frentes, productos o texto clave.
- **Deformación:** `width: 100%; height: 100%` sin `object-fit` aplasta o estira las fotos.
- **Pesadez móvil:** Cargar imágenes panorámicas gigantes de 2000px en celulares degrada el rendimiento.

---

## 2. Los 3 Patrones de Implementación

### Patrón A: `<div>` con `background-image` (Paneles, Cards, Acordeones)
Ideal para divs interactivos que llevan contenido superpuesto, efectos hover o blur.

#### 1. CSS Base y Override Móvil
```css
/* Base desktop */
.mi-panel-div {
  background-size: cover;
  background-repeat: no-repeat;
  /* Si no se declara variable en inline style, usa center 20% como default seguro */
  background-position: var(--focal, center 20%);
  transition: background-position 0.3s ease;
}

/* Override responsive en móvil */
@media (max-width: 768px) {
  .mi-panel-div {
    background-position: var(--focal-mobile, var(--focal, center 20%));
  }
}
```

#### 2. Uso en JSX / React
```tsx
<div
  className="mi-panel-div"
  style={{
    backgroundImage: `url('/foto-consulta.webp')`,
    "--focal": "center 25%",        // Sujeto protegido en PC
    "--focal-mobile": "center 18%", // Sujeto protegido en pantalla vertical
  } as React.CSSProperties}
>
  <div className="overlay-content">
    <h3>Título del Servicio</h3>
  </div>
</div>
```

---

### Patrón B: Hero Principal con `<picture>` + `<img>` (*Art Direction*)
Estándar premium (estilo e-commerce GMO) para heros principales o sliders donde la versión móvil puede ser una imagen vertical diferente o recortada.

#### 1. JSX / HTML
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
    loading="eager" // o "lazy" para imágenes secundarias
  />
</picture>
```

#### 2. CSS
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
Garantiza proporciones estéticas en cualquier resolución:

```css
.hero-wrapper {
  /* Desktop: mínimo 380px, ideal 44vw, tope 560px */
  height: clamp(380px, 44vw, 560px);
  position: relative;
  overflow: hidden;
}

@media (max-width: 640px) {
  .hero-wrapper {
    /* Móvil: más altura vertical para dar cabida a títulos/botones sin tapar el rostro */
    height: clamp(490px, 115vw, 600px);
  }
}
```

---

## 3. Calibrador de Puntos Focales (`--focal`)

| Valor | Elemento que Protege |
|---|---|
| `center 0%` o `center top` | Cielo, techos, logos o elementos en el borde superior. |
| `center 18%` a `center 25%` | **Personas (Regla de oro):** Protege cabeza, ojos y hombros. |
| `center 30%` a `center 40%` | Retratos de plano medio o torso. |
| `center 50%` | Centro geométrico (para texturas simétricas o fondos abstractos). |
| `center 70%` a `center 80%` | Manos manipulando productos, mesas, equipos en la parte inferior. |
| `left 20%` o `right 20%` | Sujeto ubicado en tercio lateral de la fotografía. |

### Guía para calibrar visualmente en DevTools:
- **Subir el %** (ej. de 25% a 35%): Baja el corte de la imagen (muestra más de la parte inferior).
- **Bajar el %** (ej. de 25% a 15%): Sube el corte de la imagen (muestra más de la parte superior).

---

## 4. Estándar de Tamaños y Formatos WebP

| Tipo de Componente | Relación de Aspecto | Tamaño Desktop | Tamaño Móvil | Peso Tope (WebP) |
|---|---|---|---|---|
| **Hero Full-width** | 16:9 o 21:9 | 1920 × 760 px | 750 × 940 px | < 180 KB / < 110 KB |
| **Card Cuadrada** | 1:1 | 600 × 600 px | 400 × 400 px | < 80 KB |
| **Banner Sección** | 21:9 | 1440 × 560 px | 750 × 500 px | < 130 KB |
| **Panel / Card Vertical** | 3:4 o 4:5 | 400 × 500 px | 350 × 450 px | < 85 KB |

---

## 5. Checklist de Verificación
1. [ ] ¿La imagen tiene `background-size: cover` u `object-fit: cover`?
2. [ ] ¿Se definió un punto focal explícito (`--focal` / `object-position`) en lugar del default geométrico?
3. [ ] ¿Se verificó en móvil vertical (375px a 430px de ancho) que los rostros o productos no estén cortados?
4. [ ] ¿La imagen está en formato `.webp` con compresión optimizada?
