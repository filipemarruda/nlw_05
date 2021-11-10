/* global io Mustache dayjs */
const socket = io();

let connetionsUsers = [];

socket.on("admin_list_all_users", connections => {
  connetionsUsers = connections;
  document.getElementById("list_users").innerHTML = "";

  const template = document.getElementById("template").innerHTML;
  connections.forEach(({ socket_id: id, user: { email } }) => {
    const rendered = Mustache.render(template, {
      email,
      id
    });

    document.getElementById("list_users").innerHTML += rendered;
  });
});

function call(id) {
  const connection = connetionsUsers.find(conn => conn.socket_id === id);
  const template = document.getElementById("admin_template").innerHTML;
  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id
  });
  document.getElementById("supports").innerHTML += rendered;

  const params = {
    user_id: connection.user_id
  };

  socket.emit("admin_user_in_support", params);

  socket.emit("admin_list_messages_by_users", params, messages => {
    const divMessages = document.getElementById(`allMessages${connection.user_id}`);

    messages.forEach(({ admin_id: msg_admin_id, text, created_at }) => {
      const createDiv = document.createElement("div");

      if (msg_admin_id === null) {
        createDiv.className = "admin_message_client";

        createDiv.innerHTML = `<b>${connection.user.email}:</b>`;
        createDiv.innerHTML += `<span>${text}</span>`;
        createDiv.innerHTML
          += `<span class="admin_date">${dayjs(created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        createDiv.className = "admin_message_admin";

        createDiv.innerHTML = "<b>Atendente:</b>";
        createDiv.innerHTML += `<span>${text}</span>`;
        createDiv.innerHTML
          += `<span class="admin_date">${dayjs(created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      }

      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    text: text.value,
    user_id: id
  };

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${id}`);

  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";

  createDiv.innerHTML = "<b>Atendente:</b>";
  createDiv.innerHTML += `<span>${params.text}</span>`;
  createDiv.innerHTML
          += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.append(createDiv);
  text.value = "";
}

socket.on("admin_receive_message", ({ socket_id: data_socket_id, message: { text, created_at } }) => {
  const connection = connetionsUsers.find(conn => conn.socket_id === data_socket_id);
  const divMessages = document.getElementById(`allMessages${connection.user_id}`);

  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_client";

  createDiv.innerHTML = `<b>${connection.user.email}:</b>`;
  createDiv.innerHTML += `<span>${text}</span>`;
  createDiv.innerHTML
          += `<span class="admin_date">${dayjs(created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(createDiv);
});
