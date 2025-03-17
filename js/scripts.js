// scripts.js

// Função para extrair o ID do vídeo do HTML
function getWistiaVideoId() {
    const wistiaEmbed = document.querySelector('.wistia_embed');
    if (wistiaEmbed) {
        // Extrai o ID da classe (ex: "wistia_async_07gx0usx69")
        const classList = wistiaEmbed.classList;
        for (const className of classList) {
            if (className.startsWith('wistia_async_')) {
                return className.replace('wistia_async_', ''); // Remove o prefixo
            }
        }
    }
    return null; // Retorna null se não encontrar o ID
}

// Inicializa o Wistia
const videoId = getWistiaVideoId();
if (videoId) {
    window._wq = window._wq || [];
    _wq.push({
        id: videoId, // Usa o ID extraído do HTML
        onReady: function (video) {
            const wistiaPlayer = video;

            // Função para converter o timestamp no formato HH:MM:SS para segundos
            function timestampToSeconds(timestamp) {
                const [hours, minutes, seconds] = timestamp.split(':').map(Number);
                return hours * 3600 + minutes * 60 + seconds;
            }

            // Função para verificar se o chat está no final
            function isChatAtBottom(chatContainer) {
                const tolerance = 10; // Tolerância para considerar que está no final
                return chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - tolerance;
            }

            // Função para rolar o chat para o final
            function scrollChatToBottom() {
                const chatContainer = document.getElementById('chat');
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            // Função para sincronizar o chat com o vídeo
            function syncChatWithVideo() {
                const chatMessages = document.querySelectorAll('.message');
                wistiaPlayer.bind('secondchange', function (time) {
                    const currentTime = Math.floor(time); // Tempo atual do vídeo em segundos
                    let shouldScroll = isChatAtBottom(document.getElementById('chat')); // Verifica se o chat está no final

                    chatMessages.forEach(message => {
                        const timestamp = message.querySelector('.timestamp').textContent; // Pega o timestamp da mensagem
                        const messageTime = timestampToSeconds(timestamp); // Converte o timestamp para segundos
                        if (messageTime <= currentTime) {
                            message.style.display = 'block'; // Mostra a mensagem
                        } else {
                            message.style.display = 'none'; // Oculta a mensagem
                        }
                    });

                    // Rola para o final apenas se o chat já estava no final
                    if (shouldScroll) {
                        scrollChatToBottom();
                    }
                });
            }

            // Inicia a sincronização
            syncChatWithVideo();
        }
    });
} else {
    console.error('ID do vídeo não encontrado no HTML.');
}
