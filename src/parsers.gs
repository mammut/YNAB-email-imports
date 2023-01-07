const chaseParser = (body, date) => {
  const chaseRegex = /A charge of \(.*\)\s+([\d\.,]+)\s+at\s+(.+)\s+has been authorized/g;
  const transaction = chaseRegex.exec(body);
  
  return {
      date: Utilities.formatDate(date, "GMT", "yyyy-MM-dd"),
      amount: -parseInt(transaction[1].replace(",", "").replace(".", "")) * 10,
      payee_name: transaction[2]
  }
}

const americanExpressParser = (body, date) => {
  const content = stripHTML(body);
  
  const amexRegex = /large purchase notifications online\.(.*)\$([\d\.,]+)\*(.+)\*The amount/g;
  const transaction = amexRegex.exec(content);

  return {
    date: Utilities.formatDate(new Date(transaction[3]), "GMT", "yyyy-MM-dd"),
    amount: -parseInt(transaction[2].replace(",", "").replace(".", "")) * 10,
    payee_name: transaction[1]
  }
}

const americanExpressPaymentParser = (body, date) => {
  const content = stripHTML(body);

  const amexPaymentRegex = /Payment amount:\$([\d\.,]+)Processed on:(.*)Discover/g;
  const transaction = amexPaymentRegex.exec(content);

  return {
    date: Utilities.formatDate(new Date(transaction[2]), "GMT", "yyyy-MM-dd"),
    amount: parseInt(transaction[1].replace(",", "").replace(".", "")) * 10,
    payee_name: null
  }
}

