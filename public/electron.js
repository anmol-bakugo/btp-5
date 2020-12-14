const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { menu } = require('./menu');
const Store = require('./store.js');
const { autoUpdater } = require('electron-updater');

const fs = require('fs');
const readline = require('readline');
const latex = require('node-latex');

let mainWindow;
const isWindows = 'win32' === process.platform;

const store = new Store({
	configName: 'window-preferences',
	defaults: {
		windowBounds: {
			width: 1600,
			height: 900,
		},
	},
});

app.on('ready', async () => {
	let { width, height } = store.get('windowBounds');

	mainWindow = new BrowserWindow({
		width: width,
		height: height,
		center: true,
		minWidth: 1600 * 0.75,
		minHeight: 900 * 0.75,
		//icon: `${__dirname}/images/logo/birds-kitchen.png`,
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		frame: !isWindows,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			worldSafeExecuteJavaScript: true,
		},
	});

	mainWindow
		.loadURL(
			isDev
				? 'http://localhost:3000'
				: `file://${path.join(__dirname, '../build/index.html')}`
		)
		.then((r) => r);
	
	mainWindow.webContents.openDevTools();	

	mainWindow.on('resize', () => {
		let { width, height } = mainWindow.getBounds();
		store.set('windowBounds', { width, height });
	});

	const prefs = globalShortcut.register('CommandOrControl+,', () => {
		if (mainWindow === BrowserWindow.getFocusedWindow()) {
			mainWindow.webContents.send('appMenu', {
				type: 'preferences',
				tab: 'storage',
			});
		}
	});

	if (!prefs) {
		console.log('globalShortcut registration failed');
	}

	autoUpdater.checkForUpdatesAndNotify();

	mainWindow.on('closed', () => (mainWindow = null));
});

app.disableHardwareAcceleration();

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
	if ('darwin' !== process.platform) {
		app.quit();
	}
});

ipcMain.on('app_version', (e) => {
	e.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents.send('update_available');
	});
});

autoUpdater.on('update-downloaded', () => {
	mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
	autoUpdater.quitAndInstall();
});

ipcMain.handle(`display-app-menu`, (e, args) => {
	if (isWindows && mainWindow) {
		menu.popup({ window: mainWindow, x: args.x, y: args.y });
	}
});

const processLineByLine = async (formValues) =>{
    sample_text_file_path = (isDev ? './public/Sample_MOM.txt' : path.join(process.resourcesPath,'extraResources','Sample_MOM.txt'));
    
    const fileStream = fs.createReadStream(sample_text_file_path);
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity 
    });
  
    lines = ""
    count = 0;
    for await (line of rl){
        count+=1;
        if(count==40)
        {
            if(line.charAt(13)=='{')
            {
                console.log(" Got the { in 40 th line");
                line = line.substring(0,14) + formValues.title + line.substring(14);
            }
        }
  
        lines+= line+'\n';
        
        
    }
    
    fileStream.destroy();
    return lines;
};

ipcMain.on("pdftest",(event,formValues)=>{
	console.log(formValues.title);
	processLineByLine(formValues).then(lines =>{
		const pdf = latex(lines)
		const fileName = formValues.file_path;
		const output = fs.createWriteStream(fileName);
		pdf.pipe(output);

		pdf.on('error', err => {
			console.error(err);
			event.sender.send("pdftestComplete",err);
		})

		pdf.on('finish', () => {
		  console.log('PDF generated!');
		  // para.innerHTML = "Hurray, pdf generated!";   // to renderer
		  event.sender.send("pdftestComplete",lines);
		})


		
		
    });
	// write catch in case of error 
})