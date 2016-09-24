# ASP.NET Core / React SPA Template App

This app is a template application using ASP.NET Core for a REST/JSON API server and React for a web client.

## Overview of Stack
- Server
  - ASP.NET Core
  - PostgresSQL
  - Entity Framework Core w/ EF Migrations
  - JSON Web Token (JWT) authorization with OpenIddict
- Client
  - React
  - Webpack for asset bundling and HMR
- Testing
  - xUnit for .NET Core
  - Enzyme for React
- DevOps
  - Ansible playbook for provisioning (Nginx reverse proxy, SSL via Let's Encrypt, PostgresSQL backups to S3)
  - Ansible playbook for deployment

## Setup

1. Install the following:
   - [.NET Core](https://www.microsoft.com/net/core)
   - [Node.js >= 4.0](https://nodejs.org/en/download/)
   - [Ansible >= 2.0](http://docs.ansible.com/ansible/intro_installation.html)
   - [Docker](https://docs.docker.com/engine/installation/)
2. Run `npm install && npm start`
3. Open browser and navigate to [http://localhost:5000](http://localhost:5000).

## Scripts

### `npm install`

When first cloning the repo or adding new dependencies, run this command.  This will:

- Install Node dependencies from package.json
- Install .NET Core dependencies from api/project.json and api.test/project.json (dotnet restore)

### `npm start`

To start the app for development, run this command.  This will:

- Run `docker-compose up` to ensure the Postgres Docker image is up and running
- Run dotnet watch run which will build the app (if changed), watch for changes and start the web server on http://localhost:5000
- Run Webpack dev middleware with HMR via [ASP.NET JavaScriptServices](https://github.com/aspnet/JavaScriptServices)

### `npm test`

This will run the xUnit tests in api.test/ and the Mocha tests in client-react.test/.

### `npm run provision:prod`

 _Before running this script, you need to create a ops/hosts file first.  See the [ops README](ops/) for instructions._

 This will run the ops/provision.yml Ansible playbook and provision hosts in ops/hosts inventory file.  This prepares the hosts to recieve deployments by doing the following:
  - Install Nginx
  - Generate a SSL certificate from [Let's Encrypt](https://letsencrypt.org/) and configure Nginx to use it
  - Install .Net Core
  - Install Supervisor (will run/manage the ASP.NET app)
  - Install PostgreSQL
  - Setup a cron job to automatically backup the PostgresSQL database, compress it, and upload it to S3.
  - Setup UFW (firewall) to lock everything down except inbound SSH and web traffic
  - Create a deploy user, directory for deployments and configure Nginx to serve from this directory

### `npm run deploy:prod`

_Before running this script, you need to create a ops/hosts file first.  See the [ops README](ops/) for instructions._

This script will:
 - Build release Webpack bundles
 - Package the .NET Core application in Release mode (dotnet publish)
 - Run the ops/deploy.yml Ansible playbook to deploy this app to hosts in /ops/hosts inventory file.  This does the following:
  - Copies the build assets to the remote host(s)
  - Updates the `appsettings.release.json` file with PostgresSQL credentials specified in ops/hosts file and the app URL (needed for JWT tokens)
  - Restarts the app so that changes will be picked up
