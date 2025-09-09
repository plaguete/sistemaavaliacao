// Adicione no início do arquivo
const reviewContainer = document.getElementById('review-container');
const lastReview = document.querySelector('.last-review');

// Função para tornar a janela arrastável
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const titleBar = element.querySelector('.title');

    titleBar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Pega a posição do cursor no início
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Chama uma função sempre que o cursor se mover
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calcula a nova posição do cursor
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Define a nova posição do elemento
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Para de mover quando o botão do mouse é solto
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Função para criar estrelas de avaliação
function createStarRating(rating) {
    const container = document.createElement('div');
    container.className = 'card-stars';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('img');
        star.src = 'https://blob.gifcities.org/gifcities/AOYTPUI6EAC37U2YBBXCVHSDXYXUM4DB.gif';
        star.className = i <= rating ? 'star active' : 'star';
        container.appendChild(star);
    }
    
    return container;
}

// Função para renderizar a avaliação
function renderReview(data) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    // Adiciona as estrelas
    card.appendChild(createStarRating(data.rating));
    
    // Adiciona o comentário
    const comment = document.createElement('p');
    comment.className = 'card-comment';
    comment.textContent = data.review || 'Sem comentário';
    card.appendChild(comment);
    
    // Limpa o container e adiciona o novo card
    reviewContainer.innerHTML = '';
    reviewContainer.appendChild(card);
}

// Função para mostrar mensagem quando não há avaliações
function showNoReviewMessage() {
    reviewContainer.innerHTML = '<p class="no-review">Nenhuma avaliação ainda</p>';
}

// Inicialmente mostra a mensagem de nenhuma avaliação
showNoReviewMessage();

// Adicione eventos para os botões de fechar e OK
document.querySelector('.last-review .close-button').addEventListener('click', function() {
    lastReview.style.display = 'none';
});

document.querySelector('.last-review .ok').addEventListener('click', function() {
    lastReview.style.display = 'none';
});

// Torne a janela arrastável
makeDraggable(lastReview);

// Modifique o bloco de sucesso do fetch:
if (response.ok) {
    message.textContent = 'Obrigado por sua avaliação!';
    reviewInput.value = '';
    rating = 0;
    updateStars(0);
    renderReview(result.data);
    
    // Mostra o pop-up de última avaliação
    lastReview.style.display = 'block';
    
    setTimeout(() => {
        message.textContent = '';
    }, 3000);
}