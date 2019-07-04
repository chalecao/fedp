import shell from 'shelljs'

export function runCmds(cmds) {
    if (Array.isArray(cmds)) {
        cmds.forEach(cmd => {
            shell.exec(cmd, { async: true });
        })
    } else {
        shell.exec(cmds, { async: true });
    }

}

export function getLink(host, urlsuffix) {
    return new Promise((resolve, reject) => {
        if (urlsuffix) {
            resolve(`http://${host}/${urlsuffix}`);
        } else {
            shell.exec('git remote -v', { silent: true }, (code, stdout, stderr) => {
                if (/.com.(.*?)\.git/i.test(stdout)) {
                    var path = RegExp.$1.replace('/', '-');
                    var name = /mui-/.test(path) ? 'mobile' : 'index';
                    var url = `http://${host}/${path}/${name}`;
                    resolve(url);
                } else {
                    resolve(`http://${host}/`);
                }
            });
        }
    });
}