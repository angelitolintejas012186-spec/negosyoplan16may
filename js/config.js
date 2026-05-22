// Environment-aware API configuration
// Runs before all other scripts — sets window.NEGOSYO_API_BASE for production
(function () {
    var host = window.location.hostname;
    var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
    if (!isLocal && !window.NEGOSYO_API_BASE) {
        // Replace this URL with your deployed backend (e.g. Render, Railway, Fly.io)
        window.NEGOSYO_API_BASE = 'https://negosyoplan-api.onrender.com';
    }
})();
