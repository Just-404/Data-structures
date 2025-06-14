class Node {
  constructor(value, nextNode) {
    this.value = value || null;
    this.nextNode = nextNode || null;
  }
}

class LinkedList {
  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }

  #increaseSize() {
    this.size++;
  }

  #decreaseSize() {
    if (this.size === 0) return;
    this.size--;
  }

  append(value) {
    // adds a new node containing value to the end of the list
    const newNode = new Node(value, null);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      this.#increaseSize();
    } else {
      this.tail.nextNode = newNode;
      this.tail = newNode;
      this.#increaseSize();
    }
  }

  prepend(value) {
    //  adds a new node containing value to the start of the list
    const newNode = new Node(value);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      this.#increaseSize();
    } else {
      newNode.nextNode = this.head;
      this.head = newNode;
      this.#increaseSize();
    }
  }

  at(index) {
    // returns the node at the given index
    if (!Number.isInteger(index))
      throw new Error("The index must be an integer");
    if (index < 0) throw new Error("The index cannot be negative");
    if (index >= this.size)
      throw new Error("The index cannot be higher that the size of the list");

    if (index === this.size - 1) return this.tail;
    let temp = this.head;

    for (let i = 0; i < index; i++) {
      temp = temp.nextNode;
    }
    return temp;
  }

  pop() {
    //removes the last element from the list and returns it

    if (this.head === null) throw new Error("The Linked List is empty");

    // If there is one node then delete it
    if (this.head.nextNode === null) {
      const deletedNode = this.head;
      this.head = null;
      this.tail = null;
      this.#decreaseSize();
      return deletedNode;
    }

    let temp = this.head;
    while (temp.nextNode !== this.tail) {
      temp = temp.nextNode;
    }
    const deletedNode = this.tail;
    temp.nextNode = null;
    this.tail = temp;
    this.#decreaseSize();
    return deletedNode;
  }

  contains(value) {
    //  returns true if the passed in value is in the list and otherwise returns false.
    if (this.head === null) return false;

    if (this.head.value === value) return true;
    let temp = this.head;
    while (temp !== null) {
      if (temp.value === value) return true;
      temp = temp.nextNode;
    }

    return false;
  }

  find(value) {
    // returns the index of the node containing value, or null if not found.
    let temp = this.head;
    let i = 0;
    while (temp !== null) {
      if (temp.value === value) return i;
      i++;
      temp = temp.nextNode;
    }
    return null;
  }

  insertAt(value, index) {
    // inserts a new node with the provided value at the given index.
    const newNode = new Node(value, null);
    if (this.head === null) {
      this.prepend(value);
      return;
    }

    if (index < 0) throw new Error("The index cannot be negative");
    if (index > this.size)
      throw new RangeError(
        "Then index cannot be greater to the size of the linked list"
      );

    if (index === 0) {
      this.prepend(value);
      return;
    }
    let temp = this.head;
    for (let i = 0; i < index - 1; i++) {
      temp = temp.nextNode;
    }
    newNode.nextNode = temp.nextNode;
    temp.nextNode = newNode;

    if (newNode.nextNode === null) this.tail = newNode;
    this.#increaseSize();
  }

  removeAt(index) {
    if (index < 0) throw new Error("The index cannot be negative");
    if (index >= this.size)
      throw new RangeError(
        "Then index cannot be greater or equal to the size of the linked list"
      );

    if (index === 0) {
      const deletedNode = this.head;

      this.head = this.head.nextNode;
      if (this.size === 1) {
        this.tail = null;
      }
      this.#decreaseSize();
      return deletedNode;
    }

    let temp = this.head;
    for (let i = 0; i < index - 1; i++) {
      temp = temp.nextNode;
    }

    const deletedNode = temp.nextNode;
    temp.nextNode = temp.nextNode.nextNode;

    if (deletedNode === this.tail) {
      this.tail = temp;
    }
    this.#decreaseSize();
    return deletedNode;
  }
  toString() {
    if (this.head === null) return `( null )`;

    let temp = this.head;
    let values = "";

    while (temp !== null) {
      values += `( ${temp.value} ) -> `;
      temp = temp.nextNode;
    }
    if (temp === null) values += `( null )`;

    return values;
  }
}

const list = new LinkedList();
list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");

list.prepend("mouse");

console.log(list.size);
// console.log(list.at(0));

// console.log(list.pop());
// console.log(list.contains("hamster"));
// console.log(list.find("mouse"));

list.insertAt("cow", 0);
console.log(list.toString());

list.removeAt(3);
console.log(list.toString());
