FROM php:7.0-fpm

MAINTAINER Berry Goudswaard <info@berrygoudswaard.nl>

RUN apt-get update \
    && apt-get install -y g++ libicu-dev libpng12-dev \
    && docker-php-ext-install mbstring intl pdo_mysql gd

CMD ["php-fpm"]
