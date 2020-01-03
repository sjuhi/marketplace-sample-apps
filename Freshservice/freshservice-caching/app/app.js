$(document).ready(function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.events.on('app.activated',
        function () {
          cachedResponse();
        },
        function (){
          notify('info','Unable to Open to App')
        }
        );
    });
});

/**
 * Function to Cache Request API response
 */
function cachedResponse() {
  var options = {
    headers: {
      Authorization: "Basic <%= encode(iparam.freshservice_api_key)%>",
      "Content-Type": "application/json;charset=utf-8"
    },
    cache: true,
    ttl: 1000
  };
  client.request.get(`https://<%=iparam.freshservice_subdomain%>.freshservice.com/api/v2/agents`, options)
    .then(function (data) {
      try {
        data = JSON.parse(data.response);
        data = data.agents;
        renderTable(data);

      } catch (error) {
        console.error("Error while attempting to show issue", error);
      }
    })
    .catch(function (error) {
      console.error("error", error);
    });
}


/**
 * Function to Open modal with Agent Details
 * @param {String} id ID of the agent to be viewed
 */
function openModal(id) {
  client.interface.trigger("showModal", {
    title: "Agent Details",
    template: "modal.html",
    data: { agentID: id }
  })
}

/**
 * Function to Genreate ad Render table data 
 * @param {Array} table 
 */
function renderTable(table) {
  var tableContainer = `<table class="table">`;
  var tableHead = `<thead> <tr> <th>Ticket ID </th> <th>Ticket Name</th> </tr> </thead>`;
  var tableBody = `<tbody>`;
  var tableContent = '';

  for (tableItem of table) {
    tableContent += `<tr id=${tableItem.id} onclick="openModal(this.id)"><td>${tableItem.id}</td><td>${tableItem.first_name} ${tableItem.last_name ? tableItem.last_name : ''}</td></tr>`
  }
  var html = `${tableContainer}${tableHead}${tableBody}${tableContent}</tbody></table>`;
  $('#table').append(html);

}

/**
 * 
 * @param {String} status Staus of the Notififcation
 * @param {String} message Message for the notification
 */
function notify(status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

