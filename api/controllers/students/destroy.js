module.exports = {

  friendlyName: 'Destroy',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    notFound: {
      description: 'Не существует такого объекта с таким ID.',
      responseType: 'notFound',
    }
  },

  fn: async function (inputs, exits) {
    const req = this.req;
    if (!req.isSocket) {
      throw 'badRequest';
    }
    let student = await Student.findOne({
      id: inputs.id
    });

    if (!student) {
      throw 'notFound';
    }

    await Student.destroy({id: inputs.id});
    return exits.success();
  }
};
