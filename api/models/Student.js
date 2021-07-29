module.exports = {

  attributes: {
    reminder: {
      type: 'string',
      required: true,
      description: `Напоминалка.`
    },

    owner: {
      model: 'user'
    },

    dateBirth: {
      type: 'string',
      required: true,
      description: 'Дата рождения.'
    },
  },

};

