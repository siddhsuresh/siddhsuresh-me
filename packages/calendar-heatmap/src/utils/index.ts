import moment from "moment";
import { useMemo } from "react";
import { Container, Data, Settings } from "../types";
import useParseData from "./parse";

const calcDimensions = (
  container: Container,
  data: Data[],
  settings: Settings
) => {
  const dayIndex = Math.round(
    (moment().valueOf() -
      moment().subtract(1, "year").startOf("week").valueOf()) /
      86400000
  );

  const colIndex = Math.trunc(dayIndex / 7);
  const numWeeks = colIndex + 1;

  const width = container.offsetWidth < 1000 ? 1000 : container.offsetWidth;
  const item_size =
    (width - settings.label_padding) / numWeeks - settings.gutter;
  const height = settings.label_padding + 7 * (item_size + settings.gutter);

  if (!!data && !!data[0].summary) {
    // drawChart();
  }

  return {
    width,
    height,
    item_size,
  };
};

export const useDimensions = (
  container: Container,
  data: Data[],
  settings: Settings
) => {
  return useMemo(
    () => calcDimensions(container, data, settings),
    [container, data, settings]
  );
};

export { useParseData };
