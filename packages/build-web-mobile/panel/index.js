// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>build-web-mobile</h2>
    <hr />
    <div id="status">status: idle</div>
    <hr />
    <ui-button id="only-build">构建</ui-button>
    <ui-button id="build-and-deploy">构建并部署</ui-button>
    <ui-button id="change-state">部署服务器</ui-button>
  `,

  // element and variable binding
  $: {
    status: '#status',
    onlyBuild: '#only-build',
    buildAndDeploy: '#build-and-deploy',
    changeState: '#change-state',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.$onlyBuild.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('build-web-mobile:only-build');
    });
    this.$buildAndDeploy.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('build-web-mobile:build-and-deploy');
    });
  },

  // register your ipc messages here
  messages: {
    'build-web-mobile:get-status' (event, callback) {
      // 返回当前状态给主进程
      const currentStatus = this.$status.innerText.replace('status: ', '');
      if (callback) {
        callback(currentStatus);
      }
    },
    
    'build-web-mobile:set-status' (event, msg) {
      this.$status.innerText = `status: ${msg}`;

      let logMsg = '[build-web-mobile] ';
      if (msg == 'building') {
        logMsg += '构建中';
      }
      else if (msg == 'completed') {
        logMsg += '构建完成';
      }
      else if (msg == 'deploying') {
        logMsg += '部署中';
      }
      else if (msg == 'deployed') {
        logMsg += '部署完成';
      }
      else if (msg == 'failed') {
        logMsg += '操作失败';
      }
      else if (msg == 'idle') {
        logMsg += '空闲状态';
      }
      Editor.log(logMsg);
    },
  }
});