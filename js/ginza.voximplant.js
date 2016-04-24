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
                poll();
            } else {
                alert('Ошибка соединения с сервером. ВАРНИНГ!!!!111');
            }
        }
    });

    function ApiCall() {
        var _ = this;
        var apiData = {
            account_id: 479251,
            api_key: 'edfaac20-1902-4744-9268-032d81e2ab78'
        };
        var callData;
        this.callSuccess = false;

        this.remoteCall = function(number) {
            if(DEBUG == false) {
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "https://api.voximplant.com/platform_api/StartScenarios/",
                    data: {
                        account_id: apiData.account_id,
                        api_key: apiData.api_key,
                        rule_id: 150585,
                        script_custom_data: number
                    }
                }).done(function (msg) {
                    callData = msg;
                    if(callData.result == 1) {
                        _.callSuccess = true;
                    } else {
                        _.callSuccess = false;
                    }
                });
                console.log(apiData.account_id);
                console.log(apiData.api_key);
            } else {
                _.callSuccess = true;
            }
        }

    }

    function poll() {
        $.ajax({
            type: "GET",
            url: "http://www.roboflunky.ru/getState(_).json",
            //contentType: "text/html;charset=UTF-8"
        }).done(function(json) {
            console.log(json);
            if(JSON.stringify(json) == '{}') {
                setTimeout(poll, 500);
            } else {
                parseStep(json);
                if(json.step_number == -100) {
                    $('.finish').html('Вы забронировали столик в ресторане. Ждем вас.');
                    return;
                }
                setTimeout(poll, 2000);
            }
        });
    }

    var currentStep = -1;

    function parseStep(json) {
        console.log('Start parse');
        if(isChangedStep(json)) {
            console.log('step changed');
            var gid = $('.gid');
            var choise = getChoiceInfo(json);
            console.log(choise);
            switch (currentStep) {
                case 0:
                {
                    //gid.append('<li>Кухня: ' + choise + '</li>');
                    break;
                }
                case 1:
                {
                    var rest = getRestaurantById(json.restaurant.rest_id);
                    console.log(rest);

                    var content =
                        '<div class="restaurant">' +
                        '<div class="title">' + rest.title + '</div>' +
                        '<img src="http://iginza.ru/images/w250/' + rest.logo + '">' +
                        '<div class="address"><b>Адрес: </b>' + rest.contacts_address + '</div>' +
                        '<div class="contacts"><b>Телефоны: </b>' + [rest.contacts_phone, rest.contacts_phone_service].join(', ') + '</div>';

                    if(rest.panorama.length > 0) {
                        content += '<div class="meta"><a target="_blank" href="' + rest.panorama + '" class="btn btn-sm btn-primary">Посмотреть панораму</a></div>'
                    }

                    content += '</div>';

                    gid.append('<li>' + content + '</li>');
                    //gid.append('<li>Ресторан: ' + decodeURIComponent(escape(json.restaurant.rest_name)) + '</li>');
                    break;
                }
                case 2:
                {
                    gid.append('<li>Дата заказа: ' + choise + '</li>');
                    break;
                }
                case 3:
                {
                    gid.append('<li>Время заказа: ' + choise + '</li>');
                    break;
                }
                case 4:
                {
                    gid.append('<li>Количество персон: ' + choise + '</li>');
                    break;
                }
                case 5:
                {
                    //gid.append('<li>: ' + choise + '</li>');
                    break;
                }
                case 6:
                {
                    //gid.append('<li>Вы заказали: ' + choise + '</li>');
                    break;
                }
                case 7: {
                    // Подтверждение заказа
                    break;
                }
                case 8: {
                    // Оплата сейчас
                    break;
                }
            }
        }
    }

    function isChangedStep(json) {
        var step = json.step_number;
        console.log('Step: ' + step);
        console.log('Current step: ' + currentStep);
        if(step > currentStep) {
            currentStep = step;
            return true;
        } else {
            return false;
        }
    }

    function getChoiceInfo(json) {
        var text = decodeURIComponent(escape(json.choice));
        console.log(text);
        return text;
    }

    function getRestaurantById(id) {
        var r;
        $.ajax({
            async: false,
            type: "GET",
            url: "http://www.roboflunky.ru/getRest(" + id + ").json",
            //contentType: 'application/json; charset=utf-8',
            //crossDomain: true
        }).done(function (msg) {
            r = msg.response[0];

        });

        return r;
    }
});
