document.getElementById('login').onclick = function () {
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        document.getElementById('status').textContent = response.message;
    });
};

document.getElementById('logout').onclick = function () {
    chrome.runtime.sendMessage({ message: 'logout' }, function (response) {
        document.getElementById('status').textContent = 'Desconectado.';
    });
};
