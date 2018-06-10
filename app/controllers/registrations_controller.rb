class RegistrationsController < Devise::RegistrationsController

  protected

  # Позволяет пользователю изменить данные своего аккаунта
  # без повторного ввода пароля
  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  # Определяет параметры, которые пользователь может задать
  # при создании нового аккаунта
  def sign_up_params
    params.require(:user).permit(:full_name, :group, :email, :password, :password_confirmation)
  end

  # Определяет параметры, которые пользователь может задать
  # при изменении своего аккаунта
  def account_update_params
    params.require(:user).permit(:full_name, :group, :email, :password, :password_confirmation)
  end
end
