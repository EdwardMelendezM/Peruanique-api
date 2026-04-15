# FIJA Backend: Guia Paso a Paso (Ingenieria de Software)

## 0) Contexto actual (analisis rapido del frontend)

Con base en el codigo actual, el frontend ya tiene estos flujos y contratos:

- Navegacion principal en `navigation/types.ts`:
  - `Onboarding`
  - `Home`
  - `Lesson` (`lessonId`, `lessonTitle`)
  - `Insight` (`lessonId`, `lessonTitle`)
  - `Ranking`
  - `Profile`
- Estado local en `features/onboarding/stores/use-app-store.ts` con:
  - `groupId`, `username`, `birthDate`
  - `points`, `completedLessons`, `streak`
- Roadmap mock en `data/mockRoadmap.ts` por grupo (`a`, `b`, `c`, `d`) con nodos:
  - `completed`, `current`, `locked`, `checkpoint`
- Ranking mock en `features/ranking/hooks/use-ranking.ts`
- Perfil derivado de estado local en `features/profile/hooks/use-profile.ts`

Conclusion: el backend debe reemplazar mocks y estado local por datos persistidos, versionados y seguros.

---

## 1) Objetivo de backend (MVP realista)

Construir un backend que permita:

1. Registrar/autenticar estudiantes.
2. Guardar su grupo de postulacion (`A/B/C/D`) y perfil.
3. Entregar roadmap dinamico por grupo y progreso individual.
4. Resolver preguntas de leccion y devolver feedback inmediato.
5. Generar explicacion IA cuando falla una respuesta.
6. Calcular puntos, racha y monedas (`Qorilazo coins`).
7. Publicar ranking por grupo y global.
8. Operar con seguridad, logs y pruebas automaticas.

---

## 2) Stack recomendado (para Expo + equipo pequeno)

### Opcion recomendada (rapida y escalable): Prisma + Edge Functions

- **Base de datos**: PostgreSQL + Prisma
- **Auth**: Better auth
- **API**:
  - CRUD simple via PostgREST (con Row Level Security)
  - Logica de negocio via server actions on next js
- **Storage**: Vercel Storage (para imagenes o archivos, si se necesitan)
- **Jobs**: Inngest
- **IA**: Edge Function que consume proveedor LLM (Gemini)

---

## 3) Arquitectura funcional (modulos backend)

1. **Auth & User**
   - registro/login, perfil, grupo academico.
2. **Curriculum/Roadmap**
   - grupos, cursos, lecciones, nodos, checkpoints.
3. **Challenge Engine**
   - preguntas, opciones, validacion de respuesta.
4. **Progress & Rewards**
   - intentos, XP, coins, racha, desbloqueo de nodos.
5. **Ranking**
   - leaderboard por grupo y global.
6. **AI Insight**
   - explicacion paso a paso para respuestas incorrectas.
7. **Observability & Security**
   - logs, auditoria, rate limit, politicas de acceso.

---

## 4) Modelo de datos minimo (tablas)

> Usa UUID para IDs y `created_at/updated_at` en todas las tablas.

### 4.1 Core

- `users`
  - `id` (uuid, PK, igual al auth user id)
  - `username` (unique)
  - `birth_date` (date)
  - `group_id` (`a|b|c|d`)
  - `is_active` (bool)
  
- `admin_users`
    - `id` (uuid, PK)
    - `user_id` (fk -> users)

- `groups`
  - `id` (uuid, PK)
  - `code` (`a|b|c|d`, PK)
  - `name` (`Grupo A`, etc.)
  - `career_focus` (`Ingenierias`, `Medicina`, etc.)

- `lessons`
  - `id` (uuid)
  - `group_id` (fk -> groups)
  - `title`
  - `order_index` (int)
  - `node_type` (`lesson|checkpoint`)
  - `is_published` (bool)

- `questions`
  - `id` (uuid)
  - `lesson_id` (fk -> lessons)
  - `prompt`
  - `difficulty` (`easy|medium|hard`)
  - `explanation_base` (texto canonico para IA)

- `question_options`
  - `id` (uuid)
  - `question_id` (fk)
  - `label` (`A`,`B`,`C`,`D`)
  - `text`
  - `is_correct` (bool)

### 4.2 Tracking academico

- `lesson_attempts`
  - `id` (uuid)
  - `user_id` (fk -> users)
  - `lesson_id` (fk)
  - `question_id` (fk)
  - `selected_option_id` (fk)
  - `is_correct` (bool)
  - `time_spent_seconds` (int)
  - `answered_at` (timestamp)

- `user_lesson_progress`
  - `id` (uuid)
  - `user_id` (fk)
  - `lesson_id` (fk)
  - `status` (`locked|current|completed`)
  - `score` (int)
  - `last_attempt_at` (timestamp)

- `user_rewards`
  - `user_id` (PK/fk)
  - `points` (int)
  - `coins` (int)
  - `streak_days` (int)
  - `last_study_date` (date)

- `reward_events`
  - `id` (uuid)
  - `user_id` (fk)
  - `type` (`correct_answer|daily_streak|checkpoint_complete|bonus`)
  - `points_delta` (int)
  - `coins_delta` (int)
  - `meta` (jsonb)
  - `created_at`

### 4.3 IA

- `ai_explanations`
  - `id` (uuid)
  - `attempt_id` (fk -> lesson_attempts)
  - `provider`
  - `model`
  - `input_tokens` (int)
  - `output_tokens` (int)
  - `latency_ms` (int)
  - `content` (jsonb: pasos estructurados)
  - `created_at`

### 4.4 Ranking

- `leaderboard_daily` (materialized view o tabla agregada)
  - `date`
  - `group_id`
  - `user_id`
  - `points_total`
  - `position`

Indices clave:

- `lesson_attempts(user_id, answered_at desc)`
- `user_lesson_progress(user_id, status)`
- `lessons(group_id, order_index)`
- `leaderboard_daily(date, group_id, position)`

---

## 5) API contracts (versionado desde el inicio)

Prefijo: `/v1`

### 5.1 Auth/Profile

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `GET /v1/me`
- `PATCH /v1/me` (username, birthDate, groupId)

### 5.2 Home/Roadmap

- `GET /v1/roadmap?groupId=b`
  - Devuelve header (`grupo`, `career`, `streak`, `coins`) + nodos con estado por usuario.

### 5.3 Lesson/Challenge

- `GET /v1/lessons/:lessonId/question` (siguiente pregunta)
- `POST /v1/lessons/:lessonId/answer`
  - Request:
    - `questionId`
    - `selectedOptionId`
    - `timeSpentSeconds`
  - Response:
    - `isCorrect`
    - `correctOptionId`
    - `xpDelta`
    - `coinsDelta`
    - `showInsight` (bool)

### 5.4 Insight IA

- `POST /v1/insight/generate`
  - Input: `attemptId`
  - Output: pasos `{ title, body, formulaLatex?, highlight? }[]`

### 5.5 Ranking

- `GET /v1/ranking?groupId=b&period=daily`

### 5.6 Profile stats

- `GET /v1/profile/stats`
  - `completedLessons`, `points`, `streak`, `level`

---

## 6) Seguridad (no negociable)

1. **JWT verification** en cada endpoint privado.
2. **RLS en PostgreSQL** para evitar lectura cruzada entre usuarios.
3. **Rate limiting**:
   - fuerte para `/auth/*` y `/insight/generate`.
4. **Input validation** con Zod (backend tambien).
5. **Secrets** en variables de entorno, nunca en repo.
6. **Auditoria minima** para cambios criticos (`group_id`, recompensas).

---

## 7) Paso a paso de implementacion (checklist ejecutable)

## Fase 1: Fundacion

- [ ] Crear carpeta o repo `fija-backend`.
- [ ] Elegir stack final (recomendado Prisma + Edge Functions).
- [ ] Configurar entornos: `dev`, `staging`, `prod`.
- [ ] Definir `ENV`:
  - `DATABASE_URL`
  - `BETTER_AUTH_URL`
  - `BETTER_AUTH_SECRET`
  - `RESEND_API_KEY`
  - `LLM_API_KEY`
  - `JWT_AUDIENCE` (si aplica)
- [ ] Crear migracion inicial con tablas core.
- [ ] Activar RLS en todas las tablas con politicas por `auth.uid()`.

Entregable: backend levantado con auth y DB inicial.

## Fase 2: API base para reemplazar el frontend de mobile

- [ ] Implementar endpoint `GET /v1/roadmap`.
- [ ] Implementar endpoint `GET /v1/ranking`.
- [ ] Implementar endpoint `GET /v1/profile/stats`.
- [ ] Poblar seed data para grupos A/B/C/D y primeras lecciones.

## Fase 3: Motor de preguntas y progreso

- [ ] Crear endpoints de `question` y `answer`.
- [ ] Registrar intentos en `lesson_attempts`.
- [ ] Actualizar `user_lesson_progress` y desbloqueo de nodo siguiente.
- [ ] Actualizar rewards (`points`, `coins`, `streak`).
- [ ] Implementar reglas de negocio:
  - correcta: +10 XP
  - checkpoint: bonus configurable
  - prevenir doble conteo de recompensa

## Fase 4: IA explicativa

- [ ] Implementar `POST /v1/insight/generate`.
- [ ] Prompt template estructurado (3 pasos maximo).
- [ ] Guardar trazas en `ai_explanations`.
- [ ] Cache por `questionId + wrongOptionId` para reducir costo.
- [ ] Timeout y fallback:
  - si IA falla, entregar `explanation_base` predefinida.

## Fase 5: Configurar el flujo para cada Grupo como administrador

- [ ] Crear los server actions para crear/modificar grupos, lecciones, preguntas y opciones como administrador.
- [ ] Crear las interfaces para grupos, lecciones, preguntas y opciones en el dashboard de administración.
- [ ] Integrar las acciones y las interfaces para permitir a los administradores configurar el flujo de cada grupo.
- [ ] Crear un proceso de seed inicial para poblar los grupos A/B/C/D con lecciones y preguntas base.

## Fase 6: Calidad y operacion

- [ ] Pruebas unitarias (reglas de score y streak).
- [ ] Pruebas de integracion (answer flow completo).
- [ ] Contratos API (OpenAPI/Swagger).
- [ ] Logging estructurado + trazas.
- [ ] Alarmas:
  - latencia p95 alta
  - error rate > 2%
  - costo IA diario excedido

Entregable: backend listo para beta privada.

---

## 8) Integracion frontend (orden sugerido)

1. Crear cliente API central (`api/client.ts`) con interceptor JWT.
2. Migrar hooks uno por uno:
   - `useRoadmapData` -> remoto
   - `useRanking` -> remoto
   - `useProfile` -> remoto
3. Mantener Zustand para cache/UI state, no como source of truth.
4. Agregar manejo de estados en UI:
   - loading/skeleton
   - empty states
   - retry offline
5. Activar feature flags para fallback a mocks en dev.

---

## 9) CI/CD minimo recomendado

Pipeline por PR:

1. Lint + Typecheck
2. Unit tests
3. Integration tests (DB temporal)
4. Build Edge Functions
5. Deploy a `staging` (si rama `develop`)
6. Deploy a `prod` con aprobacion manual (si rama `main`)

---

## 10) Riesgos principales y mitigacion

- **Costo IA crece rapido**
  - Mitigacion: cache, limite por usuario/dia, modelo economico por defecto.
- **Ranking inconsistente por concurrencia**
  - Mitigacion: updates atomicos + job de reconciliacion diaria.
- **Fraude de respuestas automatizadas**
  - Mitigacion: rate limit, device fingerprint suave, analisis de patrones.
- **Dependencia de red en zonas con internet inestable**
  - Mitigacion: cache local de ultimo roadmap + cola de envio de intentos.

---

## 11) Definition of Done (para salir a beta)

- [ ] 100% de pantallas clave consumen backend real (`Home`, `Lesson`, `Insight`, `Ranking`, `Profile`).
- [ ] Error rate < 2% en 7 dias de prueba.
- [ ] Latencia p95:
  - endpoints comunes < 400 ms
  - insight IA < 2.5 s (con cache)
- [ ] Cobertura de pruebas del dominio > 70%.
- [ ] Logs y alertas activos en `staging` y `prod`.

---

## 12) Primer sprint sugerido (muy concreto)

Semana 1 (ejecucion practica):

- Dia 1: proyecto backend + entornos + auth.
- Dia 2: esquema SQL (users, groups, lessons, questions, options).
- Dia 3: roadmap endpoint + seed inicial.
- Dia 4: ranking/profile endpoints.
- Dia 5: conectar frontend (`Home`, `Ranking`, `Profile`) y validar en dispositivo.

Si completas esta semana, ya habras eliminado la mayoria de mocks del producto.

