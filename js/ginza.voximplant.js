//noinspection JSUnresolvedFunction
var VoxApi;
const DEBUG = false;

$(document).ready(function() {

    $('.phone').mask('79999999999');

    $('#phone-success').click(function(e)  {
        var phone = $('.phone');
        if(phone.val().length != 0) {
            $(this).attr('disabled', true);
            phone.attr('disabled', true);
            VoxApi = new ApiCall();
            VoxApi.remoteCall(phone.val());
            if(VoxApi.callSuccess == true) {
                poll(VoxApi.uid);
            } else {
                alert('Ошибка соединения с сервером.');
            }
        }
    });

    function ApiCall() {
        var _ = this;
        var callData;
        this.callSuccess = false;
        this.uid;

        this.remoteCall = function(number) {
            if(DEBUG == false) {
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "http://www.roboflunky.ru/makeCall(" + number + ").json",
                }).done(function (msg) {
                    callData = msg;
                    if(callData.result == 1) {
                        _.callSuccess = true;
                        _.uid = callData.uid;
                    } else {
                        _.callSuccess = false;
                    }
                });
            } else {
                _.callSuccess = true;
            }
        }

    }

    function poll(uid) {
        $.ajax({
            type: "GET",
            url: "http://www.roboflunky.ru/getState(" + uid + ").json",
        }).done(function(json) {
            console.log(json);
            if(JSON.stringify(json) == '{}') {
                setTimeout(function() { poll(uid) }, 500);
            } else {
                parseStep(json);
                if(json.step_number == -404 || json.step_number == -100) {
                    return;
                }
                setTimeout(function() { poll(uid) }, 2000);
            }
        });
    }


    //console.log(bg.css('background-image'));

    var currentStep = -1;

    function parseStep(json) {
        console.log('Start parse');
        if(isChangedStep(json)) {
            console.log('step changed');
            var choise = getChoiceInfo(json);
            console.log(choise);
            switch (json.step_number) {//currentStep
                case 0:
                {
                    if(choise == -1) {
                        addStepLoading(1, 'Процесс выбора ресторана');
                        return;
                    }
                    break;
                }
                case 1:
                {
                    if(choise == -1) {
                        return;
                    }

                    var rest = getRestaurantById(json.restaurant.rest_id);
                    console.log(rest);

                    //var content =
                    //    '<div class="restaurant">' +
                    //    '<div class="title">' + rest.title + '</div>' +
                    //    '<img src="http://iginza.ru/images/w250/' + rest.logo + '">' +
                    //    '<div class="address"><b>Адрес: </b>' + rest.contacts_address + '</div>' +
                    //    '<div class="contacts"><b>Телефоны: </b>' + [rest.contacts_phone, rest.contacts_phone_service].join(', ') + '</div>';

                    var content =
                        '<div class="restaurant">' +
                            '<img class="logo" src="http://iginza.ru/images/w250/' + rest.logo + '">' +
                            '<div class="info">' +
                                '<div class="title"><b>Наименование: </b>' + rest.title + '</div>' +
                                '<div class="address"><b>Адрес: </b>' + rest.contacts_address + '</div>' +
                                '<div class="contacts"><b>Телефоны: </b>' + [rest.contacts_phone, rest.contacts_phone_service].join(', ') + '</div>' +
                            '</div>' +
                        '</div>';

                    var bg = $('.background');
                    bg.css({"background-image": 'url("http://iginza.ru/images/w2000-h2000/' + rest.cover + '")'});

                    //if(rest.panorama.length > 0) {
                    //    content += '<div class="meta"><a target="_blank" href="' + rest.panorama + '" class="btn btn-sm btn-primary">Посмотреть панораму</a></div>'
                    //}
                    //
                    //content += '</div>';

                    addStep('Ресторан', 1, content);
                    break;
                }
                case 2:
                {
                    if(choise == -1) {
                        addStepLoading(2, 'Выбор даты');
                        return;
                    }
                    addStep('Дата', 2, '<b>Дата заказа:</b> ' + choise);
                    break;
                }
                case 3:
                {
                    if(choise == -1) {
                        addStepLoading(3, 'Выбор времени заказа');
                        return;
                    }
                    addStep('Время', 3, '<b>Время заказа:</b> ' + choise);

                    break;
                }
                case 4:
                {
                    if(choise == -1) {
                        addStepLoading(4, 'Выбор количества персон');
                        return;
                    }
                    addStep('Персоны', 4, '<b>Количество персон:</b> ' + choise);

                    break;
                }
                case 5:
                {
                    if(choise == -1) {
                        addStepLoading(5, 'Окончание обработки заказа');
                        return;
                    }
                    break;
                }
                case 6:
                {
                    //gid.append('<li>Вы заказали: ' + choise + '</li>');
                    break;
                }
                case 7: {
                    // Подтверждение заказа
                }
                case -100: {

                }
                case 8: {

                    if(choise == -1) {
                        //addStepLoading(5, 'Окончание обработки заказа');
                        return;
                    }
                    addStep('Спасибо за заказ', 5, '<b>Столик зарезервирован. Будем рады вас видеть!</b>');

                    break;
                }
            }
        }
    }

    function isChangedStep(json) {
        var step = json.step_number;
        console.log('Step: ' + step);
        console.log('Current step: ' + currentStep);
        currentStep = step;
        return true;
        //if(step >= currentStep) {
        //    currentStep = step;
        //    return true;
        //} else {
        //    return false;
        //}
    }

    function getChoiceInfo(json) {
        var text = decodeURIComponent(escape(json.choice));
        console.log(text);
        return text;
    }

    //console.log(getRestaurantById(61));;

    function getRestaurantById(id) {
        var req = 'restaurants/get/' + id;
        var r;
        $.ajax({
            async: false,
            type: "GET",
            url: "http://www.roboflunky.ru/ginzaAPI(" + req + ").json",
        }).done(function (msg) {
            r = msg.response[0];
        });

        return r;
    }

    function addStep(title, num, content) {
        var steps = $('.steps');
        var res;

        if($('div').is('#step_id_' + num)) {
            $('#step_id_' + num).html('<span class="number">' + num + '</span>' +
                '<div class="title">' + title + '</div>' +
                '<div class="content">' + content + '</div>');
        } else {
            var stepid = $('#step_id_' + num);

            res = '<div class="step" id="step_id_' + num + '">' +
                '<span class="number">' + num + '</span>' +
                '<div class="title">' + title + '</div>' +
                '<div class="content">' + content + '</div>' +
                '</div>';

            steps.append(res);
        }
    }

    function addStepLoading(num, title) {
        addStep(title + '... <span class="process loading"><img src="../img/loading.svg"></span>', num, '');
    }
});
