FROM debian:jessie

MAINTAINER Berry Goudswaard <info@berrygoudswaard.nl>

ENV PHP_VERSION 5.4.40
ENV PHP_INI_DIR /usr/local/etc/php
ENV PHP_URL "http://php.net/get/php-$PHP_VERSION.tar.bz2/from/this/mirror"
ENV PHP_EXTRA_EXT "--enable-intl"
ENV EXTRA_PACKAGES "libicu-dev g++"
ENV XDEBUG_BRANCH "xdebug_2_3"
ENV HOME /home/ci

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -y \
        autoconf \
        bzip2 \
        ca-certificates \
        curl \
        file \
        gcc \
        git \
        libc-dev \
        libcurl4-openssl-dev \
        libmagickwand-dev \
        libpcre3 \
        libpcre3-dev \
        libreadline6-dev \
        librecode-dev \
        librecode0 \
        libsqlite3-0 \
        libsqlite3-dev \
        libssl-dev \
        libxml2 \
        libxml2-dev \
        mysql-server \
        make \
        pkg-config \
        re2c \
        ssh-client \
        $EXTRA_PACKAGES \
        --no-install-recommends \
    && rm -r /var/lib/apt/lists/*

RUN mkdir -p $PHP_INI_DIR/conf.d \
    && curl -SL "$PHP_URL" -o php.tar.bz2 \
    && mkdir -p /usr/src/php \
    && tar -xof php.tar.bz2 -C /usr/src/php --strip-components=1 \
    && rm php.tar.bz2* \
    && cd /usr/src/php \
    && ./configure \
        --disable-cgi \
        --enable-mysqlnd \
        --enable-mbstring \
        --enable-zip \
        --with-config-file-path="$PHP_INI_DIR" \
        --with-config-file-scan-dir="$PHP_INI_DIR/conf.d" \
        --with-curl \
        --with-gd \
        --with-jpeg-dir=/usr/lib \
        --with-openssl \
        --with-pdo-mysql=mysqlnd \
        --with-mysql-sock=/var/run/mysqld/mysqld.sock \
        --with-readline \
        --with-recode \
        --with-zlib \
        $PHP_EXTRA_EXT \
    && make \
    && make install \
    && make clean \
    && echo 'pdo_mysql.default_socket=/var/run/mysqld/mysqld.sock' > /usr/local/etc/php/conf.d/ext-pd_mysql.ini \
    && echo 'date.timezone = UTC' > /usr/local/etc/php/conf.d/date.timezone.ini

RUN git clone --branch $XDEBUG_BRANCH git://github.com/xdebug/xdebug.git /usr/src/php/ext/xdebug \
    && cd /usr/src/php/ext/xdebug \
    && phpize \
    && ./configure --enable-xdebug \
    && make \
    && make install \
    && echo 'zend_extension=/usr/src/php/ext/xdebug/modules/xdebug.so' > /usr/local/etc/php/conf.d/ext-xdebug.ini

RUN git clone git://github.com/mkoppanen/imagick.git /usr/src/php/ext/imagick \
    && cd /usr/src/php/ext/imagick \
    && phpize \
    && ./configure \
    && make \
    && make install \
    && echo 'extension=/usr/src/php/ext/imagick/modules/imagick.so' > /usr/local/etc/php/conf.d/ext-imagick.ini

RUN useradd -ms /bin/bash ci \
    && echo '#!/bin/bash' > /tmp/run.sh \
    && echo 'service mysql start \' >> /tmp/run.sh \
    && echo '&& chown ci:ci -R  $HOME \' >> /tmp/run.sh \
    && echo '&& su ci -c "export PATH=$PATH && /tmp/ci.sh"' >> /tmp/run.sh \
    && chmod +x /tmp/run.sh

RUN mkdir $HOME/bin \
    && curl -sS https://getcomposer.org/installer | php  -- --install-dir=$HOME/bin --filename=composer \
    && $HOME/bin/composer global require \
        phpunit/phpunit \
        sebastian/phpcpd \
        squizlabs/php_codesniffer \
        berrygoudswaard/coverage-reporter

WORKDIR $HOME/project

ENV PATH $HOME/bin:$HOME/.composer/vendor/bin:$PATH

CMD /tmp/run.sh

