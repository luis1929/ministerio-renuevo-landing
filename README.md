# Ministerio El Renuevo — Landing Page

Plataforma institucional del **Ministerio El Renuevo**. Portal de fe, esperanza y transformación con sistema de registro de miembros, blog, agenda de servicios, chat con IA local y panel de comunicaciones.

---

## Arquitectura de Entornos

```
                    ┌─────────────────────────────────────┐
                    │          Cloudflare (DNS + SSL)      │
                    │   Full (Strict) · www → apex redirect│
                    └──────┬──────────────────┬────────────┘
                           │                  │
              ┌────────────▼──────┐  ┌────────▼───────────┐
              │   PRODUCCIÓN      │  │   DESARROLLO        │
              │   Vercel          │  │   Cloudflare Tunnel │
              │   (Edge Network)  │  │   → localhost:5173  │
              │                   │  │                     │
              │   https://www.    │  │   https://dev.      │
              │   envivoministerio│  │   envivoministerio  │
              │   elrenuevo.org   │  │   elrenuevo.org     │
              └───────────────────┘  └─────────────────────┘
```

| Entorno   | Dominio                                | Hosting           | SSL                           |
|-----------|----------------------------------------|-------------------|-------------------------------|
| Producción| `https://www.envivoministerioelrenuevo.org` | Vercel        | Cloudflare Full (Strict)      |
| Desarrollo| `https://dev.envivoministerioelrenuevo.org` | Cloudflare Tunnel → WSL | Automático (Tunnel) |

---

## Guía de inicio rápido

### Prerrequisitos

```bash
node >= 18            # node --version
npm  >= 10            # npm --version
cloudflared           # which cloudflared
Ollama (opcional)     # para el agente de chat local
```

### Instalación

```bash
git clone <repo-url> ministerio-renuevo-landing
cd ministerio-renuevo-landing

cp .env.example .env.local    # editar con tus credenciales
npm install
```

### Encendido del entorno local

```bash
# 1. Iniciar el servidor de desarrollo Next.js (puerto 5173)
npm run dev -- --port 5173

# 2. En otra terminal, iniciar el túnel Cloudflare
cloudflared tunnel run ministerio-renuevo-dev

# 3. Abrir en el navegador
#    https://dev.envivoministerioelrenuevo.org
```

> **Nota:** El túnel `ministerio-renuevo-dev` apunta a `http://localhost:5173`. Si usas otro puerto, actualiza `~/.cloudflared/config.yml`.

---

## Variables de Entorno

Crear un archivo `.env.local` en la raíz:

```bash
# ──────────────────────────────────────────────
# Supabase — Base de datos principal
# ──────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://ejxatamhznvwfhjrlcni.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# ──────────────────────────────────────────────
# Telegram — Notificaciones del orquestador Hermes
# ──────────────────────────────────────────────
TELEGRAM_BOT_TOKEN=1234567890:AAHdqTcvCH1vGWJxfSeOfS...
TELEGRAM_CHAT_ID=-1001234567890

# ──────────────────────────────────────────────
# Ollama — Modelo local para el agente "Anfitrión"
# ──────────────────────────────────────────────
OLLAMA_URL=http://localhost:11434
OLLAMA_ANFITRION_MODEL=qwen2.5:1.5b
```

### Mapa de variables vs. uso

| Variable | Dónde se usa | ¿Requerida? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `lib/supabase-server.ts` | ✅ Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts`, `lib/supabase-server.ts` | ✅ Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/fieles/`, `/api/registraciones/`, `/api/comunicaciones/` | ✅ Sí |
| `TELEGRAM_BOT_TOKEN` | `lib/telegram.ts` (notifica nuevos miembros, alertas CPU) | ❌ Opcional |
| `TELEGRAM_CHAT_ID` | `lib/telegram.ts` | ❌ Opcional |
| `OLLAMA_URL` | `hermes/agents/anfitrion.ts` (default: `http://localhost:11434`) | ❌ Opcional |
| `OLLAMA_ANFITRION_MODEL` | `hermes/agents/anfitrion.ts` (default: `qwen2.5:3b`) | ❌ Opcional |

---

## API Routes

| Endpoint | Método | Descripción | Tabla Supabase |
|---|---|---|---|
| `/api/hermes` | POST | Orquestador de agentes de IA | — |
| `/api/hermes` | GET | Health check + estado de agentes | — |
| `/api/fieles` | POST | Registro de miembros | `fieles` |
| `/api/registraciones` | POST | Registro de asistencia a servicios | `registraciones` |
| `/api/comunicaciones` | GET | Listar comunicaciones (opcional `?fiel_id=`) | `comunicaciones` |
| `/api/comunicaciones` | POST | Crear comunicación | `comunicaciones` |
| `/api/chat` | POST | Chat legacy (si existe) | — |

---

## Módulo Hermes — Orquestador de Agentes IA

```
POST /api/hermes  { agente, sessionId, payload }
        │
        ▼
  route.ts ───→ orquestador.ts (switch)
        │
        ├── "anfitrion" ───→ Ollama (Qwen/DeepSeek)
        │       chat institucional con System Prompt restrictivo
        │
        ├── "admin-contenido"
        │       procesamiento de metadatos para blog_posts
        │
        └── "copiloto"
                monitoreo del servidor (CPU, RAM, disco, tunnel)
                alertas vía Telegram si CPU > 80%
```

### Agente "Anfitrión" (El Oráculo)

**Propósito:** Responder preguntas institucionales frecuentes sin desviarse del ámbito del ministerio.

**System Prompt (institucional y restrictivo):**

```
Eres "Anfitrión", el asistente virtual del Ministerio El Renuevo.
Tu personalidad es cálida, acogedora y profesional.
Hablas solo en español con un tono amable y servicial.

Conoces sobre:
- Horarios de servicios (Dominical 10:00 AM, Miércoles Estudio Bíblico)
- Eventos y actividades del ministerio
- Cómo registrarse como miembro
- Cómo realizar donaciones/diezmos
- Información de contacto general

Si alguien se registra como nuevo miembro, muestra entusiasmo.
Si no sabes algo, sé honesto y ofrece derivar a un líder.
```

**¿Por qué modelos 1.5B ligeros?**
- El agente solo responde preguntas institucionales acotadas — no necesita razonamiento profundo ni generación extensa.
- Modelos como `qwen2.5:1.5b` o `deepseek-r1:1.5b` consumen ~1-2 GB RAM vs. 8-16 GB de uno de 7B.
- Permite ejecutar el chat en servidores gratuitos o VPS de recursos limitados sin swap ni latencia.
- La velocidad de inferencia es 3-5x más rápida en CPU, crítica para mantener la experiencia de usuario fluida.

**Flujo del chat:**
1. El usuario envía mensaje vía `AIChatWidget` → `POST /api/hermes`
2. Se guarda en memoria volátil (Map en RAM, máximo 50 mensajes por sesión)
3. Se construye el array de mensajes: `[system prompt] + [historial] + [nuevo mensaje]`
4. Se envía a Ollama `POST /api/chat` con `stream: false`
5. Si el mensaje menciona "registro" o "nuevo miembro", se dispara notificación Telegram
6. Se devuelve la respuesta al widget

---

## Base de Datos (Supabase)

### Migraciones existentes

| Archivo | Tablas creadas |
|---|---|
| `supabase/migrations/20260523041702_create_ministry_tables.sql` | `registrations`, `blog_posts` |

### ⚠️ Tablas adicionales necesarias (migraciones pendientes)

Las siguientes tablas son referenciadas por las API routes pero **no tienen migración**:

| Tabla | Usada por | Estado |
|---|---|---|
| `fieles` | `POST /api/fieles` | ❌ Sin migración |
| `comunicaciones` | `GET/POST /api/comunicaciones` | ❌ Sin migración |
| Bautizos? | — | Pendiente definir |

Además, la migración existente crea la tabla `registrations` (inglés) pero la API en `app/api/registraciones/route.ts` consulta `registraciones` (español). Verificar consistencia.

---

## Infraestructura Local (WSL)

### Cloudflare Tunnel

El túnel `ministerio-renuevo-dev` ya está creado con el certificado y archivo de credenciales en `~/.cloudflared/`.

```yaml
# ~/.cloudflared/config.yml
tunnel: e1f03663-aa9f-426d-8f3b-0eb224102ff0
credentials-file: /home/barrera/.cloudflared/e1f03663-aa9f-426d-8f3b-0eb224102ff0.json

ingress:
  - hostname: dev.envivoministerioelrenuevo.org
    service: http://localhost:5173
  - service: http_status:404
```

Para listar los túneles disponibles:

```bash
cloudflared tunnel list
```

### Docker (producción alternativa)

```bash
docker compose up -d          # Solo levanta Qwen (Ollama en contenedor)
docker build -t renuevo .     # Build de la app Next.js
docker run -p 3000:3000 renuevo
```

---

## Linting y TypeScript

```bash
npm run lint        # ESLint (next/core-web-vitals)
npm run typecheck   # tsc --noEmit
```

---

## Scripts auxiliares

| Archivo | Propósito |
|---|---|
| `actualizar_proyecto.sh` | Renombra `name` en package.json y limpia redundancias en .gitignore |
| `test_supabase.js` | Prueba de conectividad con Supabase |

---

## Notas de Seguridad

- `SUPABASE_SERVICE_ROLE_KEY` otorga acceso **total** (RLS bypass). Nunca exponerla en cliente.
- Las notificaciones Telegram se silencian si faltan las variables (no crashean).
- El archivo `.env` está en `.gitignore`. Usar `.env.local` para entorno local.
- La memoria del chat de Hermes es volátil (Map en RAM). Se pierde al reiniciar el servidor.

---

## Licencia

Uso interno — Ministerio El Renuevo.
