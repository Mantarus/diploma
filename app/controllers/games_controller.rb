class GamesController < ApplicationController
  before_action :authenticate_user!

  def index
    @games = Game.all
  end

  def create
    @game = current_user.games.create(game_params)
  end

  def new; end

  def show

  end

  private

  def game_params
    params.require(:strategy).permit(:strategy1, :strategy2)
  end

end
