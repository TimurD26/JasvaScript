$(function () { 
 
    const total = { 
        cpu: 0, 
        user: 0, 
    } 
    let loading = false; 
    const $startButton = $('#start'); 
 
    // Нажатие кнопки Бросить кости 
    $('#start' ).click(()=>{ 
        start();  
    }); 
 
    // Закрытие уведомления нажатием на крестик 
    $('.alert-close').on('click', function () { 
        $(this).parents('.alert').toggleClass('d-block', false); 
    }); 
 
    // Запускает игру 
    async function start() { 
        /*
        await $.get('https://www.randomnumberapi.com/api/v1.0/random?min=1&max=6&count=2', function(response) { 
            let cpu = response[0]; 
            let user = response[1];  
            $('#cpu').html(template(cpu))  
            $('#user').append(template(user));  
        });
        */
       const response = fakeApi();
       let cpu = response[0];
       let user = response[1]; 
       $('#cpu').html(template(cpu))  
       $('#user').html(template(user));  
       
        if(cpu > user) { 
            total.cpu += 1;  
        } 

        else if(cpu < user) { 
            total.user += 1;  
        } 

        else if(cpu === user) { 
             
        } 

        setProgress();  
        // Отправляем запрос в API и получаем два случайных числа 
        //  
 
         
    } 
 
    // Возвращает шаблон кости по номеру от 1 до 6 
    function template(diceValue) { 
        return `<div class="dice dice-${diceValue}"></div>`;
    } 
 
    // Показывает уведомление о выигрыше, проигрыша или ничьей 
    function showAlert(type) { 
        $('.alert').toggleClass('show', false); 
 
        clearTimeout(window.timeout); 
 
        if (type === 'success') { 
            $('.alert-success').toggleClass('show', true); 
        } else if (type === 'danger') { 
            $('.alert-danger').toggleClass('show', true); 
        } else if (type === 'warning') { 
            $('.alert-warning').toggleClass('show', true); 
        } 
 
        window.timeout = setTimeout(function () { 
            $(`.alert-${type}`).toggleClass('show', false); 
        }, 5000); 
    } 

    function fakeApi() {
        return [getRandom(1, 6), getRandom(1, 6)]
    }

    
 
 
    // Возвращает случайное число между min и max 
    function getRandom(min, max) { 
        min = Math.ceil(min); 
        max = Math.floor(max); 
        return Math.floor(Math.random() * (max - min + 1) + min); 
    } 

    
    // Анимирует бросок костей 
    function animateDice() { 
        const animate = setInterval(() => { 
            if (loading) { 
                $('#cpu').html(template(getRandom(1, 6))); 
                $('#user').html(template(getRandom(1, 6))); 
            } 
        }, 70); 
 
        if (loading === false) { 
            clearInterval(animate); 
        } 
    } 
 
    // Блокирует кнопку Бросить кости и показывает лоадер 
    function setLoading(state) { 
        loading = state; 
        $startButton.attr('disabled', state); 
        $startButton.find('.spinner').toggleClass('d-none', !state); 
    } 
 
    // Визуализация прогресса и счета 
 
    function setProgress() { 
        $('#totalCpu').text(total.cpu); 
        $('#totalUser').text(total.user);         
        $('#progressCpu').css("width", Math.round(total.cpu/10 * 100) + '%' ); 
        $('#progressUser').css("width", Math.round(total.user/10 * 100) + '%' ); 
 
        showModal(); 
    } 
 
    // Показывает модалку при окончании игры 
    async function showModal() { 
        if (total.cpu >= 10 || total.user >= 10) { 
            const success = total.user > total.cpu; 
            const resultText = success ? 'Вы выиграли' : 'Вы проиграли'; 
            const resultClass = success ? 'success' : 'danger'; 
 
            $('#final .final-result').html(` 
                <h2 class="title ${resultClass}"> 
                    ${resultText} со счетом<br> 
                    ${total.cpu} : ${total.user} 
                </h2> 
                <p></p> 
                <p><i class="icon-emoji icon-emoji__${resultClass}"></i></p> 
            `); 
 
            $('#final').modal(); 
        } 
    } 
    
    function restart() {
        window.location.reload();
    }
});