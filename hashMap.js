import LinkedList from "./linkedLists.js";
class HashMap {
  constructor() {
    this.loadFactor = 0.75;
    this.capacity = 16;
    this.count = 0;
    this.buckets = new Array(this.capacity);
  }

  #resize() {
    if (!(this.length() > Math.ceil(this.capacity * this.loadFactor))) return;

    this.capacity *= 2;
    const oldBuckets = this.buckets;
    const newBuckets = new Array(this.capacity * 2);
    this.buckets = newBuckets;
    this.count = 0;
    // To calculate the new hash again in every value as the size increased two times
    for (const bucket of oldBuckets) {
      if (!bucket) continue;

      if (bucket instanceof LinkedList) {
        let temp = bucket.head;
        while (temp !== null) {
          const { key, value } = temp.value;
          this.set(key, value);
          temp = temp.nextNode;
        }
      } else {
        const { key, value } = bucket;
        this.set(key, value);
      }
    }
  }
  hash(key) {
    // Returns a hash code only for Strings keys.
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }

  set(key, value) {
    // Assigns a value in the hash map using the index of the hashed key
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    const newKeyValue = { key, value };
    const currentBucket = this.buckets[index];

    // If its empty, then we store the key-value pair first.
    if (!currentBucket) {
      this.buckets[index] = newKeyValue;
      this.count++;
      this.#resize();

      return;
    }

    // If there is a collision, we store it in a linked List
    if (!(currentBucket instanceof LinkedList)) {
      // if it is the same key, we update the value
      if (currentBucket.key === key) {
        this.buckets[index] = newKeyValue;
      } else {
        // If not, the linked list is created
        const list = new LinkedList();
        list.append(currentBucket);
        list.append(newKeyValue);
        this.buckets[index] = list;
        this.count++;
        this.#resize();
      }
      return;
    }

    // If the above is not true, then there is a linked list
    let temp = currentBucket.head;
    while (temp !== null) {
      // If the same key already exits, we update the value;
      if (temp.value.key === key) {
        temp.value = newKeyValue;
        return;
      }
      temp = temp.nextNode;
    }

    // If the key is not found in the linked list, then we append it
    this.buckets[index].append(newKeyValue);
    this.count++;
    this.#resize();
  }

  get(key) {
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    const currentBucket = this.buckets[index];

    //If there is not a linked list, then look for the key
    if (!(currentBucket instanceof LinkedList)) {
      if (currentBucket?.key === key) {
        return currentBucket.value;
      }
      return null;
    }

    // If there is a linked list
    let temp = currentBucket.head;
    while (temp !== null) {
      if (temp.value.key === key) {
        return temp.value.value;
      }
      temp = temp.nextNode;
    }
    return null;
  }

  has(key) {
    if (!key) return false;
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    const currentBucket = this.buckets[index];

    //If there is not a linked list, then look for the key
    if (!(currentBucket instanceof LinkedList)) {
      if (currentBucket?.key === key) {
        return true;
      }
      return false;
    }

    // If there is a linked list
    let temp = currentBucket.head;
    while (temp !== null) {
      if (temp.value.key === key) {
        return true;
      }
      temp = temp.nextNode;
    }
    return false;
  }

  remove(key) {
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    const currentBucket = this.buckets[index];

    if (!(currentBucket instanceof LinkedList)) {
      if (currentBucket.key === key) {
        this.buckets[index] = null;
        this.count--;
        return true;
      }
      return false;
    }

    const nodeIndex = currentBucket.find(key);
    const result = this.buckets[index].removeAt(nodeIndex);
    if (result) {
      size--;
      return true;
    }
    return false;
  }

  length() {
    return this.count;
  }

  clear() {
    this.capacity = 16;
    this.buckets = new Array(this.capacity);
    this.count = 0;
  }

  keys() {
    let keys = [];

    for (let i = 0; i < this.capacity; i++) {
      // If there is a linkedList
      if (this.buckets[i] instanceof LinkedList) {
        let temp = this.buckets[i].head;
        while (temp !== null) {
          keys.push(temp.value.key);
          temp = temp.nextNode;
        }
      } else if (this.buckets[i]) keys.push(this.buckets[i].key);
    }
    return keys;
  }

  values() {
    let values = [];

    for (let i = 0; i < this.capacity; i++) {
      // If there is a linkedList
      if (this.buckets[i] instanceof LinkedList) {
        let temp = this.buckets[i].head;
        while (temp !== null) {
          values.push(temp.value.value);
          temp = temp.nextNode;
        }
      } else if (this.buckets[i]) values.push(this.buckets[i].value);
    }
    return values;
  }

  entries() {
    // entries() returns an array that contains each key, value pair.
    // Example: [[firstKey, firstValue], [secondKey, secondValue]]

    let keyValuePairs = [];
    for (let i = 0; i < this.capacity; i++) {
      // If there is a linkedList
      if (this.buckets[i] instanceof LinkedList) {
        let temp = this.buckets[i].head;
        while (temp !== null) {
          keyValuePairs.push([temp.value.key, temp.value.value]);
          temp = temp.nextNode;
        }
      } else if (this.buckets[i]) {
        keyValuePairs.push([this.buckets[i].key, this.buckets[i].value]);
      }
    }
    return keyValuePairs;
  }
}

const test = new HashMap();
test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");

test.set("lion", "red");

const output = test.entries();
console.log(output);

console.log(test.length());
console.log(test.capacity);
test.set("moon", "silver");
test.remove("moon");
console.log(test.length());
console.log(test.has(""));
