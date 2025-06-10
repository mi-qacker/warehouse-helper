# Обзор архитектуры Warehouse Helper

## Введение

Warehouse Helper - это веб-приложение для оптимизации организации склада, которое решает три основные задачи:

1. Определение расположения и конфигурации стеллажей для хранения
2. Оптимальное распределение товаров на полках при поступлении и отгрузке
3. Построение оптимального маршрута по складу

Данный документ описывает архитектуру приложения, его основные компоненты и их взаимодействие.

## Общая архитектура

Приложение построено на основе фреймворка Next.js с использованием TypeScript. Архитектура приложения может быть представлена следующей диаграммой:

```mermaid
graph TD
    UI[UI Components] --> Store[Zustand Store]
    Store --> UI
    Store --> API[API Routes]
    API --> Algorithms[Optimization Algorithms]
    Algorithms --> API
    Algorithms --> Store

    subgraph UI Components
        Parameters[Parameters Forms]
        Map[Warehouse Map]
        Solution[Solution View]
    end

    subgraph Zustand Store
        Products[Products]
        Cells[Cells]
        Warehouse[Warehouse]
        Placement[Placement]
        Route[Route]
        Graph[Graph]
    end

    subgraph Optimization Algorithms
        LP[Linear Programming]
        Genetic[Genetic Algorithm]
        PathFinder[Path Finder]
    end
```

## Основные компоненты

### 1. Хранилище данных (Zustand Store)

Центральное хранилище данных реализовано с использованием библиотеки Zustand. Оно хранит все данные приложения и предоставляет методы для их изменения.

```mermaid
classDiagram
    class WarehouseStore {
        +Warehouse warehouse
        +Product[] products
        +Cell[] cells
        +Placement placement
        +Route route
        +Graph graph
        +setWarehouse()
        +addProduct()
        +updateProduct()
        +removeProduct()
        +getProduct()
        +addCell()
        +updateCell()
        +removeCell()
        +getCell()
        +setPlacement()
        +resetPlacement()
        +setRoute()
        +resetRoute()
        +setGraph()
    }
```

### 2. Модели данных

Основные типы данных, используемые в приложении:

```mermaid
classDiagram
    class Warehouse {
        +BBox bounds
        +Feature<Point> inputPoint
        +Feature<Point> outputPoint
    }

    class Product {
        +string id
        +string name
        +number volume
        +ZoneCondition storageCondition
        +string[] incompatibleWith
    }

    class Cell {
        +string id
        +string name
        +number capacity
        +ZoneCondition zoneCondition
        +BBox bounds
        +Feature<Point> loadingPoint
    }

    class Placement {
        +Array<Product['id']> [cellId: Cell['id']]
    }

    class Route {
        +Cell[] cells
    }
```

### 3. Алгоритмы оптимизации

#### 3.1. Оптимизация размещения товаров (Linear Programming)

Для оптимального размещения товаров в ячейках используется линейное программирование (библиотека glpk.js).

```mermaid
graph TD
    Input[Входные данные: товары, ячейки, начальная позиция, матрица расстояний] --> LP[Создание задачи линейного программирования]
    LP --> Variables[Создание переменных x_ij]
    Variables --> Constraints[Добавление ограничений]
    Constraints --> Solve[Решение задачи]
    Solve --> Format[Форматирование результата]
    Format --> Output[Выходные данные: размещение товаров по ячейкам]

    subgraph Constraints
        Capacity[Ограничения вместимости]
        Storage[Ограничения условий хранения]
        Incompatibility[Ограничения несовместимости]
        Placement[Ограничения размещения]
    end
```

#### 3.2. Оптимизация маршрута (Genetic Algorithm)

Для построения оптимального маршрута обхода ячеек используется генетический алгоритм (библиотека genetic-js).

```mermaid
graph TD
    Input[Входные данные: ячейки, начальная и конечная точки, матрица расстояний] --> Seed[Создание начальной популяции]
    Seed --> Fitness[Оценка приспособленности]
    Fitness --> Selection[Отбор]
    Selection --> Crossover[Скрещивание]
    Crossover --> Mutation[Мутация]
    Mutation --> Fitness
    Fitness --> Termination{Условие остановки}
    Termination -->|Да| Output[Выходные данные: оптимальный маршрут]
    Termination -->|Нет| Selection
```

#### 3.3. Поиск пути (Path Finder)

Для нахождения пути между точками используется алгоритм A\* (библиотека ngraph.path).

```mermaid
graph TD
    Input[Входные данные: граф, начальная и конечная точки] --> AStar[Алгоритм A*]
    AStar --> Distance[Функция расстояния]
    Distance --> Path[Поиск пути]
    Path --> Output[Выходные данные: путь между точками]
```

### 4. Граф навигации

Для навигации по складу создается граф, где узлы - это точки (точки склада, точки ячеек и центры полигонов сетки), а ребра - это линии, соединяющие точки.

```mermaid
graph TD
    Input[Входные данные: сетка полигонов, точки склада, точки ячеек] --> RBush[Создание R-дерева]
    RBush --> WarehousePoints[Добавление точек склада]
    WarehousePoints --> CellPoints[Добавление точек ячеек]
    CellPoints --> GridPoints[Добавление центров полигонов]
    GridPoints --> Output[Выходные данные: граф навигации]
```

### 5. Матрица расстояний

Для быстрого доступа к расстояниям между точками создается матрица расстояний.

```mermaid
graph TD
    Input[Входные данные: граф, точки склада, точки ячеек] --> WarehouseMatrix[Создание матрицы расстояний между точками склада и ячейками]
    WarehouseMatrix --> CellsMatrix[Создание матрицы расстояний между ячейками]
    CellsMatrix --> Output[Выходные данные: матрица расстояний]
```

## Поток данных

Общий поток данных в приложении можно представить следующей диаграммой:

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Store
    participant API
    participant Algorithms

    User->>UI: Ввод данных о товарах и ячейках
    UI->>Store: Сохранение данных
    User->>UI: Запрос на оптимизацию размещения
    UI->>API: POST /api/placement
    API->>Algorithms: solveOptimizationPlacement
    Algorithms->>API: Оптимальное размещение
    API->>Store: Сохранение размещения
    Store->>UI: Обновление UI
    User->>UI: Запрос на оптимизацию маршрута
    UI->>API: POST /api/distance-matrix
    API->>Algorithms: createDistanceMatrix
    Algorithms->>API: Матрица расстояний
    UI->>Algorithms: solveOptimizationRoute
    Algorithms->>Store: Сохранение маршрута
    Store->>UI: Отображение маршрута
```

## Заключение

Архитектура приложения Warehouse Helper хорошо структурирована и разделена на логические компоненты. Использование современных библиотек и фреймворков (Next.js, Zustand, GLPK.js, genetic-js) позволяет эффективно решать задачи оптимизации склада.

Основные преимущества архитектуры:

1. Четкое разделение ответственности между компонентами
2. Централизованное хранилище данных
3. Модульная структура, позволяющая легко расширять функциональность
4. Использование специализированных алгоритмов для решения конкретных задач оптимизации

Возможные улучшения:

1. Добавление серверной части для выполнения тяжелых вычислений
2. Реализация кэширования результатов оптимизации
3. Добавление возможности сохранения и загрузки конфигураций склада
4. Улучшение алгоритмов оптимизации для работы с большими объемами данных
