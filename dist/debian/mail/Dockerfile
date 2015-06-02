FROM debian:latest

MAINTAINER Berry Goudswaard <info@berrygoudswaard.nl>

RUN apt-get update \
    && echo postfix postfix/mailname string berrygoudswaard.nl | debconf-set-selections \
    && echo postfix postfix/main_mailer_type string 'Internet Site' | debconf-set-selections \

    && apt-get install -y \
        postfix \
        libsasl2-2 \
        libsasl2-modules \
        sasl2-bin \
        rsyslog \
        supervisor \
        spamass-milter \
        opendkim \
        opendkim-tools \

    && sed -i "s/^START=no/START=yes/g" /etc/default/saslauthd \
    && sed -i "s/\/var\/run\/saslauthd/\/var\/spool\/postfix\/var\/run\/saslauthd/g" /etc/default/saslauthd \
    && postconf -e "myhostname=berrygoudswaard.nl" \
    && postconf -e "mydestination=berrygoudswaard.nl,d-zire.com" \
    && postconf -e "virtual_alias_maps=hash:/etc/postfix/virtual" \
    && postconf -e "virtual_mailbox_domains=hash:/etc/postfix/virtual-mailbox-domains" \
    && postconf -e "virtual_mailbox_maps=hash:/etc/postfix/virtual-mailbox-users" \
    && postconf -e "smtpd_sasl_auth_enable=yes" \
    && postconf -e "broken_sasl_auth_clients=yes" \
    && postconf -e "smtpd_sasl_security_options=noanonymous" \
    && postconf -e "smtpd_recipient_restrictions=permit_sasl_authenticated,permit_mynetworks,reject_unauth_destination" \
    && postconf -e "milter_protocol=2" \
	&& postconf -e "milter_default_action=accept" \
	&& postconf -e "smtpd_milters=unix:/spamass/spamass.sock,inet:localhost:12301" \
	&& postconf -e "non_smtpd_milters=unix:/spamass/spamass.sock,inet:localhost:12301" \

    # Configure SpamAssassin
	&& sed -i "s/OPTIONS=\"-u spamass-milter -i 127.0.0.1\"/OPTIONS=\"-u spamass-milter -i 127.0.0.1 -m -r -1 -I\"/g" /etc/default/spamass-milter \
	&& sed -i "s/# rewrite_header/rewrite_header/g" /etc/spamassassin/local.cf \
    && sed -i -e "s/^\(smtp.*smtpd\)$/\1\n   -o content_filter=spamassassin/g" /etc/postfix/master.cf \
    && sed -i -e "s/^#\(submission.*smtpd\)$/\1\n   -o content_filter=spamassassin/g" /etc/postfix/master.cf \
	&& sed -i -e "s/ENABLED=0/ENABLED=1/g" -e "s/CRON=0/CRON=1/g" -e "s/OPTIONS=\"--create-prefs --max-children 5 --helper-home-dir\"/OPTIONS=\"--create-prefs --max-children 5 --helper-home-dir=\/var\/lib\/spamassassin -u spamd -g spamd\"/g" /etc/default/spamassassin \

    && echo "spamassassin unix -     n       n       -       -       pipe" >> /etc/postfix/master.cf \
    && echo "   user=debian-spamd argv=/usr/bin/spamc -f -e /usr/sbin/sendmail -oi -f \${sender} \${recipient}" >> /etc/postfix/master.cf \

	&& adduser --shell /bin/false --home /var/lib/spamassassin --disabled-password --disabled-login --gecos "" spamd \
	&& chown spamd:spamd -R /var/lib/spamassassin \

    # Set the authentication for the smtp daemon
    && echo "pwcheck_method: saslauthd" > /etc/postfix/sasl/smtpd.conf \
    && echo "mech_list: PLAIN LOGIN" >> /etc/postfix/sasl/smtpd.conf \

    # Tell which domains to accept for incoming messages
    && echo "berrygoudswaard.nl	OK" > /etc/postfix/virtual-mailbox-domains \
    && echo "d-zire.com		OK" >> /etc/postfix/virtual-mailbox-domains \

    # Tell which users have a mailbox
    && echo "berry@berrygoudswaard.nl	OK" > /etc/postfix/virtual-mailbox-users \
    && echo "berry@d-zire.com		OK" >> /etc/postfix/virtual-mailbox-users \

    # Forward all mail to gmail
    && echo "@berrygoudswaard.nl	berry.dzire@gmail.com" > /etc/postfix/virtual \
    && echo "@d-zire.com		berry.dzire@gmail.com" >> /etc/postfix/virtual \

    && echo "[supervisord]" > /etc/supervisor/conf.d/supervisord.conf \
    && echo "nodaemon=true" >> /etc/supervisor/conf.d/supervisord.conf \
    && echo "" >> /etc/supervisor/conf.d/supervisord.conf \
    && echo "[program:smtp]" >> /etc/supervisor/conf.d/supervisord.conf \
    && echo "command=/opt/smtp.sh" >> /etc/supervisor/conf.d/supervisord.conf \
    && echo "" >> /etc/supervisor/conf.d/supervisord.conf \
    && echo "[program:rsyslog]" >> /etc/supervisor/conf.d/supervisord.conf \
    && echo "command=/usr/sbin/rsyslogd -n -c3" >> /etc/supervisor/conf.d/supervisord.conf \


    && echo "#!/bin/bash" > /opt/smtp.sh \
    && echo "useradd -g mail -m \$SMTP_USER" >> /opt/smtp.sh \
    && echo "echo -e \"\$SMTP_PASSWORD\n\$SMTP_PASSWORD\" | passwd \$SMTP_USER" >> /opt/smtp.sh \
    && echo "sa-update" \
    && echo "service saslauthd start" >> /opt/smtp.sh \
    && echo "service postfix start" >> /opt/smtp.sh \
	&& echo "service spamass-milter start" >> /opt/smtp.sh \
	&& echo "service spamassassin start" >> /opt/smtp.sh \
    && echo "tail -f /var/log/mail.log" >> /opt/smtp.sh \
    && chmod +x /opt/smtp.sh \
    && adduser postfix sasl \

    && postmap /etc/postfix/virtual \
    && postmap /etc/postfix/virtual-mailbox-domains \
    && postmap /etc/postfix/virtual-mailbox-users
