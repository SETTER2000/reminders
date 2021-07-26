module.exports = {

  friendlyName: 'Create reminder',

  description: 'Создать напоминалку.',

  inputs: {
    lastName: {
      type: 'string',
      required: true,
      description: `Фамилия студента.`
    },

    dateBirth: {
      type: 'string',
      required: true,
      description: 'Дата рождения.',
    },
  },


  exits: {
    success: {
      outputDescription: 'Information about the newly created record.',
      // Устанавливаем выходной тип данных. Хорошая практика для документирования кода.
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
    const moment = require('moment');
    // moment.locale('ru');

    if (!req.isSocket) {
      throw 'badRequest';
    }


    const socketId = sails.sockets.getId(req);
    // => "BetX2G-2889Bg22xi-jy"


    const roomName = req.me.emailAddress
    await sails.sockets.join(socketId, roomName);

    console.log(req.session.userId);

    let newObj = await Student.create({
      lastName: inputs.lastName,
      dateBirth: await sails.helpers.dateFix(inputs.dateBirth),
      owner: req.me.id,
    }).fetch();

    if (!newObj)
      console.error('Error объект с задачей не записался в БД!');

    let res = await sails.helpers.croneReminder(newObj.dateBirth)

    console.log('RESSS: ', res);

    if (!res) {
      throw 'badRequest';
    }
    await sails.sockets.broadcast(roomName, 'list-topic', res);

    return exits.success();
  }
};
