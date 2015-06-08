#!/bin/bash
useradd -g mail -m $SMTP_USER
echo -e "$SMTP_PASSWORD\n$SMTP_PASSWORD" | passwd $SMTP_USER

echo "pwcheck_method: saslauthd" > /etc/postfix/sasl/smtpd.conf
echo "mech_list: PLAIN LOGIN" >> /etc/postfix/sasl/smtpd.conf

service saslauthd start
service postfix start
tail -F /var/log/mail.log
