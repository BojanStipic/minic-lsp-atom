const cp = require('child_process');
const { shell } = require("electron");
const {AutoLanguageClient} = require('atom-languageclient')
const PACKAGE_NAME = require('../package.json').name;

class MiniCLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.c' ]; }
  getLanguageName () { return 'C'; }
  getServerName () { return 'minic-lsp'; }

  startServerProcess (projectPath) {
    const config = atom.config.get(PACKAGE_NAME);

    const childProcess = cp.spawn(config.miniclspCommand, [], {cwd: projectPath});

    childProcess.on("error", err =>
      atom.notifications.addError(
        "Unable to start the minic-lsp language server.",
        {
          dismissable: true,
          buttons: [
            {
              text: "View README",
              onDidClick: () =>
                shell.openExternal("https://github.com/BojanStipic/minic-lsp-atom")
            },
            {
              text: "Download minic-lsp",
              onDidClick: () =>
                shell.openExternal("https://github.com/BojanStipic/minic-lsp")
            }
          ],
          description:
          "This can occur if you do not have minic-lsp installed or if it is not in your path.\n\nViewing the README is strongly recommended."
        }
      )
    );

    return childProcess;
  }
}

module.exports = new MiniCLanguageClient()

module.exports.config = {
  miniclspCommand: {
    type: 'string',
    title: 'minic-lsp executable',
    description: 'Specify the location of minic-lsp if it is not in your $PATH. Reload or restart to take effect',
    default: 'minic-lsp'
  }
};
