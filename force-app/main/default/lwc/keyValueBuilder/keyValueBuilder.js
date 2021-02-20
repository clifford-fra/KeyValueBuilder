import { LightningElement, api, track } from "lwc";
import {FlowAttributeChangeEvent} from "lightning/flowSupport";

export default class App extends LightningElement {
  @api masterLabel;
  @api prefilledKeysAsString;
  @api prefilledKeys = [];
  @api required;
  @api requiredValues;
  @api requiredUniqueKeys;

  @track items = [];

  @api get keys() {
    var keys = [];

    // Collecting and returning all keys
    this.items.forEach(key => {
      keys.push(key.key);
    });

    console.log('Get Keys returnes: ' + keys);

    return keys;
  }

  set keys(keys) {

    console.log('Entering Set Keys with: ' + keys);
    
    var x;
    for (x in keys) {
      // For the label number
      var length = parseInt(x) + 1;

      // Update entries and if more keys than values exist, create new entries
      if (x < this.items.length) {
        this.items[x].key = keys[x];
      } else {
        this.items.push({name: x, key_label: 'Key ' + length, value_label: 'Value ' + length, key : keys[x], value : ''});
      }
    }
    
  }

  @api get values() {

    var values = [];

    // Collecting and returning all values
    this.items.forEach(key => {
      values.push(key.value);
    });

    console.log('Get Values returnes: ' + values);

    return values;
  }

  set values(values) {

    console.log('Entering Set Values with: ' + values);
    
    var x;
    for (x in values) {
      // For the label number
      var length = parseInt(x) + 1;

      // Update entries and if more values than keys exist, create new entries
      if (x < this.items.length) {
        this.items[x].value = values[x];
      } else {
        this.items.push({name: x, key_label: 'Key ' + length, value_label: 'Value ' + length, key : '', value : values[x]});
      }
    }
    
  }

  connectedCallback() {

    console.log('Entering Connected Callback');
 
    // If prefilled keys are provided as a string, create a collection
    if (this.prefilledKeysAsString) {
      this.prefilledKeys = this.prefilledKeysAsString.split(',').map(function(item) {
        return item.trim();
      });;
    }

    console.log('Prefilled Keys are: ' + this.prefilledKeys);

    /*
    Set all prefilled keys, and if no entries with these keys exists, create new ones
    */
    var setToPrefilled = [];
    var prefilledKeysTemp = this.prefilledKeys.slice(0);

    // First set all existing prefilled entries to true and remember what was set
    for (let item of this.items) {
      if (prefilledKeysTemp.includes(item.key)) {
        item.prefilled = true;
        setToPrefilled.push(item.key);

        // Remove the key from the temp prefilledKeys
        prefilledKeysTemp = prefilledKeysTemp.filter(function(i) {
          return i !== item.key
        });
      }
    }

    console.log('The following items exists and have been set to prefilled: ' + setToPrefilled);

    // Now create all remaining prefilled entries
    var x;
    var startLength = this.items.length;
    for (x in this.prefilledKeys) {
      // Correct Label number
      var length = startLength + parseInt(x) + 1;

      // If the prefilled key has not been found and updated, create a new entry
      if (!setToPrefilled.includes(this.prefilledKeys[x])) {

        console.log('Creating new prefilled item: ' + this.prefilledKeys[x]);

        this.items.push({name: x, key_label: 'Key ' + length, value_label: 'Value ' + length, key : this.prefilledKeys[x], value : '', prefilled : true});
      }
    }
    
    // Add one item if nothing is prefilled and no data exists
    if (this.isEmptyArray(this.items)) {

      console.log('No items found: Creating a new empty one');
      this.items.push({name: 0, key_label: 'Key 1', value_label: 'Value 1', key : '', value : ''});
    }

  }

  updateOrder() {
    var x;
    for (x in this.items) {
      var length = parseInt(x) + 1;
      this.items[x].name = x;
      this.items[x].key_label = 'Key ' + length;
      this.items[x].value_label = 'Value ' + length;
    }
  }

  handleKeyChange(event) {
    var index = event.target.dataset.id;
    this.items[index].key = event.target.value;

    this.dispatchFlowAttributeChangedEvent('keys', this.keys);
  }

  handleValueChange(event) {
    var index = event.target.dataset.id;
    this.items[index].value = event.target.value;

    this.dispatchFlowAttributeChangedEvent('values', this.values);
  }

  handleAdd() {
    length = this.items.length;
    this.items.push({name: (String)(this.items.length), key_label: 'Key ' + (length+1)  , value_label: 'Value ' + (length+1), key : '', value : ''});
  }

  handleDelete(event) {
    // Delete item
    console.log('Deleting Index: ' + event.target.dataset.id);
    this.items.splice(event.target.dataset.id , 1);

    // Reorder
    this.updateOrder();
  }

  dispatchFlowAttributeChangedEvent(attributeName, attributeValue) {
    const attributeChangeEvent = new FlowAttributeChangeEvent(
        attributeName,
        attributeValue
    );
    this.dispatchEvent(attributeChangeEvent);
  }

  containsEmptyString(array){
    for(var i = 0; i < array.length; i++){
        if(array[i] === "")   
          return true;
    }
    return false;
  }

  isEmptyArray(array) {
      if (!Array.isArray(array) || !array.length) {
        return true;
      }
      return false;
  }

  hasDuplicates(array){
    return new Set(array).size !== array.length 
  }

  @api
  validate() {
    console.log('Entering Validation');

    let sameSize = this.keys.length === this.values.length;
    let hasEmptyKey = this.containsEmptyString(this.keys);
    let hasEmptyValue = this.containsEmptyString(this.values);
    let validatedTo = true;
    let errorMessage;

    console.log('sameSize: ' + sameSize);
    console.log('size is: ' + this.keys.length);
    console.log('has empty key: ' + hasEmptyKey);
    console.log('has empty value: ' + hasEmptyValue);

    if (!sameSize) {
      errorMessage = "Your Keys and Values do not have the same size.";
      validatedTo = false;
    } else if (this.required === true && hasEmptyKey) {
      errorMessage = "You must complete all empty keys.";
      validatedTo = false;

    } else if (this.requiredValues === true && hasEmptyValue) {
      errorMessage = "You must complete all empty values.";
      validatedTo = false;

    } else if (this.requiredUniqueKeys === true && this.hasDuplicates(this.keys)) {
      errorMessage = "Your Keys contain duplicates.";
      validatedTo = false;
    }

    // Output validation result
    if (validatedTo === false) {
      console.log('Validated false');
        
      return {
        isValid: false,
        errorMessage: errorMessage
      };
    } else {
      console.log('Validated true');
      return { isValid: true };
    } 
  }


}
