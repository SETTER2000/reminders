module.exports = {

  friendlyName: 'Reminder update',

  description: 'Обновить данные по заметке.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: `Идентификатор.`
    },
    lastName: {
      type: 'string',
      required: true,
      description: `Заметка.`
    },
    dateBirth: {
      type: 'string',
      // required: true,
      description: 'Дата оповещения.',
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
    }
  },


  fn: async function (inputs, exits) {
    const req = this.req;

    if (!req.isSocket) {
      throw 'badRequest';
    }

    await sails.sockets.join(req, 'student');

    let updateObj = {
      lastName: inputs.lastName,
      dateBirth: await sails.helpers.dateFix(inputs.dateBirth),
    };

    let updateDog = await Student.updateOne({id: inputs.id}).set(updateObj);

    if (!updateDog) {
      throw 'badRequest';
    }

    return exits.success();
  }
};
