This folder contains [Ansible](https://www.ansible.com/) assets responsible for provisioning hosts and deploying this application.

## Setup

1. Procure access to Ubuntu 16 host(s) which will be used to host this application.  [AWS](aws.amazon.com) or [Digital Ocean](https://m.do.co/c/974ef9a471c1) are good options.
2. Setup DNS records to point to these host(s).
3. Create `hosts` file in this directory, using `hosts.example` as a pattern.

## Usage

From the root of this respository, run one of the following commands:
- `npm run provision:prod`: This will provision all production hosts specified in hosts file.
- `npm run deploy:prod`: This will deploy the app to all production hosts specified in hosts file.

## Notes
 - The deploy.yml and provision.yml playbooks were written against and tested on Ubuntu 16.
 - The [Ansible Best Practices](http://docs.ansible.com/ansible/playbooks_best_practices.html) document demonstrates using /groups_vars/... for application environment variables (i.e. production / staging) and /group_vars/all for global variables.  However, we are using inventory group variables, all contained within the inventory file (hosts) to define environment and global variables.  Because of this, all the variables are in a single location and easily managed.
