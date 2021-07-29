module.exports = {


  friendlyName: 'Sender mailgun',


  description: 'Отправить почту через сервис mailgun.com',


  inputs: {
    data:{
      type:'ref'
    }
  },


  fn: async function (inputs) {
    const api_key = sails.config.mailgun.token;
    const domain = sails.config.mailgun.domain;
    const host = sails.config.mailgun.host;

    let result = false;
    const mailgun = require('mailgun-js')(
      {
        apiKey: api_key,
        domain: domain,
        host: host
      });

    const data = {
      from: `Reminders service <info@${domain}>`,
      to: inputs.data.to,
      subject: 'Reminder',
      text: inputs.data.reminder,
      "o:tag" : [inputs.data.id, inputs.data.to]
    };

    try {

      result = await mailgun.messages().send(data);
      result = result.length > 0

    } catch (err) {
      console.error('Email not validate | statusCode: ', err.statusCode);
      return false
    }

    return result
  }
};

