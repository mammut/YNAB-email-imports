# YNAB-email-imports
Google Scripts that can import transactions into YNAB by parsing purchase notification emails from different institutions

## How does it works?
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
1. Go to https://script.google.com/
1. On the Sidebar click the `New Project` button at the top
1. At the top, rename the project from `Untitled Project` to something meaningful.
1. On the editor in the `Files` section click the `+` button and create the same script files as the ones in the [`src`](https://github.com/mammut/YNAB-email-imports/tree/main/src) of this repository
1. Copy the contents of each file into the respective Google Script file.
1. Update the first lines of `main.gs` to use your own constants:
    1. **YNAB_ACCESS_TOKEN**: Can be obtained by following the [YNAB API Quick Start](https://api.youneedabudget.com/) guide.
    1. **YNAB_BUDGET_ID**: It's the string from the URI when you open the app: `https://app.youneedabudget.com/<THIS-IS-YOUR-BUDGET-ID>/budget`
    1. **YNAB_AMEX_ACCOUNT_ID**: Is the account id within YNAB, you can get if by opening clicking on your account in the YNAB app and checking the URI: `https://app.youneedabudget.com/<BUDGET-ID>/accounts/<THIS-IS-YOUR-ACCOUNT-ID>`
1. At the top of the editor by the `run` button, select the `publishYNAB` from the dropdown. Then click `run`
1. A popup will show up asking to review the permissions. Click `review permissions`
1. Select your gmail account
1. Click on the `Advence` link
1. Click on `Go to YNAB Import Tutorial (unsafe)`
1. Click the `Allow` button. This will grant the script access to your gmail account so it can read the emails

At this point if you had an AMEX Large Purchase email in your `YNAB-publish` label, the transaction will show up in YNAB ready for you to review and approve/reject. The email will have been moved to `YNAB-done`.

### 4. Setup periodic runs
In this step we'll be adding a timebased trigger that will execute the `publishYNAB` function at a set interval.

1. On the Google Script sidebar, click the `Clock (Triggers) button`
1. Click on the bottom right button: `Add Trigger`
1. Fill the details:
  1. **Choose which function to run**: `publishYNAB`
  1. **Choose which deployment should run**: `Head`
  1. **Select event source**: `Time-driven`
  1. **Select type of time based trigger**: `Minutes timer`
  1. **Select minute interval**: `Every 5 Minutes`
1. Click on the `Save` button

Google Scripts will now trigger the `publishYNAB` function every 5 minutes. Feel free to play around with the intervals. Just be mindful of the [YNAB API Rate limits](https://api.youneedabudget.com/#rate-limiting)

