class AdaptStatus {

    constructor(data) {
        console.log(data);
        let modal = new GameModal("#joinGameModal");

        AdaptStatus.modal = modal;
        if (this.guesser) {
            this.guesser.hide();
        }
        let leaveNav = $('#leaveNav');
        let gameFinder = $('#GameFinder');
        leaveNav.hide();
        if (data.result) {
            $('#loginNav').hide();
            $('.mustconnected').show();
            $('#welcomingMessage').html("Welcome " + data.username);
            $('#pleaseconnectmessage').hide();
            gameFinder.hide();
            if (data.gameID) {
                this.guesser = Guess.getUniqueGuesser("#guessimput", data.wordToMakeGuess);
                this.guesser.hide();
                modal.hide();
                if (data.notEnoughPlayer) {
                    modal.show();
                    GameModal.showMinWarning();
                    GameModal.hideCreation();

                } else {
                    modal.hide();
                    GameModal.hideMinWarning();
                    this.guesser.show();
                    leaveNav.show();
                    if (data.imguesser) {
                        Plateau.createPlateauIfNotExist("#plateau", data.gameID, true);
                        if (!AdaptStatus.Jetons) {
                            AdaptStatus.Jetons = new Jetons("#jetons");
                        }
                    } else {
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
                gameFinder.show();
            }
        } else {

            $('#loginNav').show();
            $('.mustconnected').hide();
            GameModal.showCreation();
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
                GameModal.hideCreation();
                GameModal.showMinWarning();
            }
        } else {

            GameModal.showCreation();
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
                    if (plateau.concepts.hasOwnProperty(concept) && conceptWhereAddedJeton.indexOf(plateau.concepts[concept], 0) < 0) {
                        plateau.concepts[concept].removeHtmlJeton();
                    }
                }


            } else if (result.notEnoughPlayer && result.gameID) {
                plateau.stopAutoUpdating();
                AdaptStatus.leaveGame();
                alert("Sorry ... Your last partner has left and there is no more player to play with :'(");
                location.reload();

            } else if (!result.gameID) {
                plateau.stopAutoUpdating();
                location.reload();
            } else {
                for (let concept in plateau.concepts) {
                    if (plateau.concepts.hasOwnProperty(concept)) {
                        plateau.concepts[concept].removeHtmlJeton();
                    }
                }
            }


        }).fail(error);

        return true
    }
}

AdaptStatus.Jetons = null;