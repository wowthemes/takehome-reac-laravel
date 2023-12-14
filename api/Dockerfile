FROM php:8.1-apache

WORKDIR /var/www/html

# ... (rest of the Dockerfile)

# Copy Laravel files
# COPY . .

# Install dependencies and run migrations
RUN apt-get update && \
    apt-get install -y \
        libzip-dev \
        unzip \
        supervisor \
    && docker-php-ext-install zip pdo_mysql \
    && a2enmod rewrite

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf
COPY laravel-worker.conf /etc/supervisor/conf.d/laravel-worker.conf
# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# Enable necessary Apache modules
RUN a2enmod rewrite
RUN service apache2 restart

RUN composer install
# CMD ["sh", "-c", "php artisan migrate --force --seed && apache2-foreground && supervisord -n"]
# RUN cd /var/www/html && php artisan migrate
#RUN php artisan app:fetch-article-data
ENTRYPOINT ["entrypoint"]