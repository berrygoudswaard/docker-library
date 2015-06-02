FROM php:5.6-apache

<!-- @import maintainer -->
RUN apt-get update \
    && apt-get install -y g++ libicu-dev \
    && docker-php-ext-install mbstring intl pdo_mysql \
    && a2enmod rewrite
