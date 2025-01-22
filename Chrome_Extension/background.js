let countdownTimer;
let timeLeft = 1200;  
let reminderStatus = 'off';


function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(countdownTimer);  
        reminderStatus = 'off';
        chrome.storage.local.set({ reminderStatus: 'off' });  
        chrome.runtime.sendMessage({ action: 'updateStatus', status: 'Reminder is OFF' });
        
        
        chrome.windows.create({
            url: chrome.runtime.getURL("focusReminder.html"),  
            type: "popup",
            width: 400,
            height: 300
        });
    } else {
        timeLeft--;
        chrome.storage.local.set({ timeLeft: timeLeft }); 
        chrome.runtime.sendMessage({ action: 'updateTime', timeLeft });  
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startReminder') {
        if (reminderStatus === 'off') {
            reminderStatus = 'on';
            chrome.storage.local.set({ reminderStatus: 'on' });
            chrome.runtime.sendMessage({ action: 'updateStatus', status: 'Reminder is ON' });
            countdownTimer = setInterval(updateTimer, 1000);  
        }
    } else if (message.action === 'stopReminder') {
        clearInterval(countdownTimer);  
        reminderStatus = 'off';
        chrome.storage.local.set({ reminderStatus: 'off' });
        chrome.runtime.sendMessage({ action: 'updateStatus', status: 'Reminder is OFF' });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['reminderStatus', 'timeLeft'], (data) => {
        reminderStatus = data.reminderStatus || 'off';
        timeLeft = data.timeLeft || 1200;
        if (reminderStatus === 'on') {
            countdownTimer = setInterval(updateTimer, 1000);  
        }
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['reminderStatus', 'timeLeft'], (data) => {
        reminderStatus = data.reminderStatus || 'off';
        timeLeft = data.timeLeft || 1200;
        if (reminderStatus === 'on') {
            countdownTimer = setInterval(updateTimer, 1000);  
        }
    });
});
