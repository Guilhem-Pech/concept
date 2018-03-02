/*jshint esversion:6, jquery:true, browser:true, devel:true */

let error = function () {
    alert('Something bad append');
};

class Plateau {
    constructor(divId,isGuesser){
        this.isGuesser = isGuesser;
        this.images = null;
        $.ajax({
            url:'/json/conceptimages.php',
            type:'post'
        }).done(function(result){
            for(let path of result.test){
                new Concept(path, divId);
            }
        }).fail(error);
    }
}

class Concept {
    constructor(image, parent) {
        self = this;
        this.image = image;
        this.htmlObject = $('<img />').attr('src', this.image).addClass("img-fluid mr-1 mb-1").css({
            "max-width": "5.5%"
        });
        
        this.htmlparent = $(parent).append(this.htmlObject);
        
        this.htmlObject.hover(function(){
            $(this).css({
                "transform":"scale(2)",
                "transition":"250ms ease-in-out",
                "z-index":1
            })
        }, function(){ 
            $(this).css({
                "transform":"scale(1)",
                "z-index": 0
            })
        });    
        // this.htmlObject.droppable();
    }
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
        this.htmlObject = $('<img />').attr('src', this.image).addClass("img-fluid mr-1 mb-1").css({
            "max-width": "5%",
            cursor: "move",
            "z-index" : 2

        });
    
        this.htmlparent = $(parent).append(this.htmlObject);
        this.htmlObject.draggable({
            revert: "invalid",
            stack: ".draggable",
            helper: 'clone'
        });
    }
}