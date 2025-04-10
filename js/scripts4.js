document.addEventListener('DOMContentLoaded', () => {
    const player = new Plyr('#player', {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
        settings: ['speed'],
        speed: { selected: 1, options: [0.5, 1, 1.5, 2] }
    });

    // Aguarda o evento 'ready' para garantir que o player está carregado
    player.on('ready', () => {
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
    });

    // Depuração
    player.on('error', (event) => {
        console.error('Erro no Plyr:', event.detail);
    });

    player.on('loadedmetadata', () => {
        console.log('Metadados carregados no Plyr');
    });

    // Função para carregar o Disqus dinamicamente
    function loadDisqus() {
        if (!window.disqusLoaded) {
            window.disqusLoaded = true;
            const disqusScript = document.createElement('script');
            disqusScript.src = 'https://mkhvods.disqus.com/embed.js';
            disqusScript.setAttribute('data-timestamp', +new Date());
            (document.head || document.body).appendChild(disqusScript);
        }
    }

    // Função para controlar o menu de opções
    function setupMenu() {
        const menuButton = document.getElementById('menuButton');
        const menuOptions = document.getElementById('menuOptions');
        const chatContainer = document.getElementById('chat');
        const disqusContainer = document.getElementById('disqus');
        const descriptionContainer = document.getElementById('description');
        const downloadLink = document.getElementById('downloadLink');

        // Mostra ou oculta o menu ao clicar no botão
        menuButton.addEventListener('click', function () {
            if (menuOptions.style.display === 'block') {
                menuOptions.style.display = 'none';
            } else {
                menuOptions.style.display = 'block';
            }
        });

        // Oculta o menu ao clicar fora dele
        document.addEventListener('click', function (event) {
            if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
                menuOptions.style.display = 'none';
            }
        });

        // Alterna entre chat, Disqus e descrição
        const chatOption = document.getElementById('chatOption');
        const disqusOption = document.getElementById('disqusOption');
        const descriptionOption = document.getElementById('descriptionOption');
        const downloadOption = document.getElementById('downloadOption');

        chatOption.addEventListener('click', function () {
            chatContainer.style.display = 'block';
            disqusContainer.style.display = 'none';
            descriptionContainer.style.display = 'none';
            menuOptions.style.display = 'none';
        });

        disqusOption.addEventListener('click', function () {
            chatContainer.style.display = 'none';
            disqusContainer.style.display = 'block';
            descriptionContainer.style.display = 'none';
            loadDisqus();
            menuOptions.style.display = 'none';
        });

        descriptionOption.addEventListener('click', function () {
            chatContainer.style.display = 'none';
            disqusContainer.style.display = 'none';
            descriptionContainer.style.display = 'block';
            menuOptions.style.display = 'none';
        });

        downloadOption.addEventListener('click', function () {
            downloadLink.click();
            menuOptions.style.display = 'none';
        });
    }

    // Inicia o menu
    setupMenu();
});