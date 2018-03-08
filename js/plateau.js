/*jshint esversion:6, jquery:true, browser:true, devel:true */

let error = function () {
    alert('Something bad append');
};

class Plateau {
    constructor(divId) {
        this.images = null;
        $.ajax({
            url: '/json/conceptimages.php',
            type: 'post'
        }).done(function (result) {
            for (let path of result.test) {
                new Concept(path, divId);
            }
        }).fail(error);
    }
}

class Concept {
    constructor(image, parent) {
        var self = this;
        this.image = image;
        this.htmlImage = $('<img />').attr('src', this.image).addClass("img-fluid mr-1 mb-1").css({});

        this.htmlObject = $("<div/>").addClass("imagecontainer").append(this.htmlImage).css({
            width: "5.5%",
            height: "auto",
            display: "flex",
            margin: "2px",
            "align-items": "center",
            "justify-content": "center",

        });

        this.htmlparent = $(parent).append(this.htmlObject);

        this.htmlObject.hover(function () {
            $(this).children().css({
                "transform": "scale(2)",
                "transition": "250ms ease-in-out",
                "z-index": 1
            });
            $(this).children(".jeton").css({
                opacity: 0.5
            })

        }, function () {
            $(this).children().prop("z-index", function (val, old) {
                return old - 1;
            }).css({
                "transform": "scale(1)",
                "z-index": 0
            });
            $(this).children(".jeton").css({
                opacity: 1
            })

        });
        this.htmlObject.droppable({
            accept: function () {
                if ($(this).children(".jeton").length > 0)
                    return false;
                return true;
            },
            drop: function (event, ui) {
                let draggable = ui.draggable;
                // draggable.attr("src");
                let child = new Jeton(draggable.attr("src"), this);
                child.htmlObject.attr({
                    "data-container": "body",
                    "data-toggle": "popover",
                });
                child.htmlObject.css({
                    position: "absolute",
                    "width": "3%",
                });
                child.disableDrag();

                let dismiss = $("<bouton/>").addClass("btn btn-success").text("Abort").attr("type", "button").css("margin-left", "2px");
                let remove = $("<bouton/>").addClass("btn btn-danger").text("Remove").attr("type", "button");

                dismiss.on("click", function () {
                    child.htmlObject.popover("hide");
                });

                remove.on("click", function () {
                    self.updateGame(true,self.image)
                    child.htmlObject.popover("hide");
                    child.htmlObject.remove();
                });
                child.htmlObject.popover({
                    content: remove.add(dismiss),
                    html: true,
                    title: "Do you want to remove the token ?"
                });
                child.htmlObject.on("click", function () {
                    child.htmlObject.popover();
                })
                self.updateGame(false,self.image,child.image);
            }
        });
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
