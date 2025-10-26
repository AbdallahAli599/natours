const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error logging in. Please try again.');
  }
};

const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'GET',
    });

    if (res.ok) {
      window.setTimeout(() => {
        location.assign('/');
      }, 100);
    } else {
      alert('Error logging out. Please try again.');
    }
  } catch (err) {
    alert('Error logging out. Please try again.');
  }
};

document
  .querySelector('.nav__el--logout')
  ?.addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
  });

document
  .querySelector('.form--login')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
