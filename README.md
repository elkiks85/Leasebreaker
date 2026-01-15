# Lease Terminator

Sistema de gestión legal para arrendatarios que buscan terminar contratos de arrendamiento comercial en Ciudad de México y recuperar sus depósitos.

## Descripción

Lease Terminator es una aplicación web full-stack que ayuda a los arrendatarios a:

- Rastrear contratos de arrendamiento y sus términos
- Gestionar acciones legales y quejas
- Aplicar presión legal sistemática sobre arrendadores incumplidos
- Documentar comunicaciones y evidencia
- Utilizar plantillas pre-escritas para comunicaciones legales

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod

## Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/your-repo/lease-terminator.git
cd lease-terminator
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Inicializar la base de datos:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

6. Abrir http://localhost:3000

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Páginas de autenticación
│   ├── (dashboard)/       # Páginas del dashboard
│   └── api/               # API routes
├── components/            # Componentes React
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Sidebar, Header
│   ├── dashboard/        # Dashboard widgets
│   ├── contracts/        # Contract components
│   ├── actions/          # Action components
│   ├── arsenal/          # Tactics components
│   └── shared/           # Reusable components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configs
├── store/                # Zustand store
└── types/                # TypeScript types
```

## Características Principales

### Arsenal de Presión
- 8 tácticas legales pre-configuradas
- Incluye quejas SAT, PROSOC, demandas civiles
- Información de contacto de agencias
- Documentos requeridos listados

### Gestión de Contratos
- Registro completo de términos del contrato
- Información del arrendador con RFC
- Seguimiento de depósitos y penalidades
- Historial de acciones por contrato

### Seguimiento de Acciones
- Estado de cada acción legal
- Prioridades y fechas de vencimiento
- Documentos adjuntos
- Recordatorios

### Plantillas de Comunicación
- Cartas de terminación
- Quejas SAT
- Solicitudes PROSOC
- Cartas de demanda

## Variables de Entorno

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Iniciar producción
- `npm run lint` - Ejecutar linter
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Poblar base de datos

## Licencia

MIT

## Disclaimer

Esta herramienta es para uso informativo únicamente. Consulte con un abogado para asesoría legal específica.
