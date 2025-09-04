function isPrime(num) {
   
    for (let i = 1; i <=num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}


module.exports = isPrime;
