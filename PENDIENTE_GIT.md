# Pendiente antes de subir a Git

## Estado: LISTO PARA DESARROLLO
El código está funcional. Los siguientes items son mejoras opcionales o preparativos para producción.

---

## Tareas Completadas ✅

- [x] CMS Admin en `/admin` — crear, editar, eliminar artículos MDX
- [x] API routes `/api/posts` y `/api/posts/[slug]` — CRUD completo
- [x] Frontmatter SEO fields: metaTitle, metaDescription, seoKeywords, ogImage
- [x] Schema.org Article JSON-LD por artículo
- [x] Schema.org Person + Organization + LocalBusiness en layout global
- [x] OpenGraph y Twitter Cards por artículo
- [x] Sitemap básico (sin blog posts dinámicos — agregar cuando haya auth)

---

## Limpieza Requerida 🧹

**Antes de subir a git:**

1. **Eliminar `.next/`** — cache de build, no subir
2. **Eliminar `node_modules/`** — no sube a git (debería estar en .gitignore)
3. **Verificar `page_temp.tsx`** — si existe en `src/app/blog/[slug]/`, eliminarlo

---

## Errores de Lint (No Bloquean)

Los siguientes errores existen pero **no impiden el build ni el funcionamiento**:

### Entidades HTML sin escapar
Archivos con comillas sin escapar (`"` por `&quot;`):

- `src/app/blog/page.tsx` (líneas 39, 67, 163)
- `src/app/page.tsx` (líneas 67, 163)
- `src/components/Footer.tsx` (línea 28)
- `src/components/HeroSlider.tsx` (línea 155)
- `src/components/ShortsSlider.tsx` (líneas 55 — uso de `any`)
- `src/components/blog/BlogClient.tsx` (línea 104)
- `src/components/plan-2026/HeroPlan.tsx` (línea 43)
- `src/components/plan-2026/PlanBlock.tsx` (línea 97)
- `src/components/plan-2026/PlanFinalCTA.tsx` (línea 38)
- `src/components/sobre-jorge/AcademicSection.tsx` (línea 47)
- `src/components/sobre-jorge/FamilyOrigin.tsx` (línea 43)
- `src/components/sobre-jorge/HeroJorge.tsx` (línea 58)
- `src/components/sobre-jorge/MoralSeal.tsx` (líneas 45, 73)
- `src/components/sobre-jorge/ObrasSection.tsx` (línea 54)

### Variables No Usadas (Warnings)
- `Counter.tsx` — `useState` no usado
- `HeroSlider.tsx` — `direction` no usado
- `ShortsSlider.tsx` — `absDiff`, `velocity` no usados
- `AdminPostEditor.tsx` — `useCallback` no usado

### Otros
- `ShortsSlider.tsx:94` — usar `<Image>` en vez de `<img>`
- `BlogClient.tsx` — tipo `any` en línea 17

---

## Para Activar Después 🔐

### Auth en Admin
El panel `/admin` no tiene contraseña. Para activar:

1. Crear `.env.local` con:
   ```
   ADMIN_PASSWORD=tu-contraseña-segura
   ```

2. Descomentar y ajustar el middleware de auth en `src/middleware.ts` (crear si no existe)

3. Proteger todas las rutas `/admin/*` y `/api/posts/*`

### Analytics
- Crear cuenta en Google Analytics 4
- Agregar Measurement ID al layout

### Base de Datos (Opcional)
El CMS usa filesystem (MDX). Para escalar:
- Migrar a Supabase/PostgreSQL
- Actualizar `src/lib/blog.ts` para usar DB en vez de fs

---

## Deploy Checklist 🚀

- [ ] Limpiar `.next/` y `node_modules/`
- [ ] Configurar `ADMIN_PASSWORD` en Variables de Entorno del hosting
- [ ] Agregar dominio en `metadataBase` de `layout.tsx` si cambia
- [ ] Configurar Google Analytics
- [ ] Generar sitemap dinámico (ver `src/app/sitemap.ts`)
- [ ] Probar HTTPS
- [ ] Configurar redirects de www a no-www (o viceversa)

---

## Contacto y Soporte

Para dudas sobre el código, revisar:
- `AGENTS.md` — instrucciones generales
- `CLAUDE.md` — referencias
- Comentarios en cada archivo de componentes