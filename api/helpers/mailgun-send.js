module.exports = {


  friendlyName: 'Sender mailgun',


  description: 'Отправить почту через сервис mailgun.com',


  inputs: {
    reminder: {
      type: 'string',
      defaultsTo: 'Вам надо покрасить дом!',
    },
    to: {
      type: 'string'
    }
  },


  fn: async function (inputs) {
    const api_key = sails.config.mailgun.token;
    const domain = sails.config.mailgun.domain;
    const host = sails.config.mailgun.host;


    let result = false
    const mailgun = require('mailgun-js')(
      {
        apiKey: api_key,
        domain: domain,
        host: host
      });

    const data = {
      from: `Reminders service <info@${domain}>`,
      to: inputs.to,
      subject: 'Reminder',
      text: inputs.reminder
    };

    try {

      result = await mailgun.messages().send(data);
      result = result.length > 0

    } catch (err) {

      console.error('error statusCode: ', err.statusCode);
      return false

    }


    return result

  }
};

