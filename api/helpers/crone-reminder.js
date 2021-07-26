module.exports = {


  friendlyName: 'Crone Reminder',


  description: 'Отрабатывает в памяти приложения по установленному периоду',


  inputs: {
    date: {
      type: 'string'
    }
  },


  fn: async function (inputs) {
    const schedule = require('node-schedule');
    const rule = new schedule.RecurrenceRule();
    let job=false
    rule.minute = 5;
    console.log('Я в кроне получил задание на: ', inputs.date);
    let x = ()=>55+55;
     job = schedule.scheduleJob(inputs.date, function (y) {
      console.log('y: ', y());
      console.log('Я отработал в: ', inputs.date);
    }.bind(null, x));

    x = job ? true : job;

    const job2 = schedule.scheduleJob(rule, function () {
      console.log('crone-reminder - выполняюсь каждые 5 мин... ');
    });

    return x
  }
};

