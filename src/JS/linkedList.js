class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    add(value) {
        const newNode = new Node(value);
        if (this.tail) {
            this.tail.next = newNode;
            this.tail = newNode;
        } else {
            this.head = this.tail = newNode;
        }
    }

    clear() {
        this.head = this.tail = null;
    }

    toArray() {
        const array = [];
        let current = this.head;
        while (current) {
            array.push(current.value);
            current = current.next;
        }
        return array;
    }
}

export default LinkedList;
