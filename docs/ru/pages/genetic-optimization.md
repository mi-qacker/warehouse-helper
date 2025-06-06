# Генетический алгоритм для оптимизации

После выполнения оптимизации расстановки мы получаем список ячеек которые нужно посетить для реализации этой расстановки.

## Основные моменты генетического алгоритма

### Seed

В качестве первого поколения собираем N вариантов обхода полученных ячеек.

### Fitness

Показателем фитнеса является общая длина маршрута обхода всех точек.
Маршрут считаем как евклидово расстояние между каждой точкой (у каждой ячейки есть своя координата).

### Mutation

В качестве мутации меняем местами рандомные 2 точки в маршруте.

### Crossover

Получаем 2 маршрута для скрещивания. Рандомно выбираем точку в маршруте и одну половину (до точки) берем от одного родителя, вторую половину (после точки) от второго родителя.

В полученном маршруте элементы не должны дублироваться и должны иметь такую же длину как и у родителей.

### Optimize

Выбираем маршрут с наиболее краткой длиной маршрута.

## Улучшения

- Использовать расчет расстояний между точками по графу
