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
const SLEEP_TIME = 0;

let ships_map = {
    P1: [],
    P2: []
};

async function play(game_log) {
    clear_field();

    let lines = game_log.split(";");

    // Основной цикл игры
    for (let i = 0; i < lines.length; i++) {
        let tokens = lines[i].split('\t');
        if (tokens[0] === "pl") {
            process_pl_line(tokens);
        } if (tokens[0] === "mv") {
            process_mv_line(tokens);
            await sleep(SLEEP_TIME)
        } if (tokens[0] === "st") {
            await process_st_line(tokens);
            await sleep(SLEEP_TIME)
        }
    }
    console.log(ships_map)
}

function process_pl_line(tokens) {
    let player = tokens[1];
    let ship_idx = parseInt(tokens[2]);
    let ship_len = parseInt(tokens[3]);
    let ship_hor = tokens[4] === "true";
    let ship_y = parseInt(tokens[5]);
    let ship_x = parseInt(tokens[6]);
    let ship_coords = render_ship(player, ship_x, ship_y, ship_len, ship_hor, [], 100);

    ships_map[player][ship_idx] = {
        id: ship_idx,
        len: ship_len,
        hp: 100,
        coords: ship_coords
    }
}

function process_mv_line(tokens) {
    let player = tokens[1];
    let ship_idx = parseInt(tokens[2]);
    let ship_hor = tokens[3] === "true";
    let ship_y = parseInt(tokens[4]);
    let ship_x = parseInt(tokens[5]);
    let ship_len = ships_map[player][ship_idx].len;
    let ship_coords = ships_map[player][ship_idx].coords;
    let ship_hp = ships_map[player][ship_idx].hp;

    console.log(`MOVE ${player} ${ship_idx} ${ship_x} ${ship_y} ${ship_hor}`);
    ships_map[player][ship_idx].coords =
        render_ship(player, ship_x, ship_y, ship_len, ship_hor, ship_coords, ship_hp)
}

async function process_st_line(tokens) {
    let player = tokens[1];
    let shot_y = parseInt(tokens[2]);
    let shot_x = parseInt(tokens[3]);
    let result = tokens[4];
    let ship_idx;
    let ship_hp;
    let opponent = player === "P1" ? "P2" : "P1";

    console.log(`SHOT ${player}`);
    if (result.startsWith("killed")) {
        console.log(`KILL ${opponent}`);

        let ship = find_ship(opponent, shot_x, shot_y);
        clear_ship(opponent, ship);
        ships_map[opponent] = ships_map[opponent].filter(item => item != ship);
        console.log(ships_map[opponent])
    }
    if (result === "wounded") {
        console.log(`WOUNDED ${opponent}`);

        ship_idx = tokens[5];
        ship_hp = tokens[6];
        color_cell(opponent, shot_x, shot_y, HIT_COLOR, null);
        await sleep(SLEEP_TIME);
        let ship = find_ship(opponent, shot_x, shot_y);
        ship.hp = ship_hp;
        update_ship(opponent, ship)
    }
    if (result === "miss") {
        console.log(`MISS ${opponent}`);

        color_cell(opponent, shot_x, shot_y, MISS_COLOR, null);
        await sleep(SLEEP_TIME);
        color_cell(opponent, shot_x, shot_y, WATER_COLOR, null);
    }
}

function get_cell_id(player, x, y) {
    return `${player}_${x}_${y}`
}

function find_ship(player, x, y) {
    // console.log(player, x, y);
    // console.log(ships_map[player]);
    let ship = ships_map[player].filter(ship => {
        let contains = false;
        ship.coords.forEach(coord => {
            if (coord[0] === x && coord[1] === y)
                contains = true
        });
        return contains;
    });
    // console.log(ships_map[player]);
    if (ship.length)
        return ship[0];
    return null;
}

function update_ship(player, ship) {
    let ship_x = ship.coords[0][0];
    let ship_y = ship.coords[0][1];
    let ship_len = ship.coords.length;
    let ship_hor = ship_len === 1 || ship.coords[0][1] === ship.coords[1][1];
    render_ship(player, ship_x, ship_y, ship_len, ship_hor, ship.coords, ship.hp)
}

function render_ship(player, ship_x, ship_y, ship_len, ship_hor, old_coords, hp) {
    // console.log([player, ship_x, ship_y, ship_len, ship_hor]);

    // Очистить старые клетки
    old_coords.forEach(coord => color_cell(player, coord[0], coord[1], WATER_COLOR, ""));

    let dim;
    if (ship_hor)
        dim = [ship_len, 1];
    else
        dim = [1, ship_len];

    let new_coords = [];
    for (let x = 0; x < dim[0]; x++) {
        for (let y = 0; y < dim[1]; y++) {
            // console.log([ship_x + x, ship_y + y]);
            color_cell(player, ship_x + x, ship_y + y, SHIP_COLOR, hp);
            new_coords.push([ship_x + x, ship_y + y])
        }
    }

    // Вернуть массив новых координат корабля
    return new_coords
}

function clear_ship(player, ship) {
    ship.coords.forEach(coord => color_cell(player, coord[0], coord[1], WATER_COLOR, ""))
}

function color_cell(player, x, y, color, value) {
    let cell_id = get_cell_id(player, x, y);
    document.getElementById(`${cell_id}`).style.backgroundColor = color;
    document.getElementById(`${cell_id}`).innerText = value;
}

function clear_field() {
    let fields = document.getElementsByClassName("square");
    for (let i = 0; i < fields.length; i++) {
        fields[i].style.backgroundColor = WATER_COLOR;
        fields[i].style.innerText = "";
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}