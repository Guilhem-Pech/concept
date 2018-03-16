/*jshint esversion:6, jquery:true, browser:true, devel:true */

let error = function () {
    alert('Something bad append');
};


class Plateau {
    constructor(divId, gameID, guesser) {
        $(divId).empty();
        this.images = null;
        this.divId = divId;
        this.guesser = guesser;
        this.concepts = Array();
        $(divId).data("GameID", gameID);
        $.ajax({
            url: '/json/conceptimages.php',
            type: 'post'
        }).done(result => {
            for (let path of result.test) {

                let newConcept = new Concept(path, divId, guesser);
                this.concepts[newConcept.image] = newConcept;
            }
        }).fail(error);
        this.timerUpdate = this.startAutoUpdating();
    }

    static createPlateauIfNotExist(div, gameID, guesser) {
        if (!Plateau.plateau) {
            Plateau.plateau = new Plateau(div, gameID, guesser);
        } else if (Plateau.plateau.guesser && !guesser) {
            Plateau.plateau = new Plateau(div, gameID, guesser);
        }
        return Plateau.plateau;
    }

    static getUniquePlateau() {
        return Plateau.plateau;
    }

    setGameID(gameID) {
        $(this.divId).data("gameID", gameID);
    }

    getGameID() {
        return $(this.divId).data("gameID");
    }

    startAutoUpdating() {
        this.getUpdate();
        return setInterval(() => {
            if (!this.getUpdate()) {
                this.stopAutoUpdating();
                console.log(this.getUpdate());
            }
        }, 3000);
    }

    stopAutoUpdating() {
        console.log("Stop plateau update");
        clearInterval(this.timerUpdate);
    }

    getUpdate() {
        return AdaptStatus.updatePlateau(this);
    }

}

Plateau.plateau = null;

class Concept {
    constructor(image, parent, guesser) {
        let self = this;
        this.guesser = guesser;
        this.image = image;
        this.htmlImage = $('<img />').attr('src', this.image).addClass("img-fluid mr-1 mb-1").css({});
        this.child = false;
        this.htmlObject = $("<div/>").addClass("imagecontainer").append(this.htmlImage).css({
            width: "5.5%",
            height: "auto",
            display: "flex",
            margin: "2px",
            "align-items": "center",
            "justify-content": "center",

        });

        this.htmlparent = $(parent).append(this.htmlObject);

        this.htmlObject.hover(this.onHover, this.outHover);
        if (guesser) {

            this.makeDroppable();
        }
    }

    makeDroppable() {
        this.htmlObject.droppable({
            accept: this.isAccepted,
            drop: (event, ui) => {
                try {
                    let draggable = ui.draggable;
                    let JetonName = draggable.attr("src");
                    let child = this.addJeton(JetonName);
                    this.updateGame(false, this.image, child.image);
                } catch (error) {
                    this.removeHtmlJeton();
                }
            }
        });
    }

    getJeton() {
        return this.child
    }

    addJeton(JetonName) {
        if (this.getJeton() && this.getJeton().image == JetonName) {
            return;
        } else if (this.getJeton()) {
            this.removeJeton();
        }
        let child = new Jeton(JetonName, this.htmlObject);
        child.htmlObject.attr({
            "data-container": "body",
            "data-toggle": "popover",
        });
        child.htmlObject.css({
            position: "absolute",
            "width": "3%",
        });
        child.disableDrag();

        if (this.guesser) {
            this.makePopOver(child);
        }
        this.child = child;
        return child;
    }

    makePopOver(child) {
        let dismiss = $("<bouton/>").addClass("btn btn-success").text("Abort").attr("type", "button").css("margin-left", "2px");
        let remove = $("<bouton/>").addClass("btn btn-danger").text("Remove").attr("type", "button");

        dismiss.on("click", () => {
            child.htmlObject.popover("hide");
        });

        remove.on("click", () => {
            this.removeJeton();
        });

        child.htmlObject.popover({
            content: remove.add(dismiss),
            html: true,
            title: "Do you want to remove the token ?"
        });
        child.htmlObject.on("click", () => {
            child.htmlObject.popover();
        });
    }

    removeJeton() {
        this.removeHtmlJeton();
        this.updateGame(true, this.image);
    }

    removeHtmlJeton() {
        if (!this.getJeton())
            return;
        this.getJeton().htmlObject.popover("hide");
        let jetonHtml = this.getJeton().htmlObject;
        this.child = false;
        jetonHtml.remove();
    }

    isAccepted() {
        if ($(this).children(".jeton").length > 0)
            return false;
        return true;
    }

    outHover() {
        $(this).children().prop("z-index", function (val, old) {
            return old - 1;
        }).css({
            "transform": "scale(1)",
            "z-index": 0
        });
        $(this).children(".jeton").css({
            opacity: 1
        })

    }

    onHover() {
        $(this).children().css({
            "transform": "scale(2)",
            "transition": "250ms ease-in-out",
            "z-index": 1
        });
        $(this).children(".jeton").css({
            opacity: 0.5
        })
    }

    updateGame(remove,conceptImg,jetonImg) {
        let toSend = {
            concept: conceptImg,
            jeton: jetonImg
        };
        $.ajax({
            type: 'POST',
            url: '/json/updategame.php',
            data: toSend
        }).done(function (data) {
            console.log(data);
        });
    };
}

class Jetons {
    constructor(divId) {
        this.htmlObject = $(divId).empty();
        this.images = null;
        $.ajax({
            url: '/json/jetonimages.php',
            type: 'post'
        }).done(function (result) {
            for (let path of result.test) {
                new Jeton(path, divId);
            }
        }).fail(error);
    }
}

class Jeton {
    constructor(image, parent) {
        self = this;
        this.image = image;
        this.htmlObject = $('<img />').attr('src', this.image).addClass("img-fluid mr-1 mb-1 jeton").css({
            "max-width": "5%",
            cursor: "move",
            "z-index": 2

        });

        this.htmlparent = $(parent).append(this.htmlObject);
        this.htmlObject.draggable({
            revert: "invalid",
            stack: ".draggable",
            containment: "#dragzone",
            helper: 'clone'
        });
        this.disableDrag = function () {
            self.htmlObject.draggable('disable');
        }
    }

}
