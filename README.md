# YNAB-email-imports
Google Scripts that can import transactions into YNAB by parsing purchase notification emails from different institutions

## How it works?
1. A user purchases something using their AMEX Credit Card.
1. AMEX sends an email notification with the transaction details (payee, amount) to the users gmail account.
1. Gmail adds the label `YNAB-publish` to the transaction email.
1. Google Script is run every 5 minutes which will:
    1. Query gmail for all emails under `YNAB-publish` label
    1. For each email it will:
        1. Parse it's contents to get the transaction details
        1. Publish the transaction to YNAB using the [`createTransaction`](https://api.youneedabudget.com/v1#/Transactions/createTransaction) endpoint
        1. Remove the `YNAB-publish` label
        1. Add the `YNAB-done` label

## Prerequisites
1. **A gmail account**: We'll be using Google Scripts, which needs access to the emails through an API.
1. **YNAB Personal Access Tokens**. Will give you access to your YNAB account through the JavaScript API. You can read more at https://api.youneedabudget.com/#personal-access-tokens
1. **Transaction Email Notifications from your institution**: AMEX is the only one supported today. Please consider contributing others.
