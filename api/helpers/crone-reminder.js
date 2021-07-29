module.exports = {


  friendlyName: 'Crone Reminder',


  description: 'Отрабатывает в памяти приложения по установленному периоду',


  inputs: {
    date: {
      type: 'string'
    },
    reminder: {
      type: 'string',
      description: 'Сообщение-напоминалка'
    },
    to: {
      type: 'string',
      example: 'admin@example.com',
      description: 'Email получателя'
    },
    id: {
      type: 'string',
      description: 'Идентификатор сообщения'
    },
    userId: {
      type: 'string',
      description: 'Идентификатор пользователя'
    },
  },


  fn: async function (inputs) {
    const moment = require('moment');
    const schedule = require('node-schedule');
    const rule = new schedule.RecurrenceRule();
    let date = moment(inputs.date).valueOf()

    let job = false
    rule.minute = 5;
    console.info('reminder: новое задание на ', moment(inputs.date).format('dddd, MMMM Do YYYY, HH:mm:ss'));

    // Планируем диапазон отправки
    const startTime = new Date(date + 5000);
    const endTime = new Date(startTime.getTime() + sails.config.reminderCron.minutes * 60 * 1000);
    let range = {
      start: startTime,
      end: endTime,
      rule: '*/10 * * * * *'
    };

    range = sails.config.reminderCron.repeat ? range : startTime

    job = await schedule.scheduleJob(range, async () => {

      let result = await sails.helpers.mailgunSend(inputs)
      console.log('result mailgun: ', result)
      if (result) {
        job.cancel()

      }

      console.info(
        `reminder: отправлено на ${inputs.to} в `,
        moment().format('dddd, MMMM Do YYYY, HH:mm:ss'));
    });


    const job2 = schedule.scheduleJob(rule, function () {
      console.log('crone-reminder работает - выполняюсь каждые 5 мин... ');
    });

    return job ? true : job;
  }
};

