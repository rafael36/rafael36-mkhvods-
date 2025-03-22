// Função para gerar uma cor única com base no nome do usuário
function getColorForUsername(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Gera cores com saturação e brilho fixos (ajuste conforme necessário)
    const hue = Math.abs(hash % 360); // Usa o hash para definir o tom (0-360)
    return `hsl(${hue}, 70%, 50%)`; // Cores mais vibrantes
}

// Função para aplicar cores aos autores
function applyAuthorColors() {
    // Seleciona todas as mensagens
    const messages = document.querySelectorAll('.message');

    // Objeto para armazenar cores já atribuídas a cada autor
    const authorColors = {};

    messages.forEach(message => {
        // Seleciona o elemento do autor
        const authorElement = message.querySelector('.author');
        if (!authorElement) return; // Se não encontrar, ignora

        // Pega o nome do autor
        const username = authorElement.textContent;

        // Verifica se já temos uma cor para esse autor
        if (!authorColors[username]) {
            // Gera uma nova cor para o autor
            authorColors[username] = getColorForUsername(username);
        }

        // Aplica a cor ao nome do autor
        authorElement.style.color = authorColors[username];
    });
}

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

// Função para carregar o Disqus dinamicamente
function loadDisqus() {
    // Verifica se o Disqus já foi carregado
    if (!window.disqusLoaded) {
        window.disqusLoaded = true; // Marca como carregado

        // Cria o script do Disqus
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
            menuOptions.style.display = 'none'; // Oculta o menu
        } else {
            menuOptions.style.display = 'block'; // Mostra o menu
        }
    });

    // Oculta o menu ao clicar fora dele
    document.addEventListener('click', function (event) {
        if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
            menuOptions.style.display = 'none'; // Oculta o menu
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
        menuOptions.style.display = 'none'; // Oculta o menu após a seleção
    });

    disqusOption.addEventListener('click', function () {
        chatContainer.style.display = 'none';
        disqusContainer.style.display = 'block';
        descriptionContainer.style.display = 'none';
        loadDisqus(); // Carrega o Disqus dinamicamente
        menuOptions.style.display = 'none'; // Oculta o menu após a seleção
    });

    descriptionOption.addEventListener('click', function () {
        chatContainer.style.display = 'none';
        disqusContainer.style.display = 'none';
        descriptionContainer.style.display = 'block';
        menuOptions.style.display = 'none'; // Oculta o menu após a seleção
    });

    downloadOption.addEventListener('click', function () {
        downloadLink.click(); // Simula o clique no link de download
        menuOptions.style.display = 'none'; // Oculta o menu após a seleção
    });
}

// Inicializa o menu
setupMenu();

// Aplica as cores aos autores quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', applyAuthorColors);