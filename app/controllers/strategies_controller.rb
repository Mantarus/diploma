class StrategiesController < ApplicationController
  # Пользователь должен быть аутентифицирован,
  # чтобы выполнять любые действия со стратегиями
  before_action :authenticate_user!

  # Отображение всех стратегий
  def index
    @strategies = Strategy.all
  end

  # Создание новой стратегии из
  # переданных параметров
  def create
    # Создание объекта из параметров,
    # переданных из формы
    @strategy = current_user.strategies.create(strategy_params)

    # Сохранение стратегии в базу данных
    @strategy.save

    # Перенаправление пользователя на
    # страницу загруженной стратегии
    redirect_to @strategy
  end

  # Запрос на загрузку новой стратегии
  def new; end

  # Отображение выбранной стратегии
  def show
    @strategy = Strategy.find(params[:id])
  end

  # Запрос на изменение выбранной стратегии
  def edit
    @strategy = Strategy.find(params[:id])
  end

  # Обновление выбранной стратегии по
  # переданным параметрам
  def update
    @strategy = Strategy.find(params[:id])

    # Если стратегия была успешно изменена,
    # перенаправить пользователя на её страницу
    if @strategy.update(strategy_params)
      redirect_to @strategy
    end
  end

  # Удаление выбранной стратегии
  def destroy
    @strategy = Strategy.find(params[:id])

    # Удалить стратегию, если пользователь является
    # её автором либо администратором
    if @strategy.user == current_user or current_user.admin?
      @strategy.destroy
      redirect_to strategies_path
    end
  end

  private

  # Определяет поля объекта "стратегия"
  def strategy_params
    params.require(:strategy).permit(:title, :code)
  end
end
