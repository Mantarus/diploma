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
const SLEEP_TIME = 150;

let ships_map = {
    P1: [],
    P2: []
};

async function play(game_log) {
    // Инициализация игровых полей
    clear_field();

    // Разбиение лога на строки
    let lines = game_log.split(";");

    // Основной цикл игры
    for (let i = 0; i < lines.length; i++) {
        // Разбиение входной строки на слоа
        let tokens = lines[i].split('\t');
        // Обработка расположения кораблей
        if (tokens[0] === "pl") {
            process_pl_line(tokens);
        }
        // Обработка перемещения кораблей
        if (tokens[0] === "mv") {
            process_mv_line(tokens);
            await sleep(SLEEP_TIME);
        }
        // Обработка выстрелов
        if (tokens[0] === "st") {
            await process_st_line(tokens);
            await sleep(SLEEP_TIME);
        }
        // Обработка завершения игры
        if (tokens[0] === "win") {
            process_win_line(tokens);
        }
    }
}

function process_pl_line(tokens) {
    // Извлечение значений
    let player = tokens[1];
    let ship_idx = parseInt(tokens[2]);
    let ship_len = parseInt(tokens[3]);
    let ship_hor = tokens[4] === "true";
    let ship_y = parseInt(tokens[5]);
    let ship_x = parseInt(tokens[6]);

    // Отрисовка корабля и получение массива его координат
    let ship_coords = render_ship(player, ship_x,
        ship_y, ship_len, ship_hor, [], 100);

    // Занесение в ships_map нового объекта, основанного на
    // переданных значениях
    ships_map[player][ship_idx] = {
        id: ship_idx,
        len: ship_len,
        hp: 100,
        coords: ship_coords
    }
}

function process_mv_line(tokens) {
    // Извлечение значений из строки
    let player = tokens[1];
    let ship_idx = parseInt(tokens[2]);
    let ship_hor = tokens[3] === "true";
    let ship_y = parseInt(tokens[4]);
    let ship_x = parseInt(tokens[5]);
    // Извлечение значений из ships_map
    let ship_len = ships_map[player][ship_idx].len;
    let ship_coords = ships_map[player][ship_idx].coords;
    let ship_hp = ships_map[player][ship_idx].hp;

    // Отрисовка корабля в новых координатах и обновление
    // координат корабля результатом вызова функции
    ships_map[player][ship_idx].coords =
        render_ship(player, ship_x, ship_y,
            ship_len, ship_hor, ship_coords, ship_hp)
}

async function process_st_line(tokens) {
    // Извлечение значений
    let player = tokens[1];
    let shot_y = parseInt(tokens[2]);
    let shot_x = parseInt(tokens[3]);
    let result = tokens[4];
    // Получение идентификатора игрока-противника
    let opponent = player === "P1" ? "P2" : "P1";

    // Обработка события "корабль убит"
    if (result.startsWith("killed")) {
        let ship = find_ship(opponent, shot_x, shot_y);
        color_cell(opponent, shot_x, shot_y, HIT_COLOR, null);
        await sleep(SLEEP_TIME);
        clear_ship(opponent, ship);
        ships_map[opponent] = ships_map[opponent].filter(item => item != ship);
    }
    // Обработка события "корабль ранен"
    if (result === "wounded") {
        let ship_hp = tokens[6];
        color_cell(opponent, shot_x, shot_y, HIT_COLOR, null);
        await sleep(SLEEP_TIME);
        let ship = find_ship(opponent, shot_x, shot_y);
        ship.hp = ship_hp;
        update_ship(opponent, ship)
    }
    // Обработка события "промах"
    if (result === "miss") {
        color_cell(opponent, shot_x, shot_y, MISS_COLOR, null);
        await sleep(SLEEP_TIME);
        color_cell(opponent, shot_x, shot_y, WATER_COLOR, null);
    }
}

function process_win_line(tokens) {
    let player_name = tokens[1] === "P1" ? "Игрок 1" : "Игрок 2";
    alert(`${player_name} победил!`)
}

function find_ship(player, x, y) {
    // Поиск корабля по координатам
    let ship = ships_map[player].filter(ship => {
        let contains = false;
        ship.coords.forEach(coord => {
            if (coord[0] === x && coord[1] === y)
                contains = true
        });
        return contains;
    });

    // Вернуть корабль, если найден
    if (ship.length)
        return ship[0];
    return null;
}

function update_ship(player, ship) {
    let ship_x = ship.coords[0][0];
    let ship_y = ship.coords[0][1];
    let ship_len = ship.coords.length;
    // Определение ориентации корабля по паре соседних координат
    let ship_hor = ship_len === 1 || ship.coords[0][1] === ship.coords[1][1];
    // Перерисовка корабля
    render_ship(player, ship_x, ship_y, ship_len, ship_hor, ship.coords, ship.hp)
}

function render_ship(player, ship_x, ship_y, ship_len, ship_hor, old_coords, hp) {
    // Очистить старые клетки
    old_coords.forEach(coord => color_cell(player, coord[0], coord[1], WATER_COLOR, ""));

    // Определение массива для разворота корабля
    // по вертикальной или горизонтальной оси
    // в соответствии с аргументом ship_hor
    let dim;
    if (ship_hor)
        dim = [ship_len, 1];
    else
        dim = [1, ship_len];

    // Объявление массива новых координат корабля
    let new_coords = [];
    // Окраска клеток поля в соответствии с новым расположением корабля
    // и запись новых координат в массив
    for (let x = 0; x < dim[0]; x++) {
        for (let y = 0; y < dim[1]; y++) {
            color_cell(player, ship_x + x, ship_y + y, SHIP_COLOR, hp);
            new_coords.push([ship_x + x, ship_y + y])
        }
    }

    // Вернуть массив новых координат корабля
    return new_coords
}

function clear_ship(player, ship) {
    ship.coords.forEach(coord => color_cell(player, coord[0], coord[1], WATER_COLOR, null))
}

function get_cell_id(player, x, y) {
    return `${player}_${x}_${y}`
}

function color_cell(player, x, y, color, value) {
    // Сформировать идентификатор клетки, по которому будет найден
    // конкретный элемент веб-страницы
    let cell_id = get_cell_id(player, x, y);
    // Покрасить клетку в выбранный цвет
    document.getElementById(cell_id).style.backgroundColor = color;
    // Записать текст в клетку
    document.getElementById(cell_id).innerText = value;
}

function clear_field() {
    // Получить массив, содержащий все элементы класса square
    let fields = document.getElementsByClassName("square");
    // Изменить цвет каждой клетки
    for (let i = 0; i < fields.length; i++) {
        fields[i].style.backgroundColor = WATER_COLOR;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}