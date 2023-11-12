const getRandomInt = require('../scripts/generateMap2');

// Test case 1: Minimum and maximum are both 0
console.log(getRandomInt(0, 0)); // Should return 0

// Test case 2: Minimum is negative, maximum is positive
console.log(getRandomInt(-10, 10)); // Should return an integer between -10 and 10 (inclusive)

// Test case 3: Minimum and maximum are the same positive number
console.log(getRandomInt(5, 5)); // Should return 5

// Test case 4: Minimum is greater than maximum
console.log(getRandomInt(20, 10)); // Should return null or some indication of an error

// Test case 5: Large range with minimum and maximum
console.log(getRandomInt(0, 1000000)); // Should return an integer between 0 and 1000000 (inclusive)

// Test case 6: Minimum and maximum are negative numbers
console.log(getRandomInt(-100, -50)); // Should return an integer between -100 and -50 (inclusive)