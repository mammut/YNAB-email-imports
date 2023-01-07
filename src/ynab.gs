class YNAB {
  constructor(accessToken, budgetId) {
    this.budgetId = budgetId;

    this.options = {
      "headers": {
          "Authorization": "Bearer " + accessToken
      }
    };
  }

  createTransaction(transactions) {
    return this._ynabApi('post', `/v1/budgets/${this.budgetId}/transactions`, {
      transactions
    });
  }

  /**
   * Calls the YNAB API
   *
   * @param path {string} A string for the path part of the YNAB API URL
   * @returns {string} The response from YNAB
   */
  _ynabApi(method, path, data) {
    const options = {
      ...this.options,
      ...{
        method,
        contentType: 'application/json',
        payload: JSON.stringify(data)
      }
    };

    const response = UrlFetchApp.fetch("https://api.youneedabudget.com" + path, options);
    
    return JSON.parse(response.getContentText());
  }
}

