class GameFinder {

    constructor(ClassOrId) {
        this.gamesAvailable = [];
        $.ajax({
            url: '/json/getstatus.php',
            type: 'get'
        }).done(data => {
            for (let game of data.gameAvailable) {
                let newGame = new JoinGame(game);
                this.gamesAvailable.push(newGame);
                $(ClassOrId).append(newGame.htmlObject);
            }
            this.htmlObject = $(ClassOrId).append(new CreateGame().htmlObject);
        }).fail(error)
    }

}

class JoinGame {

    constructor(GameInfo) {
        this.gameName = GameInfo.nom;
        this.id = GameInfo.gameID;

        this.htmlObject = $("<button/>").attr("type", "button").addClass("list-group-item list-group-item-action")
            .html(GameInfo.nom + "<span style='margin-left: 10px' class=\"badge badge-info\">players: NA </span>").attr("data", GameInfo.gameID);

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

class CreateGame {

    constructor() {
        this.badgeObject = $("<span/>").addClass("badge badge-success").html("Create a new Game !");
        this.htmlObject = $("<button/>").attr("type", "button").addClass("list-group-item list-group-item-action").append(this.badgeObject);
        this.htmlObject.on("click", event => {
            $("#joinGameModal").modal({
                keyboard: false,
                show: true,
                backdrop: 'static'
            });
            $("#createGameSubmit").submit(function () {
                let theForm = $(this);
                console.log(theForm.attr('method'));
                $.ajax({
                    type: theForm.attr('method'),
                    url: theForm.attr('action'),
                    data: theForm.serialize()
                }).done(result => {
                    //console.log(result);
                    if (result.success) {
                        AdaptStatus.updateStatus();
                    }
                }).fail(erreurCritique);
                return false;
            })
        });

        this.timer = this.startAutoUpdating();
    }

    startAutoUpdating() {
        this.updateList();
        return setInterval(() => {
            this.updateList();
        }, 3000);
    }

    updateList() {
        $.ajax({
            url: "/json/getstatus.php",
            method: "get"
        }).done(data => {
            if (data.gameID && !data.notEnoughPlayer) {
                AdaptStatus.updateStatus();
                this.stopAutoUpdating();
            }
        }).fail(() => {
            erreurCritique();
        });
    }

    stopAutoUpdating() {

        clearInterval(this.timer);
    }
}