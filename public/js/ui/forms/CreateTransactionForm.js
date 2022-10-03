/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список  (<option value="${id}">${name}</option>)
   * */
 
  renderAccountsList() {
    Account.list(null, (err, resp) =>{
      if(resp && resp.success && resp.data) {
        document.querySelectorAll('option').forEach(el => el.remove());
        resp.data.forEach(element => {
          const selectExpense = document.getElementById('expense-accounts-list');
          selectExpense.insertAdjacentHTML('beforeend', `<option value="${element.id}">${element.name}</option>`);
          const selectIncome = document.getElementById('income-accounts-list');
          selectIncome.insertAdjacentHTML('beforeend', `<option value="${element.id}">${element.name}</option>`);
        });              
      }
    }) 
                   
  }   
    
  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, resp) => {
      if(resp && resp.success) {
        App.update();
        this.element.reset();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
      }
    });
  }
}