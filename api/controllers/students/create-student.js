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


    const socketId = sails.sockets.getId(req);
    const roomName = req.me.emailAddress
    await sails.sockets.join(socketId, roomName);

    let newObj = await Student.create({
      reminder: inputs.reminder,
      dateBirth: await sails.helpers.dateFix(inputs.dateBirth),
      owner: req.me.id,
    }).fetch();

    if (!newObj)
      console.error('Error объект с задачей не записался в БД!');

    let res = await sails.helpers.croneReminder.with({
      date: newObj.dateBirth,
      reminder: newObj.reminder,
      id:newObj.id,
      userId:newObj.owner,
      to: req.me.emailAddress
    })


    if (!res) {
      throw 'badRequest';
    }
    await sails.sockets.broadcast(roomName, 'list-topic', res);
    return exits.success();
  }
};
