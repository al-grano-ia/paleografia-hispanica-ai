# Paleografía Hispánica AI

Entorno de trabajo web para la **transcripción paleográfica asistida por IA multimodal** de
manuscritos hispánicos de la Edad Moderna (siglos XV–XVIII), con especial atención a los fondos
del Archivo General de Indias (AGI), el Archivo General de Simancas (AGS) y el Archivo Histórico
Nacional (AHN).

Proyecto experimental de **AL Grano IA**, publicado como *case study* técnico.

---

## El problema

Leer un documento en escritura **cortesana**, **procesal**, **procesal encadenada** o
**humanística** no es solo cuestión de descifrar trazos: exige desplegar abreviaturas, reconocer
fórmulas cancillerescas y situar el documento en su contexto archivístico. Es un trabajo lento,
altamente especializado y difícil de escalar cuando hay miles de folios digitalizados esperando.

Paleografía Hispánica AI no sustituye a esa competencia: la **acelera**. Produce un primer
borrador estructurado —transcripción literal, versión normalizada, listado de abreviaturas y
cotejo línea a línea— que la persona experta revisa, corrige y valida dentro de la propia
aplicación.

---

## Cómo funciona

```
Escaneo del manuscrito (JPEG / PNG / WebP)
        │
        ▼
Frontend React  ──POST /api/paleography/analyze──►  Servidor Express
                                                          │
                                    GEMINI_API_KEY (solo servidor)
                                                          ▼
                                              Google Gemini (multimodal)
                                                          │
                                                  Respuesta JSON
                                                          ▼
        Área de trabajo: transcripción literal · versión normalizada ·
        metadatos archivísticos · abreviaturas · cotejo línea a línea
                                                          │
                                                          ▼
                                      Revisión humana → edición → exportación
```

La imagen se envía en base64 al backend, que es **el único punto del sistema que conoce la clave
de Gemini**. El navegador nunca ve la credencial.

---

## Funcionalidades

- **Análisis paleográfico multimodal.** Subida de un escaneo y generación de un estudio completo
  mediante Gemini, con instrucciones personalizables por documento.
- **Transcripción literal.** Respeta grafías, mayúsculas y saltos de línea originales, y despliega
  las abreviaturas entre corchetes (`d[ic]ho`, `S[u] M[ajes]tad`, `n[uest]ros`), con marcas
  `[ilegible]` y `[dudoso: lectura]`.
- **Versión normalizada.** Ortografía, puntuación y acentuación actuales según norma RAE, para
  lectura e interpretación inmediatas.
- **Cotejo línea a línea.** Cada renglón enfrenta literal y normalizado con notas de lectura, y
  queda sincronizado con el visor de la imagen.
- **Metadatos archivísticos.** Periodo estimado, tipología de escritura, archivo probable y
  contexto histórico sintético.
- **Diccionario paleográfico.** Repertorio consultable de abreviaturas y fórmulas de la
  administración hispánica, clasificado por categoría y periodo.
- **Guía de escrituras y archivos.** Referencia rápida de tipologías gráficas y fondos.
- **Edición manual.** Toda transcripción generada es editable: el resultado final es siempre el
  que valida la persona usuaria.
- **Exportación.** Descarga en Markdown (`.md`) y texto plano (`.txt`), o copia al portapapeles.

---

## Formatos soportados

| | |
|---|---|
| **Entrada (imágenes)** | JPEG, PNG, WebP — formato y tamaño validados en cliente y servidor |
| **Tamaño máximo por imagen** | 20 MB por escaneo |
| **Salida** | Markdown (`.md`), texto plano (`.txt`), copia al portapapeles |

PDF y TIFF **no** están soportados: conviértelos previamente a JPEG o PNG.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4, lucide-react, motion |
| Build / dev server | Vite 6 |
| Backend | Node.js + Express 4 (TypeScript, ejecutado con `tsx`) |
| IA | Google Gemini vía `@google/genai` (llamada server-side) |
| Bundling de producción | `vite build` + `esbuild` |
| Tests | Test runner nativo de Node (`node:test`) |

---

## Arquitectura

```
paleografia-hispanica-ai/
├── server.ts                 Express + único endpoint de IA + Vite en modo middleware
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx              Punto de entrada React
│   ├── App.tsx               Layout y estado de la sesión de trabajo
│   ├── types.ts              Modelo de dominio (documento, línea, abreviatura, metadatos)
│   ├── components/
│   │   ├── Header.tsx                 Navegación y selector de documento
│   │   ├── DocumentViewer.tsx         Visor del escaneo con zoom y selección de renglón
│   │   ├── TranscriptionPanel.tsx     Literal / normalizada / línea a línea / metadatos
│   │   ├── AiAnalysisModal.tsx        Subida de imagen y ejecución del análisis
│   │   ├── PaleographicDictionary.tsx Repertorio de abreviaturas
│   │   ├── ArchivalGuideModal.tsx     Guía de escrituras y archivos
│   │   └── ExportModal.tsx            Exportación del estudio
│   └── data/
│       ├── sampleManuscripts.ts       Documentos de demostración
│       └── paleographicDictionary.ts  Corpus de abreviaturas
└── tests/
    └── server.paleography-analyze.test.ts
```

Un único servidor Express sirve tanto la aplicación (Vite en desarrollo, estáticos en producción)
como la API. Solo existe un endpoint:

```
POST /api/paleography/analyze
  { imageBase64, mimeType, customPrompt? }  →  { literalTranscription, normalizedVersion,
                                                 archivalMetadata, abbreviationsList, lineByLine }
```

---

## Instalación y ejecución local

**Requisitos:** Node.js 20 o superior.

```bash
git clone https://github.com/al-grano-ia/paleografia-hispanica-ai.git
```

```bash
cd paleografia-hispanica-ai && npm install
```

### Configurar `GEMINI_API_KEY`

1. Obtén una clave en [Google AI Studio](https://aistudio.google.com/apikey).
2. Copia el fichero de ejemplo:

```bash
cp .env.example .env
```

3. Edita `.env` y sustituye el placeholder por tu clave real:

```
GEMINI_API_KEY=tu_clave_real
```

`.env` está ignorado por Git. **La clave se usa exclusivamente en el servidor**: no la copies al
código del frontend, al README, a los tests ni a ninguna variable `VITE_*`, porque cualquier
variable `VITE_*` acaba incrustada en el bundle que descarga el navegador.

### Arrancar en desarrollo

```bash
npm run dev
```

Disponible en `http://localhost:3000`.

### Compilar y ejecutar en producción

```bash
npm run build && npm start
```

---

## Lint, tipos y tests

Comprobación de tipos (hace las veces de lint del proyecto):

```bash
npm run lint
```

Suite de tests del endpoint de análisis (validación de entrada y paso de parámetros a Gemini,
con el cliente mockeado — no consume cuota de la API):

```bash
npm test
```

---

## Estado del proyecto

**Experimental / prueba de concepto.** Funcional de extremo a extremo y con tests sobre el
endpoint de análisis, pero pensado como demostración técnica y didáctica, no como producto de
producción.

Pendiente antes de un despliegue público:

- Rate limiting y control de abuso en `/api/paleography/analyze` (hoy el endpoint es abierto).
- Persistencia: el trabajo vive en memoria del navegador y se pierde al recargar.
- Sustituir las imágenes de demostración por escaneos con procedencia y licencia verificadas.

---

## ⚠️ Advertencia importante

- Este es un proyecto **experimental y educativo**.
- Las transcripciones se generan mediante **inteligencia artificial y pueden contener errores**:
  lecturas incorrectas, abreviaturas mal desplegadas, fechas o nombres erróneos y metadatos
  archivísticos inexactos o inventados.
- Todo resultado **debe ser revisado y validado por una persona con competencia paleográfica**
  antes de ser utilizado o citado.
- Lo que produce esta aplicación **no constituye una transcripción paleográfica ni una atribución
  archivística certificada**, y no debe presentarse como tal en trabajos académicos, jurídicos o
  patrimoniales.
- No subas documentación con datos personales o sujeta a restricciones de acceso: las imágenes se
  envían a la API de Google Gemini para su procesamiento.

---

## Licencia

Este repositorio **aún no tiene licencia asignada**. Mientras no se añada un fichero `LICENSE`, se
aplican por defecto los derechos de autor reservados: el código puede consultarse, pero no existe
concesión de uso, modificación ni redistribución.

## Créditos

Desarrollado por **AL Grano IA**.
