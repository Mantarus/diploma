class StrategiesController < ApplicationController
  before_action :authenticate_user!

  def index
    @strategies = Strategy.all
  end

  def my
    @strategies = current_user.strategies
  end

  def show
    @strategy = Strategy.find(params[:id])
  end

  def new; end

  def create
    @strategy = Strategy.new(strategy_params)
    @strategy.user = current_user

    @strategy.save
    redirect_to @strategy
  end

  private

  def strategy_params
    params.require(:strategy).permit(:title, :code)
  end
end
