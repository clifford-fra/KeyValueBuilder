# Key Value Builder Screen Component for Salesforce Flows

The Key Value Builder Screen Component allows you to create a String Map by outputting two Text Collections of equal size: `keys` and `values`. Add new or delete existing entries with the buttons on the right side.

The component allows you set mandatory keys. Either use the input variable `Prefilled Keys` to pass a text collection to be displayed as read-only keys or use the input variable `Prefilled Keys as String` to pass a String with comma separated items.

Mix prefilled keys and add new entries as you like.

The component allows you to pass keys and/or values as default entries. If your collections have different sizes or one collection is missing, the component will fill up missing keys/values with empty Strings.

Use the different required variables to enforce your users to complete the fields.

## Input and Output Variables

- `Master Label`	The main label
- `Prefilled Keys`	A text collection with prefilled keys
- `Prefilled Keys as String`	A comma separated list as a String with prefilled keys. Either use this or the Prefilled Keys variable
- `Requires Keys`	Will prevent transition if set to {!$GlobalConstant.True} and at least one key is empty
- `Requires Unique Keys`	Will prevent transition if set to {!$GlobalConstant.True} and keys contains duplicates
- `Requires Values`	Will prevent transition if set to {!$GlobalConstant.True} and at least one value is empty
- `Keys`	A text collection with all keys
- `Values`	A text collection with all values

## Installation

Use the Deploy to Salesforce button to install the component:\
<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
