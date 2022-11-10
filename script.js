$(function () {

    const total = {
        cpu: 0,
        user: 0,
    }

    // console.log(localStorage.getItem('cpu',total.cpu));
    // console.log(localStorage.getItem('user',total.user));

    if(localStorage.getItem('cpu',total.cpu)||localStorage.getItem('user',total.user))
    {
        total.cpu =parseInt (localStorage.getItem('cpu',total.cpu));
        total.user =parseInt (localStorage.getItem('user',total.user));
      
        $('#totalCpu').text(total.cpu);
        $('#totalUser').text(total.user);        
        $('#progressCpu').css("width", Math.round(total.cpu/10 * 100) + '%' );
        $('#progressUser').css("width", Math.round(total.user/10 * 100) + '%' );
    }

    let loading = false;
    const $startButton = $('#start');

    // Нажатие кнопки Бросить кости
    $('#start').click( ()=> { start()}) 
    $('body').keydown((e)=>{
       
    if(e.code==='Space')
    {
        e.preventDefault();
        start();
        // $('start').trigger('click');
    }
    })
    // Закрытие уведомления нажатием на крестик
    $('.alert-close').on('click', function () {
        $(this).parents('.alert').toggleClass('d-block', false);
    });

    // Запускает игру
    async function start() {
        if(loading) return;
        let cpu=0;
        let user=0;
        if (total.cpu >= 10 || total.user >= 10)
        {
            showModal();
            return;
        }
        setLoading(true);
        animateDice();
        //имитируем задержку
        // await new Promise((resolve) => setTimeout(resolve,getRandom(1,3)*1000));

        await $.get(`https://www.randomnumberapi.com/api/v1.0/random?min=1&max=6&count=2`, function(response) {  
             
        cpu = response[0];
        user = response[1];
        $('#cpu').html(template(cpu));
        $('#user').html(template(user));
            });
            setLoading(false);
            animateDice();
        // Отправляем запрос в API и получаем два случайных числа
        // https://www.randomnumberapi.com/api/v1.0/random?min=1&max=6&count=2
        
        if(cpu>user)
        {
                total.cpu += 1;
                localStorage.setItem('cpu',total.cpu);
                showAlert('danger');
        }
        else if(cpu<user)
        {
                total.user += 1;
                localStorage.setItem('user',total.user);
                showAlert('success');
        }
        else if (cpu===user)
        {
            showAlert('warning');
        }
        // saveTotal('cpu',total.cpu);
        // saveTotal('user',total.user);

        setProgress();
    }

    // Возвращает шаблон кости по номеру от 1 до 6
    function template(diceValue) {
        return `<div class="dice dice-${diceValue}"></div>`
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

    function restart()
    {
        if(total.cpu >=10||total.user>=10)
        {
            $('.progress-bar').css('width','0%');
            $('#final').modal('hide');
            total.cpu=0;
            total.user=0;
            $('.pricing-card-title').text('0');
            $('.dice-wrapper').html('');


            localStorage.setItem('cpu',0);
            localStorage.setItem('user',0);
        }
    }
  $('#yes').on('click', function() {
        restart()
  })
 
    //новый код

    // function saveTotal(param,total) {
    //     console.log(localStorage.getItem(param,total));
    // }
    // function saveProgress(param,percent) {
    //     console.log(localStorage.getItem(param,total));
    // }

    //новый код

});