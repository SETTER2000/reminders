module.exports = {


  friendlyName: 'List',


  description: 'List students.',


  inputs: {},


  exits: {
    success: {
      anyData: 'Вы подключились к комнате student и слушаете событие list'
    },
    notFound: {
      description: 'There is no such object with such ID.',
      responseType: 'notFound' // как раньше res.notFound(), сейчас это встроеная функция sails
    },
    forbidden: {
      description: 'The student who makes this request does not have permission to delete this entry.',
      responseType: 'forbidden' // как раньше res.forbidden(), сейчас это встроеная функция sails
    },
    badRequest: {
      description: 'Error.',
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {
    let req = this.req;
    if (!req.isSocket) {
      throw 'badRequest';
    }

    const socketId = sails.sockets.getId(req);
    const roomName = req.me.emailAddress
    await sails.sockets.join(req, roomName);

    let user = await User.findOne({'id': req.session.userId}).populate('reminders');

    await sails.sockets.broadcast(roomName, 'list-student', user.reminders);

    return exits.success();
  }


};
