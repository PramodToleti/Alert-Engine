const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user_role: String,
  alert_time: String,
  freq: Number,
  wait_time: Number,
});

const policySchema = new mongoose.Schema({
  name: String,
  target: String,
  org_id: String,
  zone_id: String,
  site_id: String,
  app_level_alert: {
    freq: Number,
  },
  mail_level_alert: [alertSchema],
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
