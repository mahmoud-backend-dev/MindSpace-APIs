/**
 * HELPERS
 */
const helpers = require("../../helpers/helpers");

/**
 * COMMON SEND EMAIL HTML FUNCTION
 * @param {STRING} email
 * @param {STRING} milisecound
 * @param {STRING} randomString
 */

async function sendEmail(id, milliseconds, randomString, roleType, type) {
	var html =
		`
        <html>
        <body>
            <!-- <section class="update-status" style="height: 100vh;text-align: center;background-image:url(cid:emailImage);width: 100%;background-size: cover;">
             <div class="update-panel" style="height: 100%; background-image: url(cid:emailImage)">
                 <h2 style=" margin: 0;font-size: 4rem;font-weight: 600;color: #8EB48E;margin-bottom: 50px;">Hello!</h2>
                <p class="update-pera-one" style="margin: 0;font-size:20px;letter-spacing: normal;color: #404040;line-height:28px;">You have requested to reset your app password through our forgotten password
                     recovery
                     service.
                     <span style=" display: block;text-align: center;color: #000;font-weight: 500;">Click the button below and change your password!</span>
                 </p>
                 <a href="#" class="change-password-btn">Change Password</a>
                 <p class="update-pera" style="margin: 0;font-size:20px;letter-spacing: normal;color: #404040;line-height:28px;">If you face any issue with our solution, go to contact support chat.
                     <br>We will be glad to
                     help you.
                 </p>
                 <p class="regard-pera" style="margin-top: 50px; font-size:20px;letter-spacing: normal;color: #404040;line-height:28px;">Regards, Mind Scape Team
                     <svg style="width: 13px;height: 13px;" class="smile-icon" id="layer_1" enable-background="new 0 0 512 512" height="13"
                         viewBox="0 0 512 512" width="13" xmlns="http://www.w3.org/2000/svg">
                         <path
                             d="m256 0c-141.159 0-256 114.841-256 256s114.841 256 256 256 256-114.841 256-256-114.841-256-256-256zm0 480c-123.514 0-224-100.486-224-224s100.486-224 224-224 224 100.486 224 224-100.486 224-224 224zm134.856-146c-27.973 48.445-78.385 77.368-134.852 77.369-56.469.001-106.884-28.922-134.859-77.369-4.419-7.652-1.798-17.438 5.854-21.856 7.654-4.419 17.439-1.797 21.856 5.854 22.191 38.429 62.247 61.372 107.148 61.371 44.899-.001 84.952-22.943 107.141-61.371 4.418-7.653 14.204-10.274 21.856-5.855 7.653 4.419 10.274 14.204 5.856 21.857zm-272.178-141.057c0-17.652 14.361-32.014 32.014-32.014s32.014 14.361 32.014 32.014-14.361 32.014-32.014 32.014-32.014-14.361-32.014-32.014zm274.645 0c0 17.652-14.361 32.014-32.014 32.014s-32.014-14.361-32.014-32.014 14.361-32.014 32.014-32.014c17.652.001 32.014 14.362 32.014 32.014z" />
                     </svg>
                 </p>
             </div>
         </section>  -->
    
            <div
                style="
                    height: 90vh;
                    text-align: center;
                    background-image: url(cid:emailImage);
                    width: 100%;
                    background-size: cover;
                "
            >
                <div style="padding-top: 9%">
                    <table
                        align="center"
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        width="100%"
                        style="margin: auto"
                    >
                        <tr>
                            <td>
                                <center>
                                    <h2
                                        style="
                                            font-size: 4rem;
                                            font-weight: 600;
                                            color: #8eb48e;
                                            margin-bottom: 25px;
                                        "
                                    >
                                        Hello!
                                    </h2>
                                </center>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style="width: 100%; text-align: center">
                                    <tr>
                                        <td>
                                            <div>
                                                <p
                                                    class="update-pera-one"
                                                    style="
                                                        margin: 0;
                                                        font-size: 20px;
                                                        letter-spacing: normal;
                                                        color: #404040;
                                                        line-height: 28px;
                                                    "
                                                >
                                               You are given as ` +
		roleType +
		` access to Mindscape admin panel, Please set your password through clicking following button.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style="width: 100%; text-align: center">
                                    <tr>
                                        <td>
                                            <div style="margin: 50px 0">
                                                <a href= ` +
		process.env.FORGOT_PASSWORD_URL +
		"?id=" +
		// "http://192.168.1.151:4200/forgot-password/?id=" +
		id +
		"&time=" +
		milliseconds +
		"&randomString=" +
		randomString +
		"&type=" +
		type +
		` class="change-password-btn"
                                                    style="
                                                        letter-spacing: normal;
                                                        background: #8eb48e;
                                                        padding: 10px 20px;
                                                        border-radius: 30px;
                                                        text-decoration: none;
                                                        color: #fff;
                                                        font-weight: 500;
                                                    "
                                                    >Update Password</a
                                                >
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style="width: 100%; text-align: center">
                                    <tr>
                                        <td>
                                            <div>
                                                <p
                                                    class="update-pera"
                                                    style="
                                                        margin: 0;
                                                        font-size: 20px;
                                                        letter-spacing: normal;
                                                        color: #404040;
                                                        line-height: 28px;
                                                    "
                                                >
                                                    If you face any issue with our solution, go to contact support
                                                    chat. <br />We will be glad to help you.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style="width: 100%; text-align: center">
                                    <tr>
                                        <td>
                                            <div>
                                                <p
                                                    class="regard-pera"
                                                    style="
                                                        margin-top: 50px;
                                                        font-size: 20px;
                                                        letter-spacing: normal;
                                                        color: #404040;
                                                        line-height: 28px;
                                                    "
                                                >
                                                    Regards, MindScape Team
                                                    <svg
                                                        style="width: 13px; height: 13px"
                                                        class="smile-icon"
                                                        id="layer_1"
                                                        enable-background="new 0 0 512 512"
                                                        height="13"
                                                        viewBox="0 0 512 512"
                                                        width="13"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="m256 0c-141.159 0-256 114.841-256 256s114.841 256 256 256 256-114.841 256-256-114.841-256-256-256zm0 480c-123.514 0-224-100.486-224-224s100.486-224 224-224 224 100.486 224 224-100.486 224-224 224zm134.856-146c-27.973 48.445-78.385 77.368-134.852 77.369-56.469.001-106.884-28.922-134.859-77.369-4.419-7.652-1.798-17.438 5.854-21.856 7.654-4.419 17.439-1.797 21.856 5.854 22.191 38.429 62.247 61.372 107.148 61.371 44.899-.001 84.952-22.943 107.141-61.371 4.418-7.653 14.204-10.274 21.856-5.855 7.653 4.419 10.274 14.204 5.856 21.857zm-272.178-141.057c0-17.652 14.361-32.014 32.014-32.014s32.014 14.361 32.014 32.014-14.361 32.014-32.014 32.014-32.014-14.361-32.014-32.014zm274.645 0c0 17.652-14.361 32.014-32.014 32.014s-32.014-14.361-32.014-32.014 14.361-32.014 32.014-32.014c17.652.001 32.014 14.362 32.014 32.014z"
                                                        />
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
    </html>`;

	return html;
}

module.exports = {
	sendEmail,
};
