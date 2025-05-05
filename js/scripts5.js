// Elementos do hash
const hashOption = document.getElementById('hashOption');
const hashPopup = document.getElementById('hashPopup');
const copyHashButton = document.getElementById('copyHashButton');
const closeHashButton = document.getElementById('closeHashButton');
const hashText = document.getElementById('hashText');

// Mostrar popup do hash
hashOption.addEventListener('click', () => {
    hashPopup.style.display = 'flex';
});

// Copiar hash
copyHashButton.addEventListener('click', () => {
    navigator.clipboard.writeText(hashText.textContent)
        .then(() => {
            // Feedback visual que o texto foi copiado
            const originalText = copyHashButton.textContent;
            copyHashButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyHashButton.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Erro ao copiar texto: ', err);
            // Fallback para navegadores mais antigos
            const textarea = document.createElement('textarea');
            textarea.value = hashText.textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            const originalText = copyHashButton.textContent;
            copyHashButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyHashButton.textContent = originalText;
            }, 2000);
        });
});

// Fechar popup do hash
closeHashButton.addEventListener('click', () => {
    hashPopup.style.display = 'none';
});

// Fechar popup ao clicar fora do conteúdo
hashPopup.addEventListener('click', (e) => {
    if (e.target === hashPopup) {
        hashPopup.style.display = 'none';
    }
});

// Elementos para alterar URL
const changeUrlOption = document.getElementById('changeUrlOption');
const changeUrlPopup = document.getElementById('changeUrlPopup');
const newUrlInput = document.getElementById('newUrlInput');
const confirmUrlButton = document.getElementById('confirmUrlButton');
const cancelUrlButton = document.getElementById('cancelUrlButton');
const player = document.getElementById('player');
const videoSource = player.querySelector('source');

// Mostrar popup para alterar URL
changeUrlOption.addEventListener('click', () => {
    // Preenche o campo com a URL atual
    newUrlInput.value = videoSource.src;
    // Seleciona todo o texto para facilitar a substituição
    newUrlInput.select();
    changeUrlPopup.style.display = 'flex';
});

// Confirmar nova URL
confirmUrlButton.addEventListener('click', () => {
    const newUrl = newUrlInput.value.trim();
    
    if (newUrl) {
        try {
            // Verifica se é uma URL válida
            new URL(newUrl);
            
            // Atualiza a fonte do vídeo
            videoSource.src = newUrl;
            
            // Recarrega o player
            player.load();
            
            // Fecha o popup
            changeUrlPopup.style.display = 'none';
            
            // Feedback visual mais discreto
            const originalText = confirmUrlButton.textContent;
            confirmUrlButton.textContent = '✓ Alterado!';
            setTimeout(() => {
                confirmUrlButton.textContent = originalText;
            }, 2000);
        } catch (e) {
            // Feedback de erro no próprio campo
            newUrlInput.focus();
            newUrlInput.style.borderColor = '#f44336';
            setTimeout(() => {
                newUrlInput.style.borderColor = '#555';
            }, 2000);
        }
    } else {
        // Feedback de campo vazio
        newUrlInput.focus();
        newUrlInput.style.borderColor = '#f44336';
        setTimeout(() => {
            newUrlInput.style.borderColor = '#555';
        }, 2000);
    }
});

// Cancelar alteração de URL
cancelUrlButton.addEventListener('click', () => {
    changeUrlPopup.style.display = 'none';
});

// Fechar popup ao clicar fora do conteúdo
changeUrlPopup.addEventListener('click', (e) => {
    if (e.target === changeUrlPopup) {
        changeUrlPopup.style.display = 'none';
    }
});

// Copiar título
const copyTitleButton = document.getElementById('copyTitleButton');
const videoTitle = document.getElementById('videoTitle');

copyTitleButton.addEventListener('click', () => {
    navigator.clipboard.writeText(videoTitle.textContent)
        .then(() => {
            const originalText = copyTitleButton.textContent;
            copyTitleButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyTitleButton.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Erro ao copiar título: ', err);
            const textarea = document.createElement('textarea');
            textarea.value = videoTitle.textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            const originalText = copyTitleButton.textContent;
            copyTitleButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyTitleButton.textContent = originalText;
            }, 2000);
        });
});






// Verificação de carregamento do vídeo
document.addEventListener('DOMContentLoaded', function() {
    const videoFailPopup = document.getElementById('videoFailPopup');
    const redirectButton = document.getElementById('redirectButton');
    const closeFailPopup = document.getElementById('closeFailPopup');
    const playerElement = document.getElementById('player');
    
    // Tempo de espera (8 segundos)
    const loadTimeout = 8000;
    let videoLoaded = false;
    
    // Verifica se o vídeo começou a carregar
    playerElement.addEventListener('loadeddata', function() {
        videoLoaded = true;
    });
    
    // Verifica se o vídeo deu erro
    playerElement.addEventListener('error', function() {
        showFailPopup();
    });
    
    // Timeout para verificar se não carregou
    setTimeout(function() {
        if (!videoLoaded && playerElement.readyState < 2) {
            showFailPopup();
        }
    }, loadTimeout);
    
    // Mostra o popup de fallback
    function showFailPopup() {
        videoFailPopup.style.display = 'flex';
    }
    
    // Redirecionamento
    redirectButton.addEventListener('click', function() {
        window.location.href = 'https://mkhvods.vercel.app/ipfshelp.html';
    });
    
    // Fechar popup com o botão X
    closeFailPopup.addEventListener('click', function() {
        videoFailPopup.style.display = 'none';
    });
    
    // Fechar popup ao clicar fora
    videoFailPopup.addEventListener('click', function(e) {
        if (e.target === videoFailPopup) {
            videoFailPopup.style.display = 'none';
        }
    });
});