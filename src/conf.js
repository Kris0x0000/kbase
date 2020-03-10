module.exports = function (choice) {

  if(choice === 'api_url_base') {
  let api_url_base = 'http://localhost:1234';
  let session_timeout = 900*1000;

  if(process.env.NODE_ENV === 'production') {
    api_url_base = 'https://api.zikom.com.pl';
  } else {
    api_url_base = 'http://localhost:1234';

  }
  //console.log(api_url_base);
    return api_url_base;
  }

  if(choice === 'session_timeout') {
  let session_timeout = 900*1000;

  if(process.env.NODE_ENV === 'production') {
    session_timeout = 900*1000;
  } else {
    session_timeout = 900*1000;

  }
  //console.log(api_url_base);
    return session_timeout;
  }

};
