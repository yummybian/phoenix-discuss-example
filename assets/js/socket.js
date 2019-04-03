// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import { Socket } from "phoenix"

let socket = new Socket("/socket", { params: { token: window.userToken } })

socket.connect()

const createSocket = (topicId) => {
  // Now that you are connected, you can join channels with a topic:
  let channel = socket.channel(`comments: ${topicId}`, {})
  channel.join()
    .receive("ok", resp => {
      renderComments(resp.comments)
    })
    .receive("error", resp => { console.log("Unable to join", resp) })

  channel.on(`comments:${topicId}:new`, renderComment);

  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value;

    channel.push('comment:add', { content: content });
  })
}

function renderComments(comments) {
  const renderedComments = comments.map(comment => {
    return commentTemplate(comment);
  })

  document.querySelector('.collection').innerHTML = renderedComments.join('')
}

function renderComment(comment) {
  const renderedComment = commentTemplate(comment.comment)
  document.querySelector('.collection').innerHTML += renderedComment
}

function commentTemplate(comment) {
  let email = 'Anonymous';
  if (comment.user) {
    email = comment.user.email;
  }

  return `
      <li class="collection-item">
        ${comment.content}
        <div class="secondary-content">
          ${email}
        </div>
      </li>
    `
}
window.createSocket = createSocket;
