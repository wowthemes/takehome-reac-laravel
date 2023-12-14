
# Setup Docker
Make sure docker is up and running. Then run the following command in the same directory

`docker-compose up --build -d`

You need to wait about 5-10 minutes until all services get up and running. Because it runs the following command during build and setting up containers

```
composer install
php artisan migrate --seed #this needs to wait for mysql service to be up. It wait for 5 minutes for mysql service to be up.
npm install
npm run start
```