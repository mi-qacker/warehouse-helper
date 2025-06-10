# System Patterns *Optional*

This file documents recurring patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2025-06-10 11:10:00 - Log of updates made.

*

## Coding Patterns

* **React Hooks Pattern** - Использование React Hooks (useState, useCallback, useMemo) для управления состоянием компонентов
* **Zustand Store Pattern** - Централизованное хранилище данных с использованием Zustand
* **Feature-based Structure** - Организация кода по функциональным возможностям (features)
* **Module-based Architecture** - Разделение логики на модули (genetic-algorithm, graph, lp-solver)

## Architectural Patterns

* **Client-Side Optimization** - Выполнение алгоритмов оптимизации на стороне клиента
* **API Routes Pattern** - Использование API-маршрутов Next.js для обработки запросов
* **Separation of Concerns** - Разделение UI, бизнес-логики и алгоритмов оптимизации
* **Immutable State Updates** - Обновление состояния без мутаций (в хранилище Zustand)

## Testing Patterns

* **Unit Testing** - Модульное тестирование отдельных функций (например, permutations.test.ts, random-index.test.ts)
* **E2E Testing** - Сквозное тестирование с использованием Playwright