document.addEventListener('DOMContentLoaded', function () {
    console.info('Loaded');
    const form = document.querySelector("#frm-items");
    if (form !== null) {
        form.addEventListener('submit', function (event) {
            console.info('Form onsubmit');
            event.preventDefault();
            const item = document.querySelector("#item");
            if (item == null) {
                throw 'Item control is not found';
            }

            const nickname = document.querySelector('#nickname')
            if (nickname.value == null) {
                throw 'Item control is not found';
            }

            const description = document.querySelector("#description");
            if (description.value == null) {
                throw 'Description is not found'
            }

            const check = document.querySelector('#check[type=checkbox]');

            if (!check.checked) {
                throw 'You dont have permission'
            }

            addItemToTable(item.value, nickname.value, description.value);
            item.value = '';
            nickname.value = '';
            description.value = '';
            check.checked = false;
        });
    }
});

function addItemToTable(item, nickname, description) {
    console.info('Try to add item');
    const table = document.querySelector("#posts");
    if (table == null) {
        throw 'Table is not found';
    }
    console.log(item);
    var filename = item.replace('C:\\fakepath\\', 'src\\');
    const linesCount = document.querySelectorAll("#tbl-items tbody tr").length;
    const id = 'item-' + Date.now();
    const tableHtml =
        '<a href="BigImage.html">\
            <div class="container bg-light">\
                <div class="row">\
                    <img class="col-sm" src="'+ filename +'">\
                        <div class="col-sm info d-flex flex-column fs-2">\
                            <div class="fs-1 fw-bold text-break">\
                                '+nickname+'\
                            </div>\
                            <div>'+ description +'</div>\
                            <div class="d-flex flex-row">\
                                <div class="fs-5">Comments: 3</div>\
                                <div class="fs-5">Likes: 1</div>\
                            </div>\
                        </div>\
                </div>\
            </div>\
        </a>';
    table.innerHTML += tableHtml;
    console.info('Added');
}



