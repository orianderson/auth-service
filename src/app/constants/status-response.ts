export class StatusResponse {
  static CONTINUE = {
    statusCode: 100,
    message: 'Continue',
  };
  static SWITCHING_PROTOCOLS = {
    statusCode: 101,
    message: 'Switching Protocols',
  };
  static PROCESSING = {
    statusCode: 102,
    message: 'Processing',
  };
  static OK = {
    statusCode: 200,
    message: 'OK',
  };
  static CREATED = {
    statusCode: 201,
    message: 'Created',
  };
  static ACCEPTED = {
    statusCode: 202,
    message: 'Accept',
  };
  static NON_AUTHORITATIVE_INFORMATION = {
    statusCode: 203,
    message: 'Non - authoritative Information',
  };
  static NO_CONTENT = {
    statusCode: 204,
    message: 'No Content',
  };
  static RESET_CONTENT = {
    statusCode: 205,
    message: 'Reset Content',
  };
  static PARTIAL_CONTENT = {
    statusCode: 206,
    message: 'Partial Content',
  };
  static MULTI_STATUS = {
    statusCode: 207,
    message: 'Multi - Status',
  };
  static ALREADY_REPORTED = {
    statusCode: 208,
    message: 'Already Reported',
  };
  static IM_USED = {
    statusCode: 226,
    message: 'IM Used',
  };
  static MULTIPLE_CHOICE = {
    statusCode: 300,
    message: 'Multiple Choices',
  };
  static MOVED_PERMANENTLY = {
    statusCode: 301,
    message: 'Moved Permanently',
  };
  static FOUND = {
    statusCode: 302,
    message: 'Found',
  };
  static SEE_OTHER = {
    statusCode: 303,
    message: 'See Other',
  };
  static NOT_MODIFIED = {
    statusCode: 304,
    message: 'Not Modified',
  };
  static USE_PROXY = {
    statusCode: 305,
    message: 'Use Proxy',
  };
  static TEMPORARY_REDIRECT = {
    statusCode: 307,
    message: 'Temporary Redirect',
  };
  static PERMANENT_REDIRECT = {
    statusCode: 308,
    message: 'Permanent Redirect',
  };
  static BAD_REQUEST = {
    statusCode: 400,
    message: 'Bad Request',
  };
  static UNAUTHORIZED = {
    statusCode: 401,
    message: 'Unauthorized',
  };
  static PAYMENT_REQUIRED = {
    statusCode: 402,
    message: 'Payment Required',
  };
  static FORBIDDEN = {
    statusCode: 403,
    message: 'Forbidden',
  };
  static NOT_FOUND = {
    statusCode: 404,
    message: 'Not Found',
  };
  static METHOD_NOT_ALLOWED = {
    statusCode: 405,
    message: 'Method Not Allowed',
  };
  static NOT_ACCEPTABLE = {
    statusCode: 406,
    message: 'Not Acceptable',
  };
  static PROXY_AUTHENTICATION_REQUIRED = {
    statusCode: 407,
    message: 'Proxy Authentication Required',
  };
  static REQUEST_TIMEOUT = {
    statusCode: 408,
    message: 'Request Timeout',
  };
  static CONFLICT = {
    statusCode: 409,
    message: 'Conflict',
  };
  static GONE = {
    statusCode: 410,
    message: 'Gone',
  };
  static LENGTH_REQUIRED = {
    statusCode: 411,
    message: 'Length Required',
  };
  static PRECONDITION_FAILED = {
    statusCode: 412,
    message: 'Precondition Failed',
  };
  static PAYLOAD_TOO_LARGE = {
    statusCode: 413,
    message: 'Payload Too Large',
  };
  static REQUEST_URI_TOO_LONG = {
    statusCode: 414,
    message: 'Request - URI Too Long',
  };
  static UNSUPPORTED_MEDIA_TYPE = {
    statusCode: 415,
    message: 'Unsupported Media Type',
  };
  static REQUEST_RANGE_NOT_SATISFIABLE = {
    statusCode: 416,
    message: 'Requested Range Not Satisfiable',
  };
  static EXPECTATION_FAILED = {
    statusCode: 417,
    message: 'Expectation Failed',
  };
  static IM_A_TEAPOT = {
    statusCode: 418,
    message: 'I’m a teapot',
  };
  static MISDIRECTED_REQUEST = {
    statusCode: 421,
    message: 'Misdirected Request',
  };
  static UNPROCESSABLE_ENTITY = {
    statusCode: 422,
    message: 'Unprocessable Entity',
  };
  static LOCKED = {
    statusCode: 423,
    message: 'Locked',
  };
  static FAILED_DEPENDENCY = {
    statusCode: 424,
    message: 'Failed Dependency',
  };
  static UPGRADE_REQUIRED = {
    statusCode: 426,
    message: 'Upgrade Required',
  };
  static PRECONDITION_REQUIRED = {
    statusCode: 428,
    message: 'Precondition Required',
  };
  static TOO_MANY_REQUESTS = {
    statusCode: 429,
    message: 'Too Many Requests',
  };
  static REQUEST_HEADER_FIELDS_TOO_LARGE = {
    statusCode: 431,
    message: 'Request Header Fields Too Large',
  };
  static CONNECTION_CLOSED_WITHOUT_RESPONSE = {
    statusCode: 444,
    message: 'Connection Closed Without Response',
  };
  static UNAVAILABLE_FOR_LEGAL_REASONS = {
    statusCode: 451,
    message: 'Unavailable For Legal Reasons',
  };
  static CLIENT_CLOSED_REQUEST = {
    statusCode: 499,
    message: 'Client Closed Request',
  };
  static INTERNAL_SERVER_ERROR = {
    statusCode: 500,
    message: 'Internal Server Error',
  };
  static NOT_IMPLEMENTED = {
    statusCode: 501,
    message: 'Not Implemented',
  };
  static BAD_GATEWAY = {
    statusCode: 502,
    message: 'Bad Gateway',
  };
  static SERVICE_UNAVAILABLE = {
    statusCode: 503,
    message: 'Service Unavailable',
  };
  static GATEWAY_TIMEOUT = {
    statusCode: 504,
    message: 'Gateway Timeout',
  };
  static HTTP_VERSION_NOT_SUPPORTED = {
    statusCode: 505,
    message: 'HTTP Version Not Supported',
  };
  static VARIANT_ALSO_NEGOTIATES = {
    statusCode: 506,
    message: 'Variant Also Negotiates',
  };
  static INSUFFICIENT_STORAGE = {
    statusCode: 507,
    message: 'Insufficient Storage',
  };
  static LOOP_DETECTED = {
    statusCode: 508,
    message: 'Loop Detected',
  };
  static NOT_EXTEND = {
    statusCode: 510,
    message: 'Not Extended',
  };
  static NETWORK_AUTHENTICATION_REQUIRED = {
    statusCode: 511,
    message: 'Network Authentication Required',
  };
  static NETWORK_CONNECT_TIMEOUT_ERROR = {
    statusCode: 599,
    message: 'Network Connect Timeout Error',
  };
}

// export class StatusCode {
//   static CONTINUE = 100;
//   static SWITCHING_PROTOCOLS = 101;
//   static PROCESSING = 102;
//   static OK = 200;
//   static CREATED = 201;
//   static ACCEPTED = 202;
//   static NON_AUTHORITATIVE_INFORMATION = 203;
//   static NO_CONTENT = 204;
//   static RESET_CONTENT = 205;
//   static PARTIAL_CONTENT = 206;
//   static MULTI_STATUS = 207;
//   static ALREADY_REPORTED = 208;
//   static IM_USED = 226;
//   static MULTIPLE_CHOICE = 300;
//   static MOVED_PERMANENTLY = 301;
//   static FOUND = 302;
//   static SEE_OTHER = 303;
//   static NOT_MODIFIED = 304;
//   static USE_PROXY = 305;
//   static TEMPORARY_REDIRECT = 307;
//   static PERMANENT_REDIRECT = 308;
//   static BAD_REQUEST = 400;
//   static UNAUTHORIZED = 401;
//   static PAYMENT_REQUIRED = 402;
//   static FORBIDDEN = 403;
//   static NOT_FOUND = 404;
//   static METHOD_NOT_ALLOWED = 405;
//   static NOT_ACCEPTABLE = 406;
//   static PROXY_AUTHENTICATION_REQUIRED = 407;
//   static REQUEST_TIMEOUT = 408;
//   static CONFLICT = 409;
//   static GONE = 410;
//   static LENGTH_REQUIRED = 411;
//   static PRECONDITION_FAILED = 412;
//   static PAYLOAD_TOO_LARGE = 413;
//   static REQUEST_URI_TOO_LONG = 414;
//   static UNSUPPORTED_MEDIA_TYPE = 415;
//   static REQUEST_RANGE_NOT_SATISFIABLE = 416;
//   static EXPECTATION_FAILED = 417;
//   static IM_A_TEAPOT = 418;
//   static MISDIRECTED_REQUEST = 421;
//   static UNPROCESSABLE_ENTITY = 422;
//   static LOCKED = 423;
//   static FAILED_DEPENDENCY = 424;
//   static UPGRADE_REQUIRED = 426;
//   static PRECONDITION_REQUIRED = 428;
//   static TOO_MANY_REQUESTS = 429;
//   static REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
//   static CONNECTION_CLOSED_WITHOUT_RESPONSE = 444;
//   static UNAVAILABLE_FOR_LEGAL_REASONS = 451;
//   static CLIENT_CLOSED_REQUEST = 499;
//   static INTERNAL_SERVER_ERROR = 500;
//   static NOT_IMPLEMENTED = 501;
//   static BAD_GATEWAY = 502;
//   static SERVICE_UNAVAILABLE = 503;
//   static GATEWAY_TIMEOUT = 504;
//   static HTTP_VERSION_NOT_SUPPORTED = 505;
//   static VARIANT_ALSO_NEGOTIATES = 506;
//   static INSUFFICIENT_STORAGE = 507;
//   static LOOP_DETECTED = 508;
//   static NOT_EXTEND = 510;
//   static NETWORK_AUTHENTICATION_REQUIRED = 511;
//   static NETWORK_CONNECT_TIMEOUT_ERROR = 599;
// }
