const searchForChannel = function(channelName) {
    
    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        
        request.onload = () => {
            if(request.status >= 200 && request.status < 300) {
                resolve(request.response);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };

        request.onerror = () => {
            reject({
                status: request.status,
                statusText: request.statusText
            });
        };

        request.open("GET", `https://www.googleapis.com/youtube/v3/search?part=snippet&part=id&q=${channelName}&type=channel&key=${GOOGLE_API_KEY}`);
        request.send();
    
    });

};

const tryGetChannelLinks = function(channelURL) {

    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        
        request.onload = () => {
            
            if(request.status >= 200 && request.status < 300) {
                
                let parser = new DOMParser();
                let doc = parser.parseFromString(request.response, "text/html");

                let elems = doc.querySelectorAll("a.about-channel-link");
                let redirects = [...elems].map(elem => elem.href);

                // Clever trick to parse URL easily
                let links = redirects.map((redirect) => {
                    return new URLSearchParams(redirect).get("q");
                });

                // Remove duplicates 
                resolve([...new Set(links)]);

            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }    

        };

        request.onerror = () => {
            reject({
                status: request.status,
                statusText: request.statusText
            });
        };

        request.open("GET", `/api/cors-passthrough?url=${encodeURIComponent(channelURL)}`);
        request.send();

    });

};

const getChannelLinks = async function(channelID) {

    let url = `https://www.youtube.com/channel/${channelID}/about`;
    for(let attempt = 0; attempt < 10; attempt++) {
        let links = await tryGetChannelLinks(url);
        if(links.length != 0 && links[0] != null) {
            return links;
        }
    }

    return [];

}

const getVideosPlaylist = function(channelID) {

    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        
        request.onload = () => {
            if(request.status >= 200 && request.status < 300) {
                resolve(request.response);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };

        request.onerror = () => {
            reject({
                status: request.status,
                statusText: request.statusText
            });
        };

        request.open("GET", `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelID}&key=${GOOGLE_API_KEY}`);
        request.send();

    });

};

const getVideosInPlaylist = function(playlistID, nextPageKey) {

    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        
        request.onload = () => {
            if(request.status >= 200 && request.status < 300) {
                resolve(request.response);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };

        request.onerror = () => {
            reject({
                status: request.status,
                statusText: request.statusText
            });
        };

        request.open("GET", `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&part=snippet&maxResults=6&playlistId=${playlistID}&key=${GOOGLE_API_KEY}${nextPageKey !== undefined ? "&pageToken=" + nextPageKey : ""}`);
        request.send();

    });    

};