const YNAB_ACCESS_TOKEN = "<YOUR_YNAB_DEVELOPER_TOKEN>"
const YNAB_BUDGET_ID = "<YOUR_YNAB_BUDGET_ID, Get it from URI>";
const YNAB_INPUT_LABEL = "YNAB-publish"; // Change this if you want
const YNAB_OUTPUT_LABEL = "YNAB-done";   // Change this if you want
const YNAB_AMEX_ACCOUNT_ID = "<YOUR_YNAB_AMEX_ACCOUNT_ID, get from URI>";
const YNAB_CHASE_ACCOUNT_ID = "<YOUR_YNAB_CHASE_ACCOUNT_ID, get from URI>";

const parserFactory = (message) => {
  const from = message.getFrom().toLowerCase();
  const subject = message.getSubject().toLowerCase();

  switch(true) {
    case from.includes("chase") && subject.includes("transaction"):
      return {parser: chaseParser, account_id: YNAB_CHASE_ACCOUNT_ID};
    case from.includes("americanexpress") && subject.includes("payment confirmation"):
      return {parser: americanExpressPaymentParser, acount_id: YNAB_AMEX_ACCOUNT_ID};
    case from.includes("americanexpress") && subject.includes("purchase approved"):
      return {parser: americanExpressParser, account_id: YNAB_AMEX_ACCOUNT_ID};
    default:
      return (body, date) => null; // No-op
  }
}

function publishYNAB() {
  const currlbl = GmailApp.getUserLabelByName(YNAB_INPUT_LABEL); /* Label object we are reacting to. */
  const newlbl = GmailApp.getUserLabelByName(YNAB_OUTPUT_LABEL); /* Label object we are moving emails to once done. */
  const threads = currlbl.getThreads(); 
  
  const transactions = threads.map(thread => {
    const transactions = thread.getMessages().map(message => {
      const {parser, account_id} = parserFactory(message);
      return {
        ...parser(message.getBody(), message.getDate()), 
        account_id
      };
    });

    thread.removeLabel(currlbl);
    thread.addLabel(newlbl);

    return transactions;
  })
    .filter(x => !!x)
    .flat();

  if (Array.isArray(transactions) && transactions.length > 0) {
    const ynab = new YNAB(YNAB_ACCESS_TOKEN, YNAB_BUDGET_ID);
    ynab.createTransaction(transactions);
  }
}
