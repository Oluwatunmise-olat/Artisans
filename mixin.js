const jsSkills = {
  knowsJS() {
    return true;
  },
};

const engDegree = {
  hasDegree() {
    return true;
  },
};

const jsEngineer = Object.assign({}, jsSkills, engDegree);

console.log(jsEngineer);
