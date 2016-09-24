# ansible-postgresql

[PostgreSQL](http://www.postgresql.org/) is a powerful, open source object-relational database system.

[![Platforms](http://img.shields.io/badge/platforms-ubuntu-lightgrey.svg?style=flat)](#)

Tunables
--------
* `postgresql_client` (boolean) - Install PostgreSQL client?
* `postgresql_server` (boolean) - Install PostgreSQL server?
* `postgresql_user` (string) - User to run postgresql as
* `postgresql_runtime_root` (string) - Directory for runtime data
* `postgresql_pidfile_path` (string) - Path for pidfile
* `postgresql_accepts_external_connections` (boolean) - Allow connections from places that aren't localhost?
* `postgresql_backup_enabled` (boolean) - Enable backups?
* `postgresql_backup_path` (string) - Directory to store backups
* `postgresql_backup_frequency` (string) - Frequency of backups

Dependencies
------------
* [telusdigital.apt-repository](https://github.com/telusdigital/ansible-apt-repository/)

Example Playbook
----------------
    - hosts: servers
      roles:
         - role: telusdigital.postgresql
           postgresql_server: yes
           postgresql_backup_enabled: yes
           postgresql_backup_frequency: daily
           postgresql_backup_path: /data/backup/postgresql

License
-------
[MIT](https://tldrlegal.com/license/mit-license)

Contributors
------------
* [Chris Olstrom](https://colstrom.github.io/) | [e-mail](mailto:chris@olstrom.com) | [Twitter](https://twitter.com/ChrisOlstrom)
* Aaron Pederson
* Steven Harradine
