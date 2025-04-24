/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const HELP_TEXTS = {
    smtp_type: _(
        'If you set SMTP provider to "Turris", the servers provided to members of the Turris project would be ' +
            "used. These servers do not require any additional settings. If you want to set your own SMTP server, please " +
            'select "Custom" and enter required settings.'
    ),
    common: {
        severity_filter: _(
            "Depending on the importance or severity of the notification, you can choose to receive notifications about all events or only about those that require your attention."
        ),
        to: _(
            "Email address of recipient. Separate multiple addresses by comma."
        ),
        send_news: _("Send notifications about new releases."),
    },
    smtp_turris: {
        sender_name: _(
            'Name of the sender that will be used before the "at" symbol in the email address. For example: "home-router@notify.turis.cz"'
        ),
    },
    smtp_custom: {
        from: _("This is the address notifications are send from."),
    },
};

export default HELP_TEXTS;
