async function createNewFolderHere() {

    let newfoldername = prompt('What would you like to call your new item?')

    if (!newfoldername) return;

    let newpath = location.pathname + '/' + newfoldername
    let token = (await AUTH.getSession()).token

    let res = await fetch(`https://api.micahpowch.com/newfolder`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({
            location: newpath,
            username: location.hostname.split('.')[0],
            token,
        })
    })
    let text = await res.text();
    if (text == 'reload') pagetrix.reload()
}

async function uploadFile(file, filepath, username) {
    let session = await AUTH.getSession()
    if (!username) username = session.username;
    console.log('uploading', file)

    var data = new FormData()
    data.append('file', file)
    data.append('filepath', filepath)
    data.append('username', username)

    data.append('token', session.token)

    let res = await fetch('https://api.micahpowch.com/upload', {
        method: 'POST',
        body: data,
    })

    return res;
}
async function deleteFile(filepath, username) {
    let session = await AUTH.getSession()
    if (!username) username = session.username;
    console.log('deleting', filepath)

    let res = await fetch('https://api.micahpowch.com/delete', {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            filepath, username, token: session.token,
        }),
    })

    return res;
}

window.API = {
    createNewFolderHere,
    uploadFile,
    deleteFile,
}