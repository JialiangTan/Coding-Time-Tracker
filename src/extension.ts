import * as vscode from 'vscode';
import { TextDecoder, TextEncoder } from 'util';

async function fileExist(fileUri: vscode.Uri) {
	try {
		await vscode.workspace.fs.stat(fileUri);
		return true;
	} catch {
		return false;
	}	
}

async function readFile(fileUri: vscode.Uri) {
	let exist = await fileExist(fileUri);
	if (exist) {
		let buffer = await vscode.workspace.fs.readFile(fileUri);
		return new TextDecoder().decode(buffer);
	} else {
		return "Coding events:";
	}
	
}

async function getUserName() {
	const name: string | undefined = await vscode.window.showInputBox({
		prompt: "Enter your name to continue:"
	});
	if (name) {
		console.log('User name is: ' + name);
		let logUri = vscode.Uri.file('/tmp/extension/' + userDate + '/' + name + '/codeLog');
		return logUri;
	} else {
		let logUri = vscode.Uri.file('/tmp/extension/undefined/codeLog');
		return logUri;
	}

}

let year = new Date().getFullYear().toString();
let month = new Date().getMonth().toString() + 1;
let day = new Date().getDate().toString();
let userDate = year + month + day;

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "coding-time-tracker" is now active!');

	// let userName = getUserName();
	// console.log('Username2: ' + userName);

	// let curFileName1 = ' ';
	// let curFileName2 = ' ';
	let curlineNum1 = 0;
	let curlineNum2 = 0;

	let time1 = 0;
	let time2 = 0;


	if (vscode.workspace.workspaceFolders) {

		let name = vscode.workspace.workspaceFolders[0].uri.path;
		let userName = name.split('/')[2];

		// get login date in 2022/1/1 format

		// let logUri = getUserName();

		console.log('Log in date: ' + userDate);
		console.log('Log in as ' + userName);
		let logUri = vscode.Uri.file('/tmp/extension/' + userDate + '/' + userName + '/codeLog');
		console.log('Store data in: ' + logUri);
		
		// vscode.window.showInformationMessage("write in " + logUri);
		
		readFile(logUri).then(
			logData => {
				// let lastActiveEditor: vscode.TextEditor | undefined = undefined;
				vscode.window.onDidChangeActiveTextEditor(activeEditor => {
					// if (lastActiveEditor) {
					// 	const document = lastActiveEditor.document;
					// 	let curTime = new Date();
					// 	let lineNum = document.lineCount;
					// 	logData += '\n Close:' + curTime.toString() + ', ' + document.fileName + ', ' + lineNum.toString() + ' lines of codes';
					// 	vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData));
					// 	vscode.window.showInformationMessage("1. written in " + logUri);
					// 	lastActiveEditor = undefined;
					// 	// vscode.window.showTextDocument(logUri);
					// }
					if (activeEditor) {
						const document = activeEditor.document;
						// lastActiveEditor = activeEditor;
						
						let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
						
						let lineNum = document.lineCount;
						// curFileName1 = document.fileName;

						time1 = new Date().valueOf();
												
						vscode.window.showInformationMessage('curent file: ' + document.fileName);

						logData += '\n Open: ' + curTime.toString() + ', ' + document.fileName + ', ' + lineNum.toString() + ' lines of codes';
						vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData));
						// vscode.window.showTextDocument(logUri);
				        vscode.window.showInformationMessage("2. written in " + logUri);

						setTimeout(() => {
							let curLineNum = document.lineCount;
							if (curLineNum - lineNum == 0) {
								vscode.window.showInformationMessage('Not editing in 1 minute');
								logData += '\n Not editing in 1 minute';
								vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData)); 
							}
						}, 60000);


					}
				});

				vscode.workspace.onDidSaveTextDocument(document => {
					let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
					let lineNum = document.lineCount;

					// curFileName2 = document.fileName;
					// curlineNum2 = lineNum;

					// time2 = new Date().valueOf();

					// let lineChange = curlineNum2 - curlineNum1;

					// if (curFileName2 == curFileName1) {
					// 	vscode.window.showInformationMessage(lineChange + ' line changes');
					// 	let timeChange = time2 - time1;

					//     let h, m, s;
					//     h = Math.floor(timeChange/1000/60/60);
					//     m = Math.floor((timeChange/1000/60/60 - h)*60);
					// 	s = Math.floor(((timeChange/1000/60/60 - h)*60 - m)*60);
					// 	logData += '\n Save: ' + document.fileName + ', spent ' + h + ' hour ' + m + ' minute ' + s + ' second, write ' + lineChange.toString() + ' lines';
					// 	vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData));

					// } else {
					// 	logData += '\n file name incorrect';
					// 	vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData));
					// }
					

					logData += '\n Save: ' + curTime + ', ' + document.fileName + ', ' + lineNum.toString() + ' lines of codes';					 
					vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData));
					
					vscode.window.showInformationMessage("save file" + logUri);
				});
				
			}
		)

		
	    let terminalUri = vscode.Uri.file('/tmp/extension/' + userDate + '/' + userName + '/terLog');
		// let terminalUri = vscode.Uri.file('/tmp/test');
		readFile(terminalUri).then(
			terminalData => {

				function checkActiveTerminal() {
					let { activeTerminal} = vscode.window;
					vscode.window.showInformationMessage('avtiveTerminal: ' + (activeTerminal ? activeTerminal.name : '<none>'));
					let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
					// logData += '\n' + curTime.toString() + ": [Terminal Active] " + activeTerminal?.name
					terminalData += '\n \n' + curTime.toString() + ": [Terminal Active] \n";
					vscode.workspace.fs.writeFile(vscode.Uri.file(terminalUri.path), new TextEncoder().encode(terminalData));
					// vscode.window.showInformationMessage("Open terminal!");
					activeTerminal?.sendText('ls', true);
					activeTerminal?.sendText('script -a ' + '/tmp/extension/' + userDate + '/' + userName + '/terLog', true);
				}

				checkActiveTerminal();
				vscode.window.onDidChangeActiveTerminal(checkActiveTerminal);

				// function CloseActiveTerminal() {
				// 	let { activeTerminal} = vscode.window;
				// 	let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
				// 	// logData += '\n' + curTime.toString() + ": [Terminal Active] " + activeTerminal?.name
				// 	terminalData += '\n' + curTime.toString() + ": [Terminal Close] ";
				// 	vscode.workspace.fs.writeFile(vscode.Uri.file(terminalUri.path), new TextEncoder().encode(terminalData));
				// 	activeTerminal?.sendText('exit', true);
				// 	vscode.window.showInformationMessage("Terminal close!");
				// }

				// CloseActiveTerminal();
				// vscode.window.onDidCloseTerminal(CloseActiveTerminal);

				vscode.window.onDidCloseTerminal(terminal => {
					let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
					terminal?.sendText('exit', true);
					terminalData += '\n' + curTime.toString() + ": [Terminal Close] ";
					vscode.workspace.fs.writeFile(vscode.Uri.file(terminalUri.path), new TextEncoder().encode(terminalData));
					console.log('close terminal');

				})

			}
		)
	}

}

export function deactivate() {
	console.log('extension deactivate');

}
