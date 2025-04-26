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
  interface Select1Type {
    Tournament2: SelectFn;
    Tournament3: SelectFn;
    Fittest: SelectFn;
    Random: SelectFn;
    RandomLinearRank: SelectFn;
    Sequential: SelectFn;
  }

  type Select2Fn<T> = (pop: Array<{fitness: number; entity: T}>) => [T, T];
  interface Select2Type {
    Tournament2: Select2Fn;
    Tournament3: Select2Fn;
    Random: Select2Fn;
    RandomLinearRank: Select2Fn;
    Sequential: Select2Fn;
    FittestRandom: Select2Fn;
  }

  type NotificationCallback<T> = (
    pop: {
      fitness: number;
      entity: T;
    }[],
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

  interface Genetic<
    TEntity extends object = unknown,
    TUserData extends object = unknown,
  > {
    fitness: (entity: TEntity) => number;
    seed: () => TEntity;
    mutate?: (entity: TEntity) => TEntity;
    crossover?: (parent1: TEntity, parent2: TEntity) => [TEntity, TEntity];
    select1: SelectFn<TEntity>;
    select2: Select2Fn<TEntity>;
    optimize: OptimizeFn;
    generation?: GenerationCallback<TEntity>;
    notification?: NotificationCallback<TEntity>;

    configuration: GeneticConfiguration;
    userData: TUserData;
    internalGenState: Record<string, unknown>;
    entities: TEntity[];

    start(): void;
    evolve(config: Partial<GeneticConfiguration>, userData?: TUserData): void;
  }

  function create<T, U>(): Genetic<T, U>;

  const Select1: Select1Type;
  const Select2: Select2Type;
  const Optimize: OptimizeType;
  function Clone<T>(obj: T): T;

  export {create, Select1, Select2, Optimize, Clone, Genetic};
}
