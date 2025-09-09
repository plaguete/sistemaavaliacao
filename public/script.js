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

// Torne a janela arrastável após o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    const lastReview = document.querySelector('.last-review');
    makeDraggable(lastReview);
    
    // Adicione eventos para os botões de fechar e OK
    document.querySelector('.last-review .close-button').addEventListener('click', function() {
        lastReview.style.display = 'none';
    });

    document.querySelector('.last-review .ok').addEventListener('click', function() {
        lastReview.style.display = 'none';
    });
});

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

           if (response.ok) {
            message.textContent = 'Obrigado por sua avaliação!';
            reviewInput.value = '';
            rating = 0;
            updateStars(0);
            renderReview(result.data);
            
            // Mostra o pop-up de última avaliação
            document.querySelector('.last-review').style.display = 'block';
        
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