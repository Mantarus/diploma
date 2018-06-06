require 'net/http'
require 'json'

class GamesController < ApplicationController
  before_action :authenticate_user!

  def index
    @games = Game.all
  end

  def create
    @game = current_user.games.create(game_params)

    uri = URI.parse('http://localhost:4567/play/')
    http = Net::HTTP.new(uri.host, uri.port)
    # http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
    data = { strategy1: Strategy.find(@game.strategy1_id).code,
             strategy2: Strategy.find(@game.strategy2_id).code }
    request.body = data.to_json
    puts request.body.to_s

    response = http.request(request)
    data = JSON.parse(response.body)

    @game.success = data['success']
    @game.winner = data['winner']
    @game.game_log = data['game_log']
    @game.game_error = data['game_error']

    @game.save

    redirect_to @game
  end

  def new; end

  def show
    @game = Game.find(params[:id])
  end

  private

  def game_params
    params.require(:game).permit(:strategy1_id, :strategy2_id)
  end

end
