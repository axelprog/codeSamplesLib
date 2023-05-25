import { useRef, useEffect, EffectCallback, DependencyList } from "react";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const usePrevious = (value: any[], initialValue: any[]): any[] => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * Hook for debug what changes call useEffect
 * @param effectHook callback like in useEffect
 * @param dependencies list of dependencies
 * @param dependencyNames (optional) list of dependency names
 * @example
  Before:
      useEffect(() => {
        // useEffect code here...
      }, [dep1, dep2])

  After:
      useEffectDebugger(() => {
        // useEffect code here...
      }, [dep1, dep2])
 * @example
  Before:
      useEffect(() => {
        // useEffect code here...
      }, [dep1, dep2])

  After:
    useEffectDebugger(() => {
      // useEffect code here...
    }, [dep1, dep2], ['dep1', 'dep2'])
 */

const useEffectDebugger = (
  effectHook: EffectCallback,
  dependencies: DependencyList,
  dependencyNames: string[] = []
): void => {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const previousDeps = usePrevious(dependencies as any[], []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log("[use-effect-debugger] ", changedDeps);
  }

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(effectHook, dependencies);
};

export default useEffectDebugger;
