
window.AUTH = class {

    static username = location.host.split('.')[0]

    static getUsername() {
        return this.username;
    }

    static async login(username,password) {
        let res = await fetch('https://api.micahpowch.com/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username,password
            })
        })
        if(res.status!=200) {
            let message = await res.text()
            alert('wrong username or password.');
            // alert(res.status==401?'wrong username or password. ' : 'error: ' + message);
            return false;
        }
        let resjson = await res.json();

        console.log('resjson',resjson)
        let token = resjson.token;
        console.log('setting  token',token)
        COOKIE.set('token',token)

        window.pagetrix.goto(`https://${username}.micahpowch.com`)
    }

    // todo - recheck session
    static async getSession() {
        let token = COOKIE.get('token');
        if(!token) return null;

        let username = token.split('.')[0];

        return {username,token}
    }
}
window.AUTH =AUTH;