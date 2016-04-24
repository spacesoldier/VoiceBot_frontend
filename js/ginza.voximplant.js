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
                if(json.step_number == -100) return;
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
            //gid.append('<li>' + choise +'</li>');
            switch (currentStep) {
                case 0:
                {
                    gid.append('<li>Кухня: ' + choise + '</li>');
                    break;
                }
                case 1:
                {
                    gid.append('<li>Ресторан: ' + decodeURIComponent(escape(json.restaurant.name)) + '</li>');
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
                    gid.append('<li>Сколько человек: ' + choise + '</li>');
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
});
