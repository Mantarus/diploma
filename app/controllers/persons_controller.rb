class PersonsController < ApplicationController
  def profile
    @strategies = current_user.strategies
    @games = current_user.games
  end
end
