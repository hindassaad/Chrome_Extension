let countdownTime = 20; 
let countdownTimer;

function startCountdown() {
    countdownTimer = setInterval(() => {
        if (countdownTime <= 0) {
            clearInterval(countdownTimer); 
            window.close(); 
        } else {
            countdownTime--;
            document.getElementById('timer').textContent = `${countdownTime < 10 ? '0' : ''}${countdownTime}:00`;
        }
    }, 1000);
}

window.onload = startCountdown;
