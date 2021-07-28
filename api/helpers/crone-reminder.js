module.exports = {


  friendlyName: 'Crone Reminder',


  description: 'Отрабатывает в памяти приложения по установленному периоду',


  inputs: {
    date: {
      type: 'string'
    },
    reminder: {
      type: 'string'
    }
  },


  fn: async function (inputs) {
    const moment = require('moment');
    const schedule = require('node-schedule');
    const rule = new schedule.RecurrenceRule();
    let date = moment(inputs.date).valueOf()

    // console.log('MOMENT::: ', date)

    let job = false
    rule.minute = 5;
    console.info('reminder: новое задание на ', moment(inputs.date).format('LLLL'));
    // let x = () => 33 + 32
    // job = schedule.scheduleJob(inputs.date, async function (y) {
    //   d = await sails.helpers.mailgunSend(inputs.reminder)
    //   if (d) {
    //     console.log('mailgunSend: ', d);
    //     console.info(`reminder: получил задание на ${inputs.date}, отработал в ${new Date()}`);
    //   }
    //
    // }.bind(null, x));

    // Планируем диапазон отправки
    const startTime = new Date(date + 5000);
    const endTime = new Date(startTime.getTime() + 1 * 60 * 1000);

    job = await schedule.scheduleJob({
      start: startTime,
      end: endTime,
      rule: '*/10 * * * * *'
    }, async () => {
      d = await sails.helpers.mailgunSend(inputs.reminder)
      console.info('reminder: отправлено ', moment().format('dddd, MMMM Do' +
        ' YYYY, hh:mm:ss'));
    })


    const job2 = schedule.scheduleJob(rule, function () {
      console.log('crone-reminder - выполняюсь каждые 5 мин... ');
    });

    return job ? true : job;
  }
};

