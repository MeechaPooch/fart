async function createNewFolderHere() {

    let newfoldername = prompt('What would you like to call your new item?')

    if(!newfoldername) return;
    
    let newpath = location.pathname + '/' + newfoldername

    let res = await fetch(`https://api.micahpowch.com/newfolder`,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'post',
        body:JSON.stringify({
            location:newpath,
            username:location.hostname.split('.')[0],
        })
    })
    let text = await res.text();
    if(text=='reload') pagetrix.reload()
}