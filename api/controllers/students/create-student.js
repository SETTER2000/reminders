module.exports = {

  friendlyName: 'Create reminder',

  description: 'Создать напоминалку.',

  inputs: {
    reminder: {
      type: 'string',
      required: true,
      description: `Текст уведомления о событии (напоминалка).`
    },

    dateBirth: {
      type: 'string',
      required: true,
      description: 'Дата отправки напоминания.',
    },
  },


  exits: {
    success: {
      outputDescription: 'Information about the newly created record.',
      outputType: {
        id: 'number',
        imageSrc: 'string'
      },
    },
    badRequest: {
      description: 'No image upload was provided.',
      responseType: 'badRequest'
    },

    alreadyInUse: {
      statusCode: 409,
      description: 'The specified topic is already in use.',
    },

    alreadyInUseRU: {
      statusCode: 409,
      description: 'Указанное имя темы уже используется.',
    },
  },


  fn: async function (inputs, exits) {
    let req = this.req;

    if (!req.isSocket) {
      throw 'badRequest';
    }

    // const api_key = sails.config.mailgun.token;
    // const domain = sails.config.mailgun.domain;
    // const host = sails.config.mailgun.host;
    // const mailgun = require('mailgun-js')(
    //   {
    //     apiKey: api_key,
    //     domain: domain,
    //     host: host
    //   });
    //
    // const data = {
    //   from: `Excited User <info@${domain}>`,
    //   to: 'lphp@mail.ru',
    //   subject: 'Hello',
    //   text: 'Testing some Mailgun awesomeness!'
    // };
    //
    // mailgun.messages().send(data, function (error, body) {
    //   console.log(body);
    // });


    const socketId = sails.sockets.getId(req);
    const roomName = req.me.emailAddress
    await sails.sockets.join(socketId, roomName);

    console.log(req.session.userId);

    let newObj = await Student.create({
      reminder: inputs.reminder,
      dateBirth: await sails.helpers.dateFix(inputs.dateBirth),
      owner: req.me.id,
    }).fetch();

    if (!newObj)
      console.error('Error объект с задачей не записался в БД!');

    // console.log('newObj:: ', newObj)


    let res = await sails.helpers.croneReminder.with({
      date: newObj.dateBirth,
      reminder: newObj.reminder
    })

    console.log('croneReminder: ', res);

    if (!res) {
      throw 'badRequest';
    }
    await sails.sockets.broadcast(roomName, 'list-topic', res);

    return exits.success();
  }
};
