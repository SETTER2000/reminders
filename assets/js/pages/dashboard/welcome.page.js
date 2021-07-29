parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    students: [],
    formData: {/* … */},
    centerDialogAdded: false,
    modal: '',
    links: [],
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
      },
    },
    state: '',
    timeout: null,
    search: '',
    pageLoadedAt: Date.now(),
    syncing: false,
    editList: [],
    filterList: [],
    cloudError: '',
    buttonUpdate: false,
    ruleForm: {
      reminder: 'Вам надо покрасить дом!',
      domains: [{
        key: 1,
        value: '',
        state: '',
        rating: 1
      }],
      email: ''
    },
    rules: {
      dateBirth: [
        {required: true, message: 'Когда прислать уведомление? Дата обязательна.', trigger: 'blur'}
      ],
      reminder: [
        {required: true, message: 'Текст уведомления обязательно.', trigger: 'blur'},
        {min: 3, max: 150, message: 'Длина должна быть от 3 до 150 зн.', trigger: 'blur'}
      ],

    },
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    _.extend(this, SAILS_LOCALS);
    io.socket.get(`/api/v1/students/list`, function gotResponse(body, response) {
      // console.log('Сервер ответил кодом ' + response.statusCode + ' и данными: ', body);
    });

    io.socket.on('list-student', (data) => {
      this.students = this.editList = this.filterList = _.isNull(data) ? [] : data;
      // console.log('STUDENTS::: ', this.students);
    });


  },

  filters: {
    dateF: function (value, l, format) {
      if (!value) {
        return '';
      }
      moment.locale(l);
      let formatNew = (!format) ? 'LLL' : format;
      return (moment.parseZone(value).format(formatNew)) ? moment.parseZone(value).format(formatNew) : value;
    },
  },
  //  ╦  ╦╦╦═╗╔╦╗╦ ╦╔═╗╦    ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ╚╗╔╝║╠╦╝ ║ ║ ║╠═╣║    ╠═╝╠═╣║ ╦║╣ ╚═╗
  //   ╚╝ ╩╩╚═ ╩ ╚═╝╩ ╩╩═╝  ╩  ╩ ╩╚═╝╚═╝╚═╝

  virtualPagesRegExp: /^\/welcome\/?([^\/]+)?\/?/,
  afterNavigate: async function (virtualPageSlug) {
    // `virtualPageSlug` is determined by the regular expression above, which
    // corresponds with `:unused?` in the server-side route for this page.
    switch (virtualPageSlug) {
      case 'hello':
        this.modal = 'example';
        break;
      default:
        this.modal = '';
    }
  },
  computed: {
    titleAdd: {
      get: function () {
        return !this.buttonUpdate ? 'Добавить' : 'Изменить';
      }
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    clickOpenExampleModalButton: async function () {
      this.goto('/welcome/hello');
    },

    closeExampleModal: async function () {
      this.ruleForm = {
        domains: [{
          key: 1,
          value: '',
          state: '',
          rating: 1,
          defaultTime: ['12:00:00']
        }],
      };
      this.buttonUpdate = false;
      this.goto('/welcome');
    },
    handleParsingForm: function () {
      this.formErrors = {};
      var argins = this.formData;

      if (!argins.fullName) {
        this.formErrors.fullName = true;
      }

      if (!argins.emailAddress || !parasails.util.isValidEmailAddress(argins.emailAddress)) {
        this.formErrors.emailAddress = true;
      }

      if (!argins.password) {
        this.formErrors.password = true;
      }

      if (argins.password && argins.password !== argins.confirmPassword) {
        this.formErrors.confirmPassword = true;
      }

      if (!argins.agreed) {
        this.formErrors.agreed = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        return;
      }
      return argins;
    },

    async submitForm(formName) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid && !this.buttonUpdate) {
          this.add();
        } else if (valid && this.buttonUpdate) {
          this.update();
        } else {
          return false;
        }
        return false;
      });
    },

    async add() {
      let data = this.ruleForm;
      dt = await io.socket.post('/api/v1/students/student', data,(data, jwRes) => {
        if (jwRes.statusCode === 200) {
          this.resetForm('ruleForm');
          this.closeExampleModal();
          this.ruleForm.federations = this.resetFederation;
          this.getList();
          this.$message({
            message: 'Задание добавлено.'
          });
        } else {
          this.$message({
            type: 'error',
            message: 'Отмена.'
          });
        }
      });
    },

    update() {
      let data = this.ruleForm;
      data.id = this.ruleForm.id;
      console.log('DATA UPDATE перед отправкой ::: ', data);
      io.socket.put('/api/v1/students/student', data, (data, jwRes) => {
        if (jwRes.statusCode === 200) {
          this.resetForm('ruleForm');
          this.closeExampleModal();
          this.ruleForm.federations = this.resetFederation;
          this.getList();
        } else {
          this.$message({
            type: 'error',
            message: `Обновление не прошло. Ошибка ${jwRes.statusCode}`
          });
        }
      });
    },
    async handleEdit(index, row) {
      this.ruleForm = Object.assign({}, this.ruleForm, row);
      this.clickOpenExampleModalButton();
      this.buttonUpdate = true;
    },
    clickAddButton() {
      this.centerDialogAdded = true;
    },

    tableRowClassName({row, rowIndex}) {
      if (!row.see) {
        return 'warning-row';
      }
      return '';
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
      this.search = '';
    },

    openRemoveDialog(id) {
      this.removeId = id;
      this.$confirm('Это навсегда удалит объект. Продолжить?', 'Внимание', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Отменить',
        type: 'warning'
      }).then(() => {
        this.deleteDog();

      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Отменить'
        });
      });
    },


    deleteDog: async function () {
      io.socket.delete('/api/v1/students/student', {id: this.removeId}, (dataRes, jwRes) => {
        if (jwRes.statusCode === 200) {
          this.getList();
          this.$forceUpdate();
        } else {
          this.$message({
            type: 'Error',
            message: 'Проблемы с удалением.'
          });
        }
      });
    },

    async getList() {
      await io.socket.get(`/api/v1/students/list`, function gotResponse(body, response) {
        // console.log('Сервер ответил кодом ' + response.statusCode + ' и данными: ', body);
      });

    },
    resetForm(formName) {
      this.$refs.upload ? this.$refs.upload.clearFiles() : '';
      this.$refs[formName].resetFields();
      this.ruleForm.federations = this.resetFederation;
    },

    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: 'wangxiaohu'
          }, {
            id: 32,
            date: '2016-05-01',
            name: 'wangxiaohu'
          }
        ]);
      }, 1000);
    },

    querySearchAsync(queryString, cb) {
      var links = this.links;
      var results = queryString ? links.filter(this.createFilter(queryString)) : links;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },

    handleChange(value) {
      console.log(value);
    },
  }
});
