    // Inicializa o Wistia
    window._wq = window._wq || [];
    _wq.push({
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
