async function getAccessToken() {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = chrome.runtime.getURL('oauth2.html');
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;
    console.log("Redirect URI: ", redirectUri)
    return new Promise((resolve, reject) => {
        chrome.windows.create({ 'url': authUrl, 'type': 'popup' }, function (popup) {
            chrome.tabs.onUpdated.addListener(function listener(tabId, _, tab) {
                if (tabId === popup.tabs[0].id && tab.url && tab.url.startsWith(redirectUri)) {
                    const url = new URL(tab.url);
                    const error = url.searchParams.get('error');
                    if (error) {
                        reject(error);
                    } else {
                        const accessToken = url.hash.match(/access_token=([^&]*)/)[1];
                        resolve(accessToken);
                    }
                    chrome.windows.remove(popup.id);
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            });
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        getAccessToken().then(accessToken => {
            fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Client-Id': process.env.CLIENT_ID
                }
            }).then(response => response.json())
                .then(data => {
                    let user = data.data[0];
                    sendResponse({ success: true, message: `ID de usuario: ${user.id}` });
                }).catch(err => {
                    sendResponse({ success: false, message: 'Error al obtener el ID de usuario.' });
                });
        }).catch(error => {
            sendResponse({ success: false, message: `Fallo al inicio de sesión: ${error}` });
        });
        return true; // permite respuestas asíncronas
    } else if (request.message === 'logout') {
        // Implementa la lógica de cierre de sesión aquí
    }
});
