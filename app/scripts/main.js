$(function () {
    var form = $('#login-form');
    var error = $('#error');
    var parsedHash = queryString.parse(location.hash);

    var domains = {
        qa1: 'https://qaslot1.myhealthfusion.org',
        qa2: 'https://qaslot2.myhealthfusion.org',
        qa3: 'https://qaslot3.myhealthfusion.org',
        dev: 'http://dev.myhealthfusion.org',
        local: 'http://localhost:3000'
    };

    var appIds = {
        qa1: 'MyHealth-QA1',
        qa2: 'MyHealth-QA2',
        qa3: 'MyHealth-QA3',
        dev: 'MyHealth-Dev',
        local: 'MyHealth-LocalDev'
    };

    var app = 'dev';
    if (typeof parsedHash.app != 'undefined' && parsedHash.app && typeof domains[parsedHash.app] != 'undefined') {
        app = parsedHash.app;
    }

    var loginUrl = '/app/universal-login-web-api/api/login?appId=';
    var siteUrl = '/#/oauth/callback/?tempToken=';
    var data = JSON.stringify({
        "UserName": "will@cnrmyhealthtest.com",
        "Password": "Password1"
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

    var doLogin = function () {
        error.html('Getting token ....');
        $.ajax(app + loginUrl + appIds[app], {
            data: data,
            contentType: 'application/json',
            type: 'POST',
            dataType: 'json',
            success: function (response, status, jqXHR) {
                if ('success' in response && 'message' in response) {
                    if (response.success) {
                        var token = response.message;
                        error.html("Redirecting ...");
                        window.location = domains[app] + siteUrl + token;
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

    form.on('submit', function (e) {
        e.preventDefault();
        doLogin();
    });

    if (typeof parsedHash.redirect != 'undefined' && parsedHash.redirect) {
        doLogin();
    }
});
