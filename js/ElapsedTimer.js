export default class ElapsedTimer {
    displayElement

    startTime

    timerInterval

    constructor(displayElementId) {
        this.displayElement = document.getElementById(displayElementId);
        this.startTime = Date.now();
        this.timerInterval = null;
        this.updateTimer = this.updateTimer.bind(this)
        console.log('constructor', this.displayElement, );
    }
    
    start() {
        if (this.timerInterval) return; // Prevent multiple intervals
        this.startTime = Date.now();
        const updateTimer = this.updateTimer;
        this.timerInterval = setInterval(updateTimer, 1000);
        this.setDisplay();
    }
    
    updateTimer() {
        let elapsedTime = Date.now() - this.startTime;
        let seconds = Math.floor((elapsedTime / 1000) % 60);
        let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        let formattedTime = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        this.setDisplay(formattedTime);
    }
    
    setDisplay(formattedTime = '00:00:00') {
        if (!this.displayElement) return;
        this.displayElement.textContent = formattedTime;
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = null;
    }
    
    reset() {
        this.startTime = Date.now();
        this.updateTimer();
    }
}