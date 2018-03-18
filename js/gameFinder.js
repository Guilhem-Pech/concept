class GameFinder {

    constructor(ClassOrId) {
        this.data = [];
        this.gamesAvailable = [];
        $.ajax({
            url: '/json/getstatus.php',
            type: 'get'
        }).done(data => {
            this.htmlObject = $(ClassOrId).append(new CreateGame().htmlObject);
            this.data = data;
            this.addGames(data);

            this.setAutoUpdate(true);
        }).fail(error)
    }

    static getGameFinder(ClassOrId) {
        if (!GameFinder.gameFinder) {
            GameFinder.gameFinder = new GameFinder(ClassOrId);
        } else {
            GameFinder.gameFinder.update();
        }
        return GameFinder.gameFinder;
    }

    setAutoUpdate(bool) {
        if (bool) {
            this.update();
            this.timer = setInterval(() => {
                this.update();
            }, 3000);
        } else {
            clearInterval(this.timer);
        }

    }

    update() {

        $.ajax({
            url: '/json/getstatus.php',
            type: 'get'
        }).done(data => {
            if (!data.lookingForAGame) {
                this.setAutoUpdate(false);
            } else if (data.gameAvailable) {
                for (let game of data.gameAvailable) {
                    this.addGames(data);
                }
            }

        }).fail(error)
    }

    addGames(data) {
        if (!data.gameAvailable) {
            return;
        }
        for (let game of data.gameAvailable) {
            let newGame = new JoinGame(game);
            if (!this.gamesAvailable[newGame.id]) {
                this.gamesAvailable[newGame.id] = newGame;
                this.htmlObject.append(newGame.htmlObject);
            }
        }
    }
}

GameFinder.gameFinder = null;

class JoinGame {

    constructor(GameInfo) {
        this.gameName = GameInfo.nom;
        this.id = GameInfo.gameID;

        this.htmlObject = $("<button/>").attr("type", "button").addClass("list-group-item list-group-item-action")
            .html(GameInfo.nom).attr("data", GameInfo.gameID);

        this.htmlObject.on("click", () => {
            this.join();
        });
    }

    join() {
        $.ajax({
            url: "/json/joinGame.php",
            type: "post",
            data: {gameID: this.id}
        }).done(data => {
            if (data.success) {
                AdaptStatus.updateStatus();
            }
        }).fail(erreurCritique);
    }
}

class GameModal {

    constructor(id) {

        this.htmlObject = $(id);
        this.leaveButton = $("#leaveButtonJ");

        this.leaveButton.on("click", () => {
            AdaptStatus.leaveGame();
            this.hide();
            AdaptStatus.updateStatus();
        });
        let joinGameModal = $("#joinGameModal");
        joinGameModal.on("show.bs.modal", () => {
            this.timer = this.startAutoUpdating();
        });
        joinGameModal.on("hide.bs.modal", () => {
            this.stopAutoUpdating();
        });
    }

    show() {
        this.htmlObject.modal("show");
    }

    hide() {
        this.htmlObject.modal("hide");
    }

    static showMinWarning() {
        $("#minplayers").show()

    }

    static showCreation() {
        $("#creationForm").show();
    }

    static hideMinWarning() {
        $("#minplayers").hide()
    }

    static hideCreation() {
        $("#creationForm").hide();
    }

    startAutoUpdating() {

        this.update();
        return setInterval(() => {
            this.update();
        }, 3000);
    }

    update() {

        $.ajax({
            url: "/json/getstatus.php",
            method: "get"
        }).done(data => {

            AdaptStatus.updateJoining(data);

        }).fail(() => {
            erreurCritique();
        });
    }

    stopAutoUpdating() {
        clearInterval(this.timer);
    }


}




class CreateGame {

    constructor() {

        this.badgeObject = $("<span/>").addClass("badge badge-success").html("Create a new Game !");
        this.htmlObject = $("<button/>").attr("type", "button").addClass("list-group-item list-group-item-action").append(this.badgeObject);
        this.htmlObject.on("click", () => {
            $("#joinGameModal").modal({
                keyboard: false,
                show: true,
                backdrop: 'static'

            });
            $("#createGameSubmit").submit(function () {
                let theForm = $(this);
                $.ajax({
                    type: theForm.attr('method'),
                    url: theForm.attr('action'),
                    data: theForm.serialize()
                }).done(result => {
                    if (result.success) {
                        AdaptStatus.updateStatus();
                    }
                }).fail(erreurCritique);
                return false;
            })
        });


    }

}