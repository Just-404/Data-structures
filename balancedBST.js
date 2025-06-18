class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const validArray = this.#sortAndRemoveDuplicates(array);
    this.root = this.buildTree(validArray);
  }

  #sortAndRemoveDuplicates(array) {
    return Array.from(new Set(array)).sort((a, b) => a - b);
  }

  buildTree(array, start = 0, end = array.length - 1) {
    if (start > end) return null;
    let mid = start + Math.floor((end - start) / 2);

    const root = new Node(array[mid]);

    root.left = this.buildTree(array, start, mid - 1);
    root.right = this.buildTree(array, mid + 1, end);

    return root;
  }

  insert(value, root = this.root) {
    if (root === null) {
      return new Node(value);
    }

    if (root.data === value) return root;

    if (value < root.data) {
      root.left = this.insert(value, root.left);
    } else if (value > root.data) {
      root.right = this.insert(value, root.right);
    }

    return root;
  }

  #getSuccesor(node) {
    // Helper function to delete a node with both children
    node = node.right;
    while (node !== null && node.left !== null) {
      node = node.left;
    }

    return node;
  }
  delete(root, value) {
    if (root === null) return root;

    if (root.data > value) {
      root.left = this.delete(root.left, value);
    } else if (root.data < value) {
      root.right = this.delete(root.right, value);
    } else {
      // If root has a child on the right or 0
      if (root.left === null) {
        return root.right;
      }
      // If root has a child on the left or 0

      if (root.right === null) {
        return root.left;
      }

      // If root has both children

      let succesor = this.#getSuccesor(root);
      root.data = succesor.data;
      root.right = this.delete(root.right, succesor.data);
    }
    return root;
  }

  find(value, root = this.root) {
    if (root === null) return null;
    if (root.data === value) return root;

    if (root.data > value) {
      return this.find(value, root.left);
    }
    return this.find(value, root.right);
  }

  levelOrder(callback) {
    if (this.root === null) return;
    if (!callback) throw new Error("A callback is expected");

    let queue = [this.root];

    while (queue.length) {
      let currentNode = queue.shift();

      callback(currentNode.data);
      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
      queue.unshift();
    }
  }

  inOrder(callback, root = this.root) {
    if (root === null) return;
    if (!callback) throw new Error("A callback is expected");

    this.inOrder(callback, root.left);
    callback(root.data);
    this.inOrder(callback, root.right);
  }

  preOrder(callback, root = this.root) {
    if (root === null) return;
    if (!callback) throw new Error("A callback is expected");

    callback(root.data);
    this.preOrder(callback, root.left);
    this.preOrder(callback, root.right);
  }

  postOrder(callback, root = this.root) {
    if (root === null) return;
    if (!callback) throw new Error("A callback is expected");

    this.postOrder(callback, root.left);
    this.postOrder(callback, root.right);
    callback(root.data);
  }

  height(value) {
    const root = this.find(value);
    if (root === null) return null;

    function searchHeight(node) {
      if (node === null) return -1;

      let leftHeight = searchHeight(node.left);
      let rightHeight = searchHeight(node.right);

      if (leftHeight > rightHeight) {
        return leftHeight + 1;
      } else {
        return rightHeight + 1;
      }
    }
    return searchHeight(root);
  }

  depth(value) {
    let currentNode = this.root;
    let depth = 0;

    while (currentNode !== null) {
      if (currentNode.data === value) return depth;

      if (currentNode.data < value) {
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
      depth++;
    }
    return null;
  }

  isBalanced() {
    function isBalancedRec(root) {
      if (root === null) return 0;

      let leftHeight = isBalancedRec(root.left);
      let rightHeight = isBalancedRec(root.right);

      if (
        leftHeight === -1 ||
        rightHeight === -1 ||
        Math.abs(leftHeight - rightHeight) > 1
      ) {
        return -1;
      }

      return Math.max(leftHeight, rightHeight) + 1;
    }

    return isBalancedRec(this.root) !== -1;
  }

  rebalance() {
    if (this.isBalanced()) return;

    const orderedArr = [];
    this.inOrder((data) => {
      orderedArr.push(data);
    });

    this.root = this.buildTree(orderedArr);
  }
}

export default Tree;
