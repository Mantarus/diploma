class StrategiesController < ApplicationController
  before_action :authenticate_user!

  def index
    @strategies = Strategy.all
  end

  def create
    @strategy = current_user.strategies.create(strategy_params)

    @strategy.save
    redirect_to @strategy
  end

  def new; end

  def show
    @strategy = Strategy.find(params[:id])
  end

  def edit
    @strategy = Strategy.find(params[:id])
  end

  def update
    @strategy = Strategy.find(params[:id])

    if @strategy.update(strategy_params)
      redirect_to @strategy
    end
  end

  def destroy
    @strategy = Strategy.find(params[:id])
    if @strategy.user == current_user or current_user.admin?
      @strategy.destroy
      redirect_to strategies_path
    end
  end

  private

  def strategy_params
    params.require(:strategy).permit(:title, :code)
  end
end
