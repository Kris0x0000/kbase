module.exports = function (choice) {

  if(choice === 'api_url_base') {
  let api_url_base = 'http://localhost:1234';

  if(process.env.NODE_ENV === 'production') {
    api_url_base = 'https://api.zikom.com.pl';
  } else {
    api_url_base = 'http://localhost:1234';
  }
  //console.log(api_url_base);
    return api_url_base;
  }

};
