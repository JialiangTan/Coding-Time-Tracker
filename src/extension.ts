import * as vscode from 'vscode';
import { ProgressLocation} from 'vscode';
import { TextDecoder, TextEncoder } from 'util';

import { CodeTime } from './codetime'
// import { writeHeapSnapshot } from 'v8';
// import { spawn } from 'child_process';
const { performance } = require('perf_hooks');


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

async function getFeedback() {
	let feedback1: string | undefined = await vscode.window.showInputBox({
		prompt: "How tired do you feel now? (please choose from 1-5)"
	});
	if (feedback1) {
		console.log(feedback1);
		return feedback1;
	}
}

var codetime: CodeTime;

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "coding-time-tracker" is now active!');

	codetime = new CodeTime;

	codetime.initialize();
	//codetime.myFunc();

	codetime.getCodeInfo();

	var tiredness = setInterval(codetime.myFunc, 1000*20);
	// console.log('Tiredness is: ' + tiredness);


	let userDate = codetime.getToday();
	let userName = codetime.getUserName();
	console.log('!!!!! Log in as ' + userName);

	if (vscode.workspace.workspaceFolders) {

		// let name = vscode.workspace.workspaceFolders[0].uri.path;
		// let userName = name.split('/')[2];

		// console.log('Log in date: ' + userDate);
		// console.log('Log in as ' + userName);

		let logUri = vscode.Uri.file('/tmp/CodeTime/' + userDate + '/' + userName + '/codeLog');
		console.log('Store data in: ' + logUri);
		
		let userFeedback = vscode.Uri.file('/tmp/CodeTime/' + userDate + '/' + userName + '/feedLog');
		console.log('Store feedback in: ' + userFeedback);


		readFile(userFeedback).then(
			userData => {
				// var tiredness = setInterval(codetime.myFunc, 1000*20);
				// let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
				// userData += '\n Feedback: ' + curTime.toString() + ' ' + tiredness;
				// console.log('!!!');
				// vscode.workspace.fs.writeFile(vscode.Uri.file(userFeedback.path), new TextEncoder().encode(userData));

				// setInterval(function() {
				// 	var tiredness = codetime.myFunc;
				// 	let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
				//     userData += '\n Feedback: ' + curTime.toString() + ' ' + tiredness;
				//     console.log('!!!');
				//     vscode.workspace.fs.writeFile(vscode.Uri.file(userFeedback.path), new TextEncoder().encode(userData));
				// }, 1000*20);
			}
		) // readFile(userFeedback)

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
						
						logData += '\n Open: ' + curTime.toString() + ', ' + document.fileName + ', ' + lineNum.toString() + ' lines of codes';
						console.log('Writen in codeLog');
						vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData));
						
						setTimeout(() => {
							let curLineNum = document.lineCount;
							if (curLineNum - lineNum == 0) {
								// vscode.window.showInformationMessage('Not editing in 1 minute');
								logData += '\n Not editing in 20 minute';
								vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData)); 
							}
						}, 1200000);


					}
				});

				
				// console.time() 
				vscode.workspace.onDidSaveTextDocument(document => {
					var startTime = performance.now()
					let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
					// let lineNum = document.lineCount;
					// let content = document.getText();

					// logData += '\n Save: ' + curTime + ', ' + document.fileName + ', ' + lineNum.toString() + ' lines of codes';
					
					// logData += '\n' + content;
					// vscode.workspace.fs.writeFile(vscode.Uri.file(logUri.path), new TextEncoder().encode(logData));
					var endTime = performance.now()
				    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)				
				});
				// console.timeEnd()
				
			}
		) // readFile(logUri)

		// // get feature info, moved to codetime.ts
		// let contentUri = vscode.Uri.file('/tmp/CodeTime/' + userDate + '/' + userName + '/latest.txt');
		// readFile(contentUri).then(
		// 	latestData => {
		// 		vscode.workspace.onDidSaveTextDocument(document => {
		// 			let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
		// 			let lineNum = document.lineCount;
		// 			let content = document.getText();


		// 			//latestData += '\n Save: ' + curTime + ', ' + document.fileName + ', ' + lineNum.toString() + ' lines of codes';
					
		// 			latestData = content;
		// 			//latestData += '/n ---------- \n';
		// 			vscode.workspace.fs.writeFile(vscode.Uri.file(contentUri.path), new TextEncoder().encode(latestData));
					
		// 		});

		// 	})

		
	    let terminalUri = vscode.Uri.file('/tmp/CodeTime/' + userDate + '/' + userName + '/terLog');
		readFile(terminalUri).then(
			terminalData => {

				function checkActiveTerminal() {
					let { activeTerminal} = vscode.window;
					// vscode.window.showInformationMessage('avtiveTerminal: ' + (activeTerminal ? activeTerminal.name : '<none>'));
					let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
					// logData += '\n' + curTime.toString() + ": [Terminal Active] " + activeTerminal?.name
					terminalData += '\n \n' + curTime.toString() + ": [Terminal Active] \n";
					vscode.workspace.fs.writeFile(vscode.Uri.file(terminalUri.path), new TextEncoder().encode(terminalData));
					activeTerminal?.sendText('script -a ' + '/tmp/CodeTime/' + userDate + '/' + userName + '/terLog', true);
				}

				checkActiveTerminal();
				vscode.window.onDidChangeActiveTerminal(checkActiveTerminal);

				vscode.window.onDidCloseTerminal(terminal => {
					let curTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
					terminal?.sendText('exit', true);
					terminalData += '\n' + curTime.toString() + ": [Terminal Close] ";
					vscode.workspace.fs.writeFile(vscode.Uri.file(terminalUri.path), new TextEncoder().encode(terminalData));
					// console.log('close terminal');

				})

			}
		) // readFile(terminalUri)

		// automatically check assignment progress
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'Assignment 1'}, p => {
			vscode.window.showInformationMessage("Estimating your assignment progress...");
            return new Promise((resolve, reject) => {
                p.report({message: 'Start working...' });
                let count= 0;
                let handle = setInterval(() => {
                    count++;
                    p.report({message: 'Done ' + count + '%' });
                    if (count >= 100) {
                        clearInterval(handle);
                        resolve(1);
						vscode.window.showInformationMessage("Assignment completed!");

                    }
                }, 500);
            });
        });
	}

	// let disposable = vscode.commands.registerCommand('coding-time-tracker.check', () => {
	// 	vscode.window.showInformationMessage("Command alive!");
		
	// 	// vscode.window.withProgress({
	// 	// 	location: vscode.ProgressLocation.Notification,
	// 	// 	title: "I am long running!",
	// 	// 	cancellable: true
	// 	// }, (progress, token) =>{
	// 	// 	token.onCancellationRequested() => {
	// 	// 		console.log("User canceled the long running operation")
	// 	// 	};
	// 	// 	progress.report({increment: 0});
	// 	// });
	// })

	// progress bar with show info message
	// context.subscriptions.push(vscode.commands.registerCommand('coding-time-tracker.check', () => {
	// 	vscode.window.showInformationMessage("Command alive!");
	// 	vscode.window.withProgress({
	// 		location: ProgressLocation.Notification,
	// 		title: "Assignmemt progress: ",
	// 		cancellable: true
	// 	}, (progress, token) => {
	// 		token.onCancellationRequested(() => {
	// 			console.log("User canceled the long running operation");
	// 		});

	// 		progress.report({ increment: 0 });

	// 		setTimeout(() => {
	// 			// progress.report({ increment: 10, message: "I am long running! - still going..." });
	// 			progress.report({ increment: 10, message: "You just started..." });
	// 		}, 1000);

	// 		setTimeout(() => {
	// 			progress.report({ increment: 40, message: "Still going even more..." });
	// 		}, 2000);

	// 		setTimeout(() => {
	// 			progress.report({ increment: 50, message: "Half works have done..." });
	// 		}, 3000);

	// 		setTimeout(() => {
	// 			progress.report({ increment: 80, message: "Almost done..." });
	// 		}, 4000);

	// 		const p = new Promise<void>(resolve => {
	// 			setTimeout(() => {
	// 				resolve();
	// 			}, 6000);
	// 		});

	// 		return p;
	// 	});
	// }));


    let disposable = vscode.commands.registerCommand('coding-time-tracker.check', () => {
		vscode.window.showInformationMessage("Estimating the assignment progress...");
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'Assignment 1'}, p => {
            return new Promise((resolve, reject) => {
                p.report({message: 'Start working...' });
                let count= 0;
                let handle = setInterval(() => {
                    count++;
                    p.report({message: 'Done ' + count*10 + '%' });
                    if (count >= 10) {
                        clearInterval(handle);
                        resolve(1);
                    }
                }, 1000);
            });
        });
    });

    context.subscriptions.push(disposable);



	
}

export function deactivate() {
	codetime.dispose();
}
