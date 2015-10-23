FROM php:5.6-fpm

MAINTAINER Berry Goudswaard <info@berrygoudswaard.nl>

RUN apt-get update \
    && apt-get install -y \
        g++ \
        libfreetype6-dev \
        libicu-dev libpng12-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev \
        libpq-dev \
    && docker-php-ext-install mbstring intl pdo_mysql pdo_pgsql mcrypt iconv \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install gd

CMD ["php-fpm"]
