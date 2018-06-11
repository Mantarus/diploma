// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .

const SHIP_COLOR = "#6f6f6f";
const WATER_COLOR = "#a2ffff";
const HIT_COLOR = "#ff3a36";
const MISS_COLOR = "#ffffff";

function play(game_log) {
    clear_field();

    let lines = game_log.split(";");

    for (let i = 0; i < lines.length; i++) {
        let tokens = lines[i].split('\t');
        if (tokens[0] === "pl") {
            process_pl_line(tokens)
        }
    }
}

function process_pl_line(tokens) {
    let player = tokens[1];
    let ship_idx = parseInt(tokens[2]);
    let ship_len = parseInt(tokens[3]);
    let ship_hor = tokens[4] === "true";
    let ship_y = parseInt(tokens[5]);
    let ship_x = parseInt(tokens[6]);

    render_ship(player, ship_x, ship_y, ship_len, ship_hor);
}

function get_cell_id(player, x, y) {
    return `${player}_${x}_${y}`
}

function render_ship(player, ship_x, ship_y, ship_len, ship_hor) {
    console.log([player, ship_x, ship_y, ship_len, ship_hor]);

    let dim;
    if (ship_hor)
        dim = [ship_len, 1];
    else
        dim = [1, ship_len];

    for (let x = 0; x < dim[0]; x++) {
        for (let y = 0; y < dim[1]; y++) {
            console.log([ship_x + x, ship_y + y]);
            color_cell(player, ship_x + x, ship_y + y, SHIP_COLOR);
        }
    }

}

function color_cell(player, x, y, color) {
    let cell_id = get_cell_id(player, x, y);
    document.getElementById(`${cell_id}`).style.backgroundColor = color;
}

function clear_field() {
    let fields = document.getElementsByClassName("square");
    for (let i = 0; i < fields.length; i++) {
        fields[i].style.backgroundColor = WATER_COLOR;
    }
}