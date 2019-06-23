const version = '0.0.6';

self.addEventListener('install', (event) => {
    console.log("Magician Installed." + version);
});
self.addEventListener('activate', (event) => {
    console.log("Magician Activated." + version);
});
self.addEventListener('fetch', (event) => {

    let pathsToEscape = ['/logout', '/login', '/apps', '/magician'];
    let url = new URL(event.request.url);
    if (url.host === 'localhost:4000') {
        if (pathsToEscape.find((path) => url.pathname.startsWith(path)) !== undefined || url.pathname === "/") {
            console.info("Escaped:" + url + "|" + event.request.mode);
            return false;
        }
        else {
            url.pathname = '/apps/app1' + url.pathname;
            console.log("Re-written:" + url);
            let options = {
                method: event.request.method,
                headers: event.request.headers,
                body: event.request.body,
                //mode:Problem property
                credentials: event.request.credentials,
                //cache:Problem property
                redirect: event.request.redirect,
                error: event.request.error,
                referrer: event.request.referrer,
                referrerPolicy: event.request.referrerPolicy,
                integrity: event.request.integrity,
                keepalive: event.request.keepalive,
                signal: event.request.signal
            };

            let response = fetch(new Request(url), options);
            event.respondWith(response);
        }
    }
    else {
        console.log("Escaped: Other Domain:" + url.host);
        return false;
    }
});