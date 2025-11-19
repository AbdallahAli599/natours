const stripe = Stripe(
  'pk_test_51SON2BB5qDrlDwTj9x6LuIWoZ3quIhO3D9681Dsq2BwnsvOHIxQ66Fer63nA0YFnMFWXCnqY9ALC0pwnhUOAL8Gz00bW8emEYQ'
);

const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await fetch(`/api/v1/bookings/checkout-session/${tourId}`, {
      method: 'GET',
    });
    // console.log(session);
    const sessionData = await session.json();

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: sessionData.session.id,
    });
  } catch (err) {
    alert(err.message);
  }
};

document.getElementById('book-tour')?.addEventListener('click', async (e) => {
  e.target.textContent = 'Processing...';
  const { tourId } = e.target.dataset;
  await bookTour(tourId);
});
