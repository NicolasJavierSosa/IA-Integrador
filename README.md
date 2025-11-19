# Sistema del Aserradero - IA Integrador

Este proyecto es un sistema de prediccion de ventas a partir de subproductos para un aserradero, desarrollado con Django (backend) y React (frontend), utilizando Docker para la contenerización.

## Requisitos Previos

- Docker y Docker Compose instalados en tu sistema.
- Git para clonar el repositorio.

## Instalación y Ejecución

### 1. Clonar el Repositorio

```bash
git clone https://github.com/NicolasJavierSosa/IA-Integrador.git
cd IA-Integrador
```

### 2. Construir y Ejecutar los Contenedores

```bash
docker-compose up --build
```

Esto iniciará:
- Backend (Django) en `http://localhost:8000`
- Frontend (React/Vite) en `http://localhost:5173`

### 3. Crear Superusuario para Django

Para acceder al panel de administración de Django, crea un superusuario:

```bash
docker-compose exec backend python manage.py createsuperuser
```

Sigue las instrucciones en pantalla para configurar usuario, email y contraseña.

### 4. Acceder a la Aplicación

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000/api/`
- **Admin de Django:** `http://localhost:8000/admin/`

## Desarrollo

Para desarrollo local sin Docker:

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
