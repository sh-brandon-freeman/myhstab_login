$(function() {
  var parsedHash = queryString.parse(location.hash);

  var form = $('#login-form');
  var error = $('#error');
  var context = 'MyHealth-QA1';
  //var loginUrl = 'https://wwwtest.internal.priorityhealth.com/app/universal-login-web-api/api/login?appId=' + context;
  var loginUrl = '/app/universal-login-web-api/api/login?appId=' + context;
  var siteUrl = 'https://qaslot1.myhealthfusion.org/#/oauth/callback/?tempToken=';
  var data = JSON.stringify({
    "UserName":"will@cnrmyhealthtest.com",
    "Password":"Password1"
  });

  var handleError = function (jqXHR, exception, error) {
    var errorMessage = '(' + exception + ') ' + error + '<br/>';
    if (jqXHR.staatus === 0) {
      errorMessage += 'Not connected. Please verify your network connection.';
    } else if (jqXHR.status == 404) {
      errorMessage += 'The requested page not found. [404]';
    } else if (jqXHR.status == 500) {
      errorMessage += 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
      errorMessage += 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
      errorMessage += 'Time out error.';
    } else if (exception === 'abort') {
      errorMessage += 'Ajax request aborted.';
    } else {
      errorMessage += 'Uncaught Error.';
    }
    error.html(errorMessage);
  };

  var doLogin = function() {
    error.html('Getting token ....');
    $.ajax(loginUrl, {
      data: data,
      contentType: 'application/json',
      type: 'POST',
      dataType: 'json',
      success: function(response, status, jqXHR) {
        if ('success' in response && 'message' in response) {
          if (response.success) {
            var token = response.message;
            error.html("Redirecting ...");
            window.location = siteUrl + token;
          } else {
            error.html('Request failed: ' + response.message);
          }
        } else {
          error.html('Response was not in the intended format.');
        }
      },
      error: handleError
    });
  };

  form.on('submit', function(e) {
    e.preventDefault();
    doLogin();
  });

  if (typeof parsedHash.redirect != 'undefined' && parsedHash.redirect) {
    doLogin();
  }
});
