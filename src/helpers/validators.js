/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from "ramda";
import { COLORS } from "../constants";

const isWhite = R.equals(COLORS.WHITE);
const isBlue = R.equals(COLORS.BLUE);
const isGreen = R.equals(COLORS.GREEN);
const isOrange = R.equals(COLORS.ORANGE);
const isRed = R.equals(COLORS.RED);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => {
  if (triangle !== "white" || circle !== "white") {
    return false;
  }

  return star === "red" && square === "green";
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.pipe(
  R.values,
  R.countBy((color) => color),
  R.where({ green: R.gte(R.__, 2) })
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.pipe(
  R.values,
  R.countBy((color) => color),
  (counts) =>
    R.equals(R.propOr(0, COLORS.RED, counts), R.propOr(0, COLORS.BLUE, counts))
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.where({
  circle: isBlue,
  star: isRed,
  square: isOrange,
});

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.pipe(
  R.values,
  R.reject(isWhite()),
  R.countBy((color) => color),
  R.values,
  R.any((amount) => amount >= 3)
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = R.converge(
  (triangleColor, colorCount) => {
    return (
      R.equals(triangleColor, COLORS.GREEN) &&
      R.equals(R.propOr(0, COLORS.GREEN, colorCount), 2) &&
      R.equals(R.propOr(0, COLORS.RED, colorCount), 1)
    );
  },
  [R.prop("triangle"), R.pipe(R.values, R.countBy(R.identity))]
);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.pipe(R.values, R.all(R.equals(COLORS.ORANGE)));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.propSatisfies(
  R.allPass([
    R.compose(R.not, R.equals(COLORS.RED)),
    R.compose(R.not, R.equals(COLORS.WHITE)),
  ]),
  "star"
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.pipe(R.values, R.all(R.equals(COLORS.GREEN)));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
  R.converge(R.equals, [R.prop("triangle"), R.prop("square")]),
  R.converge(R.complement(R.equals(COLORS.WHITE)), [R.prop("triangle")]),
]);

