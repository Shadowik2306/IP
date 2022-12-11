'use strict'

Handlebars.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});

const items = new Map();

class ItemLine {
    constructor(nickname, filename, description) {
        this.filename = filename;
        this.nickname = nickname;
        this.description = description;
    }

    static createFrom(item) {
        return new ItemLine(item.nickname, item.filename, item.description);
    }
}

function loadItemsTable() {
    console.info('Try to load data');

    function drawItemsTable() {
        console.info('Try to draw table');

        const table = document.querySelector("#posts");
        if (table == null) {
            throw 'Table is not found';
        }

        fetch("handlebars/items-table.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const template = Handlebars.compile(html);
                table.innerHTML = template({ 'items': Object.fromEntries(items.entries()) });
                console.info('Drawn');
            })
            .catch(function (error) {
                console.error('Error:', error);
                throw "Can't render template";
            });
    }

    fetch("http://localhost:8079/lines")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.info('Loaded');
            items.clear();
            for (let i = 0; i < data.length; i++) {
                const current = data[i];
                items.set(current.id, ItemLine.createFrom(current));
            }
            drawItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't load items";
        });
}

function editItemInTable(id) {
    console.info('Start edit script');

    var input = document.createElement('input');
    input.type = 'file';
    var item;

    input.onchange = e => {
        item = e.target.files[0];
        extra();
    }

    input.click();

    function extra() {
        console.log(document.getElementById("item-" + id.toString()));
        const itemObject = new ItemLine(document.getElementById("item-" + id.toString()).querySelector("#nickname").textContent.trim(),
            "src\\" + item.name,
            document.getElementById("item-" + id.toString()).querySelector("#description").textContent);


        fetch("http://localhost:8079/lines/" + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemObject)
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                loadItemsTable();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

}

function addItemToTable(nickname, filename, description) {
    console.info('Try to add item');

    const itemObject = new ItemLine(nickname, filename, description);

    fetch("http://localhost:8079/lines",
        {
            method: 'POST',
            body: JSON.stringify(itemObject),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.info('Added');
            console.log(data);

            loadItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't add item";
        });
}


document.addEventListener('DOMContentLoaded', function () {
    console.info('Script Loaded');

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
        throw 'Description is not found';
    }

    loadItemsTable();

    const form = document.querySelector("#frm-items");
    if (form !== null) {
        form.addEventListener('submit', function (event) {
            console.info('Form on submit');
            event.preventDefault();

            var filename = item.value.replace('C:\\fakepath\\', 'src\\');
            console.info(filename);

            addItemToTable(nickname.value, filename, description.value);

            item.value = '';
            nickname.value = '';
            description.value = '';
        });
    }
});