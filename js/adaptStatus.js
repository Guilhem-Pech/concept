class AdaptStatus {

    constructor(data) {
        console.log(data);
        if (data.result) {
            $('#loginNav').hide();
            $('.mustconnected').show();
            $('#welcomingMessage').html("Welcome " + data.username);
            $('#pleaseconnectmessage').hide();
            $('#GameFinder').hide();
            if (data.gameID) {
                $("#joinGameModal").modal("hide");
                if (data.notEnoughPlayer) {
                    $("#joinGameModal").modal("show");
                    $("#minplayers").show();
                    $("#creationForm").hide();
                } else {
                    $("#joinGameModal").modal("hide");
                    $("#minplayers").hide();
                    new Jetons("#jetons");
                    new Plateau('#plateau');
                }
            } else if (data.lookingForAGame) {
                new GameFinder("#GameFinder");
                $('#GameFinder').show();
            }
        } else {
            $('#loginNav').show();
            $('.mustconnected').hide();
            $("#creationForm").show();
        }
    }

    static updateStatus() {
        $.ajax({
            beforeSend: function () {
                $('#pleaseWaitDialog').modal('show');
            },
            complete: function () {
                $("#pleaseWaitDialog").modal('hide');
            },
            url: "/json/getstatus.php",
            method: "get"
        }).done(data => {
            new AdaptStatus(data);
        }).fail(() => {
            erreurCritique();
        });
    }

    static updatePlateau(plateau) {
        $.ajax({
            url: '/json/getstatus.php',
            type: 'get'
        }).done(result => {
            if (!result.gameID) {
                return;
            }
            if (result.placedJeton) {
                let conceptWhereAddedJeton = Array();
                for (let placed of result.placedJeton) {
                    let concept = plateau.concepts[placed.conceptID.image];
                    conceptWhereAddedJeton.push(concept);
                    concept.addJeton(placed.jetonID.image);
                }
                for (let concept in plateau.concepts) {
                    if (conceptWhereAddedJeton.indexOf(plateau.concepts[concept], 0) < 0) {
                        plateau.concepts[concept].removeHtmlJeton();
                    }
                }
            } else if (result.notEnoughPlayer) {
                this.updateStatus(); // or finish the game ?
            } else {
                for (let concept in plateau.concepts) {
                    plateau.concepts[concept].removeHtmlJeton();
                }
            }

        }).fail(error);
    }
}