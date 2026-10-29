#!/bin/bash
# Deployment script for Job Portal
# Run this script on your VPS after cloning the repository

set -e

echo "=== Job Portal Deployment Script ==="

# Navigate to project directory
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Set environment variables
export $(cat .env | xargs)

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Create superuser (if not exists)
echo "Creating superuser if needed..."
python manage.py shell -c "
from django.contrib.auth import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Restart Gunicorn
echo "Restarting Gunicorn..."
sudo systemctl restart jobportal

echo "Deployment complete!"