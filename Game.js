



class Bead {
    div = null;
    entity_state = 0;
    color = null;
    beads_holder = null;
    row = 0;
    column = 0;
    inner_div = null;

    constructor(beads_holder, row, column) {
        this.entity_state = 0;
        this.beads_holder = beads_holder;
        this.row = row;
        this.column = column;
        let div = document.createElement('div');
        div.className = "content";
        div.style.position = "absolute";
        div.style.width = "80%";
        div.style.height = "80%";
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignContent = "center";
        div.style.top = 0;
        div.bottom = 0;
        div.left = 0;
        div.right = 0;
        let x1 = this.beads_holder.row * this.beads_holder.size + this.row;
        let y1 = this.beads_holder.column * this.beads_holder.size + this.column;
        div.id = "cell" + x1 + "-" + y1;
        var copy = this;
        div.onclick = function () { click_bead(copy) };
        this.div = div;
    }

    full(color, player_number) {
        if (this.inner_div == null) {
            inner_div = document.createElement("div");
            div.appendChild(inner_div);

            inner_div.style.color = color;
            inner_div.style.width = "100%";
            inner_div.style.height = "100%";

            inner_div.style.borderRadius = "50%";
            inner_div.style.backgroundColor = color;

            this.entity_state = player_number;
        }
    }

    set_row_and_column(row, column) {
        this.row = row;
        this.column = column;
    }


    victory_color() {
        this.inner_div.style.backgroundColor = "blue";
    }


}


function click_bead(bead) {
    if (board.finish) {
        return;
    }
    if (put_state) {
        if (bead.entity_state !== 0) {
            error_select_full_cell();
            return;
        }
        var color = color1;
        if (turn == 2) {
            color = color2;
        }
        bead.inner_div = document.createElement("div");
        bead.div.appendChild(bead.inner_div);

        bead.inner_div.style.color = color;
        bead.inner_div.style.width = "100%";
        bead.inner_div.style.height = "100%";

        bead.inner_div.style.borderRadius = "50%";
        bead.inner_div.style.backgroundColor = color;
        bead.entity_state = turn;
        put_state = false;
        board.counter++;
    }

}

class Beads_holder {
    row = 0;
    column = 0;
    size = 0;
    beads_array = null;
    beads_holder_div = null;

    constructor(row, column, size, beads_holder_div) {
        this.size = size;
        this.column = column;
        this.row = row;
        this.beads_holder_div = beads_holder_div;
        this.beads_array = Create2DArray(size);
        var table = document.createElement("table");
        this.beads_holder_div.appendChild(table);
        table.style.width = "100%";
        for (let i = 0; i < size; i++) {

            var tr = document.createElement("tr");
            table.appendChild(tr);

            for (let j = 0; j < size; j++) {

                var td = document.createElement("td");
                tr.appendChild(td);
                td.style.width = "" + 100 / this.size + "%";
                td.style.position = "relative";
                this.beads_array[i][j] = new Bead(this, i, j);
                var div = this.beads_array[i][j].div;
                td.appendChild(div);

            }
        }
        let copy = this;
        this.beads_holder_div.onclick = function () {
            rotate_request(copy);
        };
    }

    rotate(clockwise) {
        let temp = Create2DArray(this.size);
        if (!clockwise) {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    temp[i][j] = this.beads_array[j][this.size - 1 - i];
                }

            }
        } else {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    temp[j][this.size - 1 - i] = this.beads_array[i][j];
                }

            }
        }
        this.beads_array = temp;
        changeTurn();
    }

}


function rotate_request(beads_holder) {
    if (board.finish) {
        return;
    }
    if (!put_state) {
        if (!rotate_state) {
            rotate_state = true;
            return;
        }
        rotate(clockwise, beads_holder.beads_holder_div);
        beads_holder.rotate(clockwise);
        board.update();
        put_state = true;
        rotate_state = false;
    }
}



class Board {
    size = 0;
    borad_div = null;
    beads_holders = null;
    finish = false;
    counter = 0;

    constructor(size) {
        this.size = size;
        this.beads_holders = Create2DArray(2);
        this.beads_holders[0][0] = document.getElementById('beads_container0-0');
        this.beads_holders[0][1] = document.getElementById('beads_container0-1');
        this.beads_holders[1][0] = document.getElementById('beads_container1-0');
        this.beads_holders[1][1] = document.getElementById('beads_container1-1');
        this.beads_array = Create2DArray(2 * size);

        for (let i = 0; i < 2; i++) {


            for (let j = 0; j < 2; j++) {

                this.beads_holders[i][j] = new Beads_holder(i, j, size, this.beads_holders[i][j]);

            }

        }

        this.update();


    }

    update() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let row = 0; row < this.size; row++) {
                    for (let column = 0; column < this.size; column++) {
                        this.beads_array[this.size * i + row][this.size * j + column] = this.beads_holders[i][j].beads_array[row][column];
                    }

                }

            }
        }
        check_victory(this);
    }


}


function check_victory(board) {
    let beads = []
    for (let i = 0; i < size * 2; i++) {
        for (let j = 0; j < 2 * size; j++) {
            let flag = true;
            let state = board.beads_array[i][j].entity_state;
            if (state == 0) {
                continue;
            }
            for (let t = 0; t < victory_size; t++) {
                if (i + t >= 2 * size || j + t >= 2 * size) {
                    flag = false;
                    break;
                }
                if (board.beads_array[i + t][j + t].entity_state !== state) {
                    flag = false;
                    break;
                }
                beads[t] = board.beads_array[i + t][j + t];
            }
            if (flag) {
                victory_alert(beads);
                return state;
            }
            flag = true;
            state = board.beads_array[i][j].entity_state;
            if (state == 0) {
                continue;
            }
            for (let t = 0; t < victory_size; t++) {
                if (i + t >= 2 * size) {
                    flag = false;
                    break;
                }
                if (board.beads_array[i + t][j].entity_state !== state) {
                    flag = false;
                    break;
                }
                beads[t] = board.beads_array[i + t][j];
            }
            if (flag) {
                victory_alert(beads);
                return state;
            }
            flag = true;
            state = board.beads_array[i][j].entity_state;
            if (state == 0) {
                continue;
            }
            for (let t = 0; t < victory_size; t++) {
                if (j + t >= 2 * size) {
                    flag = false;
                    break;
                }
                if (board.beads_array[i][j + t].entity_state !== state) {
                    flag = false;
                    break;
                }
                beads[t] = board.beads_array[i][j + t];
            }
            if (flag) {
                victory_alert(beads);
                return state;
            }
            flag = true;
            state = board.beads_array[i][j].entity_state;
            if (state == 0) {
                continue;
            }
            for (let t = 0; t < victory_size; t++) {
                if (i + t >= 2 * size || j - t < 0) {
                    flag = false;
                    break;
                }
                if (board.beads_array[i + t][j - t].entity_state !== state) {
                    flag = false;
                    break;
                }
                beads[t] = board.beads_array[i + t][j - t];
            }
            if (flag) {
                victory_alert(beads);
                return state;
            }
        }

    }
    if (board.counter == 4 * board.size * board.size) {
        return 3;
    }
    return 0;
}


function victory_alert(beads) {
    board.finish = true;
    clearTimeout(timer);
    beads.forEach(bead => {
        bead.victory_color();
    });
    let state = beads[0].entity_state;
    let name = state == 1 ? player1 : player2;
    alert("" + name + " win the game!");
    game_container.appendChild(new_game);

}

function draw_alert() {
    board.finish = true;
    clearTimeout(timer);
    beads.forEach(bead => {
        bead.victory_color();
    });
    alert("Draws");
    game_container.appendChild(new_game);
}










































































var game_making_form = document.getElementById("game_making_form");
var game_container = document.getElementById("game_container");
var new_game = document.getElementById("new_game");
var body = document.getElementById("body");

game_container.removeChild(new_game);
body.removeChild(game_container);
timer = null;

var size = 5;
var victory_size = 2;
var turn_time = 10000;
var player1;
var player2;
var turn = 1;
var color1 = "#edd8d8";
var color2 = "#1c1b1b";
var clockwise = false;
var put_state = true;
var rotate_state = false;
var board = null;


// makeBoard();

// array = Create2DArray(size * 2);
// for (let i = 0; i < size * 2; i++) {
//     for (let j = 0; j < size * 2; j++) {
//         array[i][j] = document.getElementById("cell" + i + '-' + j);

//     }

// }


function makeBoard() {

    var form = document["forms"][0];

    size = parseInt(form.size.value);
    victory_size = parseInt(form.victory.value);
    player1 = form.player1name.value;
    player2 = form.player2name.value;

    body.removeChild(game_making_form);
    body.appendChild(game_container);
    board = new Board(size);

    document.getElementById("name1").innerHTML = player1;
    document.getElementById("name2").innerHTML = player2;

    timer = setTimeout(function () { random_turn(); }, turn_time);
}



function error_not_found_cell() {
    alert("incorrect cell have   been choosed!");
}

function error_select_full_cell() {
    alert("full cell! choose another!");
}


function changeTurn() {
    if (turn == 1) {
        document.getElementById("name1").className = "item";
        document.getElementById("name2").className = "active item";
    } else {
        document.getElementById("name2").className = "item";
        document.getElementById("name1").className = "active item";
    }
    turn = 3 - turn;
    clearTimeout(timer);
    timer = setTimeout(function () { random_turn(); }, turn_time);
}

function random_turn() {
    while (true) {
        let x = Math.floor(Math.random() * 2 * size);
        let y = Math.floor(Math.random() * 2 * size);
        if (board.beads_array[x][y].entity_state == 0) {
            click_bead(board.beads_array[x][y]);
            break;
        }
    }
    var x = Math.floor(Math.random() * 2);
    var y = Math.floor(Math.random() * 2);
    put_state = false;
    rotate_state = true;
    rotate_request(board.beads_holders[x][y]);
    alert("رایانه  به جای شما بازی کرد!");
}

function counterclockwise() {
    if (clockwise) {
        document.getElementById("directspan").innerHTML = "↺";
        clockwise = false;
    } else {
        document.getElementById("directspan").innerHTML = "↻";
        clockwise = true;
    }

}

function rotate(clockwise, element) {
    let regext_res = element.style.transform.match(/-?\d+/g);
    let current = regext_res !== null ? Number(regext_res[0]) : 0;
    let res = current + (clockwise ? 90 : -90);
    element.style.transform = 'rotate(' + res + 'deg)'
}


function Create2DArray(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }

    return arr;
}







































