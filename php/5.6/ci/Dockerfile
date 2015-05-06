FROM php:5.6-cli

MAINTAINER Berry Goudswaard <info@berrygoudswaard.nl>

RUN apt-get update \
    && apt-get install -y \
        git \
        zlib1g-dev \
    && git clone git://github.com/xdebug/xdebug.git /usr/src/php/ext/xdebug \
    && docker-php-ext-install zip \
    && docker-php-ext-install xdebug \
    && curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

RUN useradd -ms /bin/bash ci
USER ci
ENV HOME /home/ci
WORKDIR /home/ci
RUN composer global require phpunit/phpunit

ENV PATH /home/ci/.composer/vendor/bin:$PATH
