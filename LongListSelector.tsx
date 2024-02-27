import React, { useEffect, useReducer, useState } from "react";
import {
  RoundSelect,
  RoundSelectProps,
  Value,
  Option,
} from "@liftoff/components/RoundSelect";

const itemsPerPage = 100;
const endingItemsGap = 10;

interface IState<T extends Value> {
  page: number;
  filterString: string;
  portion: Option<T>[];
  itemsCount: number;
}

interface IAction {
  type: "increasePage" | "decreasePage" | "setPage" | "setFilter";
  data: string | number;
}

export default function LongListSelector<T extends Value>({
  items,
  ...restProps
}: RoundSelectProps<T>): JSX.Element {
  const [isFreezPagination, setIsFreezPagination] = useState(false);

  const [state, dispatchState] = useReducer(
    (currentState: IState<T>, action: IAction): IState<T> => {
      const newState = { ...currentState };

      switch (action.type) {
        case "increasePage":
          newState.page = Math.min(
            newState.page + ((action.data || 1) as number),
            Math.ceil(newState.itemsCount / itemsPerPage)
          );
          break;
        case "decreasePage":
          newState.page = Math.max(
            newState.page - ((action.data || 1) as number),
            1
          );
          break;
        case "setPage":
          newState.page = action.data as number;
          break;
        case "setFilter":
          newState.filterString = action.data as string;
          newState.page = 1;
          break;
        default:
          break;
      }

      const filteredItems = newState.filterString
        ? items.filter((item) =>
            (item.label as string)
              .toLowerCase()
              .includes(newState.filterString.toLowerCase())
          )
        : items;

      newState.itemsCount = filteredItems.length;
      newState.portion = filteredItems.slice(
        Math.max(0, (newState.page - 1) * itemsPerPage - endingItemsGap), // from 0 or <endingItemsGap> before page
        Math.min(
          newState.itemsCount,
          newState.page * itemsPerPage + endingItemsGap
        ) // to last or <endingItemsGap> after next page
      );

      return newState;
    },
    {
      page: 0,
      filterString: "",
      portion: [],
      itemsCount: 0,
    }
  );

  // Load first page
  useEffect(() => {
    dispatchState({ type: "setPage", data: 1 });
  }, [items]);

  const handleSearch = (value: string): void => {
    const searchVal = value.toLowerCase();
    dispatchState({ type: "setFilter", data: searchVal });
  };

  const freezPagination = () => {
    setIsFreezPagination(true);
    setTimeout(() => {
      setIsFreezPagination(false);
    }, 100);
  };

  const scrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const el = event.target as HTMLUListElement;

    if (isFreezPagination) {
      // Wait for claen freez
      return;
    }

    // Loads previous page
    if (el.scrollTop <= 0 && state.page > 1) {
      freezPagination();
      setTimeout(() => {
        el.scrollTo(0, el.scrollHeight - el.offsetHeight - 20);
      }, 50);
      dispatchState({ type: "decreasePage", data: 1 });
      return;
    }

    // Loads next page
    if (
      el.offsetHeight + el.scrollTop >= el.scrollHeight &&
      state.page < Math.ceil(state.itemsCount / itemsPerPage)
    ) {
      freezPagination();
      setTimeout(() => {
        el.scrollTo(0, 20);
      }, 50);
      dispatchState({ type: "increasePage", data: 1 });
    }
  };

  return (
    <RoundSelect
      {...restProps}
      items={state.portion}
      onSearch={handleSearch}
      onPopupScroll={scrollHandler}
    />
  );
}
