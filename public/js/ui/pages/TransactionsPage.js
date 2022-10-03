
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
    
    const question = 'Вы действительно хотите удалить этот счёт?';
    const result = confirm(question);
      if(result) {
        Account.remove({id: '2f5z21mwl8jhonjd'}, (err, resp) => { 
          if(resp && resp.success) {
            console.log(resp.data)
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
      Transaction.remove(id, (err, resp) => {
        if(resp && resp.success) {
          App.update(); 
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
      
     Account.get(options.account_id, (err, resp) => {
      if(resp && resp.data) {
        this.renderTitle(resp.data.name);
      }
    });
    
    Transaction.list(options, (err, resp) => {
      if(resp && resp.success) {
        this.renderTransactions();       
      }
    })
    options.lastOptions = options; 
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета'); 
    
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
    
  }
  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    item = {
        account_id: "1",
        created_at: "2019-09-19 20:12:02",
        id: '',
        name: "Копилка",
        sum: 1500,
        type: "income",
        user_id: "1"
      }
      if(item.type === "expense") {
        return `<div class="transaction transaction_expense row">
                  <div class="col-md-7 transaction__details">
                    <div class="transaction__icon">
                        <span class="fa fa-money fa-2x"></span>
                    </div>
                    <div class="transaction__info">
                        <h4 class="transaction__title">${item.name}</h4>    
                        <!-- дата -->
                        <div class="transaction__date">${item.created_at}</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="transaction__summ">
                    <!--  сумма -->${item.sum}
                      <span class="currency">₽</span>
                    </div>
                  </div>
                  <div class="col-md-2 transaction__controls">
                      <!-- в data-id нужно поместить id -->
                      <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                          <i class="fa fa-trash"></i>  
                      </button>
                  </div>
                </div>`;
      } else if(item.type === "income") {
        return `<div class="transaction transaction_income row">
                  <div class="col-md-7 transaction__details">
                    <div class="transaction__icon">
                        <span class="fa fa-money fa-2x"></span>
                    </div>
                    <div class="transaction__info">
                        <h4 class="transaction__title">${item.name}</h4>    
                        <!-- дата -->
                        <div class="transaction__date">${item.created_at}</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="transaction__summ">
                    <!--  сумма -->${item.sum}
                      <span class="currency">₽</span>
                    </div>
                  </div>
                  <div class="col-md-2 transaction__controls">
                      <!-- в data-id нужно поместить id -->
                      <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                          <i class="fa fa-trash"></i>  
                      </button>
                  </div>
                </div>`;      
            }
  }

  renderTransactions(data){
    console.log(document.querySelector('.content'))
    document.querySelector('.content').insertAdjacentHTML('beforeend', this.getTransactionHTML(data));
  }  
}