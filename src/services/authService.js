import {isValidEmail} from '../utils/validation';

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function loginUser(email, password) {
  await wait(800);

  if (!isValidEmail(email)) {
    return {
      success: false,
      message: 'Invalid email address.',
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: 'Invalid password.',
    };
  }

  return {
    success: true,
    user: {
      id: 'demo-user-1',
      name: 'Todo User',
      email: email.trim(),
    },
  };
}

async function signupUser(name, email, password) {
  await wait(800);

  if (!name.trim()) {
    return {
      success: false,
      message: 'Name is required.',
    };
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      message: 'Invalid email address.',
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: 'Password must be at least 6 characters.',
    };
  }

  return {
    success: true,
    user: {
      id: `demo-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
    },
  };
}

async function resetPassword(email) {
  await wait(800);

  if (!isValidEmail(email)) {
    return {
      success: false,
      message: 'Invalid email address.',
    };
  }

  return {
    success: true,
    message:
      'If an account exists with this email, reset instructions will be sent.',
  };
}

export {
  loginUser,
  signupUser,
  resetPassword,
};