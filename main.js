const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') //index=pos of block, timestamp=time of creation
    {
        //this.index = index; //not useful as order of block determined by position in array not this
        this.timestamp = timestamp;
        //this.data = data;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //random number which is changed while mining
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.chain = [this.createGenesisBlock()]; //array of blocks
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100; //100 coins awarded to miners
    }

    createGenesisBlock() { //genesis block is the 1st block of blockchain
        return new Block("10/07/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /*addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }*/

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        //the above sends all pending transactions but in reality, that's too many
        //so miners choose which pending transactions to mine

        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        //this.pendingTransactions = [];
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]; //i.e. mining reward of prev block is credited to account when next block is mined
        
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
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

/*
console.log('Mining block 1...');
sonaliCoin.addBlock(new Block(1, "11/07/2017", { amount: 4 })); //transfers 4 coins
console.log('Mining block 2...');
sonaliCoin.addBlock(new Block(2, "12/07/2017", { amount: 10 })); //transfers 10 coins

//Validation of block:
console.log(JSON.stringify(sonaliCoin, null, 4));

console.log('is blockchain valid?' + sonaliCoin.isChainValid());

//tampering of block:
sonaliCoin.chain[1].data = { amount: 100 }; //instead of 4, transfering 100 coins
console.log('is blockchain valid?' + sonaliCoin.isChainValid());

//recalculation to avoid tampering getting caught:
sonaliCoin.chain[1].hash = sonaliCoin.chain[1].calculateHash();
//still caught:
console.log('Is blockchain valid?' + sonaliCoin.isChainValid());

*/

sonaliCoin.createTransaction(new Transaction('address1', 'address2', 100));
sonaliCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
sonaliCoin.minePendingTransactions('sonalis-address');

console.log('\n Balance of Sonali Agrawal=', sonaliCoin.getBalanceOfAddress('sonalis-address'));

console.log('\n Starting the miner...');
sonaliCoin.minePendingTransactions('sonalis-address');
console.log('\n Balance of Sonali Agrawal=', sonaliCoin.getBalanceOfAddress('sonalis-address'));

