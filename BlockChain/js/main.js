// Your code here!
class Block {
    constructor(index, timestamp, data, previousHash = '') //index=pos of block, timestamp=time of creation
    {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
    }

    calculateHash() {

    }
}