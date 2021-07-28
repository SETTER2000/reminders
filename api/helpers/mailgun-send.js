module.exports = {


  friendlyName: 'Sender mailgun',


  description: 'Отправить почту через сервис mailgun.com',


  inputs: {
    reminder: {
      type: 'string'
    }
  },


  fn: async function (inputs) {
    const api_key = sails.config.mailgun.token;
    const domain = sails.config.mailgun.domain;
    const host = sails.config.mailgun.host;
    const mailgun = require('mailgun-js')(
      {
        apiKey: api_key,
        domain: domain,
        host: host
      });

    const data = {
      from: `Excited User <info@${domain}>`,
      to: 'lphp@mail.ru',
      subject: 'Hello',
      text: inputs.reminder
    };


    return  await mailgun.messages().send(data);

  }
};

