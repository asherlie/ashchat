const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain
const ac = new AbortController()
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
		//titleBarStyle: 'hidden-inset',
		titleBarStyle: 'hidden'
	})

	win.loadFile('index.html')
}

app.whenReady().then(() => {
	create_window()
})

//app.on('quit', () => {
app.on('before-quit', () => {
    console.log('quitting')
    console.log(svq_out)
    console.log(svq_out.removeAllListeners)
    //svq_out.close()
    console.log(svq_out.removeAllListeners('data'))
    //ac.abort()
    svq_out.removeAllListeners('data')
    svq_in.removeAllListeners('data')
    //svq_out.removeListener('data')
    /*
     * win.removeAllListeners('close')
     * win.close()
     * app.exit()
     * svq_in.close()
     * svq_out.close()
    */
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
    //console.log(data)
    sp_str = data.toString().split(',') 
    to_send = sp_str[1] + ': ' + sp_str[2] + '\r\n'
    //win.webContents.send('msg_recvd', data.toString()+'\r\n')
    win.webContents.send('msg_recvd', to_send)
	//console.log('queue: ' + data)
})
