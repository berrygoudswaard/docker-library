FROM debian:latest

<!-- @import maintainer -->
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get -y install \
        libsasl2-2 \
        libsasl2-modules \
        postfix \
        rsyslog \
        supervisor \
        sasl2-bin \
        --no-install-recommends && \
    apt-get clean autoclean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

ADD assets/supervisor.conf /opt/supervisor.conf
ADD assets/start.sh /opt/start.sh

RUN sed -i "s/^START=no/START=yes/g" /etc/default/saslauthd && \
    sed -i "s/\/var\/run\/saslauthd/\/var\/spool\/postfix\/var\/run\/saslauthd/g" /etc/default/saslauthd && \
    echo "pwcheck_method: saslauthd\nmech_list: PLAIN LOGIN" > /etc/postfix/sasl/smtpd.conf && \
    adduser postfix sasl && \
    chmod +x /opt/start.sh

CMD /usr/bin/supervisord -c /opt/supervisor.conf
