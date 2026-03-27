

window.AUTH = class {

    static username = location.host.split('.')[0]

    static getUsername() {
        return this.username;
    }
}