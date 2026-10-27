const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Staff member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Staff email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Staff phone number is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      enum: ['Front Desk Officer', 'Head Concierge', 'Executive Housekeeper', 'Operations Manager', 'Executive Chef', 'Maintenance Engineer', 'Security Lead'],
      default: 'Front Desk Officer',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Front Office', 'Housekeeping', 'Food & Beverage', 'Operations', 'Maintenance', 'Security'],
      default: 'Front Office',
    },
    shift: {
      type: String,
      enum: ['Morning (06:00 - 14:00)', 'Evening (14:00 - 22:00)', 'Night (22:00 - 06:00)', 'Flexible'],
      default: 'Morning (06:00 - 14:00)',
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Off Duty', 'Terminated'],
      default: 'Active',
    },
    salary: {
      type: Number,
      default: 45000,
    },
    assignedFloor: {
      type: Number,
      default: 1,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Staff', staffSchema);

