#!/bin/bash
set -e

echo 'starting migratin'
sleep 100
echo 'mysql live'

# Run migrations and seed
php artisan migrate --force --seed

# Start Apache and Supervisor
exec apache2-foreground

supervisord -n

php artisan app:fetch-article-data