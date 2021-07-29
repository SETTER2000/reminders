module.exports = {

  friendlyName: 'Create reminder',

  description: 'Создать напоминалку.',

  inputs: {
    data: {
      type: 'ref'
    }
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
    const req = this.req;
    return exits.success(p);
  }
};
