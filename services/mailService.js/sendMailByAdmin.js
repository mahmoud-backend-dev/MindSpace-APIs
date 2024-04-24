/**
 * SEND OTP MAIL 
 * @param {STRING} otp 
 */

async function sendMail(name, text) {

    var html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description"
            content="On To Family is super flexible, powerful, clean &amp; modern responsive bootstrap 5 admin template with unlimited possibilities.">
        <meta name="keywords"
            content="admin template, On To Family template, dashboard template, flat admin template, responsive admin template, web app">
        <meta name="author" content="pixelstrap">
        <link rel="icon" href="../assets/images/favicon.png" type="image/x-icon">
        <link rel="shortcut icon" href="../assets/images/favicon.png" type="image/x-icon">
        <title>Spiritualism Live - Admin panel</title>
        <!-- Google font-->
        <link href="https://fonts.googleapis.com/css?family=Rubik:400,400i,500,500i,700,700i&amp;display=swap"
            rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900&amp;display=swap"
            rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/public/assets/css/fontawesome.css">
        <!-- ico-font-->
        <link rel="stylesheet" type="text/css" href="/public/assets/css/vendors/icofont.css">
        <!-- Themify icon-->
        <link rel="stylesheet" type="text/css" href="/public/assets/css/vendors/themify.css">
        <!-- Flag icon-->
        <link rel="stylesheet" type="text/css" href="/public/assets/css/vendors/flag-icon.css">
        <!-- Feather icon-->
        <link rel="stylesheet" type="text/css" href="/public/assets/css/vendors/feather-icon.css">
        <!-- Plugins css start-->
        <!-- Plugins css Ends-->
        <!-- Bootstrap css-->
        <link rel="stylesheet" type="text/css" href="/public/assets/css/vendors/bootstrap.css">
        <!-- App css-->
        <link rel="stylesheet" type="text/css" href="/public/assets/css/style.css">
        <!-- Responsive css-->
        <link rel="stylesheet" type="text/css" href="/public/assets/css/responsive.css">
        <style>
            .update-status {
                height: 100vh;
                text-align: center;
                background-image: url(/public/images/LOGINBG.png);
                width: 100%;
                background-size: cover;
            }
        </style>
    </head>
    
    <body>
        <div
            style="height: 90vh;text-align: center;background-image: url(cid:emailImage);width: 100%;background-size: cover;">
            <div style="padding-top: 9%;">
                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                    style="margin: auto;">
                    <tr>
                        <td>
                            <center>
                                <h2 style="font-size: 2rem;font-weight: 600;color: #ec7fdf;margin-bottom: 25px;">Hello `+ name + ` ! </h2>
                            </center>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table style="width: 100%;text-align: center;">
                                <tr>
                                    <td>
                                        <div>
    
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table style="width: 100%;text-align: center;">
                                <tr>
                                    <td>
                                        <div>
                                            <p class="update-pera-one"
                                                style="margin: auto;font-size:20px;width:50%;text-align: auto;letter-spacing: normal;color: #404040;line-height:28px;">
                                                `+ text + `
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table style="width: 100%;text-align: center;">
                                <tr>
                                    <td>
                                        <div>
                                            <p class="regard-pera"
                                                style="margin-top: 50px; font-size:20px;letter-spacing: normal;color: #404040;line-height:28px;">
                                                You've received this email because you've requested for help and feedback.
                                            </p>
                                            <p class="regard-pera"
                                                style="margin-top: 1px; font-size:20px;letter-spacing: normal;color: #404040;line-height:28px;">
                                                Regards, Spiritualism Live Team
                                                <svg style="width: 13px;height: 13px;" class="smile-icon" id="layer_1"
                                                    enable-background="new 0 0 512 512" height="13" viewBox="0 0 512 512"
                                                    width="13" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="m256 0c-141.159 0-256 114.841-256 256s114.841 256 256 256 256-114.841 256-256-114.841-256-256-256zm0 480c-123.514 0-224-100.486-224-224s100.486-224 224-224 224 100.486 224 224-100.486 224-224 224zm134.856-146c-27.973 48.445-78.385 77.368-134.852 77.369-56.469.001-106.884-28.922-134.859-77.369-4.419-7.652-1.798-17.438 5.854-21.856 7.654-4.419 17.439-1.797 21.856 5.854 22.191 38.429 62.247 61.372 107.148 61.371 44.899-.001 84.952-22.943 107.141-61.371 4.418-7.653 14.204-10.274 21.856-5.855 7.653 4.419 10.274 14.204 5.856 21.857zm-272.178-141.057c0-17.652 14.361-32.014 32.014-32.014s32.014 14.361 32.014 32.014-14.361 32.014-32.014 32.014-32.014-14.361-32.014-32.014zm274.645 0c0 17.652-14.361 32.014-32.014 32.014s-32.014-14.361-32.014-32.014 14.361-32.014 32.014-32.014c17.652.001 32.014 14.362 32.014 32.014z" />
                                                </svg>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
    
    </html>`

    return html
}


module.exports = {
    sendMail
}