$( document ).ready(function() {
    console.log( "ready!" );
    $.ajax({
        type:"GET",
        url: "https://librairie-du-jeudi.herokuapp.com/books",
        beforeSend : function() {

        },
        success : function(data, textStatus, jqXHR) {
            if(data.length == 0) {
                return;
            }
            let html = '<div class="ui link cards three column grid">';
            $.each(data, function(id, book) {
                if(book?.id && book?.author && book?.date && book?.genre && book?.name && book?.description) {
                    console.log(book.id)
                    let date = new Date(book.date);

                    html += '<div class="card"><div class="image"><img src="img/ordi.jpg"></div>';
                    html += `<div class="content">
                                <div class="header">${book.name}</div>
                                    <div class="meta">
                                    <a>${book.genre}</a>
                                </div>
                                <div class="description">
                                ${book.description}
                                </div>
                            </div>`;
                    html += `<div class="extra content">
                                <span class="right floated">
                                Publié en ${date.getFullYear()}
                                </span>
                                <span>
                                <i class="user icon"></i>
                                ${book.author}
                                </span>
                            </div>`;
                    html += ' </div>'
                }
            })
            html += ' </div>'
            $('#books').append(html);
        },
        error : function() {

        },
        complete : function() {

        }
    })
});