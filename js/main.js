/*jshint esnext: true, browser: true, devel: true, jquery: true*/

let erreurCritique = function() {
    alert('Paul Chalas est tellement fort qu\'il a fait bugger ta page');
};

(function () {
    "use strict";

    $(() => {

        AdaptStatus.updateStatus();

        $("#loginform").submit(function() {
            let theForm = $(this);
            $.ajax({
                type: theForm.attr('method'),
                url: theForm.attr('action'),
                data: theForm.serialize()
            }).done(result => {
                console.log(result);
                if (result.success){
                    location.reload();
                }
            }).fail(erreurCritique);
            return false;
        });
        $("#disconnectform").submit(function() {
            let theForm = $(this);
            $.ajax({
                type: theForm.attr('method'),
                url: theForm.attr('action'),
                data: theForm.serialize()
            }).done(result => {
                if (result.success){
                    location.reload();
                }                  
            }).fail(erreurCritique);       
            return false;
        });
    });     
})();



