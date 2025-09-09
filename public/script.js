const reviewContainer = document.getElementById('review-container');

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
    // Limpa o container
    reviewContainer.innerHTML = '';
    
    const card = document.createElement('div');
    card.className = 'review-card';
    
    // Adiciona as estrelas
    card.appendChild(createStarRating(data.rating));
    
    // Adiciona o comentário
    const comment = document.createElement('p');
    comment.className = 'card-comment';
    comment.textContent = data.review || 'Sem comentário';
    card.appendChild(comment);
    
    // Adiciona ao container
    reviewContainer.appendChild(card);
}

// Função para mostrar mensagem quando não há avaliações
function showNoReviewMessage() {
    reviewContainer.innerHTML = '<p class="no-review">Nenhuma avaliação ainda</p>';
}

// Inicialmente mostra a mensagem de nenhuma avaliação
showNoReviewMessage();


document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-btn');
    const reviewInput = document.getElementById('review-input');
    const message = document.getElementById('message');
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            rating = parseInt(star.dataset.value);
            updateStars(rating);
            submitBtn.disabled = false;
        });
    });

    function updateStars(rate) {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= rate) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    submitBtn.addEventListener('click', async () => {
        const review = reviewInput.value;
        submitBtn.disabled = true;
        message.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, review })
            });

            const result = await response.json();
            if (response.ok) {
                message.textContent = 'Obrigado por sua avaliação!';
                reviewInput.value = '';
                rating = 0;
                updateStars(0);
                renderReview(result.data);
                setTimeout(() => {
                    message.textContent = '';
                }, 3000);
            } else {
                throw new Error(result.error || 'Erro ao enviar avaliação.');
            }
        } catch (error) {
            message.textContent = `Erro: ${error.message}`;
            submitBtn.disabled = false;
        }
    });
});