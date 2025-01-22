let countdownTimer;
let port;
let selectedSound;  

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['reminderStatus', 'timeLeft', 'selectedSound'], (data) => {
        let timeLeft = data.timeLeft || 1200;
        let reminderStatus = data.reminderStatus || 'off';
        selectedSound = data.selectedSound || 'beep';  

        updateTimerDisplay(timeLeft);

        if (reminderStatus === 'on') {
            document.getElementById('status').textContent = 'Reminder is ON';
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;
        } else {
            document.getElementById('status').textContent = 'Reminder is OFF';
            document.getElementById('startButton').disabled = false;
            document.getElementById('stopButton').disabled = true;
        }

        document.getElementById('startButton').addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'startReminder' });
            document.getElementById('status').textContent = 'Reminder is ON';
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;
        });

        document.getElementById('stopButton').addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'stopReminder' });
            clearInterval(countdownTimer); 
            document.getElementById('status').textContent = 'Reminder is OFF';
            document.getElementById('startButton').disabled = false;
            document.getElementById('stopButton').disabled = true;
            chrome.storage.local.remove('timeLeft'); 
        });

        document.getElementById('soundSelect').value = selectedSound;

        document.getElementById('soundSelect').addEventListener('change', (event) => {
            selectedSound = event.target.value;
            chrome.storage.local.set({ selectedSound: selectedSound });  
            playSelectedSound();  
        });
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'updateTime') {
            updateTimerDisplay(message.timeLeft);
        } else if (message.action === 'updateStatus') {
            document.getElementById('status').textContent = message.status;
        }
    });
});

function updateTimerDisplay(timeLeft) {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeLeft === 0) {
        playSelectedSound();
    }
}

function playSelectedSound() {
    let soundElement = document.getElementById(`${selectedSound}Sound`);
    soundElement.play();
}
