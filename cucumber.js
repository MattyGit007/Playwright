module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["tests/features/support/*.ts", "tests/step_definitions/*.ts"],
    paths: ["tests/features/*.feature"],
  },
};
