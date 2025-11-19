const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

exports.getOverview = async (req, res, next) => {
  try {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template

    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.getTour = async (req, res, next) => {
  try {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ _id: req.params.slug })
      .populate({
        path: 'reviews',
        fields: 'review rating user',
      })
      .populate({
        path: 'guides',
        fields: 'name photo role',
      });

    if (!tour) {
      return next(new AppError('There is no tour with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.getLoginForm = (req, res, next) => {
  try {
    res.status(200).render('login', {
      title: 'Log into your account',
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.getAccount = (req, res, next) => {
  try {
    res.status(200).render('account', {
      title: 'Your account',
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.updateUserData = async (req, res, next) => {
  try {
    // console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.getMyTours = async (req, res, next) => {
  try {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    // 3) Render template
    res.status(200).render('overview', {
      title: 'My Tours',
      tours,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
