# Vive Salud – 8 Hábitos (MVP Frontend)

Frontend móvil construido con React Native (Expo) y preparado para integrarse con Supabase.

## Stack

- React Native + Expo + TypeScript
- React Navigation (Bottom Tabs + Native Stack)
- Zustand para estado global
- Supabase SDK oficial (`@supabase/supabase-js`)

## Hábitos incluidos

1. Agua
2. Aire puro
3. Luz solar
4. Ejercicio
5. Alimentación saludable
6. Descanso
7. Temperancia
8. Espiritualidad

## Estructura

```text
src/
  components/
  config/
  constants/
  navigation/
  screens/
  services/
  store/
  theme/
  types/
```

## Configuración

1. Instala dependencias:

```bash
npm install
```

2. Crea variables de entorno:

```bash
cp .env.example .env
```

3. Completa en `.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Si no configuras estas variables, la app funciona en **modo mock** (data quemada).

## Ejecutar

```bash
npm run start
```

## Notas de backend esperado

El servicio usa estas tablas/vistas (si existen):

- `habit_daily_summary` (`user_id`, `date`, `habit_id`, `current_value`, `goal_value`, `streak_days`)
- `habit_logs` (`id`, `user_id`, `habit_id`, `value`, `date`)

Si hay error o no existen, cae automáticamente a datos mock.
