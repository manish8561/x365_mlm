export const RESPONSES = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NOCONTENT: 204,
  BADREQUEST: 400,
  FORBIDDEN: 403,
  NOTFOUND: 404,
  TIMEOUT: 408,
  TOOMANYREQ: 429,
  INTERNALSERVER: 500,
  BADGATEWAYS: 502,
  SERVICEUNAVILABLE: 503,
  GATEWAYTIMEOUT: 504,
};

export const RES_MSG = {
  EMAIL_NOT_VALID: 'Email is not valid.',
  INSERT: 'Data saved successfully',
  ERROR: 'Oops! Something went wrong. Please try again. ',
  USER_REGISTER:
    'A verification email has been sent to your registered email Id. Please verify to access your account.',
  EMAIL_ALREADY_EXISTS: 'Email already exist in our system.',
  REF_CODE_NOT_EXISTS: 'This referral code is not valid.',
  WRONG_PASSWORD: 'Password does not matched.',
  INVALID_CREDENTIAL: 'Invalid credentials.',
  EMAIL_NOT_EXISTS: "Sorry, we don't recognise this email address.",
  LOGIN_SUCCESS: 'Welcome to Paiid.',
  KEYGENERATED: 'Google secret key generated',
  LOGIN_EMAIL_NOT_VERIFIED:
    'Unverified email address. Please verify and try again.',
  LOGIN_EMAIL_VERIFICATION:
    'Your email address has been successfully verified.',
  VERIFICATION_ERROR: 'You are sending wrong value.',
  USER_STATUS: 'User status data.',
  RESEND_VERIFICATION_EMAIL: `A verification
   email has been resent to your registered email Id. Please verify to access your account.`,
  IP_TOKEN_FIND: 'Token find data.',
  KYC: {
    SUBMIT_SUCCESS: 'Your KYC application has been successfully submitted.',
    ALREADY_APPROVED: 'Your KYC is already approved.',
    UPDATE_SUCCESS: 'KYC application has been updated successfully.',
    DOCUMENT_TYPES_ID_REQUIRED:
      'Document type and document number must be filled.',
    UPDATE_MOBILE_SUCCESS: 'Mobile number has been updated successfully.',
    GET_KYC: 'Kyc data',
    DOCUMENT_REQUIRED: 'Please upload required documents.',
    AGE_CRITERIA_NOT_MET: 'Age must be greater than or equal to 18.',
  },
  TWOFA: {
    INVALID_TOKEN: 'Invalid token, please try again.',
    GOOGLE2FAENABLE: 'Google authenticator has been enabled for your account.',
    GOOGLE2FADISABLE:
      'Google authenticator has been disabled for your account.',
    ENABLEERROR:
      'An error has occurred while enabling google 2fa for your account. Please try later.',
    DISABLEERROR:
      'An error has occurred while disabling google 2fa for your account.',
    AUTHNOTENABLED: 'Google authentication is not enabled on your account.',
    VERIFIEDSUCCESS: 'Token has been successfully verified.',
  },
  RESET_PASSWORD: {
    PASSWORDNOTMATCHED: 'Password and confirm password do not match.',
    WRONGPASSWORD: 'You entered a wrong password.',
    RESETSUCCESS: 'Password has been reset.',
    RESETERROR: 'An error has occurred while resetting password.',
  },
  LOST_GOOGLE: {
    ERROR: 'An error has occured while sending email. Please try again.',
    SUCCESS: 'Google auth key has been sent to your registered email address.',
  },
  SEND_AUTH_TOKEN: {
    SEND_TOKEN: 'Verification token has been sent to your email address.',
    EMAIL_NOT_EXIST: 'Email address does not exist.',
    TOKEN_NOT_MATCHED: 'Invalid token.',
    TOKEN_MATCHED: 'Verified successfully.',
    ENABLE_EMAIL_VERFICATION:
      'Email verification has been successfully enabled.',
  },
  FORGOT_PASSWORD: {
    EMAILNOTEXIST: "Sorry, we don't recognise that email address.",
    EMAILERROR:
      'An error occurred while sending instruction email to reset password.',
    EMAILSENT:
      'An email with instructions has been sent to your registered email address.',
    WRONGPASSWORD: 'You entered a wrong password.',
    RESETSUCCESS: 'Password has been reset.',
    RESETERROR:
      'An error has occurred while resetting password. Please try again.',
  },
  AUTH_DEVICE: {
    ERROR:
      'An error has occurred while authenticating your device. Please try again.',
    ALREADY_AUTH: 'This device is already been authenticated.',
    EMAIL_SENT:
      'Email has been sent, please verify this email to allow this device.',
    ERROR_INSERTION: 'An error has been occured while updating records.',
    SUCCESS: 'Device has been authenticated.',
  },
  REFERREL_NEWCODE: 'New referral code is successfully generated.',
  REFERREL_DOWNLINE: 'Referral downline list.',
  REFERREL_MOVE_AMOUNT: 'Referral amount has been deposited to your wallet.',
  REFERREL_MOVE_ERROR: 'An error has occurred , Please try again.',
  REFERREL_KYC_ERROR: 'Kyc must be approved before move the funds.',
  ADMIN: {
    KYC: {
      KYC_LIST: 'KYC listing.',
      KYC_COUNT: 'KYC Count.',
      APPROVE_KYC: 'KYC approved successfully.',
      DECLINE_KYC: 'KYC declined successfully',
      UPDATE_SUCCESS: 'KYC updated successfully.',
      VIEW_KYC: 'KYC view data.',
    },
    USER: {
      USER_LIST: 'User list.',
      USER_EMAIL: 'User email.',
      USER_UNLOCK: 'User unlock successfully.',
      USER_LOCK: 'User locked successfully.',
      USER_SUSPEND: 'User suspended successfully.',
      TRADE_ENABLED: 'Trade enabled successfully',
      TRADE_DISABLED: 'Trade disabled successfully',
    },
    ACCOUNT_DEACTIVATE: 'Your account is not activated.',
    SUB_ADMIN_LIST: 'Sub admin list.',
    TWOFA: '2fa details',
    REFERRAL_SETTINGS: 'List of referral settings.',
    REFERRAL_SETTINGS_UPDATED: 'Referral settings updated.',
    ADMIN_REGISTER: 'Admin user registered successfully.',
    SUB_ADMIN_UPDATED: 'Sub admin updated successfully.',
    SEND_AUTH_KEY_SUCCESS: 'Auth key has been sent to user’s email address.',
    SEND_AUTH_KEY_ERROR: 'User has not enabled google auth yet.',
  },
  EMAIL_SENDING_ERROR: 'Email sending error.',
};

export const MAIL_MSG = {
  REGISTER: {
    SUBJECT: 'Paiid Email Verification',
    HTMLTEXT: `
    <p>We want to make things safe and simple, so you don’t need to remember any passwords
    or login names - anytime you use Paiid online exchange, you simply click on magic link
    to complete your order:</p>
<a href="{{siteurl}}/magic/{{encodedHash}}">
    Verify Your Email</a></p><br/>`,
    TEMPLATE: 'common',
  },
  AUTH_KEY_SEND: {
    SUBJECT: 'Request to get Auth Key',
    HTMLTEXT: `<p><br/>You have requested for your google authentication key.
    Your Auth Key: {{authkey}}</p>
    <br/>
<p>Please ignore the mail if not requested by you and reset your password for security reasons.</p><br/>
    `,
    TEMPLATE: 'common',
  },
  EMAIL_TOKEN_SEND: {
    SUBJECT: 'Email verification',
    HTMLTEXT: `<p><br/>Your one time verification code is:
    <br/><p>Code: {{emailVerificationCode}}</p>`,
    TEMPLATE: 'common',
  },
  FORGET: {
    SUBJECT: 'Forgot password',
    HTMLTEXT: `
    We have received a request to reset password. Please click on the link below to reset new password.
Button to reset the password.
<br/><br/>
<a href="{{siteurl}}/#/user/reset/{{encodedHash}}">
    Click here</a>
    <br/>
    <br/>
NOTE: If this is not you, please ignore the mail.`,
    TEMPLATE: 'common',
  },
  NEW_IP_FOUND: {
    SUBJECT: 'New device found',
    HTMLTEXT: `<p><br/>
    You recently attempted to sign into your Paiid account from a new device or in a new location.
    As a security measure, we require additional confirmation
     before allowing access to your Paiid account by click below button.</p>
     <br/><br/>
    <a href="{{siteurl}}/#/user/authneticateDevice/{{ipObject}}">
    Click here</a>
    `,
    TEMPLATE: 'common',
  },
  SUBADMIN_REGISTER_VERIFY: {
    SUBJECT: 'Verify your email address',
    HTMLTEXT: `<br/>
    <p>Your account has been registered as subadmin.Please verify your email address to access the admin panel </p>
    <br/><p><a href="{{siteurl}}/#/admin/verify-email/{{encodedHash}}">
    Verify</a></p>`,
    TEMPLATE: 'common',
  },
  REFFERAL: {
    SUBJECT: 'Paiid Referral code',
    HTMLTEXT: `<p><br/>Here is your referral code  {{refferalCode}}
     <br/> Share with your friends and family to get the bonus.
    </p>`,
    TEMPLATE: 'common',
  },
  BUY_SELL_MARKET_MAKER_LOW_BALANCE: {
    SUBJECT: 'Alert - Market Maker Account running out of balance',
    HTMLTEXT: `<p><br/>
    One of the Paiid user placed a {{orderType}} order, But Market Maker account has low balance and its value reduced to -ve. Deposit required amount.<br/>
    Order details: <br/>
    Order id: {{orderId}}<br/>
    Market Maker current balance: {{marketMakerBalance}} {{currencySymbol}}</p>
     <br/><br/>
    `,
    TEMPLATE: 'common',
  },
};

export const SERVER = {
  WALLET_LTC: process.env.WALLET_LTC,
  WALLET_BTC: process.env.WALLET_BTC,
  WALLET_ETH: process.env.WALLET_ETH,
  WALLET_BCH: process.env.WALLET_BCH,
  TRADINGMAIN: process.env.TRADINGMAIN,
};
// export const ENDPOINT = {
//   UPDATE_USER_BALANCE: '/{{coin}}/update_balance',
// };
export const CALCULATIONS = {
  SMALLEST_UNITS: process.env.SMALLEST_UNIT,
};

// PAIID constants
export const API_MSG = {
  API_SUCCESS: 'Api run successfully.',
  API_ERROR: 'Unable to process your request right now, Please try again.',
  SQL_QUERY_ERROR: 'Mysql error updating records, Please try again.',
  INVALID_TOKEN: 'Invalid authentication token.',
  NO_RECORDS_FOUND: 'No records found',
  RESEND_EMAIL_SUCCESS: 'Email has been sent successfully.',
  MISSING_REQ_PARAMS: 'Request should have required parameters and values.',
  USER_NOT_FOUND: "User email does not exists in our records.",
  ORDER_EMAIL_SENT: "Email has been already sent for this order",
  // User Status messages
  USER_STATUS_0: "Please verify your email.",
  USER_STATUS_2: "User account is disabled, Please contact with support for more information.",
  USER_STATUS_3: "User account is cancelled, Please contact with support for more information.",
  // Order status
  ORDER_STATUS_0: "Pending",
  ORDER_STATUS_1: "Received",
  ORDER_STATUS_2: "Completed",
  ORDER_STATUS_3: "Cancelled",
  ORDER_STATUS_4: "Declined",
  ORDER_STATUS_5: "Abandoned",
  ORDER_STATUS_6: "Unknown",

  // User status updated by admin
  ORDER_STATUS_UPDATED_0: "Inactive",
  ORDER_STATUS_UPDATED_1: "Active",
  ORDER_STATUS_UPDATED_2: "Disabled",
  ORDER_STATUS_UPDATED_3: "Cancelled",

  FILE_NOT_FOUND: "Unable to locate requested file.",
  ORDER_TRADE_PRICE_UPDATED: "Order(s) trade price updated successfully.",
  ORDER_DELETED: "Order(s) deleted successfully.",
  USER_DELETED: "User(s) deleted successfully.",
  MERCHANT_DELETED: "Merchant(s) deleted successfully.",

  ORDER_EMAIL_TO_MERCHANT: "Recent order email notification has been sent to merchant.",
  ADMIN_ACCESS_ERROR: "You are not authorised for this operation.",
  ADMIN_WRONG_PASSWORD: "Old password does not match.",
  ADMIN_USER_NOT_FOUND: "Admin user details not found.",
  ADMIN_FORGOT_PASSWORD: "Verification link has been sent, Please check your email for more information.",
  ADMIN_PASSWORD_RESET: "Password has been updated successfully.",
  KYC_STATUS_NOT_VERIFIED: "User's KYC not verified.",
};

export const MIDDLEWARE_RESPONSE = {
  WALLET_NOT_VALID: 'Your wallet address is invalid.',
  JWTERROR: 'Unauthorize Request',
  PERMISSION_DENIED: 'Permission denied for this user.',
  ONLY_LOGIN_WORKS: 'The feature is temporarily disabled.',
  MAGIC_LINK_EXPIRED: 'Magic link is expired.',
  REQUIRED_PARAMS_MISSING: "Required parameters are missing.",
  ORDER_LIMIT_EXCEEDED: "Order limit cannot be {{lessOrGreater}} than {{orderlimit}} {{fiatcurrency}}",
  RESET_PASSWORD_LINK_EXPIRED: "This link has been expired.",
};