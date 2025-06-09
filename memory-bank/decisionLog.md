# Decision Log

Логирование ключевых архитектурных решений проекта.

2025-06-09 20:19:45 - Лог обновлений

## Decision

Использование Next.js для фронтенда

## Rationale

- Поддержка SSR для SEO
- Интеграция с TypeScript
- Модульная структура приложения

## Implementation Details

- Маршрутизация через app router
- Разделение на feature-модули
- Интеграция с Playwright для E2E тестов

## Decision

Модульная архитектура алгоритмов

## Rationale

- Изоляция бизнес-логики
- Возможность замены реализаций
- Упрощение тестирования

## Implementation Details

- Отдельные директории genetic-algorithm и lp-solver
- Четкие интерфейсы взаимодействия

## Decision

Создание модуля работы с Memory Bank

## Rationale

- Централизованное управление контекстом проекта
- Стандартизированный API для чтения/записи
- Интеграция с существующей архитектурой

## Implementation Details

- Модуль src/modules/common/memory-bank.ts
- Поддержка всех типов файлов Memory Bank
- Использование конфигурации из config.ts
