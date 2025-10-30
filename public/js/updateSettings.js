const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    let options;

    if (type === 'data' && data.photo) {
      // use FormData for data updates with photo
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('photo', data.photo);

      options = {
        method: 'PATCH',
        body: formData,
      };
    } else {
      // use JSON for password updates or data without photo
      options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
    }

    const res = await fetch(url, options);
    const resData = await res.json();

    if (res.ok) {
      alert(`${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    } else {
      alert(resData.message);
    }
  } catch (err) {
    alert(`Error updating ${type}. Please try again.`);
  }
};

document
  .querySelector('.form-user-data')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];

    await updateSettings({ name, email, photo }, 'data');
  });

document
  .querySelector('.form-user-password')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
