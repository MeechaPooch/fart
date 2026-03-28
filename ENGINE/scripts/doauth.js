{
    (async () => {
        let userbox = document.querySelector('#topright')


        let activesession = await AUTH.getSession();
        // todo: recheck session

        if (activesession) {
            userbox.innerHTML = activesession.username
        }



        
    })()
}