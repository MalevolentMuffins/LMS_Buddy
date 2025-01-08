const ACTION = {
    GET_LOCAL_STORAGE: 'getLocalStorage',
    SET_LOCAL_STORAGE: 'setLocalStorage',
    CLEAR_LOCAL_STORAGE: 'clearLocalStorage'
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    let senderTabId = sender?.tab?.id?.toString();

    if(!senderTabId) {
        console.error('Tab ID is not available');
        return;
    }

    switch(request.action) {
        case ACTION.GET_LOCAL_STORAGE:

            chrome.storage.local.get([senderTabId], (result)  => {
                sendResponse({data: result[senderTabId]} || {});
                console.log((result[senderTabId] == undefined ? "No value found" : 'Successfully retrieved value from storage: ' + result[senderTabId]));
            });
    
            return true;

        case ACTION.SET_LOCAL_STORAGE:

            chrome.storage.local.set({[senderTabId]: request.value}, () => {
                console.log(`The storage with ID: ${senderTabId} was updated: ` + request.value);
            });

            break;

        case ACTION.CLEAR_LOCAL_STORAGE:

            chrome.storage.local.clear(() => {
                console.log('Storage is cleared');
            });
            
            break;

        default:
            console.error('Invalid action');
            break
    }
});


chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.remove(tabId.toString(), () => {
        console.log(`The storage with ID: ${tabId} was removed`);
    });  
});
  

  