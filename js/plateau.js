/*jshint esversion:6, jquery:true, browser:true, devel:true */

let error = function(customMessage){
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
                $(divId).append($('<img />').attr('src', path).addClass("img-fluid mr-1 mb-1").css("max-width","5.5%"));
            }
            
            console.log(result);
        }).fail(error);
    }
}

class Concept {
    constructor(image){
        this.image = image;
    }
}