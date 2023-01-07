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

## Instructions
### 1. Setup transaction email notifications
The following instructions are specific to AMEX. Might be different for other institutions
1. Login to your AMEX account
1. On the main menu, click `Account Services`
1. On the sidebar menu click `Alerts & Communications Preferences`
1. Click [`Account Alerts`](https://global.americanexpress.com/account-management/alerts?linknav=US-Ser-axpAccountManagement-AccountAlerts)
1. At the top, make sure that the Email is your Gmail account.
1. Enable email alerts for:
    1. **Large Purchase**: This will send an email when a transaction is made to AMEX which is larger than $10 (This is a limitation with AMEX, sadly any transaction that is less than $10 won't be autoimported by this script ☹)

### 2. Create a gmail label and a filter
In this step we will automatically categorize the emails for payment and purchase into a specific label.

1. Login to your gmail account
1. On the sidebar find `Labels` section and click the `+` to create a new label
    1. Create a new label called `YNAB-publish`
    1. Create a new label called `YNAB-done`
1. Create a filter:
    1. On the search bar click the rightmost button: `Show search options`
    1. on the Subjet enter: `Large Purchase Approved`
    1. Click on the `create filter` link at the bottom
    1. Check the `Skip Inbox`
    1. Check the `Apply the label`: from the dropdown select `YNAB-publish`
    1. Click on the `Create Filter` button

### 3. Create Google Script
*WIP...*