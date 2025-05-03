const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  module.exports = {
    validateEmail,
    validatePassword
  };