const version = '0.0.7';

self.addEventListener('install', (event) => {
    console.log("Magician Installed." + version);
});
self.addEventListener('activate', (event) => {
    console.log("Magician Activated." + version);
});
self.addEventListener('fetch', (event) => {

    let pathsToEscape = ['/logout', '/login', '/apps', '/magician'];
    let morphedUrl = new URL(event.request.url);

    if (morphedUrl.host !== 'localhost:4000') {
        console.debug("Escaped: Other Domain:" + morphedUrl.host);
        return false;
    }

    if (pathsToEscape.find((path) => morphedUrl.pathname.startsWith(path)) !== undefined || morphedUrl.pathname === "/") {
        console.debug("Escaped:" + morphedUrl + "|" + event.request.mode);
        return false;
    }

    morphedUrl.pathname = '/apps/app1' + morphedUrl.pathname;
    console.log("Re-written:(" + event.request.cache + ")" + morphedUrl);
    let options = {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body,
        //mode:Problem property
        credentials: event.request.credentials,
        cache: event.request.cache,
        redirect: event.request.redirect,
        error: event.request.error,
        referrer: event.request.referrer,
        referrerPolicy: event.request.referrerPolicy,
        integrity: event.request.integrity,
        keepalive: event.request.keepalive,
        signal: event.request.signal
    };

    let morphedRequest = new Request(morphedUrl, options);
    let response = fetch(morphedRequest).then((res) => {
        //res.headers.forEach((v, k) => { console.log(`Key:${k} Value:${v}`) })
        if (res.headers.get('hub-logout') != undefined) {
            //Session Logged out
            console.warn("Session timed out detected");

            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage("Session Logout");
                });

            });
        }
        return res;
    });
    event.respondWith(response);
    return true;
});