function getSiteUsername() {
    return window.location.hostname.split('.')[0]
}
async function isMySite() {
    return (await AUTH.getSession())?.username == getSiteUsername()
}

const SITE = {
    getSiteUsername,
    isMySite
}
window.SITE = SITE;