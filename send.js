const ipc = require('electron').ipcRenderer
msg = document.getElementById('messages')
btn = document.getElementById('submit')
to_send = document.getElementById('console')

/* when button is clicked, pass it along for broadcasting
 * this should be done with the enter key
 */
btn.addEventListener('click', () => {
	//console.log('clicked')
	//ipc.send('pop_msg_req')
	ipc.send('msg_submission', to_send.value)
	to_send.value = ''

	/*
	 * ipc.on('msg_resp', (event, arg) => {
	 *     msg.value +=  arg
	 *     //msg.innerHTML = "boyy" + arg
	 * })
	*/
	/*
	 * ipc.once('msg_resp', data => {
	 *     console.log(data)
	 *     msg.innerHTML = "MORE TEXT WAT?? " + data
	 * })
	*/
})

ipc.on('msg_recvd', (event, arg) => {
	msg.value = arg
})
