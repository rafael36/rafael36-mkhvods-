const player = new Plyr('#player', {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
    settings: ['speed'],
    speed: { selected: 1, options: [0.5, 1, 1.5, 2] }
});

// Quando o player estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    function timestampToSeconds(timestamp) {
        const [hours, minutes, seconds] = timestamp.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function isChatAtBottom(chatContainer) {
        const tolerance = 10;
        return chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - tolerance;
    }

    function scrollChatToBottom() {
        const chatContainer = document.getElementById('chat');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function syncChatWithVideo() {
        const chatMessages = document.querySelectorAll('.message');
        
        player.on('timeupdate', () => {
            const currentTime = Math.floor(player.currentTime);
            let shouldScroll = isChatAtBottom(document.getElementById('chat'));

            chatMessages.forEach(message => {
                const timestamp = message.querySelector('.timestamp').textContent;
                const messageTime = timestampToSeconds(timestamp);
                if (messageTime <= currentTime) {
                    message.style.display = 'block';
                } else {
                    message.style.display = 'none';
                }
            });

            if (shouldScroll) {
                scrollChatToBottom();
            }
        });
    }

    // Inicia a sincronização
    syncChatWithVideo();

    // Depuração
    player.on('error', (event) => {
        console.error('Erro no Plyr:', event.detail);
    });

    player.on('loadedmetadata', () => {
        console.log('Metadados carregados no Plyr');
    });
});