defmodule DiscussWeb.UserSocket do
  use Phoenix.Socket

  channel "comments:*", Discuss.CommentsChannel

  def connect(%{"token" => token}, socket, _connect_info) do
    case Phoenix.Token.verify(socket, "key", token) do
      {:ok, user_id} ->
        socket = assign(socket, :user_id, user_id)
        {:ok, socket}

      {:error, _error} ->
        :error
    end
  end

  def id(_socket), do: nil
end
