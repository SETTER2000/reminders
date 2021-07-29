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
    const crypto = require('crypto')
    const req = this.req;
    const body = req.body;
    const signature = body.signature;
    const eventData = body['event-data'];
    signature.signingKey = sails.config.mailgun.signingKey;

    const verify = ({signingKey, timestamp, token, signature}) => {
      const encodedToken = crypto
        .createHmac('sha256', signingKey)
        .update(timestamp.concat(token))
        .digest('hex')
      return (encodedToken === signature)
    }

    if (verify(signature)) {
      console.info('Запрос от mailgun верифицирован.')
    } else {
      throw 'badRequest';
    }

    const deliver = async () => {
      if (eventData.tags.length < 1){
        throw 'badRequest'
      }

      await Student.destroy({id: eventData.tags[1]});
      let user = await User.findOne({'emailAddress': eventData.tags[0]}).populate('reminders');
      await sails.sockets.broadcast(eventData.tags[0], 'list-student', user.reminders);
    }

    await deliver();
    return exits.success();
  }
};
