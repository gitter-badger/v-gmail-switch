var tabUrl;

function pageActionOnGES(tabInfo) {
    chrome.pageAction.show(tabInfo.id);
    return;
}

function getInfoForTab(tabs) {
    if (tabs.length > 0) {
        chrome.tabs.get(tabs[0].id, pageActionOnGES);
    }
}

function onChange(tabInfo) {
    chrome.tabs.query({lastFocusedWindow: true, active: true}, getInfoForTab);
};

var target = '<all_urls>';
chrome.webRequest.onCompleted.addListener(onChange, {urls: [target]});
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, pageActionOnGES);
});

// Shortcut: Cmd + I
chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var tab = tabs[0];
        console.log(tab);
        chrome.windows.create({"url": tab.url, "incognito": true});
    });
});

// Omnibox - Type 'l'+space for entering search in DuckDuckGo
chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
    text = text.replace(" ", "");
    var suggestions = [];
    suggestions.push({content: "Search with DuckDuckGo: " + text, description: "https://duckduckgo.com/?q=" + text});
    chrome.omnibox.setDefaultSuggestion({description: suggestions[0].description});
    suggestions.shift();
    suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(function (text) {
    navigate('https://duckduckgo.com/?q=' + text + '&ia=web');
});

function navigate(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.update(tabs[0].id, {url: url});
    });
}