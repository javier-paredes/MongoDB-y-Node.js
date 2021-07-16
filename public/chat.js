const socket = io.connect();

socket.on('messages', function (data) {
    console.log(data);
    render(data)
})

function render(data) {
    let html = data.map(function (elem, index) {
        return (`
        <div>
            <b style="color:blue;">${elem.autor}</b> 
            [<span style="color:brown;">${elem.fyh}</span>] : 
            <i style="color:green;">${elem.texto}</i>
        </div>
    `)
    }).join(' ');
    document.getElementById('messages').innerHTML = html;
}

socket.on('messages', function (data) { render(data); });

function addMessage(e) {
    let mensaje = {
        autor: document.getElementById('username').value,
        fyh: new Date().toLocaleString(),
        texto: document.getElementById('texto').value
    }
    console.log(mensaje);
    
    socket.emit('new-message', mensaje);
    return false;
}

