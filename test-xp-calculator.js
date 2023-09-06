function calculateXP(challengeRating) {
  const baseXP = Math.pow(challengeRating, 2) * 100;
  
  if (challengeRating <= 16) {
    return baseXP;
  } else if (challengeRating === 17) {
    return baseXP + 1000;
  } else if (challengeRating >= 18 && challengeRating <= 19) {
    return baseXP + 2000;
  } else if (challengeRating === 20) {
    return baseXP + 3000;
  } else if (challengeRating >= 21) {
    return Math.pow(challengeRating, 3) * 6;
  }
}
function calculateVariableXP(challengeRating) {
  const baseXP = calculateXP(challengeRating);
  const randomVariability = Math.random() * 0.2 + 0.9; // Random value between 0.9 and 1.1
  const roundedXP = Math.max(Math.round(baseXP * randomVariability / 100) * 100, 100); // Round to nearest 100, minimum 100
  const formattedXP = `(${roundedXP.toLocaleString()} XP)`;
  return `${challengeRating} ${formattedXP} ${baseXP} ${randomVariability}`;
}

// Perform random tests on calculateVariableXP
for (let challengeRating = 1; challengeRating <= 30; challengeRating++) {
  const result = calculateVariableXP(challengeRating);
  console.log(result);
}