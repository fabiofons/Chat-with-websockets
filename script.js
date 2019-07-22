$('form').on('submit', function(e){ 
  e.preventDefault();   
  let dataForm = $('.inputlogin').val();
  $.ajax({
    "type": "POST",
    "url": "/api/users",
    "data": `{"user": "${dataForm}"}`,
    "contentType": "application/json",
  })
  $('.inputlogin').val("");

  //insertar usuarios que estan en mongodb
  $.getJSON("/api/users")
    .then(function(data) {
      data.forEach(function(contact) {
        $('.contacts').append(`<div class="user" id=${contact.user}>
            <span class="state"><i class="far fa-circle"></i></span>
            <p class="name">${contact.user}</p>
            <i class="fas fa-ellipsis-v"></i>
          </div>`);
      });
  })

  //insertar mensajes que estan en mongodb
  $.getJSON("/api/messages")
    .then(function(data) {
      data.forEach(msg => {
        $('#chat').append(`<div class='message'>
        <p class='title'>
          ${msg.user}<span>${msg.date}</span>
        </p>
        <p class='text'>${msg.body}</p>
        </div>`);
      });
  });

  // eliminar la vista del login
  $('.login').css('display', 'none');

});

