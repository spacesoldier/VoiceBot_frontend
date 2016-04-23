function handleFileSelect(evt) {
    var files = evt.target.files;

    for (var i = 0, f; f = files[i]; i++) {
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        reader.onload = (function (file) {
            return function (e) {
                $('.appendText').remove();
                // Render thumbnail.
                var div = document.createElement('div');
                div.classList.add('thumb');
                div.innerHTML = [
                    '<span class="close">x</span>',
                    '<img src="', e.target.result,
                    '" title="', encodeURI(file.name), '"/>',
                ].join('');
                document.getElementById('list').insertBefore(div, null);
            };
        })(f);

        reader.readAsDataURL(f);
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

$(document).ready(function(){

    setEmptyText();

});

$(document).on('click', '.close', function(e) {
    $(this).parent().remove();

    setEmptyText();
});

function setEmptyText() {
    if($('.thumb').length == 0) {
        $('.output-list').html('');
        $('.output-list').append($('<p class="appendText">Тут будут ваши изображения</p><output id="list"></output>'));
    }

}