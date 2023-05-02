chrome.permissions.contains({
    permissions: ['tabs'],
    origins: ['https://www.google.com/']
}, (result) => {
    if (result) {
        // The extension has the permissions.
    } else {
        // The extension doesn't have the permissions.
    }
});
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },

        func: () => {

            const button = document.querySelector('[aria-label="Toggle Common Rendering Emulations"]');
            button.click();
            const select = document.querySelector('[name="emulation-preset"]');
            select.value = "Dark Mode";
        }

    });
});
