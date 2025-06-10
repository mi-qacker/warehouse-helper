# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-06-10 11:09:00 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

* Warehouse Helper App - приложение для помощи в организации склада, которое решает следующие задачи:
  * Определение расположения и конфигурации стеллажей для хранения
  * Оптимальное распределение товаров на полках при поступлении и отгрузке
  * Построение оптимального маршрута по складу

## Key Features

* Ввод и управление данными о товарах (объем, условия хранения, совместимость)
* Ввод и управление данными о ячейках склада (вместимость, условия зоны)
* Оптимизация размещения товаров в ячейках с учетом ограничений (линейное программирование)
* Построение оптимального маршрута обхода ячеек (генетический алгоритм)
* Визуализация склада, размещения товаров и маршрутов

## Overall Architecture

* Фронтенд: Next.js с TypeScript, использующий React для UI компонентов
* Хранение данных: Zustand для управления состоянием приложения
* Оптимизация размещения: Линейное программирование (GLPK.js)
* Оптимизация маршрута: Генетический алгоритм (genetic-js)
* Навигация: Граф для поиска путей между точками (ngraph)
* Визуализация: GeoJSON для представления геометрических данных