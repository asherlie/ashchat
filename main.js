const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain
var svq_in = require('svmq').open(5)
var svq_out = require('svmq').open(10)
let win = null

function create_window(){
	win = new BrowserWindow({
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true
		},
		width: 800,
		height: 600,
		titleBarStyle: 'hidden'
	})

	win.loadFile('index.html')
}

app.whenReady().then(() => {
	create_window()
})

/*
 * ipc.on('pop_msg_req', event => {
 *     console.log('recvd request for msg')
 *     //event.returnValue = "heyyooo"
 *     event.reply("msg_recvd", "asher,0:0:0,this is text")
 *     //event.sender.send("ok", "this should show up")
 * })
*/

ipc.on('msg_submission', (event, arg) => {
    //svq_in.push(new Buffer(arg))
    //svq_in.push(Buffer.alloc(arg))
	console.log('broadcasting: \'' + Buffer.from(arg) + '\'')
    svq_in.push(Buffer.from(arg))
})

svq_out.on('data', (data) => {
    //ipc.send('msg_recvd', data)
    win.webContents.send('msg_recvd', data.toString()+'\r\n')
	//console.log('queue: ' + data)
})
