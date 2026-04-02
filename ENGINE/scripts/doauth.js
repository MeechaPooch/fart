{
    (async () => {
        let userbox = document.querySelector('#usernametext')
        let logoutbutton = document.querySelector('#logoutbutton')
        let mysitebutton = document.querySelector('#mysitebutton')


        let activesession = await AUTH.getSession();
        // todo: recheck session

        if (activesession) {
            userbox.innerText = activesession.username;
            mysitebutton.setAttribute('href',`https://${activesession.username}.micahpowch.com`)
            
        }


        if(await SITE.isMySite()) {
            document.querySelector(':root').classList.add('mysite')
        } else {
            document.querySelector(':root').classList.add('notmysite')
        }
        
    })()
}