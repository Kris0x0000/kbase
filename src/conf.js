module.exports = function (choice) {

  if(choice === 'api_url_base') {
  let api_url_base = '';

  if(process.env.NODE_ENV === 'production') {
    api_url_base = 'http://nodejs:1234';
  } else {
    api_url_base = 'http://localhost:1234';
  }
    return api_url_base;
  }
  
};
