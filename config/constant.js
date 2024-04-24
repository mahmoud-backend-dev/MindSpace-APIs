/**
 * COUNTRY CODE REGEX
 */
//var kCountryCodeRegex = /^(\d{1}\-)?(\d{1,2})$/;
var kCountryCodeRegex = /^(\+?\d{1,3}|\d{1,4})$/;
/**
 * EMAIL REGEX
 */
var kEmailRegex = /\S+@\S[a-z]+\.\S+/;

/**
 * PHONE NUMBER REGEX
 */
var kPhoneRegex = /^(0|[1-9]\d*)$/;
//var kPhoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
//var kPhoneRegex = /^(?:[0-9\-\(\)\/\.]\s?){6, 15}[0-9]{1}$/;
/**
 * DATE REGEX
 */
//var kDateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

/**
 * PASSWORD REGEX
 */
var kPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,25}$/;

/**
 * FIRST NAME, LAST NAME, USERNAME REGEX
 */
var kFirstNameRegex = /(?=.*[A-Za-z])(?!^\d+$)^.+$/;

/**
 * ALPHABET REGEX
 */
var kAlphabet = /(?=.*[A-Za-z])/;

/**
 * ACCOUNT NAME REGEX
 */
var kAccountNameRegex = /^[a-z A-Z \-]+$/;

/**
 * ACCOUNT NUMBER REGEX
 */

var kAccountNumberRegex = /^(\d{8,20})$/;

/**
 * DATE REGEX
 */
var kDateRegex = /\d{2}-\d{2}-\d{4}/;

/**
 * DATE REGEX YYYY-MM-DD
 */
var kLeaveDateRegex = /^\d{4}-\d{2}-\d{2}$/;
/**
 * USERNAME REGEX
 */
var kUsername = /(?=.*[A-Za-z])(?!^\d+$)^.+$/;

/**
 * IBAN NUMBER REGEX
 */
var kIbanNoRegex = /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/;

/**
 * IF MULTIPLE LOGIN TRUE -> SAME EMAIL IS ALLOW FOR DIFFERENT LOGIN TYPE
 *  */
var kmultipleLogin = false;

/**
 * SLOTE TIME INTERVAL TIME
 *  */

var kInterval = 60

module.exports = {
	kCountryCodeRegex,
	kEmailRegex,
	kPhoneRegex,
	kDateRegex,
	kPasswordRegex,
	kFirstNameRegex,
	kmultipleLogin,
	kAlphabet,
	kUsername,
	kAccountNameRegex,
	kAccountNumberRegex,
	kIbanNoRegex,
	kLeaveDateRegex,
	kInterval
};
