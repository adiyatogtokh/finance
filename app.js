//дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    addStrings: ".add__type",
    descStrings: ".add__description",
    valueStrings: ".add__value",
    addBtn: ".add__btn",
    inComeList: ".income__list",
    exPense: ".expenses__list",
    //------------------------//
    tusuvLabel: ".budget__value",
    inComeLabel: ".budget__income--value",
    expeseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  return {
    displayDate: function () {
      var unuudur = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        unuudur.getFullYear() +
        " оны" +
        " " +
        unuudur.getMonth() +
        " сарын " +
        unuudur.getDate();
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.addStrings).value,
        description: document.querySelector(DOMstrings.descStrings).value,
        value: parseInt(document.querySelector(DOMstrings.valueStrings).value),
      };
    },
    displayPercentages: function (allPercentages) {
      // Зарлагын NodeList-ийг олох
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      // Элемент болгоны хувьд зарлагын хувийг массиваас авч шивж оруулах
      nodeListForeach(elements, function (el, index) {
        el.textContent = allPercentages[index];
      });
    },
    getDomStrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.descStrings + "," + DOMstrings.valueStrings
      );
      // convert list item to array
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });
      fieldsArr[0].focus();
      //for (var i = 0; i < fields.length; i++) {
      //  fieldsArr[i].value = "";
      //}
    },

    tusuviigUzuuleh: function (tusuv) {
      document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
      document.querySelector(DOMstrings.inComeLabel).textContent =
        tusuv.totalInc;
      document.querySelector(DOMstrings.expeseLabel).textContent =
        tusuv.totalExp;
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi;
      }
    },
    deleleListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    addListItem: function (item, type) {
      // Орлого зарлагын элементийг агуулсан html-ийг бэлтгэнэ

      var html, list;
      if (type === "inc") {
        list = DOMstrings.inComeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.exPense;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж өгнө
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);
      // Бэлтгэсэн HTML ээ DOM хийж өгнө
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

//Санхүүтэй ажиллах контроллер
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    items: {
      inc: [],
      exp: [],
    },

    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,
    huvi: 0,
  };
  return {
    tusuvTootsooloh: function () {
      // Нийт орлогын нийлбэрийг тооцоолно
      calculateTotal("inc");
      calculateTotal("exp");
      // Төсөвийг шинээр тооцоолох
      data.tusuv = data.totals.inc - data.totals.exp;
      // Орлого зарлагын хувийг тооцоолно
      if (data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },
    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPercentages;
    },
    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
    tusuviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },
    addItem: function (type, desc, val) {
      var item, id;
      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        //type === 'expense'
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },

    seeData: function () {
      return data;
    },
  };
})();

//Програмын хологч контроллер
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    //1. Oruulah ugugdliig delgetsees olj avna.
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      //2. Olj avsn ugugdluudee sanhuugiin controllert damjuulj tend hadgalna.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      //3. Olj avsn ugugdluudiig web deeree tohiroh hesegt gargana.
      uiController.addListItem(item, input.type);
      uiController.clearFields();
      //4. Tusuviig шинээр тооцоолоод дэлгэцэнд үзүүлнэ
      updateTusuv();
    }
  };

  var updateTusuv = function () {
    //4. Tusuviig tootsoolno.
    financeController.tusuvTootsooloh();
    //5. Etssiin uldegdel
    var tusuv = financeController.tusuviigAvah();
    //6. Tusuviin tootsoog delgetsend gargana.
    uiController.tusuviigUzuuleh(tusuv);
    //7. Элементүүдийн хувийг тооцоолно
    financeController.calculatePercentages();
    //8. Элементүүдийн хувийг хүлээж авна
    var allPercentages = financeController.getPercentages();
    //9. Эдгээр хувийг дэлгэцэнд гаргана
    uiController.displayPercentages(allPercentages);
  };
  var setUpEventlistener = function () {
    var DOM = uiController.getDomStrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);
          console.log(type + " ===> " + itemId);

          // Санхүүгийн модулиас type, id ашиглаад устгана
          financeController.deleteItem(type, itemId);

          // Дэлгэц дээрээс энэ элементийг устгана
          uiController.deleleListItem(id);
          // Үлдэгдэл тооцоог шинэчилж харуулна
          updateTusuv();
        }
      });
  };

  return {
    init: function () {
      console.log("Application starting...");
      uiController.displayDate();
      uiController.tusuviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      setUpEventlistener();
    },
  };
})(uiController, financeController);

appController.init();
