// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const ollama = require('ollama');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	console.log(`Quack Quack I'm active!`);
	
	const disposable = vscode.commands.registerCommand('duckdb.helloWorld', function () {
		
		vscode.window.showInformationMessage('Hello World from duckdb!');
		const panel = vscode.window.createWebviewPanel(
			"ddbChat",
			"Quack Chat",
			vscode.ViewColumn.Four,
			{ enableScripts: true }
		  );
		  panel.webview.html = getWebViewContent();
	
		  panel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === "chat") {
			  const userPrompt = message.text;
			  let responseText = "";
	
			  try {
				const streamResponse = await ollama.chat({
				  model: "deepseek-r1:latest",
				  messages: [{ role: "user", content: userPrompt }],
				  stream: true,
				});
				for await (const part of streamResponse) {
				  responseText += part.message.content;
				  panel.webview.postMessage({
					command: "chatResponse",
					text: responseText,
				  });
				}
			  } catch (err) {
				panel.webview.postMessage({
				  command: "chatError",
				  text: `Error: ${String(err)}`,
				});
			  }
			}
		  });
		}
	  );

	context.subscriptions.push(disposable);
}

function getWebViewContent() {
	return `
	  <!DOCTYPE html>
  <html lang="en">
	<head>
	  <meta charset="UTF-8" />
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <title>ddb</title>
	  <style>
		body {
		  font-family: sans-serif;
		  margin: 1rem;
		}
		#prompt {
		  width: 100%;
		  box-sizing: border-box;
		}
		#response {
		  border: 1px solid #ccc;
		  margin-top: 1rem;
		  padding: 0.5rem;
		}
	  </style>
	</head>
	<body>
	  <h2>Quack Chat</h2>
	  <textarea placeholder="enter your question" id="prompt"></textarea> <br />
	  <button id="askBtn">Ask</button>
	  <div id="response"></div>
	</body>
	<script>
	  const vscode = acquireVsCodeApi();
  
	  document.getElementById("askBtn").addEventListener("click", () => {
		const text = document.getElementById("prompt").value;
		vscode.postMessage({ command: "chat", text });
	  });
  
	  window.addEventListener('message', e => {
			  const {command, text} = e.data
			  if(command === 'chatResponse'){
				  document.getElementById('response').innerText = text
			  }
		  })
	</script>
  </html>
  `;
  }

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
