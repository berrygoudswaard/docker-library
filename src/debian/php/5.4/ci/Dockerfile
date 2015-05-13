FROM debian:jessie

<!-- @import maintainer -->
ENV PHP_VERSION 5.4.40
ENV PHP_INI_DIR /usr/local/etc/php
ENV PHP_URL "http://php.net/get/php-$PHP_VERSION.tar.bz2/from/this/mirror"
ENV PHP_EXTRA_EXT "--enable-intl"
ENV EXTRA_PACKAGES "libicu-dev g++"
ENV XDEBUG_BRANCH "xdebug_2_3"
<!-- @import debian/ci-installation -->
