class Guess {

    constructor(id, wordToGuess) {
        $(id).empty();
        this.guessModal = $("#guessedWord");
        this.inputForm = $('<input/>').attr('type', 'text').addClass('form-control')
            .attr('name', 'guess')
            .attr('placeholder', 'Your Guess');

        if (wordToGuess) {
            this.divForm = $('<h1/>').addClass("display-4 alert alert-info").html(wordToGuess.word);
            this.htmlObject = $(id).append(this.divForm);
        } else {
            this.divForm = $('<div/>').addClass('form-row').append($('<div/>').addClass('col').append(this.inputForm));
            this.htmlObject = $(id).append(this.divForm);
            $(id).submit(() => {
                let theForm = $(id);
                $.ajax({
                    type: theForm.attr('method'),
                    url: theForm.attr('action'),
                    data: theForm.serialize()
                }).done(result => {
                    if (!result.success) {
                        this.inputForm.addClass('is-invalid');
                        this.inputForm.effect('bounce', {complete: () => this.inputForm.removeClass('is-invalid')});
                    } else {
                        this.inputForm.addClass('is-valid');
                        location.reload();
                    }
                }).fail(erreurCritique);
                return false;
            });
        }
        this.guessModal.on("hidden.bs.modal", () => {
            location.reload();
        });


    }


    static getUniqueGuesser(id, word) {
        if (!Guess.unique) {
            return new Guess(id, word)
        }
        return Guess.unique;
    }

    showModal() {
        this.guessModal.modal("show");
    }

    show() {
        this.htmlObject.show();
    }

    hide() {
        this.htmlObject.hide();
    }


}

Guess.unique = null;

