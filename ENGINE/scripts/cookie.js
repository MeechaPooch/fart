
const COOKIE = {
    get(name) {
        let cookiestring = RegExp(name + "=[^;]+").exec(document.cookie);
        // Return everything after the equal sign, or an empty string if the cookie name not found
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
    },
    delete(name) {
        document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/;' + location.host`
    },
    // options: {expires?: number}
    set(name, value, options) {
        document.cookie = `${name}=${value}; ${Object.entries(options ?? {}).map(entry => `${entry[0]}=${entry[1]}; `).join('')}`
    },
    nuke: function (cookieName) {
        // gemini generated
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.micahpowch.com;`;

        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=micahpowch.com;`;
    },
}

// window.COOKIE = {
//     nuke: function (cookieName) {
//         // gemini generated
//         document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

//         document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.micahpowch.com;`;

//         document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=micahpowch.com;`;
//     },
//     set: function (name, value, days) {
//         this.nuke(name)
//         var domain, domainParts, date, expires, host;

//         if (days) {
//             date = new Date();
//             date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//             expires = "; expires=" + date.toGMTString();
//         }
//         else {
//             expires = "";
//         }

//         host = location.host;
//         if (host.split('.').length === 1) {
//             // no "." in a domain - it's localhost or something similar
//             document.cookie = name + "=" + value + expires + "; path=/";
//         }
//         else {
//             // Remember the cookie on all subdomains.
//             //
//             // Start with trying to set cookie to the top domain.
//             // (example: if user is on foo.com, try to set
//             //  cookie to domain ".com")
//             //
//             // If the cookie will not be set, it means ".com"
//             // is a top level domain and we need to
//             // set the cookie to ".foo.com"
//             domainParts = host.split('.');
//             domainParts.shift();
//             domain = '.' + domainParts.join('.');

//             document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;

//             // check if cookie was successfuly set to the given domain
//             // (otherwise it was a Top-Level Domain)
//             if (Cookie.get(name) == null || Cookie.get(name) != value) {
//                 // append "." to current domain
//                 domain = '.' + host;
//                 document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
//             }
//         }
//     },

//     get: function (name) {
//         var nameEQ = name + "=";
//         var ca = document.cookie.split(';');
//         for (var i = 0; i < ca.length; i++) {
//             var c = ca[i];
//             while (c.charAt(0) == ' ') {
//                 c = c.substring(1, c.length);
//             }

//             if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
//         }
//         return null;
//     },

//     erase: function (name) {
//         Cookie.set(name, '', -1);
//     }
// };
// window.Cookie = window.COOKIE

window.COOKIE = COOKIE