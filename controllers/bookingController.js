const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  try {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/?tour=${
        req.params.tourId
      }&user=${req.user.id}&price=${tour.price}`, // mot secure way but ok for demo
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour._id}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                `${req.protocol}://${req.get('host')}/img/tours/${
                  tour.imageCover
                }`,
              ],
            },
            unit_amount: tour.price * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    // 3) Send session as response
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    next(err);
  }
};

exports.createBookingCheckout = async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price })
    .then(() => {
      res.redirect(req.originalUrl.split('?')[0]);
    })
    .catch((err) => next(err));
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
