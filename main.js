const SHA256 = require("crypto-js/sha256");


class Block {
    constructor(index, timestamp, data, previousHash = '') //index=pos of block, timestamp=time of creation
    {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //random number which is changed while mining
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        //if difficulty=X, this will take first X characters of hash
        //then we check if the first X characters are 0
        while (this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) 
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined:" + this.hash);
     }
}

class Blockchain {
    constructor() {
        this.chain = [this.creeteGenesisBlock()]; //array of blocks
        this.difficulty = 4;
    }

    creeteGenesisBlock() { //genesis block is the 1st block of blockchain
        return new Block(0, "10/07/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let sonaliCoin = new Blockchain();
console.log('Mining block 1...');
sonaliCoin.addBlock(new Block(1, "11/07/2017", { amount: 4 })); //transfers 4 coins
console.log('Mining block 2...');
sonaliCoin.addBlock(new Block(2, "12/07/2017", { amount: 10 })); //transfers 10 coins

console.log(JSON.stringify(sonaliCoin, null, 4));

console.log('is blockchain valid?' + sonaliCoin.isChainValid());

//tampering of block:
sonaliCoin.chain[1].data = { amount: 100 }; //instead of 4, transfering 100 coins
console.log('is blockchain valid?' + sonaliCoin.isChainValid());

//recalculation to avoid tampering getting caught:
sonaliCoin.chain[1].hash = sonaliCoin.chain[1].calculateHash();
//still caught:
console.log('Is blockchain valid?' + sonaliCoin.isChainValid());


