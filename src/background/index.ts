chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('youtube.com')) {
    chrome.tabs.sendMessage(tab.id, 'createBoxElement');
  } else {
    alert('This extension works only on YouTube.');
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/watch')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'createBoxElement') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, 'createBoxElement');
    });
  }
});
