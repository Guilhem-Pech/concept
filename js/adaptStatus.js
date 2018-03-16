class AdaptStatus {

    constructor(data) {
        console.log(data);
        let modal = new GameModal("#joinGameModal");
        this.guesser = Guess.getUniqueGuesser("#guessimput");
        AdaptStatus.modal = modal;
        this.guesser.hide();
        if (data.result) {
            $('#loginNav').hide();
            $('.mustconnected').show();
            $('#welcomingMessage').html("Welcome " + data.username);
            $('#pleaseconnectmessage').hide();
            $('#GameFinder').hide();
            if (data.gameID) {


                modal.hide();
                if (data.notEnoughPlayer) {
                    modal.show();
                    modal.showMinWarning();
                    modal.hideCreation();

                } else {

                    modal.hide();
                    modal.hideMinWarning();
                    if (data.imguesser) {
                        Plateau.createPlateauIfNotExist("#plateau", data.gameID, true);
                        if (!AdaptStatus.Jetons) {
                            AdaptStatus.Jetons = new Jetons("#jetons");
                        }
                    } else {
                        this.guesser.show();
                        if (AdaptStatus.Jetons) {
                            AdaptStatus.Jetons.htmlObject.empty();
                        }
                        Plateau.createPlateauIfNotExist("#plateau")
                    }
                }
            } else if (data.lookingForAGame) {

                $("#plateau").empty();
                $("#jetons").empty();
                GameFinder.getGameFinder("#GameFinder");
                $('#GameFinder').show();
            }
        } else {

            $('#loginNav').show();
            $('.mustconnected').hide();
            modal.showCreation();
        }
    }


    static leaveGame() {
        $.ajax({
            url: '/json/leaveGame.php'
        }).fail(erreurCritique);
    }

    static updateStatus(result) {
        if (result) {
            new AdaptStatus()
        } else {
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
    }

    static updateJoining(data) {
        if (data.notEnoughPlayer) {
            if (data.gameID) {
                AdaptStatus.modal.hideCreation();
                AdaptStatus.modal.showMinWarning();
            }
        } else {

            AdaptStatus.modal.showCreation();
            console.log(data);
            if (data.number >= 2) {
                AdaptStatus.modal.hide();
                AdaptStatus.updateStatus();
            }

        }
    }



    static updatePlateau(plateau) {
        $.ajax({
            url: '/json/getstatus.php',
            type: 'get'
        }).done(result => {
            console.log(result.imguesser, 'PUTAIN', Plateau.getUniquePlateau().guesser);
            if (!result.imguesser && Plateau.getUniquePlateau().guesser) {
                console.log("Hey I'm a freaking idiot");
                Guess.getUniqueGuesser().showModal();
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
            } else if (result.notEnoughPlayer || !result.gameID) {
                plateau.stopAutoUpdating();
                AdaptStatus.leaveGame();
                alert("Sorry ... Your last partner has left and there is no more player to play with :'(");

                AdaptStatus.updateStatus();

            } else {
                for (let concept in plateau.concepts) {
                    plateau.concepts[concept].removeHtmlJeton();
                }
            }


        }).fail(error);

        return true
    }
}

AdaptStatus.Jetons = null;