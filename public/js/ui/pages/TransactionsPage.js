
/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error("Переданный элемент не существует");
    };
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {  
    if(this.render()) {  
      this.render();
    }
    this.render(); 
  }
  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').onclick = () => {
      this.removeAccount();
    };
    
    this.element.querySelector('.content').onclick = (e) => {
      if (e.target.closest('button')) {
        //console.log(e.target.closest('button').dataset.id);
        this.removeTransaction(e.target.closest('button').dataset.id);       
      };   
    }
  }
  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(!document.querySelector('.active')) {
      return;
    }

    const question = 'Вы действительно хотите удалить этот счёт?';
    const result = confirm(question);
      if(result) {
        Account.remove({id: document.querySelector('.active').getAttribute('data-id')}, (err, resp) => { 
          if(resp && resp.success) {
            //console.log(resp.data)
            App.updateWidgets();
            App.updateForms();  
            this.clear();
          }
        });        
      } 
    }    
  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const question = 'Вы действительно хотите удалить эту транзакцию?';
    const result = confirm(question);
    if(result) {
      Transaction.remove ({ id: document.querySelector('.transaction__remove').dataset.id=id }, (err, resp) => {
        if(resp && resp.success) {
          App.update();           
          this.update();
          App.updateWidgets();          
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {             //options = {account_id: 23}
     if(!options) {
       return;
     }
     //options.lastOptions = options;
     
     Account.get(options.account_id, (err, resp) => {      
      if(resp && resp.data) {
        //console.log(resp.data);
        console.log(options);
        this.renderTitle(resp.data.name);
      }
    });
    
    Transaction.list({account_id: options.account_id}, (err, resp) => {
      if(resp && resp.success) {
        this.renderTransactions(resp.data); 
        //console.log(resp.data);
        console.log(options);      
      }
    })
    
    //options.lastOptions = options;
    options.lastOptions = document.querySelector('.active').dataset.id;
    console.log(options.lastOptions);
  }
  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета'); 
    //options.lastOptions = '';
    document.querySelector('.active').dataset.id = '';
  }
  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector('.content-title').innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Окрября", "Нобря", "Декабря"];

    let years = new Date(date).getFullYear();  

    let month = monthNames[new Date(date).getMonth()];

    let data = new Date(date).getDate();
    data < 10 ? data = '0' + data : '';

    let hours = new Date(date).getHours();
    hours < 10 ? hours = '0' + hours : '';

    let minutes = new Date(date).getMinutes();
    minutes < 10 ? minutes = '0' + minutes : '';

    date = data + ' ' + month + ' ' + years + ' г. ' + 'в ' + hours + ':' + minutes;
  
    return date;
}
  
  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  
  getTransactionHTML(item) {
    
    const div = document.createElement("div");
    div.classList.add("transaction");
    div.classList.add("row");
                
    div.innerHTML = `
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
        ${(item.sum).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
      </div>`;
    item.type === "expense" ? div.classList.add("transaction_expense") : div.classList.add("transaction_income"); 
    
    return div.outerHTML;
    }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  
  renderTransactions(data) {   
    const content = this.element.querySelector('.content');
    content.innerHTML = data.reduce((acc, item) => {        
    return acc + this.getTransactionHTML(item);
    }, '');  
  }   
}

