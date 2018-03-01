/*jshint esversion:6, jquery:true, browser:true, devel:true */

let erreurCritique = function() {
    alert('Paul Chalas est tellement fort qu\'il a fait bugger ta page');
};

(function () {
    "use strict";

    $(() => {

        $.ajax({
            beforeSend: function () {
                $('#pleaseWaitDialog').modal('show');
            },
            complete: function () {
                $("#pleaseWaitDialog").modal('hide');
            },   
            url:"/json/getstatus.php",
            method:"post"
        }).done(function (data) {
            if (data.result){
                $('#loginNav').hide();
                $('#disconectNav').show();
                new Jetons("#jetons");
                new Plateau('#plateau', true);
                $('.mustconnected').show();
                $('#welcomingMessage').html("Welcome "+data.username);
                $('#pleaseconnectmessage').hide();
            }else{
                $('#loginNav').show();
                $('#disconectNav').hide();
            }        
        }).fail(function () {
            erreurCritique();
        });

        $("#loginform").submit(function() {
            let theForm = $(this);
            $.ajax({
                type: theForm.attr('method'),
                url: theForm.attr('action'),
                data: theForm.serialize()
            }).done(function(result){
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
            }).done(function(result){
                if (result.success){
                    location.reload();
                }                  
            }).fail(erreurCritique);       
            return false;
        });
    });     
})();



