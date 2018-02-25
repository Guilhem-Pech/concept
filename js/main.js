(function () {
    "use strict";
    $.ajax({
        url:"/json/isConnected.php",
        method:"post"
    }).done(function (data) {

    }).fail(function () {

    });
})();