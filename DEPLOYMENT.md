# Job Portal Deployment Guide

## Prerequisites
- Python 3.11+
- MySQL 8.0+
- Nginx
- Gunicorn
- Node.js 16+ (for building React frontend)

## Backend Deployment (Django)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your settings:
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Database Setup
```bash
# Create database in MySQL
mysql -u root -p
CREATE DATABASE job_portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Run migrations
python manage.py migrate
```

### 4. Create Superuser
```bash
python manage.py createsuperuser
```

### 5. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 6. Run with Gunicorn
```bash
gunicorn --config gunicorn.conf.py job_portal.wsgi:application
```

### 7. Setup Systemd Service (Optional)
```bash
sudo cp jobportal.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable jobportal
sudo systemctl start jobportal
```

### 8. Nginx Configuration
Copy `nginx.conf` to `/etc/nginx/sites-available/` and update paths:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/jobportal
sudo ln -s /etc/nginx/sites-available/jobportal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Frontend Deployment (React)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Serve with Django (Optional)
Copy the build output to Django's static directory:
```bash
cp -r build/* ../static/
```

Or serve separately with a web server like Nginx.

## Environment Variables

### Required:
- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to False in production
- `ALLOWED_HOSTS` - Your domain name
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port

### Optional:
- `JWT_SECRET_KEY` - For additional JWT security
- Email settings for password resets

## Security Checklist
- [ ] Change default Django SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure proper ALLOWED_HOSTS
- [ ] Use HTTPS (SSL/TLS certificate)
- [ ] Keep Django and all packages updated
- [ ] Regular database backups
- [ ] Use strong passwords for admin and database
- [ ] Configure firewall (UFW)
- [ ] Keep system packages updated

## Running the Application

### Development:
```bash
# Backend
python manage.py runserver

# Frontend
cd frontend && npm start
```

### Production:
```bash
# Start Gunicorn
sudo systemctl start jobportal

# Or manually:
gunicorn --config gunicorn.conf.py job_portal.wsgi:application
```

## Monitoring

### Check Gunicorn Status:
```bash
sudo systemctl status jobportal
```

### View Logs:
```bash
sudo journalctl -u jobportal
```

### Monitor Resources:
```bash
htop
```

## Troubleshooting

### Gunicorn Won't Start:
1. Check if port 8000 is available
2. Verify virtual environment is activated
3. Check error logs: `sudo journalctl -u jobportal`

### Database Connection Issues:
1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check database credentials in `.env`
3. Test connection: `mysql -u root -p -h localhost`

### Static Files Not Found:
1. Run `python manage.py collectstatic --noinput`
2. Check Nginx static file configuration
3. Verify file permissions