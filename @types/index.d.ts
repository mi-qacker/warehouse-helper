declare module 'genetic-js' {
  interface GeneticConfiguration {
    size: number;
    crossover: number;
    mutation: number;
    iterations: number;
    fittestAlwaysSurvives: boolean;
    maxResults: number;
    webWorkers: boolean;
    skip: number;
  }

  type OptimizeFn = (a: number, b: number) => boolean;
  interface OptimizeType {
    Maximize: OptimizeFn;
    Minimize: OptimizeFn;
  }

  type SelectFn<T> = (pop: Array<{fitness: number; entity: T}>) => T;
  interface Select1Type<T> {
    Tournament2: SelectFn<T>;
    Tournament3: SelectFn<T>;
    Fittest: SelectFn<T>;
    Random: SelectFn<T>;
    RandomLinearRank: SelectFn<T>;
    Sequential: SelectFn<T>;
  }

  type Select2Fn<T> = (pop: Array<{fitness: number; entity: T}>) => [T, T];
  interface Select2Type<T> {
    Tournament2: Select2Fn<T>;
    Tournament3: Select2Fn<T>;
    Random: Select2Fn<T>;
    RandomLinearRank: Select2Fn<T>;
    Sequential: Select2Fn<T>;
    FittestRandom: Select2Fn<T>;
  }

  type NotificationCallback<T> = (
    pop: T[],
    generation: number,
    stats: {
      maximum: number;
      minimum: number;
      mean: number;
      stdev: number;
    },
    isFinished: boolean
  ) => void;

  type GenerationCallback<T> = (
    pop: Array<{fitness: number; entity: T}>,
    generation: number,
    stats: {
      maximum: number;
      minimum: number;
      mean: number;
      stdev: number;
    }
  ) => boolean | void;

  interface Genetic<T = unknown> {
    fitness: (entity: T) => number;
    seed: () => T;
    mutate?: (entity: T) => T;
    crossover?: (parent1: T, parent2: T) => [T, T];
    select1: SelectFn<T>;
    select2: Select2Fn<T>;
    optimize: OptimizeFn;
    generation?: GenerationCallback<T>;
    notification?: NotificationCallback<T>;

    configuration: GeneticConfiguration;
    userData: Record<string, unknown>;
    internalGenState: Record<string, unknown>;
    entities: T[];

    start(): void;
    evolve(
      config: Partial<GeneticConfiguration>,
      userData?: Record<string, unknown>
    ): void;
  }

  function create<T = unknown>(): Genetic<T>;

  const Select1: Select1Type<unknown>;
  const Select2: Select2Type<unknown>;
  const Optimize: OptimizeType;
  function Clone<T>(obj: T): T;

  export {create, Select1, Select2, Optimize, Clone};
}
