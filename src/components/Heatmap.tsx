import CalendarHeatmap from "./calendar-heatmap";

export default function Heatmap({ data }) {
  return (
    <CalendarHeatmap
      //@ts-ignore
      data={data}
      color="#29fc9b"
    ></CalendarHeatmap>
  );
}
