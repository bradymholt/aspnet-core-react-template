const timestamp = Math.floor(new Date().getTime()/1000).toString();
const execSync = require("child_process").execSync;
execSync(`dotnet ef migrations add ${timestamp}`);
