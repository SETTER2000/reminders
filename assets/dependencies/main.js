$(document).ready(function () {
  let lang = ELEMENT.lang.ruRU;
  lang = (SAILS_LOCALS.me && SAILS_LOCALS.me.preferredLocale === 'ru') ? ELEMENT.lang.ruRU : lang;

  ELEMENT.locale(lang);
  (!!SAILS_LOCALS.me) ? moment.locale(SAILS_LOCALS.me.preferredLocale) : '';
});
