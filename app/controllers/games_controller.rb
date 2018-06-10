require 'net/http'
require 'json'

class GamesController < ApplicationController
  # Пользователь должен быть аутентифицирован,
  # чтобы выполнять любые действия с играми
  before_action :authenticate_user!

  # Показать все проведенные игры
  def index
    @games = Game.all
  end

  # Создание новой игры из переданных
  # параметрови её запуск
  def create
    # Создание объекта игры из параметров
    @game = current_user.games.create(game_params)

    # Формирование HTTP-запроса к модулю,
    # исполняющему код игры
    uri = URI.parse('http://localhost:4567/play/')
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')

    # Формирование тела запроса
    data = { strategy1: Strategy.find(@game.strategy1_id).code,
             strategy2: Strategy.find(@game.strategy2_id).code }
    request.body = data.to_json

    # Выполнение запроса к модулю и
    # получение результата
    response = http.request(request)
    data = JSON.parse(response.body)

    # Заполнение полей объекта игры
    # значениями полученного результата игры
    @game.success = data['success']
    @game.winner = data['winner']
    @game.game_log = data['game_log']
    @game.game_error = data['game_error']

    # Сохранение игры в базу данных
    @game.save

    # Перенаправление на страницу завершенной игры
    redirect_to @game
  end

  # Запрос на создание новой игры
  def new; end

  # Отображение выбранной игры
  def show
    @game = Game.find(params[:id])
  end

  private

  # Определяет поля объекта "игра"
  def game_params
    params.require(:game).permit(:strategy1_id, :strategy2_id)
  end

end
