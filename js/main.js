/*jshint esnext: true, browser: true, devel: true, jquery: true*/

let erreurCritique = function (jqXHR, textStatus) {
    console.log("An error occured");
    console.log(textStatus);
};

(function () {
    "use strict";

    $(() => {

        AdaptStatus.updateStatus();

        $("#loginform").submit(sendFormAndReload);

        function sendFormAndReload() {
            let theForm = $(this);
            $.ajax({
                type: theForm.attr('method'),
                url: theForm.attr('action'),
                data: theForm.serialize()
            }).done(result => {
                if (result.success) {
                    location.reload();
                }
            }).fail(erreurCritique);
            return false;
        }

        $("#disconnectform").submit(sendFormAndReload);
       
        $('#leaveNav').on('click', () => {
            AdaptStatus.leaveGame();
            AdaptStatus.updateStatus();
        })
    });     
})();



