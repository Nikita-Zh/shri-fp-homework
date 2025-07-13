/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import * as R from "ramda";

const api = new Api();

const getBinary = R.curry(async (number) => {
  const response = await api.get("https://api.tech/numbers/base", {
    from: 10,
    to: 2,
    number,
  });
  return response.result;
});

const getAnimal = R.curry(async (id) => {
  const response = await api.get(`https://animals.tech/${id}`, {});
  return response.result;
});

const MIN_LENGTH = 3;
const MAX_LENGTH = 9;

const validateString = R.pipe(
  R.both(
    R.pipe(R.length, R.both(R.gte(R.__, MIN_LENGTH), R.lte(R.__, MAX_LENGTH))),
    R.allPass([
      R.test(/^[0-9.]+$/),
      R.pipe(R.match(/\./g), R.defaultTo([]), R.length, R.gt(2)),
      R.pipe(parseFloat, R.both(R.complement(isNaN), R.lt(0))),
    ])
  )
);

const processSequence = async ({
  value,
  writeLog,
  handleSuccess,
  handleError,
}) => {
  if (!validateString(value)) {
    handleError("ValidationError");
    return;
  }

  const tapLog = R.tap(writeLog);
  Promise.resolve(value)
    .then(tapLog)
    .then(R.pipe(parseFloat, Math.round))
    .then(tapLog)
    .then(getBinary)
    .then(tapLog)
    .then(R.prop("length"))
    .then(tapLog)
    .then((x) => x * x)
    .then(tapLog)
    .then(R.modulo(R.__, 3))
    .then(tapLog)
    .then(getAnimal)
    .then(handleSuccess)
    .catch((error) => handleError(error.toString()));
};

export default processSequence;

