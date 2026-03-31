{
    (async () => {
        let userbox = document.querySelector('#topright')


        let activesession = await AUTH.getSession();
        // todo: recheck session

        if (activesession) {
            userbox.innerHTML = activesession.username
        }


        if(await SITE.isMySite()) {
            document.querySelector(':root').classList.add('mysite')
        } else {
            document.querySelector(':root').classList.add('notmysite')
        }
        
    })()
}