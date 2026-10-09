function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(email.trim());
}

function validateLogin(email, password) {
  if (!email.trim()) {
    return 'Please enter your email address.';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address.';
  }

  if (!password) {
    return 'Please enter your password.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return '';
}

function validateSignup(
  name,
  email,
  password,
  confirmPassword,
) {
  if (!name.trim()) {
    return 'Please enter your name.';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }

  if (!email.trim()) {
    return 'Please enter your email address.';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address.';
  }

  if (!password) {
    return 'Please enter a password.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  if (!confirmPassword) {
    return 'Please confirm your password.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return '';
}

function validateForgotPassword(email) {
  if (!email.trim()) {
    return 'Please enter your email address.';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

export {
  isValidEmail,
  validateLogin,
  validateSignup,
  validateForgotPassword,
};