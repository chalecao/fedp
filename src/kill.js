const { execSync } = require('child_process');

function killPort(port) {
  if (!Number.parseInt(port)) {
    throw new Error('Invalid argument provided for port');
  }

  try {
    const cmd = `lsof -t -iTCP:${port} -sTCP:LISTEN -P -n`;
    const processId = execSync(cmd, { cwd: process.cwd() }).toString().trim();

    if (processId !== null) {
      console.log(`将会自动 kill 已占用 ${port} 的程序`);
      execSync(`kill ${processId}`);
    }

  } catch (e) {
    // console.log('自动杀死占用端口进程失败，请自行手工操作');
  }
}

module.exports = killPort;