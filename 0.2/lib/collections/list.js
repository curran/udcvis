define(function (require, exports, module) {

module.exports = List;

var Reducible = require("./reducible");
var Observable = require("./observable");
var Operators = require("./operators");

function List(values, equals) {
    if (!(this instanceof List)) {
        return new List(values, equals);
    }
    var head = this.head = new this.Node();
    head.next = head;
    head.prev = head;
    this.contentEquals = equals || Object.equals || Operators.equals;
    this.length = 0;
    this.addEach(values);
}

List.prototype.constructClone = function (values) {
    return new this.constructor(values, this.contentEquals);
};

List.prototype.find = function (value, equals) {
    equals = equals || this.contentEquals;
    var head = this.head;
    var at = head.next;
    while (at !== head) {
        if (equals(at.value, value)) {
            return at;
        }
        at = at.next;
    }
};

List.prototype.findLast = function (value, equals) {
    equals = equals || this.contentEquals;
    var head = this.head;
    var at = head.prev;
    while (at !== head) {
        if (equals(at.value, value)) {
            return at;
        }
        at = at.prev;
    }
};

List.prototype.has = function (value, equals) {
    return !!this.find(value, equals);
};

List.prototype.get = function (value, equals) {
    var found = this.find(value, equals);
    if (found) {
        return found.value;
    }
    return this.getDefault();
};

List.prototype.getDefault = function () {
};

// LIFO (delete removes the most recently added equivalent value)
List.prototype['delete'] = function (value, equals) {
    var found = this.findLast(value, equals);
    if (found) {
        found['delete']();
        this.length--;
        if (this.isObserved) {
            this.dispatchContentChange([], [value]);
        }
        return true;
    }
    return false;
};

List.prototype.wipe = function () {
    this.head.next = this.head.prev = this.head;
};

List.prototype.add = function (value) {
    this.head.addAfter(new this.Node(value));
    this.length++;
    if (this.isObserved) {
        this.dispatchContentChange([value], []);
    }
};

List.prototype.push = function () {
    var head = this.head;
    for (var i = 0; i < arguments.length; i++) {
        var value = arguments[i];
        var node = new this.Node(value);
        head.addAfter(node);
        this.length++;
        if (this.isObserved) {
            this.dispatchContentChange([value], []);
        }
    }
};

List.prototype.unshift = function () {
    var at = this.head;
    for (var i = 0; i < arguments.length; i++) {
        var value = arguments[i];
        var node = new this.Node(value);
        at.addBefore(node);
        this.length++;
        if (this.isObserved) {
            this.dispatchContentChange([value], []);
        }
        at = node;
    }
};

List.prototype.pop = function () {
    var value;
    var head = this.head;
    if (head.prev !== head) {
        value = head.prev.value;
        head.prev['delete']();
        this.length--;
        if (this.isObserved) {
            this.dispatchContentChange([], [value]);
        }
    }
    return value;
};

List.prototype.shift = function () {
    var value;
    var head = this.head;
    if (head.prev !== head) {
        value = head.prev.value;
        head.prev['delete']();
        this.length--;
        if (this.isObserved) {
            this.dispatchContentChange([], [value]);
        }
    }
    return value;
};

// an internal utility for coercing index offsets to nodes
List.prototype.scan = function (at, alt) {
    var head = this.head;
    if (typeof at === "number") {
        var count = at;
        if (count >= 0) {
            at = head.next;
            while (count) {
                count--;
                at = at.next;
                if (at == head) {
                    break;
                }
            }
        } else {
            at = head;
            while (count < 0) {
                count++;
                at = at.prev;
                if (at == head) {
                    break;
                }
            }
        }
        return at;
    } else {
        return at || alt;
    }
};

// at and end may both be positive or negative numbers (in which cases they
// correspond to numeric indicies, or nodes)
List.prototype.slice = function (at, end) {
    var sliced = [];
    var head = this.head;
    at = this.scan(at, head.next);
    end = this.scan(end, head);

    while (at !== end && at !== head) {
        sliced.push(at.value);
        at = at.next;
    }

    return sliced;
};

List.prototype.splice = function (at, length /*...plus*/) {
    return this.swap(at, length, Array.prototype.slice.call(arguments, 2));
};

List.prototype.swap = function (at, length, plus) {
    var swapped = [];
    at = this.scan(at, this.head.next);
    while (length--) {
        swapped.push(at.value);
        at['delete']();
        at = at.next;
    }
    this.length -= length;
    for (var i = 0; i < plus.length; i++) {
        var node = new this.Node(plus[i]);
        at.addAfter(node);
    }
    this.length += plus.length;
    return swapped;
};

List.prototype.reverse = function () {
    var at = this.head;
    do {
        var temp = at.next;
        at.next = at.prev;
        at.prev = temp;
        at = at.next;
    } while (at !== this.head);
    return this;
};

// TODO account for missing basis argument
List.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var head = this.head;
    var at = head.next;
    while (at !== head) {
        basis = callback.call(thisp, basis, at.value, at, this);
        at = at.next;
    }
    return basis;
};

List.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var head = this.head;
    var at = head.prev;
    while (at !== head) {
        basis = callback.call(thisp, basis, at.value, at, this);
        at = at.prev;
    }
    return basis;
};

List.prototype.addEach = Reducible.addEach;
List.prototype.forEach = Reducible.forEach;
List.prototype.map = Reducible.map;
List.prototype.toArray = Reducible.toArray;
List.prototype.filter = Reducible.filter;
List.prototype.every = Reducible.every;
List.prototype.some = Reducible.some;
List.prototype.all = Reducible.all;
List.prototype.any = Reducible.any;
List.prototype.min = Reducible.min;
List.prototype.max = Reducible.max;
List.prototype.count = Reducible.count;
List.prototype.sum = Reducible.sum;
List.prototype.average = Reducible.average;
List.prototype.concat = Reducible.concat;
List.prototype.flatten = Reducible.flatten;
List.prototype.zip = Reducible.zip;
List.prototype.equals = Reducible.equals;
List.prototype.compare = Reducible.compare;
List.prototype.sorted = Reducible.sorted;
List.prototype.reversed = Reducible.reversed;
List.prototype.clone = Reducible.clone;

List.prototype.getContentChangeDescriptor = Observable.getContentChangeDescriptor;
List.prototype.addContentChangeListener = Observable.addContentChangeListener;
List.prototype.removeContentChangeListener = Observable.removeContentChangeListener;
List.prototype.dispatchContentChange = Observable.dispatchContentChange;
List.prototype.addBeforeContentChangeListener = Observable.addBeforeContentChangeListener;
List.prototype.removeBeforeContentChangeListener = Observable.removeBeforeContentChangeListener;
List.prototype.dispatchBeforeContentChange = Observable.dispatchBeforeContentChange;

List.prototype.equals = function (that, equals) {
    var equals = equals || this.contentEquals || Object.equals || Operators.equals;

    if (this === that) {
        return true;
    }

    var self = this;
    return (
        this.length === that.length &&
        this.zip(that).every(function (pair) {
            return equals(pair[0], pair[1]);
        })
    );
};

List.prototype.one = function () {
    if (this.head === this.head.next) {
        throw new Error("Can't get one value from empty list");
    }
    return this.head.next.value;
};

List.prototype.only = function () {
    if (this.head === this.head.next) {
        throw new Error("Can't get only value in empty list");
    }
    if (this.head.prev !== this.head.next) {
        throw new Error("Can't get only value in list with multiple values");
    }
    return this.head.next.value;
};

List.prototype.iterate = function () {
    return new ListIterator(this.head);
};

function ListIterator(head) {
    this.head = head;
    this.at = head.next;
};

ListIterator.prototype.next = function () {
    if (this.at === this.head) {
        throw StopIteration;
    } else {
        var value = this.at.value;
        this.at = this.at.next;
        return value;
    }
};

List.prototype.Node = Node;

function Node(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
};

Node.prototype['delete'] = function () {
    this.prev.next = this.next;
    this.next.prev = this.prev;
};

Node.prototype.addAfter = function (node) {
    var prev = this.prev;
    this.prev = node;
    node.prev = prev;
    prev.next = node;
    node.next = this;
};

Node.prototype.addBefore = function (node) {
    var next = this.next;
    this.next = node;
    node.next = next;
    next.prev = node;
    node.prev = this;
};


});
